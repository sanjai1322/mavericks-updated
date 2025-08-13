import { Router } from "express";
import { storage } from "../database-storage";
import { requireAuth } from "../middleware/auth";
import OpenAI from "openai";

const router = Router();

// Initialize OpenAI if API key is available
const openai = process.env.OPENAI_API_KEY ? new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
}) : null;

// Apply auth middleware to all routes
router.use(requireAuth);

// Generate career recommendations based on resume analysis
router.post("/recommendations", async (req: any, res) => {
  try {
    const userId = req.user.id;
    const user = await storage.getUser(userId);
    
    if (!user || !user.resumeText) {
      return res.status(400).json({ 
        message: "Please upload a resume first to get career recommendations" 
      });
    }

    // Generate career recommendations using AI
    let recommendations;
    try {
      if (process.env.OPENAI_API_KEY) {
        recommendations = await generateCareerRecommendationsWithOpenAI(user.resumeText, user.extractedSkills || {});
      } else if (process.env.OPENROUTER_API_KEY) {
        recommendations = await generateCareerRecommendationsWithOpenRouter(user.resumeText, user.extractedSkills || {});
      } else {
        recommendations = generateFallbackCareerRecommendations(user.extractedSkills || {});
      }
    } catch (error: any) {
      console.log("AI career analysis failed, using fallback:", error.message || "Unknown error");
      recommendations = generateFallbackCareerRecommendations(user.extractedSkills || {});
    }

    res.json({
      message: "Career recommendations generated successfully",
      recommendations
    });
  } catch (error) {
    console.error("Error generating career recommendations:", error);
    res.status(500).json({ message: "Failed to generate career recommendations" });
  }
});

// Generate learning path based on career goals
router.post("/learning-path", async (req: any, res) => {
  try {
    const userId = req.user.id;
    const { careerGoal } = req.body;
    
    if (!careerGoal) {
      return res.status(400).json({ message: "Career goal is required" });
    }

    const user = await storage.getUser(userId);
    const userSkills = user?.extractedSkills || {};

    let learningPath;
    try {
      if (process.env.OPENAI_API_KEY) {
        learningPath = await generateLearningPathWithOpenAI(careerGoal, userSkills);
      } else if (process.env.OPENROUTER_API_KEY) {
        learningPath = await generateLearningPathWithOpenRouter(careerGoal, userSkills);
      } else {
        learningPath = generateFallbackLearningPath(careerGoal, userSkills);
      }
    } catch (error: any) {
      console.log("AI learning path generation failed, using fallback:", error.message || "Unknown error");
      learningPath = generateFallbackLearningPath(careerGoal, userSkills);
    }

    res.json({
      message: "Learning path generated successfully",
      learningPath
    });
  } catch (error) {
    console.error("Error generating learning path:", error);
    res.status(500).json({ message: "Failed to generate learning path" });
  }
});

// Generate interview preparation content
router.post("/interview-prep", async (req: any, res) => {
  try {
    const userId = req.user.id;
    const { role } = req.body;
    
    if (!role) {
      return res.status(400).json({ message: "Target role is required" });
    }

    const user = await storage.getUser(userId);
    const userSkills = user?.extractedSkills || {};

    let interviewPrep;
    try {
      if (process.env.OPENAI_API_KEY) {
        interviewPrep = await generateInterviewPrepWithOpenAI(role, userSkills);
      } else if (process.env.OPENROUTER_API_KEY) {
        interviewPrep = await generateInterviewPrepWithOpenRouter(role, userSkills);
      } else {
        interviewPrep = generateFallbackInterviewPrep(role, userSkills);
      }
    } catch (error: any) {
      console.log("AI interview prep generation failed, using fallback:", error.message || "Unknown error");
      interviewPrep = generateFallbackInterviewPrep(role, userSkills);
    }

    res.json({
      message: "Interview preparation content generated successfully",
      interviewPrep
    });
  } catch (error) {
    console.error("Error generating interview preparation:", error);
    res.status(500).json({ message: "Failed to generate interview preparation" });
  }
});

// AI Functions
async function generateCareerRecommendationsWithOpenAI(resumeText: string, skills: Record<string, number>) {
  const prompt = `Based on this resume and skills, provide comprehensive career recommendations:

Resume: ${resumeText.substring(0, 1500)}
Skills: ${Object.keys(skills).join(', ')}

Provide response in JSON format:
{
  "careerPaths": ["path1", "path2", "path3"],
  "nextSteps": ["step1", "step2", "step3"],
  "skillsToImprove": ["skill1", "skill2", "skill3"],
  "industryTrends": ["trend1", "trend2", "trend3"],
  "salaryRange": "range",
  "timeframe": "timeframe for career growth"
}`;

  const response = await openai!.chat.completions.create({
    model: "gpt-4o",
    messages: [{ role: "user", content: prompt }],
    response_format: { type: "json_object" }
  });

  return JSON.parse(response.choices[0].message.content || "{}");
}

async function generateCareerRecommendationsWithOpenRouter(resumeText: string, skills: Record<string, number>) {
  const fetch = (await import('node-fetch')).default;
  
  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://mavericks-coding-platform.replit.app',
      'X-Title': 'Mavericks Coding Platform'
    },
    body: JSON.stringify({
      model: 'meta-llama/llama-3.1-8b-instruct:free',
      messages: [{
        role: 'user',
        content: `Generate career recommendations based on resume: ${resumeText.substring(0, 800)}. Skills: ${Object.keys(skills).join(', ')}. Return JSON with careerPaths, nextSteps, skillsToImprove, industryTrends, salaryRange, timeframe.`
      }],
      response_format: { type: 'json_object' }
    })
  });

  const data = await response.json();
  return JSON.parse(data.choices[0].message.content || "{}");
}

async function generateLearningPathWithOpenAI(careerGoal: string, skills: Record<string, number>) {
  const prompt = `Create a personalized learning path for someone wanting to become: ${careerGoal}

Current skills: ${Object.keys(skills).join(', ')}

Provide response in JSON format:
{
  "title": "Learning Path Title",
  "duration": "estimated duration",
  "difficulty": "Beginner|Intermediate|Advanced",
  "steps": [
    {
      "title": "Step title",
      "description": "Step description",
      "resources": ["resource1", "resource2"],
      "estimatedTime": "time needed"
    }
  ],
  "milestones": ["milestone1", "milestone2"],
  "projects": ["project1", "project2"]
}`;

  const response = await openai!.chat.completions.create({
    model: "gpt-4o",
    messages: [{ role: "user", content: prompt }],
    response_format: { type: "json_object" }
  });

  return JSON.parse(response.choices[0].message.content || "{}");
}

async function generateLearningPathWithOpenRouter(careerGoal: string, skills: Record<string, number>) {
  const fetch = (await import('node-fetch')).default;
  
  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://mavericks-coding-platform.replit.app',
      'X-Title': 'Mavericks Coding Platform'
    },
    body: JSON.stringify({
      model: 'meta-llama/llama-3.1-8b-instruct:free',
      messages: [{
        role: 'user',
        content: `Create learning path for ${careerGoal} career. Current skills: ${Object.keys(skills).join(', ')}. Return JSON with title, duration, difficulty, steps array, milestones, projects.`
      }],
      response_format: { type: 'json_object' }
    })
  });

  const data = await response.json();
  return JSON.parse(data.choices[0].message.content || "{}");
}

async function generateInterviewPrepWithOpenAI(role: string, skills: Record<string, number>) {
  const prompt = `Generate interview preparation content for: ${role}

Candidate skills: ${Object.keys(skills).join(', ')}

Provide response in JSON format:
{
  "commonQuestions": ["question1", "question2", "question3"],
  "technicalQuestions": ["tech1", "tech2", "tech3"],
  "projectQuestions": ["proj1", "proj2", "proj3"],
  "preparationTips": ["tip1", "tip2", "tip3"],
  "keyTopics": ["topic1", "topic2", "topic3"]
}`;

  const response = await openai!.chat.completions.create({
    model: "gpt-4o",
    messages: [{ role: "user", content: prompt }],
    response_format: { type: "json_object" }
  });

  return JSON.parse(response.choices[0].message.content || "{}");
}

async function generateInterviewPrepWithOpenRouter(role: string, skills: Record<string, number>) {
  const fetch = (await import('node-fetch')).default;
  
  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://mavericks-coding-platform.replit.app',
      'X-Title': 'Mavericks Coding Platform'
    },
    body: JSON.stringify({
      model: 'meta-llama/llama-3.1-8b-instruct:free',
      messages: [{
        role: 'user',
        content: `Generate interview prep for ${role}. Skills: ${Object.keys(skills).join(', ')}. Return JSON with commonQuestions, technicalQuestions, projectQuestions, preparationTips, keyTopics arrays.`
      }],
      response_format: { type: 'json_object' }
    })
  });

  const data = await response.json();
  return JSON.parse(data.choices[0].message.content || "{}");
}

// Fallback Functions
function generateFallbackCareerRecommendations(skills: Record<string, number>) {
  const skillList = Object.keys(skills);
  const hasWebSkills = skillList.some(skill => ['JavaScript', 'React', 'HTML', 'CSS'].includes(skill));
  const hasBackendSkills = skillList.some(skill => ['Node.js', 'Python', 'Java'].includes(skill));
  const hasDataSkills = skillList.some(skill => ['Python', 'SQL', 'Machine Learning'].includes(skill));

  let careerPaths = ["Software Developer", "Technical Support"];
  
  if (hasWebSkills && hasBackendSkills) {
    careerPaths = ["Full Stack Developer", "Web Developer", "Software Engineer"];
  } else if (hasWebSkills) {
    careerPaths = ["Frontend Developer", "UI/UX Developer", "Web Designer"];
  } else if (hasBackendSkills) {
    careerPaths = ["Backend Developer", "API Developer", "System Developer"];
  } else if (hasDataSkills) {
    careerPaths = ["Data Analyst", "Data Scientist", "ML Engineer"];
  }

  return {
    careerPaths,
    nextSteps: [
      "Build a strong portfolio showcasing your skills",
      "Contribute to open source projects",
      "Network with professionals in your field"
    ],
    skillsToImprove: ["System Design", "Testing", "DevOps"],
    industryTrends: ["AI Integration", "Cloud Computing", "Remote Work"],
    salaryRange: "$50,000 - $120,000 depending on location and experience",
    timeframe: "6-18 months for significant career advancement"
  };
}

function generateFallbackLearningPath(careerGoal: string, skills: Record<string, number>) {
  return {
    title: `Learning Path: ${careerGoal}`,
    duration: "3-6 months",
    difficulty: "Intermediate",
    steps: [
      {
        title: "Foundation Building",
        description: "Strengthen core programming concepts",
        resources: ["Online courses", "Documentation", "Practice projects"],
        estimatedTime: "2-4 weeks"
      },
      {
        title: "Hands-on Projects",
        description: "Build real-world applications",
        resources: ["GitHub projects", "Code challenges", "Portfolio development"],
        estimatedTime: "4-8 weeks"
      },
      {
        title: "Advanced Topics",
        description: "Learn specialized skills for your career goal",
        resources: ["Advanced courses", "Industry certifications", "Mentorship"],
        estimatedTime: "4-6 weeks"
      }
    ],
    milestones: ["Complete first project", "Build portfolio", "Get first interview"],
    projects: ["Personal website", "CRUD application", "API integration project"]
  };
}

function generateFallbackInterviewPrep(role: string, skills: Record<string, number>) {
  return {
    commonQuestions: [
      "Tell me about yourself",
      "Why are you interested in this role?",
      "What are your strengths and weaknesses?"
    ],
    technicalQuestions: [
      "Explain a challenging project you worked on",
      "How do you approach debugging?",
      "What's your experience with version control?"
    ],
    projectQuestions: [
      "Walk me through your portfolio projects",
      "How did you handle project challenges?",
      "What technologies did you choose and why?"
    ],
    preparationTips: [
      "Research the company and role thoroughly",
      "Practice coding problems related to the position",
      "Prepare specific examples of your work"
    ],
    keyTopics: Object.keys(skills).length > 0 ? Object.keys(skills) : ["Programming fundamentals", "Problem solving", "Communication"]
  };
}

export default router;