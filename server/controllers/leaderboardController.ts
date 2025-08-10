import { Router } from "express";
import { storage } from "../storage";
import { verifyToken } from "./authController";
import type { Request, Response } from "express";

const router = Router();

// Get leaderboard
router.get("/", verifyToken, async (req: Request, res: Response) => {
  try {
    const { timeframe = "all-time", category = "all" } = req.query;
    
    // Get all users sorted by points
    let leaderboard = await storage.getLeaderboard();
    
    // TODO: Filter by timeframe and category when those features are implemented
    // For now, just return the basic leaderboard
    
    // Remove passwords from response
    const sanitizedLeaderboard = leaderboard.map(user => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });
    
    res.json(sanitizedLeaderboard);
  } catch (error: any) {
    res.status(500).json({ 
      message: "Failed to get leaderboard", 
      error: error.message 
    });
  }
});

// Get user's rank
router.get("/rank/:userId", verifyToken, async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const leaderboard = await storage.getLeaderboard();
    
    const userIndex = leaderboard.findIndex(user => user.id === userId);
    if (userIndex === -1) {
      return res.status(404).json({ message: "User not found in leaderboard" });
    }
    
    const rank = userIndex + 1;
    const user = leaderboard[userIndex];
    
    // Remove password from response
    const { password, ...userWithoutPassword } = user;
    
    res.json({
      rank,
      user: userWithoutPassword,
      totalUsers: leaderboard.length,
    });
  } catch (error: any) {
    res.status(500).json({ 
      message: "Failed to get user rank", 
      error: error.message 
    });
  }
});

// Get leaderboard stats
router.get("/stats", verifyToken, async (req: Request, res: Response) => {
  try {
    const leaderboard = await storage.getLeaderboard();
    
    const stats = {
      totalUsers: leaderboard.length,
      averageScore: Math.round(
        leaderboard.reduce((sum, user) => sum + user.points, 0) / leaderboard.length
      ),
      topScore: leaderboard[0]?.points || 0,
      activeUsers: leaderboard.filter(user => user.points > 0).length,
    };
    
    res.json(stats);
  } catch (error: any) {
    res.status(500).json({ 
      message: "Failed to get leaderboard stats", 
      error: error.message 
    });
  }
});

export default router;
