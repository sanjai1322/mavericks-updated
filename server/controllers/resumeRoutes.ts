import { Router } from "express";
import { verifyToken } from "./authController";
import { 
  uploadResume, 
  getUserResumes, 
  getLatestResumeAnalysis,
  getSkillBasedRecommendations,
  updateLearningPlan 
} from "./resumeController";

const router = Router();

// All resume routes require authentication
router.use(verifyToken);

// Resume upload and management
router.post("/upload", uploadResume);
router.get("/history", getUserResumes);
router.get("/analysis", getLatestResumeAnalysis);

// Skill-based recommendations
router.get("/recommendations", getSkillBasedRecommendations);
router.put("/learning-plan", updateLearningPlan);

export default router;