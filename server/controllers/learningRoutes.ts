import { Router } from "express";
import { verifyToken as authenticateToken } from "./authController";
import {
  generatePersonalizedLearningPath,
  getUserLearningProgress,
  updateLearningProgress
} from "./learningPathController";

const router = Router();

// Generate personalized learning path (requires authentication)
router.post("/generate", authenticateToken, generatePersonalizedLearningPath);

// Get user's learning progress (requires authentication)
router.get("/progress", authenticateToken, getUserLearningProgress);

// Update learning progress (requires authentication)
router.put("/progress", authenticateToken, updateLearningProgress);

// Get personalized learning path (existing route)
router.get("/personalized", authenticateToken, async (req, res) => {
  try {
    // This is the existing route, redirect to progress
    res.redirect('/api/learning/progress');
  } catch (error) {
    console.error('Error redirecting to progress:', error);
    res.status(500).json({ message: 'Failed to fetch learning path' });
  }
});

export default router;