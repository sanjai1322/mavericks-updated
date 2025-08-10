import { Router } from "express";
import { storage } from "../storage";
import { verifyToken } from "./authController";
import type { Request, Response } from "express";

const router = Router();

// Get all assessments
router.get("/", verifyToken, async (req: Request, res: Response) => {
  try {
    const assessments = await storage.getAssessments();
    res.json(assessments);
  } catch (error: any) {
    res.status(500).json({ 
      message: "Failed to get assessments", 
      error: error.message 
    });
  }
});

// Get specific assessment
router.get("/:id", verifyToken, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const assessment = await storage.getAssessment(id);
    
    if (!assessment) {
      return res.status(404).json({ message: "Assessment not found" });
    }
    
    res.json(assessment);
  } catch (error: any) {
    res.status(500).json({ 
      message: "Failed to get assessment", 
      error: error.message 
    });
  }
});

// Submit solution for assessment
router.post("/submit", verifyToken, async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const { assessmentId, code, language = "javascript" } = req.body;
    
    if (!assessmentId || !code) {
      return res.status(400).json({ 
        message: "Assessment ID and code are required" 
      });
    }

    const assessment = await storage.getAssessment(assessmentId);
    if (!assessment) {
      return res.status(404).json({ message: "Assessment not found" });
    }

    // TODO: Integrate with code execution service
    // For now, simulate evaluation
    const mockResult = {
      success: true,
      score: Math.floor(Math.random() * 40) + 60, // Random score 60-100
      testsPassed: Math.floor(Math.random() * 3) + 3, // 3-5 tests passed
      totalTests: 5,
      executionTime: Math.floor(Math.random() * 100) + 50, // 50-150ms
      memoryUsed: Math.floor(Math.random() * 20) + 10, // 10-30MB
    };

    // Update user stats if submission is successful
    if (mockResult.success && mockResult.score >= 70) {
      await storage.updateUser(user.id, {
        problemsSolved: user.problemsSolved + 1,
        points: user.points + Math.floor(mockResult.score / 10),
        streak: user.streak + 1,
      });

      // Create activity record
      await storage.createActivity({
        userId: user.id,
        type: "assessment_completed",
        title: `Completed "${assessment.title}" challenge`,
        description: `Scored ${mockResult.score}/100`,
      });
    }

    res.json({
      message: "Solution submitted successfully",
      result: mockResult,
    });
  } catch (error: any) {
    res.status(500).json({ 
      message: "Failed to submit solution", 
      error: error.message 
    });
  }
});

// Run code (for testing without submitting)
router.post("/run", verifyToken, async (req: Request, res: Response) => {
  try {
    const { code, language = "javascript", input = "" } = req.body;
    
    if (!code) {
      return res.status(400).json({ message: "Code is required" });
    }

    // TODO: Integrate with code execution service
    // For now, return mock execution result
    const mockOutput = {
      output: "Hello, World!\n[1, 2]\n", // Mock output
      error: null,
      executionTime: Math.floor(Math.random() * 100) + 20, // 20-120ms
      memoryUsed: Math.floor(Math.random() * 15) + 5, // 5-20MB
    };

    res.json({
      message: "Code executed successfully",
      result: mockOutput,
    });
  } catch (error: any) {
    res.status(500).json({ 
      message: "Failed to run code", 
      error: error.message 
    });
  }
});

export default router;
