import { Router } from "express";
import { storage } from "../storage";
import { verifyToken } from "./authController";
import type { Request, Response } from "express";

// Note: We'll dynamically import the ProfileAgent when needed since it's CommonJS

const router = Router();

// Get user profile
router.get("/", verifyToken, async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const { password, ...userProfile } = user;
    res.json(userProfile);
  } catch (error: any) {
    res.status(500).json({ 
      message: "Failed to get profile", 
      error: error.message 
    });
  }
});

// Update user profile
router.post("/", verifyToken, async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const updates = req.body;
    
    // Don't allow updating sensitive fields
    const { id, password, username, email, createdAt, ...allowedUpdates } = updates;
    
    const updatedUser = await storage.updateUser(user.id, allowedUpdates);
    
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const { password: _, ...userResponse } = updatedUser;
    res.json(userResponse);
  } catch (error: any) {
    res.status(500).json({ 
      message: "Failed to update profile", 
      error: error.message 
    });
  }
});

// Get user activities
router.get("/activities", verifyToken, async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const activities = await storage.getUserActivities(user.id);
    res.json(activities);
  } catch (error: any) {
    res.status(500).json({ 
      message: "Failed to get activities", 
      error: error.message 
    });
  }
});

// Generate resume-based content 
router.post("/generate-content", verifyToken, async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    
    // Get user's resume analysis
    const resumeAnalysis = await storage.getResumeAnalysis(user.id);
    if (!resumeAnalysis) {
      return res.status(400).json({ 
        message: "Upload your resume first to generate personalized content"
      });
    }

    // Generate content based on resume
    const generatedContent = await generateResumeBasedContent(resumeAnalysis, user);
    
    res.json({
      success: true,
      content: generatedContent
    });
  } catch (error: any) {
    res.status(500).json({ 
      message: "Failed to generate content", 
      error: error.message 
    });
  }
});

// Get generated content
router.get("/generated-content", verifyToken, async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const generatedContent = await storage.getGeneratedContent(user.id);
    
    res.json({
      success: true,
      content: generatedContent
    });
  } catch (error: any) {
    res.status(500).json({ 
      message: "Failed to get generated content", 
      error: error.message 
    });
  }
});

// Function to generate content based on resume analysis
async function generateResumeBasedContent(resumeAnalysis: any, user: any) {
  const skills = resumeAnalysis.skills?.technical || [];
  const experience = resumeAnalysis.experienceYears || 0;
  const educationLevel = resumeAnalysis.education?.level || "Not specified";
  
  const content = {
    profileSummary: generateProfileSummary(skills, experience, educationLevel),
    careerGoals: generateCareerGoals(skills, experience),
    skillHighlights: generateSkillHighlights(skills),
    projectIdeas: generateProjectIdeas(skills),
    learningRecommendations: generateLearningPath(skills, experience),
    networkingTips: generateNetworkingTips(skills),
    portfolioTips: generatePortfolioTips(skills, experience),
    generatedAt: new Date()
  };

  // Save generated content to storage
  await storage.saveGeneratedContent(user.id, content);
  
  return content;
}

function generateProfileSummary(skills: string[], experience: number, education: string): string {
  const experienceLevel = experience <= 2 ? "emerging" : experience <= 5 ? "experienced" : "senior";
  const primarySkills = skills.slice(0, 3).join(", ");
  
  return `${experienceLevel.charAt(0).toUpperCase() + experienceLevel.slice(1)} developer with ${experience} years of experience specializing in ${primarySkills}. ${education !== "Not specified" ? `${education} graduate with` : "Possessing"} strong problem-solving abilities and a passion for building innovative solutions. Proven track record in full-stack development and modern web technologies.`;
}

function generateCareerGoals(skills: string[], experience: number): string[] {
  const goals = [];
  
  if (experience <= 2) {
    goals.push("Build a strong foundation in software engineering principles");
    goals.push("Contribute to open-source projects to gain real-world experience");
    goals.push("Develop expertise in modern development frameworks and tools");
  } else if (experience <= 5) {
    goals.push("Lead technical initiatives and mentor junior developers");
    goals.push("Architect scalable systems and drive technical decisions");
    goals.push("Expand expertise into emerging technologies and best practices");
  } else {
    goals.push("Drive technical strategy and innovation across the organization");
    goals.push("Build and lead high-performing engineering teams");
    goals.push("Establish thought leadership through speaking and writing");
  }
  
  if (skills.includes("Machine Learning") || skills.includes("AI")) {
    goals.push("Advance expertise in artificial intelligence and machine learning applications");
  }
  
  return goals;
}

function generateSkillHighlights(skills: string[]): string[] {
  return skills.map(skill => {
    const highlights: Record<string, string> = {
      "JavaScript": "Proficient in modern ES6+ features, async programming, and DOM manipulation",
      "React": "Experienced in component-based architecture, hooks, and state management",
      "Node.js": "Skilled in server-side development, APIs, and asynchronous programming",
      "Python": "Strong in object-oriented programming, data structures, and algorithmic thinking",
      "Java": "Experienced in enterprise-level applications and object-oriented design patterns",
      "SQL": "Proficient in database design, complex queries, and performance optimization",
      "Git": "Experienced with version control workflows and collaborative development",
      "Docker": "Skilled in containerization and microservices architecture"
    };
    
    return highlights[skill] || `Experienced in ${skill} development and implementation`;
  });
}

function generateProjectIdeas(skills: string[]): string[] {
  const ideas = [];
  
  if (skills.includes("React") || skills.includes("JavaScript")) {
    ideas.push("Real-time chat application with WebSocket integration");
    ideas.push("Progressive Web App with offline functionality");
  }
  
  if (skills.includes("Node.js")) {
    ideas.push("RESTful API with authentication and rate limiting");
    ideas.push("Microservices architecture with Docker containerization");
  }
  
  if (skills.includes("Python")) {
    ideas.push("Data analysis dashboard with interactive visualizations");
    ideas.push("Machine learning model for predictive analytics");
  }
  
  if (skills.includes("Machine Learning") || skills.includes("AI")) {
    ideas.push("AI-powered recommendation system");
    ideas.push("Natural language processing application");
  }
  
  // Default projects
  ideas.push("Personal portfolio website with modern design");
  ideas.push("Task management application with team collaboration");
  
  return ideas.slice(0, 5);
}

function generateLearningPath(skills: string[], experience: number): string[] {
  const recommendations = [];
  
  // Core development skills
  if (!skills.includes("Git")) {
    recommendations.push("Master Git version control and collaborative workflows");
  }
  
  if (!skills.includes("Testing")) {
    recommendations.push("Learn test-driven development and automated testing frameworks");
  }
  
  // Technology-specific recommendations
  if (skills.includes("JavaScript") && !skills.includes("TypeScript")) {
    recommendations.push("Advance to TypeScript for better code maintainability");
  }
  
  if (skills.includes("React") && !skills.includes("Next.js")) {
    recommendations.push("Explore Next.js for full-stack React development");
  }
  
  // Advanced topics based on experience
  if (experience >= 3) {
    recommendations.push("Study system design and scalability patterns");
    recommendations.push("Learn cloud platforms (AWS, Azure, or GCP)");
  }
  
  if (experience >= 5) {
    recommendations.push("Develop leadership and technical mentoring skills");
    recommendations.push("Explore emerging technologies like AI/ML or blockchain");
  }
  
  return recommendations.slice(0, 6);
}

function generateNetworkingTips(skills: string[]): string[] {
  return [
    "Join developer communities and forums related to your tech stack",
    "Attend local meetups and tech conferences in your area",
    "Contribute to open-source projects to build professional connections",
    "Share your knowledge through technical blog posts and tutorials",
    "Connect with other developers on LinkedIn and GitHub",
    "Participate in hackathons and coding competitions"
  ];
}

function generatePortfolioTips(skills: string[], experience: number): string[] {
  const tips = [
    "Showcase 3-5 of your best projects with live demos and source code",
    "Write clear, concise project descriptions explaining your role and impact",
    "Include a variety of projects demonstrating different skills and technologies",
    "Add a professional headshot and compelling personal statement"
  ];
  
  if (experience >= 2) {
    tips.push("Highlight measurable achievements and business impact of your work");
    tips.push("Include testimonials or recommendations from colleagues or clients");
  }
  
  if (skills.includes("Design") || skills.includes("UI/UX")) {
    tips.push("Showcase your design process and user experience considerations");
  }
  
  return tips;
}

// AI-powered profile update with skill extraction
router.post("/update-bio", verifyToken, async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const { bio } = req.body;
    
    if (!bio || typeof bio !== 'string') {
      return res.status(400).json({ 
        message: "Bio is required and must be a string" 
      });
    }

    // Dynamically import the ProfileAgent
    const { ProfileAgent } = await import("../agents/profileAgent.js");
    const profileAgent = new ProfileAgent();
    
    // Update profile with AI-extracted skills
    const updatedProfile = await profileAgent.updateUserProfile(user.id, bio, storage);
    
    // Remove password from response
    const { password, ...profileResponse } = updatedProfile;
    
    res.json({
      message: "Profile updated successfully with AI-extracted skills",
      profile: profileResponse,
      extractedSkills: updatedProfile.extractedSkills
    });
  } catch (error: any) {
    res.status(500).json({ 
      message: "Failed to update profile", 
      error: error.message 
    });
  }
});

// Get profile completeness analysis
router.get("/completeness", verifyToken, async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    
    // Dynamically import the ProfileAgent
    const { ProfileAgent } = await import("../agents/profileAgent.js");
    const profileAgent = new ProfileAgent();
    
    const analysis = await profileAgent.analyzeProfileCompleteness(user);
    
    res.json(analysis);
  } catch (error: any) {
    res.status(500).json({ 
      message: "Failed to analyze profile completeness", 
      error: error.message 
    });
  }
});

export default router;
