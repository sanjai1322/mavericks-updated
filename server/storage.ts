import { 
  type User, 
  type InsertUser, 
  type Assessment,
  type InsertAssessment,
  type LearningPath,
  type InsertLearningPath,
  type Hackathon,
  type InsertHackathon,
  type UserProgress,
  type InsertUserProgress,
  type Submission,
  type InsertSubmission,
  type Activity,
  type InsertActivity
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<User>): Promise<User | undefined>;
  
  // Assessment methods
  getAssessments(): Promise<Assessment[]>;
  getAssessment(id: string): Promise<Assessment | undefined>;
  createAssessment(assessment: InsertAssessment): Promise<Assessment>;
  
  // Learning Path methods
  getLearningPaths(): Promise<LearningPath[]>;
  getLearningPath(id: string): Promise<LearningPath | undefined>;
  createLearningPath(path: InsertLearningPath): Promise<LearningPath>;
  
  // Hackathon methods
  getHackathons(): Promise<Hackathon[]>;
  getHackathonsByStatus(status: string): Promise<Hackathon[]>;
  getHackathon(id: string): Promise<Hackathon | undefined>;
  createHackathon(hackathon: InsertHackathon): Promise<Hackathon>;
  
  // User Progress methods
  getUserProgress(userId: string): Promise<UserProgress[]>;
  updateUserProgress(progress: InsertUserProgress): Promise<UserProgress>;
  
  // Submission methods
  getUserSubmissions(userId: string): Promise<Submission[]>;
  createSubmission(submission: InsertSubmission): Promise<Submission>;
  
  // Activity methods
  getUserActivities(userId: string): Promise<Activity[]>;
  createActivity(activity: InsertActivity): Promise<Activity>;
  
  // Leaderboard methods
  getLeaderboard(): Promise<User[]>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private assessments: Map<string, Assessment>;
  private learningPaths: Map<string, LearningPath>;
  private hackathons: Map<string, Hackathon>;
  private userProgress: Map<string, UserProgress>;
  private submissions: Map<string, Submission>;
  private activities: Map<string, Activity>;

  constructor() {
    this.users = new Map();
    this.assessments = new Map();
    this.learningPaths = new Map();
    this.hackathons = new Map();
    this.userProgress = new Map();
    this.submissions = new Map();
    this.activities = new Map();
    this.seedData();
  }

  private seedData() {
    // Seed assessments
    const seedAssessments: Assessment[] = [
      {
        id: randomUUID(),
        title: "Two Sum",
        description: "Find two numbers that add up to a target",
        difficulty: "Easy",
        topic: "Arrays",
        acceptance: "85.2%",
        problemStatement: `Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

Example:
Input: nums = [2,7,11,15], target = 9
Output: [0,1]
Explanation: Because nums[0] + nums[1] == 9, we return [0, 1].`,
        starterCode: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var twoSum = function(nums, target) {
    // Your code here
    
};`,
        testCases: [
          { input: { nums: [2, 7, 11, 15], target: 9 }, expected: [0, 1] },
          { input: { nums: [3, 2, 4], target: 6 }, expected: [1, 2] }
        ],
        createdAt: new Date(),
      },
      {
        id: randomUUID(),
        title: "Binary Tree Traversal",
        description: "Implement in-order traversal",
        difficulty: "Medium",
        topic: "Trees",
        acceptance: "67.8%",
        problemStatement: `Given the root of a binary tree, return the inorder traversal of its nodes' values.`,
        starterCode: `/**
 * @param {TreeNode} root
 * @return {number[]}
 */
var inorderTraversal = function(root) {
    // Your code here
    
};`,
        testCases: [],
        createdAt: new Date(),
      },
      {
        id: randomUUID(),
        title: "Longest Palindromic Substring",
        description: "Find the longest palindromic substring",
        difficulty: "Hard",
        topic: "Strings",
        acceptance: "45.3%",
        problemStatement: `Given a string s, return the longest palindromic substring in s.`,
        starterCode: `/**
 * @param {string} s
 * @return {string}
 */
var longestPalindrome = function(s) {
    // Your code here
    
};`,
        testCases: [],
        createdAt: new Date(),
      }
    ];

    seedAssessments.forEach(assessment => {
      this.assessments.set(assessment.id, assessment);
    });

    // Seed learning paths
    const seedLearningPaths: LearningPath[] = [
      {
        id: randomUUID(),
        title: "JavaScript Fundamentals",
        description: "Master the basics of JavaScript programming including variables, functions, and control structures.",
        icon: "fab fa-js-square",
        difficulty: "Beginner",
        lessons: 12,
        duration: "8 hours",
        progress: 75,
        category: "Web Development",
        createdAt: new Date(),
      },
      {
        id: randomUUID(),
        title: "React Development",
        description: "Build modern web applications with React, including hooks, context, and state management.",
        icon: "fab fa-react",
        difficulty: "Intermediate",
        lessons: 15,
        duration: "12 hours",
        progress: 60,
        category: "Frontend",
        createdAt: new Date(),
      },
      {
        id: randomUUID(),
        title: "Data Structures & Algorithms",
        description: "Understand fundamental data structures and algorithms for technical interviews.",
        icon: "fas fa-database",
        difficulty: "Advanced",
        lessons: 20,
        duration: "25 hours",
        progress: 30,
        category: "Computer Science",
        createdAt: new Date(),
      },
      {
        id: randomUUID(),
        title: "Python for Beginners",
        description: "Learn Python programming from scratch with hands-on projects and exercises.",
        icon: "fab fa-python",
        difficulty: "Beginner",
        lessons: 14,
        duration: "10 hours",
        progress: 0,
        category: "Programming Languages",
        createdAt: new Date(),
      },
      {
        id: randomUUID(),
        title: "Cloud Computing with AWS",
        description: "Deploy and manage applications in the cloud using Amazon Web Services.",
        icon: "fab fa-aws",
        difficulty: "Intermediate",
        lessons: 18,
        duration: "15 hours",
        progress: 0,
        category: "Cloud Computing",
        createdAt: new Date(),
      },
      {
        id: randomUUID(),
        title: "Mobile App Development",
        description: "Build cross-platform mobile applications using React Native and Flutter.",
        icon: "fas fa-mobile-alt",
        difficulty: "Advanced",
        lessons: 22,
        duration: "20 hours",
        progress: 0,
        category: "Mobile Development",
        createdAt: new Date(),
      }
    ];

    seedLearningPaths.forEach(path => {
      this.learningPaths.set(path.id, path);
    });

    // Seed hackathons
    const seedHackathons: Hackathon[] = [
      {
        id: randomUUID(),
        title: "Spring Code Challenge 2024",
        description: "Build innovative web applications using modern technologies",
        status: "Live",
        startDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        endDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
        participants: 1247,
        prize: "$5,000 in prizes",
        technologies: ["React", "Node.js", "MongoDB"],
        createdAt: new Date(),
      },
      {
        id: randomUUID(),
        title: "AI Innovation Hackathon",
        description: "Create AI-powered solutions for real-world problems",
        status: "Live",
        startDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
        endDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
        participants: 892,
        prize: "$10,000 in prizes",
        technologies: ["Python", "TensorFlow", "OpenAI"],
        createdAt: new Date(),
      },
      {
        id: randomUUID(),
        title: "Mobile App Challenge",
        description: "Develop mobile applications for social impact",
        status: "Upcoming",
        startDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
        endDate: new Date(Date.now() + 13 * 24 * 60 * 60 * 1000), // 13 days from now
        participants: 0,
        prize: "$7,500 in prizes",
        technologies: ["React Native", "Flutter", "Swift"],
        createdAt: new Date(),
      }
    ];

    seedHackathons.forEach(hackathon => {
      this.hackathons.set(hackathon.id, hackathon);
    });
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      ...insertUser, 
      id, 
      createdAt: new Date(),
      level: 1,
      points: 0,
      streak: 0,
      problemsSolved: 0,
      rank: this.users.size + 1
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;

    const updatedUser = { ...user, ...updates };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Assessment methods
  async getAssessments(): Promise<Assessment[]> {
    return Array.from(this.assessments.values());
  }

  async getAssessment(id: string): Promise<Assessment | undefined> {
    return this.assessments.get(id);
  }

  async createAssessment(insertAssessment: InsertAssessment): Promise<Assessment> {
    const id = randomUUID();
    const assessment: Assessment = { 
      ...insertAssessment, 
      id, 
      createdAt: new Date() 
    };
    this.assessments.set(id, assessment);
    return assessment;
  }

  // Learning Path methods
  async getLearningPaths(): Promise<LearningPath[]> {
    return Array.from(this.learningPaths.values());
  }

  async getLearningPath(id: string): Promise<LearningPath | undefined> {
    return this.learningPaths.get(id);
  }

  async createLearningPath(insertPath: InsertLearningPath): Promise<LearningPath> {
    const id = randomUUID();
    const path: LearningPath = { 
      ...insertPath, 
      id, 
      createdAt: new Date() 
    };
    this.learningPaths.set(id, path);
    return path;
  }

  // Hackathon methods
  async getHackathons(): Promise<Hackathon[]> {
    return Array.from(this.hackathons.values());
  }

  async getHackathonsByStatus(status: string): Promise<Hackathon[]> {
    return Array.from(this.hackathons.values()).filter(hackathon => hackathon.status === status);
  }

  async getHackathon(id: string): Promise<Hackathon | undefined> {
    return this.hackathons.get(id);
  }

  async createHackathon(insertHackathon: InsertHackathon): Promise<Hackathon> {
    const id = randomUUID();
    const hackathon: Hackathon = { 
      ...insertHackathon, 
      id, 
      createdAt: new Date() 
    };
    this.hackathons.set(id, hackathon);
    return hackathon;
  }

  // User Progress methods
  async getUserProgress(userId: string): Promise<UserProgress[]> {
    return Array.from(this.userProgress.values()).filter(progress => progress.userId === userId);
  }

  async updateUserProgress(insertProgress: InsertUserProgress): Promise<UserProgress> {
    const id = randomUUID();
    const progress: UserProgress = { 
      ...insertProgress, 
      id, 
      updatedAt: new Date() 
    };
    this.userProgress.set(id, progress);
    return progress;
  }

  // Submission methods
  async getUserSubmissions(userId: string): Promise<Submission[]> {
    return Array.from(this.submissions.values()).filter(submission => submission.userId === userId);
  }

  async createSubmission(insertSubmission: InsertSubmission): Promise<Submission> {
    const id = randomUUID();
    const submission: Submission = { 
      ...insertSubmission, 
      id, 
      createdAt: new Date() 
    };
    this.submissions.set(id, submission);
    return submission;
  }

  // Activity methods
  async getUserActivities(userId: string): Promise<Activity[]> {
    return Array.from(this.activities.values())
      .filter(activity => activity.userId === userId)
      .sort((a, b) => b.createdAt!.getTime() - a.createdAt!.getTime())
      .slice(0, 10); // Return last 10 activities
  }

  async createActivity(insertActivity: InsertActivity): Promise<Activity> {
    const id = randomUUID();
    const activity: Activity = { 
      ...insertActivity, 
      id, 
      createdAt: new Date() 
    };
    this.activities.set(id, activity);
    return activity;
  }

  // Leaderboard methods
  async getLeaderboard(): Promise<User[]> {
    return Array.from(this.users.values())
      .sort((a, b) => b.points - a.points)
      .slice(0, 50); // Return top 50 users
  }
}

export const storage = new MemStorage();
