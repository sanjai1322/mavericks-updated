import { Router } from "express";
import { z } from "zod";
import { storage } from "../database-storage";
import { requireAuth, requireAdmin } from "../middleware/auth";
import { 
  insertUserSchema, 
  insertAssessmentSchema, 
  insertLearningPathSchema,
  insertHackathonSchema 
} from "@shared/schema";

const router = Router();

// Admin middleware - require admin role
router.use(requireAuth);
router.use(requireAdmin);

// User management routes
router.get("/users", async (req, res) => {
  try {
    const users = await storage.getUsers();
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Failed to fetch users" });
  }
});

// Assessment management routes
router.get("/assessments", async (req, res) => {
  try {
    const assessments = await storage.getAssessments();
    res.json(assessments);
  } catch (error) {
    console.error("Error fetching assessments:", error);
    res.status(500).json({ message: "Failed to fetch assessments" });
  }
});

router.post("/assessments", async (req, res) => {
  try {
    const validatedData = insertAssessmentSchema.parse(req.body);
    const assessment = await storage.createAssessment(validatedData);
    res.status(201).json(assessment);
  } catch (error) {
    console.error("Error creating assessment:", error);
    res.status(400).json({ message: "Failed to create assessment" });
  }
});

router.put("/assessments/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const assessment = await storage.updateAssessment(id, updates);
    
    if (!assessment) {
      return res.status(404).json({ message: "Assessment not found" });
    }
    
    res.json(assessment);
  } catch (error) {
    console.error("Error updating assessment:", error);
    res.status(500).json({ message: "Failed to update assessment" });
  }
});

router.delete("/assessments/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await storage.deleteAssessment(id);
    
    if (!deleted) {
      return res.status(404).json({ message: "Assessment not found" });
    }
    
    res.json({ message: "Assessment deleted successfully" });
  } catch (error) {
    console.error("Error deleting assessment:", error);
    res.status(500).json({ message: "Failed to delete assessment" });
  }
});

// Learning path management routes
router.get("/learning-paths", async (req, res) => {
  try {
    const paths = await storage.getLearningPaths();
    res.json(paths);
  } catch (error) {
    console.error("Error fetching learning paths:", error);
    res.status(500).json({ message: "Failed to fetch learning paths" });
  }
});

router.post("/learning-paths", async (req, res) => {
  try {
    const validatedData = insertLearningPathSchema.parse(req.body);
    const path = await storage.createLearningPath(validatedData);
    res.status(201).json(path);
  } catch (error) {
    console.error("Error creating learning path:", error);
    res.status(400).json({ message: "Failed to create learning path" });
  }
});

// Hackathon management routes
router.post("/hackathons", async (req, res) => {
  try {
    const validatedData = insertHackathonSchema.parse(req.body);
    const hackathon = await storage.createHackathon(validatedData);
    res.status(201).json(hackathon);
  } catch (error) {
    console.error("Error creating hackathon:", error);
    res.status(400).json({ message: "Failed to create hackathon" });
  }
});

// User analytics routes
router.get("/analytics/users", async (req, res) => {
  try {
    const users = await storage.getUsers();
    
    const analytics = {
      totalUsers: users.length,
      usersByLevel: users.reduce((acc, user) => {
        acc[user.level] = (acc[user.level] || 0) + 1;
        return acc;
      }, {} as Record<number, number>),
      usersByRole: users.reduce((acc, user) => {
        acc[user.role || 'user'] = (acc[user.role || 'user'] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      averagePoints: users.reduce((sum, user) => sum + (user.points || 0), 0) / users.length || 0,
      totalProblemsSolved: users.reduce((sum, user) => sum + (user.problemsSolved || 0), 0)
    };
    
    res.json(analytics);
  } catch (error) {
    console.error("Error fetching user analytics:", error);
    res.status(500).json({ message: "Failed to fetch analytics" });
  }
});

// Resume analysis routes
router.get("/users/:userId/resume-analysis", async (req, res) => {
  try {
    const { userId } = req.params;
    const analysis = await storage.getResumeAnalysis(userId);
    res.json(analysis);
  } catch (error) {
    console.error("Error fetching resume analysis:", error);
    res.status(500).json({ message: "Failed to fetch resume analysis" });
  }
});

// User detail route with comprehensive data
router.get("/users/:userId/detailed", async (req, res) => {
  try {
    const { userId } = req.params;
    
    const [user, resumes, activities, assessments, progress] = await Promise.all([
      storage.getUser(userId),
      storage.getUserResumes(userId),
      storage.getUserActivities(userId),
      storage.getUserAssessments(userId),
      storage.getUserProgress(userId)
    ]);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    res.json({
      user,
      resumes,
      activities,
      assessments,
      progress,
      resumeAnalysis: await storage.getResumeAnalysis(userId),
      learningScore: await calculateLearningScore(userId)
    });
  } catch (error) {
    console.error("Error fetching detailed user data:", error);
    res.status(500).json({ message: "Failed to fetch user details" });
  }
});

// Helper function to calculate learning score
async function calculateLearningScore(userId: string): Promise<number> {
  try {
    const [assessments, progress] = await Promise.all([
      storage.getUserAssessments(userId),
      storage.getUserProgress(userId)
    ]);
    
    const assessmentScore = assessments.reduce((sum, assessment) => sum + (assessment.score || 0), 0) / Math.max(assessments.length, 1);
    const progressScore = progress.reduce((sum, prog) => sum + (prog.progress || 0), 0) / Math.max(progress.length, 1);
    
    return Math.round((assessmentScore + progressScore) / 2);
  } catch (error) {
    console.error("Error calculating learning score:", error);
    return 0;
  }
}

export default router;