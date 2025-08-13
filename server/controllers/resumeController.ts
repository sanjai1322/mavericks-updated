import { Router } from "express";
import { storage } from "../database-storage";
import { requireAuth } from "../middleware/auth";
import multer from "multer";
import { z } from "zod";

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

    // AI Analysis simulation (in real app, this would call OpenAI/Claude)
    const aiAnalysis = {
      experienceLevel: "Mid-Level",
      strengths: ["Full Stack Development", "3D Design", "AI Integration", "Content Creation"],
      recommendations: [
        "Focus on advanced React patterns and state management",
        "Expand machine learning skills with more hands-on projects",
        "Consider learning cloud deployment (AWS/Azure)",
        "Build portfolio with more complex full-stack applications"
      ],
      skillGaps: ["Cloud Architecture", "DevOps", "Advanced Algorithms"],
      careerSuggestions: [
        "Senior Full Stack Developer",
        "AI/ML Engineer", 
        "Technical Content Creator",
        "3D Application Developer"
      ],
      overallScore: 85,
      categories: {
        "Technical Skills": 9,
        "Project Experience": 8,
        "Leadership": 7,
        "Communication": 9,
        "Innovation": 8
      }
    };

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

export default router;