import { Router } from "express";
import { verifyToken } from "./authController";
import { storage } from "../storage";
import type { Request, Response } from "express";
import type { AuthenticatedRequest } from "../../shared/schema";

const router = Router();

// Get learning progress for authenticated user
router.get("/progress", verifyToken, async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    if (!user) {
      return res.status(401).json({ message: "Authentication required" });
    }

    // Mock learning progress data for now
    const learningProgress = {
      learningPaths: [
        {
          id: "path-1",
          title: "JavaScript Fundamentals",
          description: "Master the basics of JavaScript programming",
          category: "Web Development",
          difficulty: "Beginner",
          estimatedHours: 20,
          content: [
            {
              section: "Variables and Data Types",
              topics: [
                {
                  title: "Understanding Variables",
                  description: "Learn about var, let, and const",
                  estimatedHours: 2,
                  resources: [
                    { type: "Video", title: "JavaScript Variables" },
                    { type: "Exercise", title: "Variable Practice" }
                  ]
                }
              ]
            }
          ],
          prerequisites: [],
          learningObjectives: ["Understand JavaScript basics", "Write simple programs"],
          tags: ["javascript", "programming", "beginner"],
          progress: 25,
          status: "In Progress"
        }
      ],
      progressSummary: {
        totalPaths: 1,
        completedPaths: 0,
        inProgressPaths: 1,
        averageProgress: 25
      },
      skillGaps: [
        {
          skill: "React",
          currentLevel: 0.3,
          recommendedAction: "Complete JavaScript fundamentals first"
        }
      ],
      nextRecommendations: [
        {
          type: "course",
          title: "Advanced JavaScript",
          description: "Deep dive into advanced JavaScript concepts"
        }
      ]
    };

    res.json(learningProgress);
  } catch (error) {
    console.error('Error fetching learning progress:', error);
    res.status(500).json({ message: 'Failed to fetch learning progress' });
  }
});

// Generate new learning path
router.post("/generate", verifyToken, async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    if (!user) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const userRecord = await storage.getUser(user.id);
    if (!userRecord) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if user has resume analysis
    if (!userRecord.extractedSkills) {
      return res.status(400).json({ 
        message: "Please upload your resume first to generate a personalized learning path" 
      });
    }

    // Create a new learning path based on user skills
    const newPath = await storage.createLearningPath({
      title: "Personalized Learning Path",
      description: "AI-generated path based on your resume skills",
      icon: "🎯",
      difficulty: "Intermediate",
      lessons: 5,
      duration: "15 hours",
      category: "Personalized",
      progress: 0
    });

    // Update user's personalized plan
    await storage.updateUser(user.id, {
      personalizedPlan: {
        pathId: newPath.id,
        generatedAt: new Date().toISOString(),
        skills: userRecord.extractedSkills
      }
    });

    res.json({ 
      message: "Learning path generated successfully",
      path: newPath
    });
  } catch (error) {
    console.error('Error generating learning path:', error);
    res.status(500).json({ message: 'Failed to generate learning path' });
  }
});

// Update learning progress
router.put("/progress", verifyToken, async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    if (!user) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const { pathId, completedSections, currentSection, progress } = req.body;

    // Mock update - in a real implementation, you'd update the user's progress
    res.json({ 
      message: "Progress updated successfully",
      pathId,
      newProgress: progress
    });
  } catch (error) {
    console.error('Error updating progress:', error);
    res.status(500).json({ message: 'Failed to update progress' });
  }
});

export default router;