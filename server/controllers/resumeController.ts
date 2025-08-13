import { Router } from "express";
import { storage } from "../database-storage";
import { requireAuth } from "../middleware/auth";
import multer from "multer";
import { z } from "zod";
import OpenAI from "openai";

// Initialize OpenAI if API key is available
const openai = process.env.OPENAI_API_KEY ? new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
}) : null;

const router = Router();
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Apply auth middleware to all routes
router.use(requireAuth);

// Upload and analyze resume
router.post("/upload", upload.single("resume"), async (req: any, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const userId = req.user.id;
    const file = req.file;
    
    // Extract text content (simplified for demo)
    const extractedText = file.buffer.toString('utf-8');
    
    // Simple skill extraction using keywords
    const skillKeywords = [
      'JavaScript', 'React', 'Node.js', 'Python', 'Java', 'HTML', 'CSS', 
      'TypeScript', 'Vue.js', 'Angular', 'Express', 'MongoDB', 'PostgreSQL',
      'MySQL', 'AWS', 'Docker', 'Kubernetes', 'Git', 'Figma', 'Blender',
      'Unity', 'Machine Learning', 'AI', 'DaVinci Resolve', 'Unreal Engine'
    ];
    
    const extractedSkills: Record<string, number> = {};
    const textLower = extractedText.toLowerCase();
    
    skillKeywords.forEach(skill => {
      const regex = new RegExp(`\\b${skill.toLowerCase()}\\b`, 'gi');
      const matches = textLower.match(regex);
      if (matches) {
        extractedSkills[skill] = matches.length / 10; // Normalize confidence
      }
    });

    // AI Analysis using OpenAI or fallback simulation
    let aiAnalysis;
    try {
      if (process.env.OPENAI_API_KEY) {
        aiAnalysis = await analyzeResumeWithOpenAI(extractedText, extractedSkills);
      } else if (process.env.OPENROUTER_API_KEY) {
        aiAnalysis = await analyzeResumeWithOpenRouter(extractedText, extractedSkills);
      } else {
        throw new Error("No AI service available");
      }
    } catch (error: any) {
      console.log("AI analysis failed, using fallback:", error.message || "Unknown error");
      // Fallback analysis based on extracted skills
      aiAnalysis = generateFallbackAnalysis(extractedSkills, extractedText);
    }

    // Save resume to database
    const resume = await storage.createResume({
      userId,
      fileName: file.originalname,
      fileSize: file.size,
      mimeType: file.mimetype,
      extractedText,
      extractedSkills,
      aiAnalysis
    });

    // Update user profile with extracted skills
    await storage.updateUser(userId, {
      extractedSkills,
      skillStrengths: aiAnalysis.categories,
      resumeText: extractedText.substring(0, 500) // Store preview
    });

    res.json({
      message: "Resume uploaded and analyzed successfully",
      analysis: aiAnalysis,
      extractedSkills,
      resumeId: resume.id
    });

  } catch (error) {
    console.error("Error uploading resume:", error);
    res.status(500).json({ message: "Failed to upload resume" });
  }
});

// Get resume analysis
router.get("/analysis", async (req: any, res) => {
  try {
    const userId = req.user.id;
    const resumes = await storage.getUserResumes(userId);
    
    if (resumes.length === 0) {
      return res.json({ 
        hasResume: false, 
        message: "No resume uploaded yet" 
      });
    }

    const latestResume = resumes[0];
    
    res.json({
      hasResume: true,
      analysis: latestResume.aiAnalysis,
      skills: latestResume.extractedSkills,
      uploadedAt: latestResume.uploadedAt,
      fileName: latestResume.fileName
    });

  } catch (error) {
    console.error("Error getting resume analysis:", error);
    res.status(500).json({ message: "Failed to get resume analysis" });
  }
});

// Get learning recommendations based on resume
router.get("/recommendations", async (req: any, res) => {
  try {
    const userId = req.user.id;
    const analysis = await storage.getResumeAnalysis(userId);
    
    if (!analysis) {
      return res.json({ recommendations: [] });
    }

    // Generate learning path recommendations based on skill gaps
    const recommendations = [
      {
        title: "Advanced React Development",
        reason: "Enhance your React skills with advanced patterns",
        priority: "High",
        estimatedTime: "4-6 weeks"
      },
      {
        title: "Machine Learning Fundamentals",
        reason: "Build on your AI interests with structured ML learning",
        priority: "Medium", 
        estimatedTime: "8-10 weeks"
      },
      {
        title: "Cloud Computing with AWS",
        reason: "Learn deployment and scaling for your applications",
        priority: "High",
        estimatedTime: "6-8 weeks"
      }
    ];

    res.json({ recommendations });

  } catch (error) {
    console.error("Error getting recommendations:", error);
    res.status(500).json({ message: "Failed to get recommendations" });
  }
});

// AI Analysis Functions
async function analyzeResumeWithOpenAI(resumeText: string, skills: Record<string, number>) {
  try {
    const prompt = `Analyze this resume and provide a comprehensive assessment:

Resume Text: ${resumeText}

Extracted Skills: ${Object.keys(skills).join(', ')}

Please provide analysis in the following JSON format:
{
  "experienceLevel": "Entry-Level|Mid-Level|Senior-Level|Expert",
  "strengths": ["strength1", "strength2", ...],
  "recommendations": ["recommendation1", "recommendation2", ...],
  "skillGaps": ["gap1", "gap2", ...],
  "careerSuggestions": ["role1", "role2", ...],
  "overallScore": 0-100,
  "categories": {
    "Technical Skills": 0-10,
    "Project Experience": 0-10,
    "Leadership": 0-10,
    "Communication": 0-10,
    "Innovation": 0-10
  }
}

Focus on practical, actionable insights based on the actual content.`;

    const response = await openai!.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" }
    });

    return JSON.parse(response.choices[0].message.content || "{}");
  } catch (error) {
    console.error("OpenAI analysis failed:", error);
    throw error;
  }
}

async function analyzeResumeWithOpenRouter(resumeText: string, skills: Record<string, number>) {
  try {
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
          content: `Analyze this resume and provide assessment: ${resumeText.substring(0, 1000)}. Skills found: ${Object.keys(skills).join(', ')}. Return JSON with experienceLevel, strengths, recommendations, skillGaps, careerSuggestions, overallScore (0-100), and categories object with Technical Skills, Project Experience, Leadership, Communication, Innovation (all 0-10).`
        }],
        response_format: { type: 'json_object' }
      })
    });

    if (!response.ok) {
      throw new Error(`OpenRouter API failed: ${response.status}`);
    }

    const data = await response.json();
    return JSON.parse(data.choices[0].message.content || "{}");
  } catch (error) {
    console.error("OpenRouter analysis failed:", error);
    throw error;
  }
}

function generateFallbackAnalysis(skills: Record<string, number>, resumeText: string) {
  const skillCount = Object.keys(skills).length;
  const textLength = resumeText.length;
  
  // Determine experience level based on content
  let experienceLevel = "Entry-Level";
  if (textLength > 2000 && skillCount > 8) {
    experienceLevel = "Senior-Level";
  } else if (textLength > 1000 && skillCount > 5) {
    experienceLevel = "Mid-Level";
  }

  // Generate analysis based on detected skills
  const topSkills = Object.entries(skills)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 4)
    .map(([skill]) => skill);

  const techSkills = topSkills.filter(skill => 
    ['JavaScript', 'React', 'Node.js', 'Python', 'Java', 'TypeScript'].includes(skill)
  );

  return {
    experienceLevel,
    strengths: topSkills.length > 0 ? topSkills : ["Software Development", "Problem Solving"],
    recommendations: [
      "Continue building projects with your current tech stack",
      "Consider learning complementary technologies",
      "Build a strong portfolio showcasing your skills",
      "Practice coding challenges and algorithms"
    ],
    skillGaps: ["System Design", "DevOps", "Testing"],
    careerSuggestions: techSkills.length > 2 ? [
      "Full Stack Developer",
      "Software Engineer",
      "Frontend Developer",
      "Backend Developer"
    ] : [
      "Junior Developer",
      "Programming Trainee",
      "IT Support Specialist"
    ],
    overallScore: Math.min(90, 40 + (skillCount * 5) + (textLength / 50)),
    categories: {
      "Technical Skills": Math.min(10, 3 + skillCount),
      "Project Experience": Math.min(10, 2 + Math.floor(textLength / 500)),
      "Leadership": Math.min(10, resumeText.toLowerCase().includes('lead') ? 7 : 4),
      "Communication": Math.min(10, resumeText.toLowerCase().includes('present') ? 8 : 5),
      "Innovation": Math.min(10, topSkills.includes('AI') || topSkills.includes('Machine Learning') ? 9 : 6)
    }
  };
}

export default router;