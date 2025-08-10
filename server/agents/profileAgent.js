// server/agents/profileAgent.js
import fetch from "node-fetch";

const HF_KEY = process.env.HUGGINGFACE_API_KEY;

// AI-powered skill extraction from user submissions and activity
async function extractSkillsFromCode(codeSubmission, language) {
  if (!HF_KEY) {
    // Fallback skill extraction without AI
    return extractSkillsFallback(codeSubmission, language);
  }

  try {
    const prompt = `Analyze this ${language} code and extract programming skills demonstrated:

${codeSubmission}

List the key programming concepts, algorithms, and skills shown in this code. Focus on:
- Data structures used
- Algorithms implemented
- Programming patterns
- Language-specific features
- Problem-solving approaches

Respond with a comma-separated list of skills.`;

    const response = await fetch("https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${HF_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          max_new_tokens: 150,
          temperature: 0.3
        }
      })
    });

    if (!response.ok) {
      console.error("HF API error:", response.status, await response.text());
      return extractSkillsFallback(codeSubmission, language);
    }

    const result = await response.json();
    const skillsText = result[0]?.generated_text || "";
    
    // Parse skills from response
    const skills = skillsText
      .split(',')
      .map(s => s.trim().toLowerCase())
      .filter(s => s.length > 0 && s.length < 50)
      .slice(0, 10); // Limit to 10 skills

    return skills.length > 0 ? skills : extractSkillsFallback(codeSubmission, language);
    
  } catch (error) {
    console.error("Error in AI skill extraction:", error);
    return extractSkillsFallback(codeSubmission, language);
  }
}

// Fallback skill extraction using pattern matching
function extractSkillsFallback(code, language) {
  const skills = [];
  const codeStr = code.toLowerCase();

  // Language-specific patterns
  const patterns = {
    javascript: {
      'arrays': /\.(map|filter|reduce|forEach|push|pop|slice)/,
      'objects': /\{.*\}|object\.|\.hasOwnProperty/,
      'async programming': /async|await|promise|\.then/,
      'dom manipulation': /document\.|getElementById|querySelector/,
      'functions': /function|=>/,
      'loops': /for\s*\(|while\s*\(|\.forEach/
    },
    python: {
      'list comprehensions': /\[.*for.*in.*\]/,
      'dictionaries': /\{.*:.*\}|\.get\(|\.keys\(/,
      'object oriented': /class\s+\w+|def\s+__init__|self\./,
      'functional programming': /map\(|filter\(|lambda/,
      'loops': /for\s+\w+\s+in|while\s+/,
      'string manipulation': /\.split\(|\.join\(|\.strip\(/
    },
    java: {
      'object oriented': /class\s+\w+|public\s+class|extends|implements/,
      'collections': /ArrayList|HashMap|HashSet|List</,
      'loops': /for\s*\(|while\s*\(|enhanced for/,
      'exception handling': /try\s*\{|catch\s*\(|throws/,
      'interfaces': /interface\s+\w+|implements/
    },
    cpp: {
      'pointers': /\*\w+|\w+\*|&\w+/,
      'stl containers': /vector|map|set|queue|stack/,
      'loops': /for\s*\(|while\s*\(/,
      'memory management': /new\s+|delete\s+|malloc|free/,
      'templates': /template\s*</
    }
  };

  // General programming concepts
  const generalPatterns = {
    'conditionals': /if\s*\(|else|switch/,
    'recursion': /function.*\{[\s\S]*\1|def.*:[\s\S]*\1/,
    'algorithms': /sort|search|binary|linear|merge|quick/,
    'data structures': /array|list|tree|graph|stack|queue|hash/
  };

  // Check language-specific patterns
  const langPatterns = patterns[language] || {};
  for (const [skill, pattern] of Object.entries(langPatterns)) {
    if (pattern.test(codeStr)) {
      skills.push(skill);
    }
  }

  // Check general patterns
  for (const [skill, pattern] of Object.entries(generalPatterns)) {
    if (pattern.test(codeStr)) {
      skills.push(skill);
    }
  }

  return skills.slice(0, 8); // Limit to 8 skills
}

// Analyze user's learning progress and identify weak areas
function analyzeWeakSkills(userSubmissions, assessmentResults) {
  const skillFrequency = {};
  const skillSuccess = {};

  // Count skill usage and success rates
  userSubmissions.forEach(submission => {
    const skills = submission.extractedSkills || [];
    const passed = submission.passed || false;

    skills.forEach(skill => {
      skillFrequency[skill] = (skillFrequency[skill] || 0) + 1;
      if (!skillSuccess[skill]) {
        skillSuccess[skill] = { total: 0, passed: 0 };
      }
      skillSuccess[skill].total += 1;
      if (passed) {
        skillSuccess[skill].passed += 1;
      }
    });
  });

  // Identify weak skills (low success rate or infrequent practice)
  const weakSkills = [];
  for (const [skill, stats] of Object.entries(skillSuccess)) {
    const successRate = stats.passed / stats.total;
    const frequency = skillFrequency[skill];

    if (successRate < 0.6 || frequency < 3) {
      weakSkills.push({
        skill,
        successRate,
        frequency,
        priority: (1 - successRate) * Math.log(frequency + 1)
      });
    }
  }

  // Sort by priority (higher priority = needs more work)
  weakSkills.sort((a, b) => b.priority - a.priority);
  
  return weakSkills.slice(0, 5).map(w => w.skill);
}

// Generate personalized learning recommendations
async function generateRecommendations(userId, weakSkills, userLevel = 'beginner') {
  const recommendations = [];

  // Skill-specific recommendations
  const skillResources = {
    'arrays': {
      beginner: [
        { title: "Array Basics in Programming", type: "article", difficulty: "easy" },
        { title: "Array Methods Tutorial", type: "video", difficulty: "easy" }
      ],
      intermediate: [
        { title: "Advanced Array Algorithms", type: "course", difficulty: "medium" },
        { title: "Array Performance Optimization", type: "article", difficulty: "medium" }
      ]
    },
    'recursion': {
      beginner: [
        { title: "Understanding Recursion", type: "video", difficulty: "easy" },
        { title: "Recursion Practice Problems", type: "practice", difficulty: "easy" }
      ],
      intermediate: [
        { title: "Dynamic Programming with Recursion", type: "course", difficulty: "hard" },
        { title: "Advanced Recursive Algorithms", type: "article", difficulty: "hard" }
      ]
    },
    'object oriented': {
      beginner: [
        { title: "OOP Fundamentals", type: "course", difficulty: "easy" },
        { title: "Classes and Objects Tutorial", type: "video", difficulty: "easy" }
      ],
      intermediate: [
        { title: "Design Patterns in OOP", type: "course", difficulty: "medium" },
        { title: "SOLID Principles", type: "article", difficulty: "medium" }
      ]
    }
  };

  // Generate recommendations for weak skills
  weakSkills.forEach(skill => {
    const resources = skillResources[skill];
    if (resources && resources[userLevel]) {
      recommendations.push(...resources[userLevel].map(r => ({
        ...r,
        skill,
        reason: `Improve your ${skill} skills based on recent assessment performance`
      })));
    }
  });

  // Add general recommendations if no specific weak skills
  if (recommendations.length === 0) {
    recommendations.push(
      {
        title: "Algorithm Fundamentals Course",
        type: "course",
        difficulty: "medium",
        reason: "Strengthen your algorithmic thinking"
      },
      {
        title: "Data Structures Deep Dive",
        type: "course", 
        difficulty: "medium",
        reason: "Master essential data structures"
      }
    );
  }

  return recommendations.slice(0, 5);
}

export {
  extractSkillsFromCode,
  analyzeWeakSkills,
  generateRecommendations
};