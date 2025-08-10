import { Router } from "express";
import { storage } from "../storage";
import { verifyToken } from "./authController";
import type { Request, Response } from "express";

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

export default router;
