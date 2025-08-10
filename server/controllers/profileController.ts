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
