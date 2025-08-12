import { Router } from "express";
import { verifyToken as authenticateToken } from "./authController";
import {
  getAllQuizzes,
  getQuizById,
  submitQuiz,
  getUserQuizHistory
} from "./quizController";

const router = Router();

// Get all quizzes (with filtering)
router.get("/", getAllQuizzes);

// Get specific quiz by ID
router.get("/:id", getQuizById);

// Submit quiz answers (requires authentication)
router.post("/submit", authenticateToken, submitQuiz);

// Get user's quiz history (requires authentication)
router.get("/history", authenticateToken, getUserQuizHistory);

export default router;