import { Router } from "express";
import { storage } from "../storage";
import { verifyToken } from "./authController";
import type { Request, Response } from "express";

const router = Router();

// Get all hackathons
router.get("/", verifyToken, async (req: Request, res: Response) => {
  try {
    const { status } = req.query;
    
    let hackathons;
    if (status && typeof status === 'string') {
      hackathons = await storage.getHackathonsByStatus(status);
    } else {
      hackathons = await storage.getHackathons();
    }
    
    res.json(hackathons);
  } catch (error: any) {
    res.status(500).json({ 
      message: "Failed to get hackathons", 
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
