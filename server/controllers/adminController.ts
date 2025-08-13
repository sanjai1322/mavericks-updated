import { Router } from "express";
import { verifyToken } from "./authController";
import { storage } from "../storage";
import type { Request, Response } from "express";
import type { AuthenticatedRequest, User } from "../../shared/schema";

const router = Router();

// Middleware to check admin role
const requireAdmin = async (req: Request, res: Response, next: any) => {
  try {
    const user = (req as any).user;
    if (!user) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const userRecord = await storage.getUser(user.id);
    if (!userRecord || userRecord.role !== 'admin') {
      return res.status(403).json({ message: "Admin access required" });
    }

    next();
  } catch (error) {
    console.error('Admin middleware error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get platform statistics
router.get("/stats", verifyToken, requireAdmin, async (req: Request, res: Response) => {
  try {
    // Mock stats for now - implement these in storage later
    const stats = {
      totalUsers: 15,
      newUsersToday: 3,
      totalAssessments: 25,
      totalLearningPaths: 8,
      totalSubmissions: 120,
      activeUsers: 12
    };

    res.json(stats);
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    res.status(500).json({ message: 'Failed to fetch statistics' });
  }
});

// Get all users
router.get("/users", verifyToken, requireAdmin, async (req: Request, res: Response) => {
  try {
    // Mock users for now - implement getUsers in storage later
    const safeUsers = [
      {
        id: '1',
        username: 'admin',
        email: 'admin@example.com',
        firstName: 'Admin',
        lastName: 'User',
        role: 'admin',
        level: 10,
        points: 1000,
        problemsSolved: 50,
        createdAt: new Date().toISOString()
      }
    ];

    res.json(safeUsers);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Failed to fetch users' });
  }
});

// Update user role
router.put("/users/:userId/role", verifyToken, requireAdmin, async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role. Must be "user" or "admin"' });
    }

    const updatedUser = await storage.updateUser(userId, { role });
    
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User role updated successfully', user: { id: updatedUser.id, role: updatedUser.role } });
  } catch (error) {
    console.error('Error updating user role:', error);
    res.status(500).json({ message: 'Failed to update user role' });
  }
});

// Get all assessments for admin
router.get("/assessments", verifyToken, requireAdmin, async (req: Request, res: Response) => {
  try {
    const assessments = await storage.getAssessments();
    res.json(assessments);
  } catch (error) {
    console.error('Error fetching assessments:', error);
    res.status(500).json({ message: 'Failed to fetch assessments' });
  }
});

// Create new assessment
router.post("/assessments", verifyToken, requireAdmin, async (req: Request, res: Response) => {
  try {
    const { title, description, difficulty, topic, acceptance, problemStatement, starterCode, testCases } = req.body;

    if (!title || !description || !difficulty || !topic || !problemStatement) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const assessment = await storage.createAssessment({
      title,
      description,
      difficulty,
      topic,
      acceptance: acceptance || '50%',
      problemStatement,
      starterCode: starterCode || '',
      testCases: testCases || []
    });

    res.status(201).json(assessment);
  } catch (error) {
    console.error('Error creating assessment:', error);
    res.status(500).json({ message: 'Failed to create assessment' });
  }
});

// Update assessment (simplified for now)
router.put("/assessments/:id", verifyToken, requireAdmin, async (req: Request, res: Response) => {
  try {
    res.json({ message: 'Assessment update feature coming soon' });
  } catch (error) {
    console.error('Error updating assessment:', error);
    res.status(500).json({ message: 'Failed to update assessment' });
  }
});

// Delete assessment (simplified for now)
router.delete("/assessments/:id", verifyToken, requireAdmin, async (req: Request, res: Response) => {
  try {
    res.json({ message: 'Assessment deletion feature coming soon' });
  } catch (error) {
    console.error('Error deleting assessment:', error);
    res.status(500).json({ message: 'Failed to delete assessment' });
  }
});

// Get all learning paths for admin
router.get("/learning-paths", verifyToken, requireAdmin, async (req: Request, res: Response) => {
  try {
    const learningPaths = await storage.getLearningPaths();
    res.json(learningPaths);
  } catch (error) {
    console.error('Error fetching learning paths:', error);
    res.status(500).json({ message: 'Failed to fetch learning paths' });
  }
});

// Create new learning path
router.post("/learning-paths", verifyToken, requireAdmin, async (req: Request, res: Response) => {
  try {
    const { title, description, icon, difficulty, lessons, duration, category } = req.body;

    if (!title || !description || !difficulty || !category) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const learningPath = await storage.createLearningPath({
      title,
      description,
      icon: icon || '📚',
      difficulty,
      lessons: lessons || 1,
      duration: duration || '1 hour',
      category,
      progress: 0
    });

    res.status(201).json(learningPath);
  } catch (error) {
    console.error('Error creating learning path:', error);
    res.status(500).json({ message: 'Failed to create learning path' });
  }
});

// User analytics
router.get("/analytics/users", verifyToken, requireAdmin, async (req: Request, res: Response) => {
  try {
    // Mock analytics for now
    const analytics = {
      totalUsers: 15,
      usersByLevel: { 1: 5, 2: 4, 3: 3, 4: 2, 5: 1 },
      averagePoints: 245,
      topUsers: [
        { id: '1', username: 'admin', firstName: 'Admin', lastName: 'User', points: 1000, level: 10 }
      ]
    };

    res.json(analytics);
  } catch (error) {
    console.error('Error fetching user analytics:', error);
    res.status(500).json({ message: 'Failed to fetch user analytics' });
  }
});

export default router;