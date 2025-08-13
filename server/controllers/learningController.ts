import { Router } from "express";
import { storage } from "../database-storage";
import { requireAuth } from "../middleware/auth";
import type { Request, Response } from "express";

const router = Router();

// Comprehensive learning paths data
const LEARNING_PATHS = [
  {
    id: "path-1",
    title: "JavaScript Fundamentals",
    description: "Master the basics of JavaScript programming",
    difficulty: "Beginner",
    estimatedTime: "4-6 weeks",
    category: "Programming Languages",
    prerequisites: [],
    skills: ["JavaScript", "Programming Basics", "ES6+"],
    progress: 25,
    modules: [
      {
        id: "module-1",
        title: "Variables and Data Types",
        completed: true,
        progress: 100,
        lessons: ["Variables", "Numbers", "Strings", "Booleans", "Arrays", "Objects"]
      },
      {
        id: "module-2", 
        title: "Functions and Scope",
        completed: false,
        progress: 60,
        lessons: ["Function Declaration", "Arrow Functions", "Scope", "Closures", "Higher-Order Functions"]
      },
      {
        id: "module-3",
        title: "DOM Manipulation",
        completed: false,
        progress: 0,
        lessons: ["Selecting Elements", "Event Handling", "Creating Elements", "CSS Manipulation"]
      },
      {
        id: "module-4",
        title: "Asynchronous JavaScript",
        completed: false,
        progress: 0,
        lessons: ["Callbacks", "Promises", "Async/Await", "Fetch API"]
      }
    ]
  },
  {
    id: "path-2",
    title: "React Development",
    description: "Build modern web applications with React",
    difficulty: "Intermediate",
    estimatedTime: "6-8 weeks",
    category: "Frontend Frameworks",
    prerequisites: ["JavaScript Fundamentals"],
    skills: ["React", "JSX", "State Management", "Hooks"],
    progress: 0,
    modules: [
      {
        id: "react-1",
        title: "React Basics",
        completed: false,
        progress: 0,
        lessons: ["Components", "JSX", "Props", "State", "Event Handling"]
      },
      {
        id: "react-2",
        title: "React Hooks",
        completed: false,
        progress: 0,
        lessons: ["useState", "useEffect", "useContext", "Custom Hooks"]
      },
      {
        id: "react-3",
        title: "Advanced React",
        completed: false,
        progress: 0,
        lessons: ["Context API", "Performance Optimization", "Error Boundaries", "Testing"]
      },
      {
        id: "react-4",
        title: "React Ecosystem",
        completed: false,
        progress: 0,
        lessons: ["React Router", "State Management", "Forms", "API Integration"]
      }
    ]
  },
  {
    id: "path-3",
    title: "Python for Data Science",
    description: "Learn Python programming for data analysis and machine learning",
    difficulty: "Intermediate",
    estimatedTime: "8-10 weeks",
    category: "Data Science",
    prerequisites: [],
    skills: ["Python", "Data Analysis", "NumPy", "Pandas", "Matplotlib"],
    progress: 0,
    modules: [
      {
        id: "python-1",
        title: "Python Fundamentals",
        completed: false,
        progress: 0,
        lessons: ["Syntax", "Data Types", "Control Flow", "Functions", "Classes"]
      },
      {
        id: "python-2",
        title: "Data Manipulation",
        completed: false,
        progress: 0,
        lessons: ["NumPy Arrays", "Pandas DataFrames", "Data Cleaning", "Data Transformation"]
      },
      {
        id: "python-3",
        title: "Data Visualization",
        completed: false,
        progress: 0,
        lessons: ["Matplotlib", "Seaborn", "Plotly", "Interactive Charts"]
      },
      {
        id: "python-4",
        title: "Machine Learning Basics",
        completed: false,
        progress: 0,
        lessons: ["Scikit-learn", "Regression", "Classification", "Model Evaluation"]
      }
    ]
  },
  {
    id: "path-4",
    title: "Full Stack Web Development",
    description: "Complete web development from frontend to backend",
    difficulty: "Advanced",
    estimatedTime: "12-16 weeks",
    category: "Full Stack",
    prerequisites: ["JavaScript Fundamentals", "React Development"],
    skills: ["Frontend", "Backend", "Databases", "APIs", "Deployment"],
    progress: 0,
    modules: [
      {
        id: "fullstack-1",
        title: "Frontend Mastery",
        completed: false,
        progress: 0,
        lessons: ["Advanced React", "TypeScript", "CSS Frameworks", "Testing"]
      },
      {
        id: "fullstack-2",
        title: "Backend Development",
        completed: false,
        progress: 0,
        lessons: ["Node.js", "Express", "API Design", "Authentication"]
      },
      {
        id: "fullstack-3",
        title: "Database Management",
        completed: false,
        progress: 0,
        lessons: ["SQL Basics", "PostgreSQL", "MongoDB", "Database Design"]
      },
      {
        id: "fullstack-4",
        title: "Deployment & DevOps",
        completed: false,
        progress: 0,
        lessons: ["Git", "Docker", "Cloud Platforms", "CI/CD"]
      }
    ]
  }
];

// Get all learning paths
router.get("/", requireAuth, async (req: Request, res: Response) => {
  try {
    res.json({
      learningPaths: LEARNING_PATHS,
      totalPaths: LEARNING_PATHS.length
    });
  } catch (error: any) {
    res.status(500).json({ 
      message: "Failed to get learning paths", 
      error: error.message 
    });
  }
});

// Get specific learning path
router.get("/:id", requireAuth, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const learningPath = LEARNING_PATHS.find(path => path.id === id);
    if (!learningPath) {
      return res.status(404).json({ message: "Learning path not found" });
    }
    
    res.json(learningPath);
  } catch (error: any) {
    res.status(500).json({ 
      message: "Failed to get learning path", 
      error: error.message 
    });
  }
});

// Update user progress for a learning path
router.post("/:id/progress", requireAuth, async (req: Request, res: Response) => {
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
