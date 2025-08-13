import { Request, Response } from "express";
import { z } from "zod";
import { db } from "../db";
import { sql } from "drizzle-orm";

// Add auth middleware interface
declare global {
  namespace Express {
    interface Request {
      user?: { id: string; username: string; };
    }
  }
}

const customizePathSchema = z.object({
  goal: z.string().min(1, "Goal is required"),
  experience: z.string().min(1, "Experience level is required"),
  timeCommitment: z.array(z.number()).optional(),
  preferredTopics: z.array(z.string()),
  learningStyle: z.string().min(1, "Learning style is required"),
  projectPreference: z.string().min(1, "Project preference is required"),
  difficultyPreference: z.string(),
  specializations: z.array(z.string()),
  customGoals: z.string().optional(),
  weeklyHours: z.array(z.number())
});

export async function createCustomLearningPath(req: Request, res: Response) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const validatedData = customizePathSchema.parse(req.body);
    
    // Generate custom learning path content based on user preferences
    const customContent = generateLearningPathContent(validatedData);
    
    // Insert into custom_learning_paths table
    const [newPath] = await db.execute(sql`
      INSERT INTO custom_learning_paths (
        user_id, title, description, goal, experience_level, weekly_hours,
        preferred_topics, learning_style, project_preference, difficulty_preference,
        specializations, custom_goals, generated_content
      ) VALUES (
        ${userId}, ${customContent.title}, ${customContent.description}, 
        ${validatedData.goal}, ${validatedData.experience}, ${validatedData.weeklyHours[0]},
        ${validatedData.preferredTopics}, ${validatedData.learningStyle}, 
        ${validatedData.projectPreference}, ${validatedData.difficultyPreference},
        ${validatedData.specializations}, ${validatedData.customGoals || ""}, 
        ${JSON.stringify(customContent)}
      ) RETURNING id
    `);

    return res.json({
      success: true,
      pathId: newPath.id,
      message: "Custom learning path created successfully",
      content: customContent
    });

  } catch (error) {
    console.error("Error creating custom learning path:", error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: "Invalid input data", errors: error.errors });
    }
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function getUserCustomPaths(req: Request, res: Response) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const paths = await db.execute(sql`
      SELECT id, title, description, goal, experience_level, weekly_hours,
             preferred_topics, learning_style, is_active, created_at
      FROM custom_learning_paths 
      WHERE user_id = ${userId} AND is_active = true
      ORDER BY created_at DESC
    `);

    return res.json(paths);

  } catch (error) {
    console.error("Error fetching custom paths:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function getCustomPath(req: Request, res: Response) {
  try {
    const userId = req.user?.id;
    const pathId = req.params.id;
    
    if (!userId) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const [path] = await db.execute(sql`
      SELECT * FROM custom_learning_paths 
      WHERE id = ${pathId} AND user_id = ${userId} AND is_active = true
    `);

    if (!path) {
      return res.status(404).json({ message: "Custom learning path not found" });
    }

    return res.json(path);

  } catch (error) {
    console.error("Error fetching custom path:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

function generateLearningPathContent(preferences: any) {
  const { goal, experience, preferredTopics, learningStyle, projectPreference, specializations } = preferences;
  
  // Generate title based on preferences
  let title = "Custom Learning Path";
  if (goal === "career-change") {
    title = "Career Transition Learning Path";
  } else if (goal === "interview-prep") {
    title = "Interview Preparation Bootcamp";
  } else if (goal === "skill-upgrade") {
    title = "Advanced Skills Development Path";
  } else if (goal === "freelance") {
    title = "Freelancer Skills Mastery";
  } else if (goal === "startup") {
    title = "Startup Builder's Journey";
  }

  // Generate description
  const topicNames = getTopicNames(preferredTopics);
  const description = `Personalized ${experience} level path focusing on ${topicNames.join(", ")}. 
    Designed for ${goal.replace("-", " ")} with ${learningStyle.replace("-", " ")} approach.`;

  // Generate curriculum based on preferences
  const curriculum = generateCurriculum(preferences);

  return {
    title,
    description,
    curriculum,
    estimatedDuration: calculateDuration(preferences),
    difficulty: mapExperienceToLevel(experience),
    learningApproach: learningStyle,
    projectTypes: projectPreference,
    specializations,
    milestones: generateMilestones(preferences)
  };
}

function getTopicNames(topicIds: string[]) {
  const topicMap: Record<string, string> = {
    "web-frontend": "Frontend Development",
    "web-backend": "Backend Development", 
    "mobile": "Mobile Development",
    "data-science": "Data Science & ML",
    "algorithms": "Algorithms & Data Structures",
    "devops": "DevOps & Cloud",
    "security": "Cybersecurity",
    "game-dev": "Game Development"
  };
  
  return topicIds.map(id => topicMap[id] || id);
}

function generateCurriculum(preferences: any) {
  const { experience, preferredTopics, learningStyle, difficultyPreference } = preferences;
  
  const modules = [];
  
  // Foundation module for beginners
  if (experience === "absolute-beginner") {
    modules.push({
      title: "Programming Fundamentals",
      duration: "2-3 weeks",
      lessons: [
        "Variables and Data Types",
        "Control Structures",
        "Functions and Methods",
        "Basic Problem Solving"
      ]
    });
  }

  // Topic-specific modules
  preferredTopics.forEach((topic: string) => {
    modules.push(generateTopicModule(topic, experience, learningStyle));
  });

  // Project modules based on preference
  if (learningStyle === "hands-on" || learningStyle === "mixed") {
    modules.push({
      title: "Capstone Projects",
      duration: "4-6 weeks",
      lessons: [
        "Project Planning & Design",
        "Implementation Phase 1",
        "Implementation Phase 2", 
        "Testing & Deployment",
        "Portfolio Optimization"
      ]
    });
  }

  return modules;
}

function generateTopicModule(topic: string, experience: string, learningStyle: string) {
  const topicModules: Record<string, any> = {
    "web-frontend": {
      title: "Frontend Web Development",
      duration: "6-8 weeks",
      lessons: [
        "HTML5 & Semantic Markup",
        "CSS3 & Responsive Design",
        "JavaScript ES6+ Fundamentals",
        "React.js Components & Hooks",
        "State Management",
        "Frontend Project Build"
      ]
    },
    "web-backend": {
      title: "Backend Development",
      duration: "6-8 weeks", 
      lessons: [
        "Server Architecture Basics",
        "RESTful API Design",
        "Database Design & SQL",
        "Authentication & Security",
        "Deployment & Hosting",
        "Backend Project Build"
      ]
    },
    "data-science": {
      title: "Data Science & Machine Learning",
      duration: "8-10 weeks",
      lessons: [
        "Python for Data Science",
        "Data Analysis with Pandas",
        "Data Visualization",
        "Machine Learning Basics",
        "Model Training & Evaluation",
        "ML Project Implementation"
      ]
    },
    "algorithms": {
      title: "Algorithms & Data Structures",
      duration: "6-8 weeks",
      lessons: [
        "Arrays & Linked Lists",
        "Stacks, Queues & Trees",
        "Sorting & Searching Algorithms",
        "Dynamic Programming",
        "Graph Algorithms",
        "Algorithm Practice Projects"
      ]
    }
  };

  return topicModules[topic] || {
    title: "Custom Topic Module",
    duration: "4-6 weeks",
    lessons: ["Introduction", "Core Concepts", "Advanced Topics", "Practical Application"]
  };
}

function calculateDuration(preferences: any) {
  const { weeklyHours, preferredTopics, experience } = preferences;
  const hoursPerWeek = weeklyHours[0] || 5;
  
  let totalHours = 0;
  
  // Base hours based on experience
  if (experience === "absolute-beginner") totalHours += 40;
  else if (experience === "some-basics") totalHours += 30;
  else totalHours += 20;
  
  // Hours per topic
  totalHours += preferredTopics.length * 25;
  
  const weeks = Math.ceil(totalHours / hoursPerWeek);
  return `${weeks} weeks (${totalHours} total hours)`;
}

function mapExperienceToLevel(experience: string) {
  const levelMap: Record<string, string> = {
    "absolute-beginner": "Beginner",
    "some-basics": "Beginner", 
    "intermediate": "Intermediate",
    "advanced": "Advanced"
  };
  return levelMap[experience] || "Intermediate";
}

function generateMilestones(preferences: any) {
  const { goal, preferredTopics } = preferences;
  
  const milestones = [
    "Complete foundational concepts",
    "Build first practice project"
  ];
  
  preferredTopics.forEach((topic: string) => {
    milestones.push(`Master ${getTopicNames([topic])[0]} fundamentals`);
  });
  
  if (goal === "interview-prep") {
    milestones.push("Complete coding interview practice");
    milestones.push("Mock interview sessions");
  }
  
  milestones.push("Deploy capstone project");
  milestones.push("Create professional portfolio");
  
  return milestones;
}