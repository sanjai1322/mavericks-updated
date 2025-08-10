import { Router } from "express";
import { storage } from "../storage";
import { verifyToken } from "./authController";
import type { Request, Response } from "express";

const router = Router();

// Get all learning paths
router.get("/", verifyToken, async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const learningPaths = await storage.getLearningPaths();
    
    // Get user's progress for each path
    const userProgress = await storage.getUserProgress(user.id);
    const progressMap = new Map(
      userProgress.map(p => [p.pathId, p.progress])
    );

    // Merge progress with learning paths
    const pathsWithProgress = learningPaths.map(path => ({
      ...path,
      progress: progressMap.get(path.id) || path.progress || 0,
    }));
    
    res.json(pathsWithProgress);
  } catch (error: any) {
    res.status(500).json({ 
      message: "Failed to get learning paths", 
      error: error.message 
    });
  }
});

// Get specific learning path
router.get("/:id", verifyToken, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = (req as any).user;
    
    const learningPath = await storage.getLearningPath(id);
    if (!learningPath) {
      return res.status(404).json({ message: "Learning path not found" });
    }

    // Get user's progress for this path
    const userProgress = await storage.getUserProgress(user.id);
    const pathProgress = userProgress.find(p => p.pathId === id);
    
    res.json({
      ...learningPath,
      progress: pathProgress?.progress || learningPath.progress || 0,
    });
  } catch (error: any) {
    res.status(500).json({ 
      message: "Failed to get learning path", 
      error: error.message 
    });
  }
});

// Update user progress for a learning path
router.post("/:id/progress", verifyToken, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { progress } = req.body;
    const user = (req as any).user;
    
    if (typeof progress !== "number" || progress < 0 || progress > 100) {
      return res.status(400).json({ 
        message: "Progress must be a number between 0 and 100" 
      });
    }

    const learningPath = await storage.getLearningPath(id);
    if (!learningPath) {
      return res.status(404).json({ message: "Learning path not found" });
    }

    const updatedProgress = await storage.updateUserProgress({
      userId: user.id,
      pathId: id,
      progress,
    });

    // Create activity record for significant progress
    if (progress > 0 && progress % 25 === 0) {
      await storage.createActivity({
        userId: user.id,
        type: "learning_progress",
        title: `${progress}% progress in "${learningPath.title}"`,
        description: `Completed ${progress}% of the learning path`,
      });
    }

    res.json({
      message: "Progress updated successfully",
      progress: updatedProgress,
    });
  } catch (error: any) {
    res.status(500).json({ 
      message: "Failed to update progress", 
      error: error.message 
    });
  }
});

export default router;
