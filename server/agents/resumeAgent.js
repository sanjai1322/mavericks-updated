import fetch from 'node-fetch';

export class ResumeAgent {
  constructor() {
    this.openRouterApiKey = process.env.OPENROUTER_API_KEY;
    this.huggingFaceApiKey = process.env.HUGGINGFACE_API_KEY;
  }

  /**
   * Parse resume text and extract structured information using AI
   */
  async parseResume(resumeText) {
    if (!resumeText?.trim()) {
      throw new Error('Resume text is required for parsing');
    }

    try {
      // Primary: Use OpenRouter with Claude for comprehensive parsing
      const openRouterResult = await this.parseWithOpenRouter(resumeText);
      if (openRouterResult) {
        return openRouterResult;
      }

      // Fallback: Use Hugging Face
      console.log('OpenRouter failed, falling back to Hugging Face');
      return await this.parseWithHuggingFace(resumeText);
    } catch (error) {
      console.error('Resume parsing failed:', error);
      throw new Error(`Resume parsing failed: ${error.message}`);
    }
  }

  /**
   * Parse resume using OpenRouter API with Claude
   */
  async parseWithOpenRouter(resumeText) {
    if (!this.openRouterApiKey) {
      console.warn('OpenRouter API key not found');
      return null;
    }

    const prompt = `Analyze this resume and extract structured information. Return a JSON object with the following structure:

{
  "personalInfo": {
    "name": "Full name",
    "title": "Professional title/role",
    "email": "email if found",
    "location": "city, state/country if found"
  },
  "skills": {
    "technical": ["programming languages", "frameworks", "tools"],
    "soft": ["leadership", "communication", "problem-solving"],
    "categories": {
      "programming": ["Python", "JavaScript"],
      "frameworks": ["React", "Django"],
      "tools": ["Git", "Docker"],
      "databases": ["PostgreSQL", "MongoDB"],
      "cloud": ["AWS", "Azure"]
    }
  },
  "experience": [
    {
      "title": "Job title",
      "company": "Company name",
      "duration": "time period",
      "description": "brief description",
      "skillsUsed": ["relevant skills"]
    }
  ],
  "education": [
    {
      "degree": "degree type",
      "institution": "school name",
      "field": "field of study",
      "year": "graduation year if found"
    }
  ],
  "projects": [
    {
      "name": "project name",
      "description": "brief description",
      "technologies": ["tech stack used"]
    }
  ],
  "summary": "2-3 sentence professional summary",
  "skillLevel": "beginner|intermediate|advanced",
  "primaryDomain": "web development|data science|mobile|devops|etc"
}

Resume text:
${resumeText}

Return only valid JSON:`;

    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.openRouterApiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://mavericks-coding-platform.replit.app',
          'X-Title': 'Mavericks Coding Platform'
        },
        body: JSON.stringify({
          model: 'anthropic/claude-3.5-sonnet',
          messages: [
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 2000,
          temperature: 0.1
        })
      });

      if (!response.ok) {
        throw new Error(`OpenRouter API error: ${response.status}`);
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content;
      
      if (!content) {
        throw new Error('No content received from OpenRouter');
      }

      // Clean and parse JSON response
      const cleanedContent = content.replace(/```json\n?|\n?```/g, '').trim();
      return JSON.parse(cleanedContent);
    } catch (error) {
      console.error('OpenRouter parsing error:', error);
      return null;
    }
  }

  /**
   * Parse resume using Hugging Face API as fallback
   */
  async parseWithHuggingFace(resumeText) {
    if (!this.huggingFaceApiKey) {
      throw new Error('No AI parsing service available. Please configure API keys.');
    }

    try {
      // Simple extraction using basic NLP patterns
      const skills = this.extractSkillsBasic(resumeText);
      const personalInfo = this.extractPersonalInfoBasic(resumeText);
      
      return {
        personalInfo,
        skills: {
          technical: skills.filter(skill => this.isTechnicalSkill(skill)),
          soft: skills.filter(skill => this.isSoftSkill(skill)),
          categories: this.categorizeSkills(skills)
        },
        experience: [],
        education: [],
        projects: [],
        summary: "Resume analysis completed using basic extraction",
        skillLevel: this.assessSkillLevel(skills),
        primaryDomain: this.determinePrimaryDomain(skills)
      };
    } catch (error) {
      console.error('Hugging Face parsing error:', error);
      throw new Error('Resume parsing failed with all available services');
    }
  }

  /**
   * Basic skill extraction using keyword matching
   */
  extractSkillsBasic(text) {
    const technicalSkills = [
      'Python', 'JavaScript', 'Java', 'C++', 'C#', 'Go', 'Rust', 'TypeScript',
      'React', 'Angular', 'Vue', 'Node.js', 'Express', 'Django', 'Flask',
      'PostgreSQL', 'MongoDB', 'MySQL', 'Redis', 'Git', 'Docker', 'Kubernetes',
      'AWS', 'Azure', 'GCP', 'Linux', 'HTML', 'CSS', 'SQL', 'GraphQL',
      'REST', 'API', 'Microservices', 'DevOps', 'CI/CD', 'Agile', 'Scrum'
    ];

    const softSkills = [
      'Leadership', 'Communication', 'Problem Solving', 'Teamwork',
      'Project Management', 'Critical Thinking', 'Analytical', 'Creative'
    ];

    const allSkills = [...technicalSkills, ...softSkills];
    const foundSkills = [];

    allSkills.forEach(skill => {
      if (text.toLowerCase().includes(skill.toLowerCase())) {
        foundSkills.push(skill);
      }
    });

    return foundSkills;
  }

  /**
   * Basic personal info extraction
   */
  extractPersonalInfoBasic(text) {
    const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/;
    const email = text.match(emailRegex)?.[0] || null;

    return {
      name: null,
      title: null,
      email,
      location: null
    };
  }

  /**
   * Check if skill is technical
   */
  isTechnicalSkill(skill) {
    const technicalKeywords = [
      'Python', 'JavaScript', 'Java', 'React', 'SQL', 'AWS', 'Docker', 'Git'
    ];
    return technicalKeywords.some(keyword => 
      skill.toLowerCase().includes(keyword.toLowerCase())
    );
  }

  /**
   * Check if skill is soft skill
   */
  isSoftSkill(skill) {
    const softKeywords = [
      'Leadership', 'Communication', 'Problem', 'Team', 'Management'
    ];
    return softKeywords.some(keyword => 
      skill.toLowerCase().includes(keyword.toLowerCase())
    );
  }

  /**
   * Categorize skills into specific domains
   */
  categorizeSkills(skills) {
    const categories = {
      programming: [],
      frameworks: [],
      tools: [],
      databases: [],
      cloud: []
    };

    const skillMap = {
      programming: ['Python', 'JavaScript', 'Java', 'C++', 'C#', 'Go', 'Rust', 'TypeScript'],
      frameworks: ['React', 'Angular', 'Vue', 'Node.js', 'Express', 'Django', 'Flask'],
      tools: ['Git', 'Docker', 'Kubernetes', 'Linux'],
      databases: ['PostgreSQL', 'MongoDB', 'MySQL', 'Redis'],
      cloud: ['AWS', 'Azure', 'GCP']
    };

    skills.forEach(skill => {
      Object.keys(skillMap).forEach(category => {
        if (skillMap[category].some(s => s.toLowerCase() === skill.toLowerCase())) {
          categories[category].push(skill);
        }
      });
    });

    return categories;
  }

  /**
   * Assess overall skill level based on skills found
   */
  assessSkillLevel(skills) {
    if (skills.length < 5) return 'beginner';
    if (skills.length < 15) return 'intermediate';
    return 'advanced';
  }

  /**
   * Determine primary domain based on skills
   */
  determinePrimaryDomain(skills) {
    const domainSkills = {
      'web development': ['React', 'Angular', 'Vue', 'JavaScript', 'HTML', 'CSS', 'Node.js'],
      'data science': ['Python', 'SQL', 'pandas', 'numpy', 'scikit-learn', 'TensorFlow'],
      'mobile development': ['React Native', 'Flutter', 'Swift', 'Kotlin', 'iOS', 'Android'],
      'devops': ['Docker', 'Kubernetes', 'AWS', 'CI/CD', 'Linux', 'DevOps'],
      'backend development': ['Node.js', 'Django', 'Flask', 'Express', 'API', 'Microservices']
    };

    let maxScore = 0;
    let primaryDomain = 'general development';

    Object.keys(domainSkills).forEach(domain => {
      const score = domainSkills[domain].filter(skill => 
        skills.some(userSkill => userSkill.toLowerCase().includes(skill.toLowerCase()))
      ).length;

      if (score > maxScore) {
        maxScore = score;
        primaryDomain = domain;
      }
    });

    return primaryDomain;
  }

  /**
   * Generate skill-based assessment alignment
   */
  async generateAssessmentAlignment(extractedSkills, existingAssessments = []) {
    const recommendations = [];
    const skills = extractedSkills.skills || {};
    
    // Map skills to assessment categories
    const skillAssessmentMap = {
      'JavaScript': ['Two Sum', 'Palindrome Checker', 'Array Manipulation'],
      'Python': ['Data Analysis', 'Algorithm Implementation', 'String Processing'],
      'React': ['Component Building', 'State Management', 'Event Handling'],
      'SQL': ['Database Queries', 'Data Relationships', 'Query Optimization'],
      'Data Science': ['Statistical Analysis', 'Machine Learning', 'Data Visualization']
    };

    // Generate recommendations based on technical skills
    if (skills.technical) {
      skills.technical.forEach(skill => {
        if (skillAssessmentMap[skill]) {
          recommendations.push({
            skill,
            assessments: skillAssessmentMap[skill],
            priority: 'high',
            reason: `Strong skill match for ${skill}`
          });
        }
      });
    }

    return {
      recommendations,
      skillCoverage: this.calculateSkillCoverage(skills, existingAssessments),
      suggestedDifficulty: this.suggestDifficulty(extractedSkills.skillLevel),
      learningPath: this.generateLearningPath(extractedSkills)
    };
  }

  /**
   * Calculate how well existing assessments cover user skills
   */
  calculateSkillCoverage(skills, assessments) {
    const userSkills = [...(skills.technical || []), ...(skills.soft || [])];
    const assessmentTopics = assessments.map(a => a.topic);
    
    const coverage = userSkills.filter(skill => 
      assessmentTopics.some(topic => 
        topic.toLowerCase().includes(skill.toLowerCase()) ||
        skill.toLowerCase().includes(topic.toLowerCase())
      )
    );

    return {
      coveredSkills: coverage,
      coveragePercentage: userSkills.length > 0 ? (coverage.length / userSkills.length) * 100 : 0,
      gapSkills: userSkills.filter(skill => !coverage.includes(skill))
    };
  }

  /**
   * Suggest difficulty level based on skill assessment
   */
  suggestDifficulty(skillLevel) {
    const difficultyMap = {
      'beginner': ['Easy'],
      'intermediate': ['Easy', 'Medium'],
      'advanced': ['Medium', 'Hard']
    };

    return difficultyMap[skillLevel] || ['Easy', 'Medium'];
  }

  /**
   * Generate personalized learning path
   */
  generateLearningPath(extractedData) {
    const path = {
      strengthAreas: [],
      improvementAreas: [],
      recommendedCourses: [],
      timeline: '4-6 weeks'
    };

    // Identify strength areas
    if (extractedData.skills?.technical?.length > 5) {
      path.strengthAreas = extractedData.skills.technical.slice(0, 3);
    }

    // Suggest improvement areas based on domain
    const improvementMap = {
      'web development': ['Advanced React Patterns', 'Backend Architecture', 'Database Design'],
      'data science': ['Machine Learning Algorithms', 'Statistical Analysis', 'Data Visualization'],
      'mobile development': ['UI/UX Design', 'Performance Optimization', 'Cross-platform Development']
    };

    path.improvementAreas = improvementMap[extractedData.primaryDomain] || 
                            ['Problem Solving', 'System Design', 'Code Quality'];

    return path;
  }
}

export const resumeAgent = new ResumeAgent();