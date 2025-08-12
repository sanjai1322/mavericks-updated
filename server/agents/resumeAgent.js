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

      // Fallback: Use enhanced pattern matching
      console.log('OpenRouter failed, using enhanced fallback analysis');
      return this.createFallbackAnalysis(resumeText);
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

    const prompt = `You are an expert resume analysis AI. Analyze this resume text with high precision and extract comprehensive structured information. Return a JSON object with the following enhanced structure:

{
  "personalInfo": {
    "name": "Full name (extract first/last)",
    "title": "Current/target professional title",
    "email": "email address if present",
    "phone": "phone number if present", 
    "location": "city, state/country if mentioned",
    "summary": "professional summary/objective if present",
    "linkedIn": "LinkedIn URL if present",
    "github": "GitHub URL if present",
    "portfolio": "portfolio/website URL if present"
  },
  "skills": {
    "technical": ["EXACT skill names found - be precise"],
    "soft": ["leadership", "communication", "teamwork", "problem-solving"],
    "categories": {
      "programming": ["Python", "JavaScript", "Java", "C++", "Go", "Rust", "C#", "PHP", "Ruby", "Swift", "Kotlin"],
      "frontend": ["React", "Vue", "Angular", "HTML", "CSS", "TypeScript", "Sass", "Bootstrap", "Tailwind"],
      "backend": ["Node.js", "Express", "Django", "Flask", "Spring", "Laravel", "Rails", "ASP.NET"],
      "databases": ["PostgreSQL", "MySQL", "MongoDB", "Redis", "SQLite", "Oracle", "DynamoDB"],
      "cloud": ["AWS", "Azure", "GCP", "Digital Ocean", "Heroku", "Vercel", "Netlify"],
      "tools": ["Git", "Docker", "Kubernetes", "Jenkins", "Terraform", "Ansible", "Postman"],
      "frameworks": ["TensorFlow", "PyTorch", "Scikit-learn", "React Native", "Flutter"],
      "testing": ["Jest", "Pytest", "JUnit", "Cypress", "Selenium"],
      "mobile": ["iOS", "Android", "React Native", "Flutter", "Xamarin"]
    }
  },
  "experience": [
    {
      "title": "Exact job title",
      "company": "Company name",
      "duration": "Start - End dates",
      "location": "City, State if provided",
      "description": "Key accomplishments and responsibilities",
      "skillsUsed": ["EXACT technical skills used in this role"],
      "achievements": ["quantifiable achievements with numbers/metrics"],
      "technologies": ["specific technologies mentioned"]
    }
  ],
  "education": [
    {
      "degree": "Exact degree name",
      "institution": "Full university/school name",
      "field": "Major/field of study",
      "graduationYear": "year if mentioned",
      "gpa": "GPA if mentioned",
      "location": "City, State if provided",
      "honors": "academic honors if mentioned"
    }
  ],
  "projects": [
    {
      "name": "Project name",
      "description": "Project description",
      "technologies": ["technologies used"],
      "achievements": ["quantifiable results"],
      "url": "project URL if provided"
    }
  ],
  "certifications": [
    {
      "name": "Certification name", 
      "issuer": "Issuing organization",
      "date": "Date obtained if mentioned",
      "credentialId": "Credential ID if provided"
    }
  ],
  "analysis": {
    "yearsOfExperience": "estimated years based on work history",
    "seniorityLevel": "entry/mid/senior/lead/executive",
    "primaryDomain": "main area of expertise",
    "strongestSkills": ["top 5 most mentioned/emphasized skills"],
    "industryExperience": ["industries worked in"],
    "leadershipExperience": "boolean - has management/leadership experience",
    "confidenceScore": 0.95
  }
}

CRITICAL INSTRUCTIONS:
1. Extract ONLY skills that are EXPLICITLY mentioned in the resume text
2. Be precise with skill names (e.g., "React.js" vs "React", "Node.js" vs "Node") 
3. Include version numbers when mentioned (e.g., "Python 3.9", "React 18")
4. Categorize skills accurately based on their actual use context
5. For experience, extract quantifiable achievements with specific numbers/percentages
6. Estimate experience years by analyzing date ranges in work history
7. Set confidenceScore based on completeness and clarity of information extracted

Resume text to analyze:
${resumeText}`;

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

      // Enhanced JSON cleaning and parsing with comprehensive error handling
      let cleanedContent = content.replace(/```json\n?|\n?```/g, '').trim();
      cleanedContent = cleanedContent.replace(/^["'`]+|["'`]+$/g, '').trim();
      
      // Try to find the JSON object in the response
      const jsonMatch = cleanedContent.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        cleanedContent = jsonMatch[0];
      }
      
      try {
        const result = JSON.parse(cleanedContent);
        
        // Enhanced result with comprehensive skill detection
        return this.enhanceResumeAnalysis(result, resumeText);
      } catch (parseError) {
        console.error('JSON parsing failed. Attempting fallback analysis.');
        return this.createFallbackAnalysis(resumeText);
      }
    } catch (error) {
      console.error('OpenRouter parsing error:', error);
      return null;
    }
  }

  /**
   * Enhanced resume analysis with comprehensive skill detection
   */
  enhanceResumeAnalysis(baseResult, resumeText) {
    try {
      // Extract additional skills using comprehensive pattern matching
      const enhancedSkills = this.extractComprehensiveSkills(resumeText);
      const personalInfo = this.extractEnhancedPersonalInfo(resumeText);
      const analysis = this.analyzeResumeQuality(resumeText, baseResult);
      
      return {
        ...baseResult,
        personalInfo: { ...baseResult.personalInfo, ...personalInfo },
        skills: {
          ...baseResult.skills,
          technical: [...new Set([...(baseResult.skills?.technical || []), ...enhancedSkills.technical])],
          soft: [...new Set([...(baseResult.skills?.soft || []), ...enhancedSkills.soft])],
          categories: {
            ...baseResult.skills?.categories,
            ...enhancedSkills.categories
          }
        },
        analysis: { ...baseResult.analysis, ...analysis }
      };
    } catch (error) {
      console.error('Error enhancing resume analysis:', error);
      return baseResult;
    }
  }

  /**
   * Create comprehensive fallback analysis when AI parsing fails
   */
  createFallbackAnalysis(resumeText) {
    const skills = this.extractComprehensiveSkills(resumeText);
    const personalInfo = this.extractEnhancedPersonalInfo(resumeText);
    const experience = this.extractExperienceBasic(resumeText);
    
    return {
      personalInfo,
      skills,
      experience,
      education: [],
      projects: [],
      certifications: [],
      analysis: {
        yearsOfExperience: this.estimateExperience(resumeText),
        seniorityLevel: this.estimateSeniority(resumeText),
        primaryDomain: this.identifyPrimaryDomain(skills),
        strongestSkills: skills.technical.slice(0, 5),
        confidenceScore: 0.75
      }
    };
  }

  /**
   * Comprehensive skill extraction with 200+ technical skills and 50+ soft skills
   */
  extractComprehensiveSkills(text) {
    const lowercaseText = text.toLowerCase();
    
    // Comprehensive technical skills database with 200+ skills
    const technicalSkills = {
      programming: [
        'javascript', 'js', 'typescript', 'ts', 'python', 'java', 'c++', 'cpp', 'c#', 'csharp', 'go', 'golang', 
        'rust', 'php', 'ruby', 'swift', 'kotlin', 'dart', 'scala', 'clojure', 'haskell', 'erlang', 'elixir',
        'r', 'matlab', 'perl', 'lua', 'bash', 'shell', 'powershell', 'assembly', 'cobol', 'fortran', 'ada',
        'objective-c', 'vb.net', 'f#', 'ocaml', 'scheme', 'prolog', 'sql', 'nosql', 'html', 'css', 'sass', 'scss'
      ],
      frontend: [
        'react', 'reactjs', 'vue', 'vuejs', 'angular', 'angularjs', 'svelte', 'ember', 'backbone', 'jquery',
        'bootstrap', 'tailwind', 'material-ui', 'mui', 'ant-design', 'chakra-ui', 'styled-components',
        'emotion', 'webpack', 'vite', 'parcel', 'rollup', 'gulp', 'grunt', 'babel', 'eslint', 'prettier'
      ],
      backend: [
        'node.js', 'nodejs', 'express', 'fastify', 'koa', 'nest.js', 'nestjs', 'django', 'flask', 'fastapi',
        'spring', 'springboot', 'laravel', 'symfony', 'codeigniter', 'rails', 'sinatra', 'asp.net', 'dotnet',
        'gin', 'echo', 'fiber', 'actix', 'rocket', 'axum', 'phoenix', 'play', 'akka'
      ],
      databases: [
        'mysql', 'postgresql', 'postgres', 'sqlite', 'mongodb', 'redis', 'cassandra', 'dynamodb', 'couchdb',
        'neo4j', 'influxdb', 'elasticsearch', 'solr', 'oracle', 'sql server', 'mariadb', 'couchbase',
        'memcached', 'etcd', 'consul', 'vault', 'clickhouse', 'snowflake', 'bigquery'
      ],
      cloud: [
        'aws', 'amazon web services', 'azure', 'microsoft azure', 'gcp', 'google cloud', 'digital ocean',
        'heroku', 'netlify', 'vercel', 'cloudflare', 'linode', 'vultr', 'oracle cloud', 'ibm cloud',
        'alibaba cloud', 'kubernetes', 'k8s', 'docker', 'containerd', 'podman', 'openshift', 'rancher'
      ],
      devops: [
        'docker', 'kubernetes', 'terraform', 'ansible', 'chef', 'puppet', 'jenkins', 'gitlab-ci', 'github-actions',
        'circleci', 'travis-ci', 'azure-devops', 'aws-codepipeline', 'prometheus', 'grafana', 'elk stack',
        'datadog', 'new relic', 'splunk', 'nagios', 'zabbix', 'consul', 'vault', 'istio', 'envoy'
      ],
      tools: [
        'git', 'github', 'gitlab', 'bitbucket', 'subversion', 'mercurial', 'jira', 'confluence', 'slack',
        'discord', 'teams', 'zoom', 'notion', 'trello', 'asana', 'monday', 'figma', 'sketch', 'adobe-xd',
        'photoshop', 'illustrator', 'postman', 'insomnia', 'swagger', 'openapi', 'graphql', 'rest-api'
      ],
      testing: [
        'jest', 'mocha', 'chai', 'cypress', 'playwright', 'selenium', 'webdriver', 'puppeteer', 'testcafe',
        'junit', 'testng', 'pytest', 'unittest', 'rspec', 'phpunit', 'karma', 'jasmine', 'enzyme'
      ],
      mobile: [
        'react-native', 'flutter', 'ionic', 'xamarin', 'cordova', 'phonegap', 'swift', 'objective-c',
        'kotlin', 'java', 'android', 'ios', 'xcode', 'android-studio'
      ],
      ai_ml: [
        'tensorflow', 'pytorch', 'scikit-learn', 'keras', 'pandas', 'numpy', 'matplotlib', 'seaborn',
        'opencv', 'spacy', 'nltk', 'transformers', 'huggingface', 'langchain', 'openai', 'gpt', 'llm',
        'machine-learning', 'deep-learning', 'neural-networks', 'computer-vision', 'nlp', 'data-science'
      ]
    };

    // Enhanced soft skills with 50+ skills
    const softSkillsDatabase = [
      'leadership', 'communication', 'teamwork', 'collaboration', 'problem-solving', 'analytical-thinking',
      'critical-thinking', 'creativity', 'innovation', 'adaptability', 'flexibility', 'time-management',
      'project-management', 'organization', 'attention-to-detail', 'multitasking', 'prioritization',
      'decision-making', 'conflict-resolution', 'negotiation', 'presentation', 'public-speaking',
      'mentoring', 'coaching', 'training', 'customer-service', 'client-management', 'relationship-building',
      'emotional-intelligence', 'empathy', 'active-listening', 'feedback', 'continuous-learning',
      'self-motivation', 'initiative', 'proactive', 'accountability', 'reliability', 'integrity',
      'ethics', 'cultural-awareness', 'cross-functional', 'agile-methodology', 'scrum-master',
      'product-owner', 'stakeholder-management', 'risk-management', 'strategic-thinking', 'business-acumen'
    ];

    const extractedSkills = {
      technical: [],
      soft: [],
      categories: {}
    };

    // Extract technical skills by category
    Object.entries(technicalSkills).forEach(([category, skills]) => {
      extractedSkills.categories[category] = [];
      skills.forEach(skill => {
        const patterns = [
          new RegExp(`\\b${skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i'),
          new RegExp(`\\b${skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?:\\s*\\d+(?:\\.\\d+)?)?\\b`, 'i') // Include versions
        ];
        
        patterns.forEach(pattern => {
          if (pattern.test(text)) {
            const match = text.match(pattern);
            if (match) {
              const foundSkill = match[0].trim();
              if (!extractedSkills.technical.includes(foundSkill) && foundSkill.length > 1) {
                extractedSkills.technical.push(foundSkill);
                extractedSkills.categories[category].push(foundSkill);
              }
            }
          }
        });
      });
    });

    // Extract soft skills
    softSkillsDatabase.forEach(skill => {
      const pattern = new RegExp(`\\b${skill.replace(/-/g, '[\\s-]?')}\\b`, 'i');
      if (pattern.test(text)) {
        const match = text.match(pattern);
        if (match && !extractedSkills.soft.includes(match[0])) {
          extractedSkills.soft.push(match[0]);
        }
      }
    });

    return extractedSkills;
  }

  /**
   * Enhanced personal information extraction
   */
  extractEnhancedPersonalInfo(text) {
    const emailPattern = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
    const phonePattern = /(\+?1[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g;
    const linkedInPattern = /linkedin\.com\/in\/[\w-]+/gi;
    const githubPattern = /github\.com\/[\w-]+/gi;
    const websitePattern = /(?:https?:\/\/)?(?:www\.)?[\w-]+\.[\w]{2,}(?:\/[\w-]*)*(?:\?[\w&=%]*)?/g;

    const emails = text.match(emailPattern) || [];
    const phones = text.match(phonePattern) || [];
    const linkedIn = text.match(linkedInPattern) || [];
    const github = text.match(githubPattern) || [];
    
    // Extract name (first few words if no clear pattern)
    const nameMatch = text.match(/^([A-Z][a-z]+ [A-Z][a-z]+)/m);
    
    return {
      email: emails[0] || null,
      phone: phones[0] || null,
      name: nameMatch ? nameMatch[1] : null,
      linkedIn: linkedIn[0] ? `https://${linkedIn[0]}` : null,
      github: github[0] ? `https://${github[0]}` : null
    };
  }

  /**
   * Estimate years of experience from resume content
   */
  estimateExperience(text) {
    const yearPattern = /\b(19|20)\d{2}\b/g;
    const years = text.match(yearPattern)?.map(y => parseInt(y)) || [];
    
    if (years.length >= 2) {
      years.sort();
      const earliestYear = years[0];
      const currentYear = new Date().getFullYear();
      return Math.max(0, currentYear - earliestYear);
    }
    
    // Alternative: count job positions
    const jobIndicators = text.match(/(?:software engineer|developer|programmer|analyst|manager|director|lead)/gi);
    return jobIndicators ? Math.min(jobIndicators.length * 2, 15) : 1;
  }

  /**
   * Estimate seniority level based on content
   */
  estimateSeniority(text) {
    const seniorKeywords = ['senior', 'lead', 'principal', 'architect', 'manager', 'director'];
    const midKeywords = ['mid', 'intermediate', '3-5 years', '4-6 years'];
    const entryKeywords = ['junior', 'entry', 'new grad', 'recent graduate'];
    
    const lowerText = text.toLowerCase();
    
    if (seniorKeywords.some(word => lowerText.includes(word))) return 'senior';
    if (midKeywords.some(word => lowerText.includes(word))) return 'mid';
    if (entryKeywords.some(word => lowerText.includes(word))) return 'entry';
    
    const experience = this.estimateExperience(text);
    if (experience >= 7) return 'senior';
    if (experience >= 3) return 'mid';
    return 'entry';
  }

  /**
   * Identify primary domain based on skills
   */
  identifyPrimaryDomain(skills) {
    const domains = {
      'web-development': ['react', 'vue', 'angular', 'javascript', 'html', 'css', 'node.js', 'express'],
      'mobile-development': ['react-native', 'flutter', 'ios', 'android', 'swift', 'kotlin'],
      'data-science': ['python', 'pandas', 'numpy', 'tensorflow', 'pytorch', 'machine-learning'],
      'devops': ['docker', 'kubernetes', 'aws', 'terraform', 'jenkins', 'ansible'],
      'backend-development': ['java', 'spring', 'python', 'django', 'node.js', 'postgresql']
    };

    let maxScore = 0;
    let primaryDomain = 'software-development';
    
    Object.entries(domains).forEach(([domain, domainSkills]) => {
      const score = domainSkills.filter(skill => 
        skills.technical.some(userSkill => userSkill.toLowerCase().includes(skill))
      ).length;
      
      if (score > maxScore) {
        maxScore = score;
        primaryDomain = domain;
      }
    });

    return primaryDomain;
  }

  /**
   * Extract basic experience information
   */
  extractExperienceBasic(text) {
    const companyPattern = /at\s+([A-Z][a-zA-Z\s&.-]+)/g;
    const companies = [];
    let match;
    
    while ((match = companyPattern.exec(text)) !== null) {
      companies.push({
        company: match[1].trim(),
        title: 'Software Developer',
        duration: 'N/A'
      });
    }

    return companies.slice(0, 5); // Limit to 5 experiences
  }

  /**
   * Analyze resume quality and completeness
   */
  analyzeResumeQuality(text, baseResult) {
    const hasEmail = /@/.test(text);
    const hasPhone = /\d{3}[-.\s]?\d{3}[-.\s]?\d{4}/.test(text);
    const hasExperience = /(?:experience|work|job|position|role)/i.test(text);
    const hasEducation = /(?:education|degree|university|college)/i.test(text);
    const hasSkills = /(?:skills|technologies|languages|frameworks)/i.test(text);
    
    const completenessScore = [hasEmail, hasPhone, hasExperience, hasEducation, hasSkills]
      .filter(Boolean).length / 5;
    
    return {
      completenessScore,
      confidenceScore: Math.min(0.95, completenessScore + 0.2)
    };
  }
}

// Create and export the resume agent instance
const resumeAgent = new ResumeAgent();
export { resumeAgent };