import { Router } from "express";
import { storage } from "../storage";
import { verifyToken } from "./authController";
import type { Request, Response } from "express";

const router = Router();

// Get personalized problem recommendations
router.get("/problems", verifyToken, async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const userId = user?.id;
    
    if (!userId) {
      return res.status(401).json({ message: "User not found" });
    }

    const limit = parseInt(req.query.limit as string) || 5;
    const difficulty = req.query.difficulty as string;
    const topic = req.query.topic as string;

    // Get user data and assessment history
    const currentUser = await storage.getUser(userId);
    if (!currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Get user's assessment history
    const userAssessments = await storage.getUserAssessments(userId);
    
    // Get all available problems
    const allProblems = await storage.getAssessments();
    
    // Filter problems user hasn't solved yet
    const solvedProblemIds = userAssessments
      .filter(assessment => assessment.passed)
      .map(assessment => assessment.assessmentId);
    
    const availableProblems = allProblems.filter(problem => 
      !solvedProblemIds.includes(problem.id)
    );

    // Apply filters if provided
    let filteredProblems = availableProblems;
    if (difficulty) {
      filteredProblems = filteredProblems.filter(p => p.difficulty.toLowerCase() === difficulty.toLowerCase());
    }
    if (topic) {
      filteredProblems = filteredProblems.filter(p => p.topic.toLowerCase().includes(topic.toLowerCase()));
    }

    // Generate personalized recommendations
    const recommendationModule = await import('../agents/recommendationAgent.js') as any;
    const RecommendationAgent = recommendationModule.RecommendationAgent;
    const recommendationAgent = new RecommendationAgent();
    
    const recommendationResult = await recommendationAgent.generateRecommendations(
      currentUser,
      userAssessments,
      filteredProblems,
      limit
    );

    // Add user progress stats
    const stats = {
      totalProblems: allProblems.length,
      solvedProblems: solvedProblemIds.length,
      currentStreak: currentUser.streak || 0,
      level: currentUser.level || 1,
      points: currentUser.points || 0
    };

    res.json({
      recommendations: recommendationResult.recommendations,
      userProfile: recommendationResult.userProfile,
      reasoning: recommendationResult.reasoning,
      stats,
      filters: {
        availableDifficulties: Array.from(new Set(availableProblems.map(p => p.difficulty))),
        availableTopics: Array.from(new Set(availableProblems.map(p => p.topic)))
      }
    });

  } catch (error: any) {
    console.error("Error getting recommendations:", error);
    res.status(500).json({ message: "Failed to generate recommendations" });
  }
});

// Get learning path recommendations
router.get("/learning-path", verifyToken, async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const userId = user?.id;
    
    if (!userId) {
      return res.status(401).json({ message: "User not found" });
    }

    const currentUser = await storage.getUser(userId);
    const userAssessments = await storage.getUserAssessments(userId);
    const allProblems = await storage.getAssessments();

    // Generate learning path based on user's current skills and weaknesses
    const recommendationModule = await import('../agents/recommendationAgent.js') as any;
    const RecommendationAgent = recommendationModule.RecommendationAgent;
    const recommendationAgent = new RecommendationAgent();
    
    const userProfile = recommendationAgent.analyzeUserProfile(currentUser, userAssessments);
    
    // Create structured learning path
    const learningPath = {
      currentLevel: userProfile.learningVelocity,
      recommendedPath: [],
      skillGaps: userProfile.skillGaps,
      nextMilestone: "",
      estimatedTimeToComplete: ""
    };

    // Define learning progression paths
    const learningPaths = {
      beginner: [
        { phase: "Foundation", topics: ["Math", "Basic Logic"], difficulty: "Easy", problems: 5 },
        { phase: "Arrays & Strings", topics: ["Arrays", "Strings"], difficulty: "Easy", problems: 8 },
        { phase: "Basic Algorithms", topics: ["Sorting", "Search Algorithms"], difficulty: "Easy-Medium", problems: 6 }
      ],
      intermediate: [
        { phase: "Data Structures", topics: ["Arrays", "Hash Tables", "Stacks"], difficulty: "Medium", problems: 10 },
        { phase: "Algorithm Design", topics: ["Two Pointers", "Sliding Window"], difficulty: "Medium", problems: 8 },
        { phase: "Problem Solving", topics: ["Dynamic Programming", "Recursion"], difficulty: "Medium-Hard", problems: 6 }
      ],
      advanced: [
        { phase: "Advanced Algorithms", topics: ["Graph Algorithms", "Tree Algorithms"], difficulty: "Hard", problems: 8 },
        { phase: "System Design", topics: ["Data Structures", "Optimization"], difficulty: "Hard", problems: 6 },
        { phase: "Complex Problem Solving", topics: ["Dynamic Programming", "Advanced Math"], difficulty: "Hard", problems: 10 }
      ]
    };

    const currentPath = learningPaths[userProfile.learningVelocity as keyof typeof learningPaths] || learningPaths.beginner;
    learningPath.recommendedPath = currentPath as any;
    learningPath.nextMilestone = currentPath[0]?.phase || "Complete Basic Problems";
    learningPath.estimatedTimeToComplete = `${currentPath.reduce((sum: number, phase: any) => sum + phase.problems, 0)} problems`;

    res.json({
      learningPath,
      userProfile: {
        level: userProfile.level,
        successRate: userProfile.successRate,
        averageScore: userProfile.averageScore,
        strongTopics: userProfile.strongTopics,
        skillGaps: userProfile.skillGaps
      }
    });

  } catch (error: any) {
    console.error("Error generating learning path:", error);
    res.status(500).json({ message: "Failed to generate learning path" });
  }
});

// Get daily challenge recommendation
router.get("/daily-challenge", verifyToken, async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const userId = user?.id;
    
    if (!userId) {
      return res.status(401).json({ message: "User not found" });
    }

    const currentUser = await storage.getUser(userId);
    const userAssessments = await storage.getUserAssessments(userId);
    const allProblems = await storage.getAssessments();

    // Check if user already has a daily challenge for today
    const today = new Date().toISOString().split('T')[0];
    const todaysAttempts = userAssessments.filter(assessment => 
      assessment.submissionTime && assessment.submissionTime.toISOString().split('T')[0] === today
    );

    let dailyChallenge;
    
    if (todaysAttempts.length === 0) {
      // Generate new daily challenge
      const recommendationModule = await import('../agents/recommendationAgent.js') as any;
      const RecommendationAgent = recommendationModule.RecommendationAgent;
      const recommendationAgent = new RecommendationAgent();
      
      const recommendations = await recommendationAgent.generateRecommendations(
        currentUser,
        userAssessments,
        allProblems,
        1
      );
      
      dailyChallenge = recommendations.recommendations[0];
    } else {
      // Return existing challenge if already attempted today
      const lastAttempt = todaysAttempts[todaysAttempts.length - 1];
      dailyChallenge = allProblems.find(p => p.id === lastAttempt.assessmentId);
    }

    res.json({
      challenge: dailyChallenge,
      isCompleted: todaysAttempts.some(attempt => attempt.passed),
      attemptsToday: todaysAttempts.length,
      streak: currentUser?.streak || 0,
      points: currentUser?.points || 0
    });

  } catch (error: any) {
    console.error("Error getting daily challenge:", error);
    res.status(500).json({ message: "Failed to get daily challenge" });
  }
});

// Get skill assessment and gap analysis
router.get("/skill-analysis", verifyToken, async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const userId = user?.id;
    
    if (!userId) {
      return res.status(401).json({ message: "User not found" });
    }

    const currentUser = await storage.getUser(userId);
    const userAssessments = await storage.getUserAssessments(userId);

    // Analyze skills using recommendation engine
    const recommendationModule = await import('../agents/recommendationAgent.js') as any;
    const RecommendationAgent = recommendationModule.RecommendationAgent;
    const recommendationAgent = new RecommendationAgent();
    
    const userProfile = recommendationAgent.analyzeUserProfile(currentUser, userAssessments);

    // Create detailed skill breakdown
    const skillAnalysis = {
      overallLevel: userProfile.learningVelocity,
      skillBreakdown: Object.entries(userProfile.topicExperience).map(([topic, stats]: [string, any]) => ({
        topic,
        level: stats.successRate > 80 ? 'Expert' : stats.successRate > 60 ? 'Intermediate' : 'Beginner',
        successRate: Math.round(stats.successRate),
        averageScore: Math.round(stats.avgScore),
        problemsSolved: stats.passed,
        totalAttempts: stats.total
      })),
      recommendations: {
        prioritySkills: userProfile.skillGaps,
        strengthAreas: userProfile.strongTopics,
        nextFocusArea: userProfile.skillGaps[0] || 'Continue practicing strong areas'
      }
    };

    res.json(skillAnalysis);

  } catch (error: any) {
    console.error("Error analyzing skills:", error);
    res.status(500).json({ message: "Failed to analyze skills" });
  }
});

export { router as recommendationRoutes };