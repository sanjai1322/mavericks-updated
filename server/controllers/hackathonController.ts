import { Router } from "express";
import { storage } from "../storage";
// Import the fetchDevpostHackathons function directly since it's already in this file
import { verifyToken } from "./authController";
import type { Request, Response } from "express";

// Interface for Devpost hackathon data
interface DevpostHackathon {
  title: string;
  description: string;
  url: string;
  status: "upcoming" | "open" | "ended";
  startDate: string;
  endDate: string;
  location: "online" | "in-person" | "hybrid";
  prizeAmount: string;
  participants: number;
  organizer: string;
  tags: string[];
  imageUrl?: string;
}

const router = Router();

// Function to fetch live Devpost hackathons
async function fetchDevpostHackathons(): Promise<DevpostHackathon[]> {
  try {
    // Mock data based on the real Devpost data I fetched
    // In production, this would use web scraping or an API
    return [
      {
        title: "RevenueCat Shipaton 2025",
        description: "Build innovative mobile apps with RevenueCat's subscription platform",
        url: "https://revenuecat-shipaton-2025.devpost.com/",
        status: "open",
        startDate: "2025-07-31",
        endDate: "2025-10-01",
        location: "online",
        prizeAmount: "$355,000",
        participants: 16087,
        organizer: "RevenueCat",
        tags: ["Mobile", "Design", "Subscription"],
        imageUrl: "https://d112y698adiu2z.cloudfront.net/photos/production/challenge_thumbnails/003/488/891/datas/medium_square.png"
      },
      {
        title: "Code with Kiro Hackathon",
        description: "AI-powered coding challenges and innovative solutions",
        url: "https://kiro.devpost.com/",
        status: "open",
        startDate: "2025-07-14",
        endDate: "2025-09-15",
        location: "online",
        prizeAmount: "$100,000",
        participants: 10065,
        organizer: "Kiro",
        tags: ["Machine Learning/AI", "Open Ended", "Beginner Friendly"]
      },
      {
        title: "OpenAI Open Model Hackathon",
        description: "Create innovative applications using OpenAI's latest open models",
        url: "https://openai.devpost.com/",
        status: "open",
        startDate: "2025-08-05",
        endDate: "2025-09-11",
        location: "online",
        prizeAmount: "$30,000",
        participants: 3156,
        organizer: "OpenAI",
        tags: ["Machine Learning/AI", "IoT", "Robotic Process Automation"]
      },
      {
        title: "Tableau Next Virtual Hackathon",
        description: "Data visualization and analytics innovation challenge",
        url: "https://tableau.devpost.com/",
        status: "open",
        startDate: "2025-07-24",
        endDate: "2025-09-18",
        location: "online",
        prizeAmount: "$45,000",
        participants: 3088,
        organizer: "Tableau",
        tags: ["Databases", "Enterprise", "Machine Learning/AI"]
      },
      {
        title: "TiDB AgentX Hackathon 2025",
        description: "Build AI agents with TiDB database technology",
        url: "https://tidb-2025-hackathon.devpost.com/",
        status: "open",
        startDate: "2025-08-01",
        endDate: "2025-09-16",
        location: "online",
        prizeAmount: "$30,500",
        participants: 1910,
        organizer: "TiDB",
        tags: ["Databases", "Machine Learning/AI", "Serverless"]
      },
      {
        title: "QuSat Group Hackathon 2025",
        description: "Quantum computing and satellite technology innovation",
        url: "https://qusat-group-hackathon.devpost.com/",
        status: "upcoming",
        startDate: "2025-07-26",
        endDate: "2025-09-25",
        location: "online",
        prizeAmount: "$40,000",
        participants: 986,
        organizer: "QuSat Group",
        tags: ["Blockchain", "Machine Learning/AI", "Fintech"]
      }
    ];
  } catch (error) {
    console.error("Failed to fetch Devpost hackathons:", error);
    return [];
  }
}

// Get all hackathons (local + Devpost)
router.get("/", verifyToken, async (req: Request, res: Response) => {
  try {
    const { status } = req.query;
    
    // Get local hackathons
    let localHackathons;
    if (status && typeof status === 'string') {
      localHackathons = await storage.getHackathonsByStatus(status);
    } else {
      localHackathons = await storage.getHackathons();
    }
    
    // Get Devpost hackathons
    const devpostHackathons = await fetchDevpostHackathons();
    
    // Combine and sort by status priority and start date
    const allHackathons = [...localHackathons, ...devpostHackathons].sort((a, b) => {
      const statusPriority = { 'open': 1, 'Live': 1, 'upcoming': 2, 'Upcoming': 2, 'ended': 3, 'Past': 3 };
      const aPriority = statusPriority[a.status as keyof typeof statusPriority] || 4;
      const bPriority = statusPriority[b.status as keyof typeof statusPriority] || 4;
      
      if (aPriority !== bPriority) {
        return aPriority - bPriority;
      }
      
      return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
    });
    
    res.json(allHackathons);
  } catch (error: any) {
    res.status(500).json({ 
      message: "Failed to get hackathons", 
      error: error.message 
    });
  }
});

// Get resume-based hackathon recommendations
router.get("/recommendations", verifyToken, async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    
    // Get user's resume analysis
    const resumeAnalysis = await storage.getResumeAnalysis(user.id);
    if (!resumeAnalysis) {
      return res.json({ 
        recommendations: [],
        message: "Upload your resume to get personalized hackathon recommendations"
      });
    }
    
    // Get all hackathons
    const devpostHackathons = await fetchDevpostHackathons();
    const localHackathons = await storage.getHackathons();
    const allHackathons = [...localHackathons, ...devpostHackathons];
    
    // Filter hackathons based on resume skills
    const userSkills = resumeAnalysis.skills?.technical || [];
    const recommendations = allHackathons
      .filter(hackathon => hackathon.status === 'open' || hackathon.status === 'Live')
      .map(hackathon => {
        // Calculate relevance score based on matching tags/skills
        const hackathonTags = (hackathon as any).tags || [];
        const matchingSkills = userSkills.filter(skill => 
          hackathonTags.some((tag: string) => 
            tag.toLowerCase().includes(skill.toLowerCase()) || 
            skill.toLowerCase().includes(tag.toLowerCase())
          )
        );
        
        return {
          ...hackathon,
          relevanceScore: matchingSkills.length,
          matchingSkills: matchingSkills,
          isRecommended: matchingSkills.length > 0
        };
      })
      .filter(h => h.relevanceScore > 0)
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, 6); // Top 6 recommendations
    
    res.json({
      recommendations,
      totalMatches: recommendations.length,
      userSkills: userSkills
    });
  } catch (error: any) {
    res.status(500).json({ 
      message: "Failed to get recommendations", 
      error: error.message 
    });
  }
});

// Get specific hackathon
router.get("/:id", verifyToken, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const hackathon = await storage.getHackathon(id);
    
    if (!hackathon) {
      return res.status(404).json({ message: "Hackathon not found" });
    }
    
    res.json(hackathon);
  } catch (error: any) {
    res.status(500).json({ 
      message: "Failed to get hackathon", 
      error: error.message 
    });
  }
});

// Join a hackathon
router.post("/join", verifyToken, async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const { hackathonId } = req.body;
    
    if (!hackathonId) {
      return res.status(400).json({ message: "Hackathon ID is required" });
    }

    const hackathon = await storage.getHackathon(hackathonId);
    if (!hackathon) {
      return res.status(404).json({ message: "Hackathon not found" });
    }

    if (hackathon.status !== "Live" && hackathon.status !== "Upcoming") {
      return res.status(400).json({ message: "Cannot join this hackathon" });
    }

    // TODO: Check if user is already registered
    // TODO: Add user to hackathon participants
    // For now, just create an activity
    await storage.createActivity({
      userId: user.id,
      type: "hackathon_joined",
      title: `Joined "${hackathon.title}" hackathon`,
      description: `Registered for hackathon starting ${hackathon.startDate}`,
    });

    res.json({
      message: "Successfully joined hackathon",
      hackathon,
    });
  } catch (error: any) {
    res.status(500).json({ 
      message: "Failed to join hackathon", 
      error: error.message 
    });
  }
});

// Get user's hackathon submissions
router.get("/submissions", verifyToken, async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const submissions = await storage.getUserSubmissions(user.id);
    res.json(submissions);
  } catch (error: any) {
    res.status(500).json({ 
      message: "Failed to get submissions", 
      error: error.message 
    });
  }
});

// Submit to a hackathon
router.post("/submit", verifyToken, async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const { hackathonId, title, description, repositoryUrl } = req.body;
    
    if (!hackathonId || !title || !description) {
      return res.status(400).json({ 
        message: "Hackathon ID, title, and description are required" 
      });
    }

    const hackathon = await storage.getHackathon(hackathonId);
    if (!hackathon) {
      return res.status(404).json({ message: "Hackathon not found" });
    }

    if (hackathon.status !== "Live") {
      return res.status(400).json({ 
        message: "Submissions are only allowed for live hackathons" 
      });
    }

    const submission = await storage.createSubmission({
      userId: user.id,
      hackathonId,
      title,
      description,
      rank: null,
      score: null,
      prize: null,
    });

    // Create activity record
    await storage.createActivity({
      userId: user.id,
      type: "hackathon_submitted",
      title: `Submitted to "${hackathon.title}"`,
      description: `Submitted project: "${title}"`,
    });

    res.json({
      message: "Submission created successfully",
      submission,
    });
  } catch (error: any) {
    res.status(500).json({ 
      message: "Failed to create submission", 
      error: error.message 
    });
  }
});

export default router;
