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
  type InsertActivity,
  type UserAssessment,
  type InsertUserAssessment
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
  
  // User Assessment methods
  getUserAssessments(userId: string): Promise<UserAssessment[]>;
  getUserAssessmentByChallenge(userId: string, assessmentId: string): Promise<UserAssessment | undefined>;
  createUserAssessment(assessment: InsertUserAssessment): Promise<UserAssessment>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private assessments: Map<string, Assessment>;
  private learningPaths: Map<string, LearningPath>;
  private hackathons: Map<string, Hackathon>;
  private userProgress: Map<string, UserProgress>;
  private submissions: Map<string, Submission>;
  private activities: Map<string, Activity>;
  private userAssessments: Map<string, UserAssessment>;

  constructor() {
    this.users = new Map();
    this.assessments = new Map();
    this.learningPaths = new Map();
    this.hackathons = new Map();
    this.userProgress = new Map();
    this.submissions = new Map();
    this.activities = new Map();
    this.userAssessments = new Map();
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
          { input: { nums: [3, 2, 4], target: 6 }, expected: [1, 2] },
          { input: { nums: [3, 3], target: 6 }, expected: [0, 1] },
          { input: { nums: [1, 2, 3, 4, 5], target: 9 }, expected: [3, 4] }
        ] as any,
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
        testCases: [] as any,
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
        testCases: [] as any,
        createdAt: new Date(),
      },
      {
        id: randomUUID(),
        title: "Two Sum (Python)",
        description: "Find two numbers that add up to a target - Python version",
        difficulty: "Easy",
        topic: "Arrays",
        acceptance: "87.3%",
        problemStatement: `Given a list of integers nums and an integer target, return indices of the two numbers such that they add up to target.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

Example:
Input: nums = [2,7,11,15], target = 9
Output: [0,1]
Explanation: Because nums[0] + nums[1] == 9, we return [0, 1].`,
        starterCode: `def two_sum(nums, target):
    """
    Find two numbers that add up to target.
    Return their indices as a list.
    """
    # Your code here
    pass`,
        testCases: [
          { input: { nums: [2, 7, 11, 15], target: 9 }, expected: [0, 1] },
          { input: { nums: [3, 2, 4], target: 6 }, expected: [1, 2] },
          { input: { nums: [3, 3], target: 6 }, expected: [0, 1] },
          { input: { nums: [1, 2, 3, 4, 5], target: 9 }, expected: [3, 4] },
          { input: { nums: [0, 4, 3, 0], target: 0 }, expected: [0, 3] }
        ] as any,
        createdAt: new Date(),
      },
      {
        id: randomUUID(),
        title: "Python List Comprehension",
        description: "Create lists using Python comprehensions",
        difficulty: "Easy",
        topic: "Python Basics",
        acceptance: "92.1%",
        problemStatement: `Write a function that takes a list of numbers and returns a new list containing only the even numbers, squared.

Example:
Input: [1, 2, 3, 4, 5, 6]
Output: [4, 16, 36]

Use Python list comprehension for the solution.`,
        starterCode: `def filter_and_square_evens(numbers):
    """
    Return a list of squared even numbers from the input list.
    Use list comprehension.
    """
    # Your code here
    pass`,
        testCases: [
          { input: { numbers: [1, 2, 3, 4, 5, 6] }, expected: [4, 16, 36] },
          { input: { numbers: [10, 15, 20, 25] }, expected: [100, 400] },
          { input: { numbers: [1, 3, 5, 7, 9] }, expected: [] },
          { input: { numbers: [2, 4, 6, 8] }, expected: [4, 16, 36, 64] }
        ] as any,
        createdAt: new Date(),
      },
      {
        id: randomUUID(),
        title: "Python Dictionary Manipulation",
        description: "Work with Python dictionaries and data processing",
        difficulty: "Medium",
        topic: "Data Structures",
        acceptance: "78.5%",
        problemStatement: `Given a list of dictionaries representing students, write a function that:
1. Filters students with grades >= 85
2. Returns a dictionary mapping student names to their grades
3. Sorts the result by grade in descending order

Example:
Input: [{"name": "Alice", "grade": 90}, {"name": "Bob", "grade": 75}, {"name": "Carol", "grade": 95}]
Output: {"Carol": 95, "Alice": 90}`,
        starterCode: `def process_students(students):
    """
    Process student data and return top performers.
    """
    # Your code here
    pass`,
        testCases: [
          { 
            input: { students: [{"name": "Alice", "grade": 90}, {"name": "Bob", "grade": 75}, {"name": "Carol", "grade": 95}] }, 
            expected: {"Carol": 95, "Alice": 90} 
          }
        ] as any,
        createdAt: new Date(),
      },
      {
        id: randomUUID(),
        title: "Python Class Design",
        description: "Implement object-oriented programming concepts",
        difficulty: "Hard",
        topic: "OOP",
        acceptance: "65.2%",
        problemStatement: `Design a Python class 'BankAccount' with the following features:
1. Constructor that takes initial balance
2. Methods: deposit(), withdraw(), get_balance()
3. Withdraw should not allow negative balance
4. All transactions should be logged
5. Implement a method to get transaction history

The class should handle edge cases and maintain data integrity.`,
        starterCode: `class BankAccount:
    def __init__(self, initial_balance=0):
        """Initialize the bank account."""
        # Your code here
        pass
    
    def deposit(self, amount):
        """Deposit money to the account."""
        # Your code here
        pass
    
    def withdraw(self, amount):
        """Withdraw money from the account."""
        # Your code here
        pass
    
    def get_balance(self):
        """Get current balance."""
        # Your code here
        pass
    
    def get_transaction_history(self):
        """Get list of all transactions."""
        # Your code here
        pass`,
        testCases: [] as any,
        createdAt: new Date(),
      }
    ];

    // Add more LeetCode-style problems
    const additionalProblems = [
      {
        id: randomUUID(),
        title: "Valid Parentheses",
        description: "Check if parentheses are valid",
        difficulty: "Easy", 
        topic: "Stack",
        acceptance: "89.2%",
        problemStatement: `Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.

An input string is valid if:
1. Open brackets must be closed by the same type of brackets
2. Open brackets must be closed in the correct order

Example:
Input: "()"
Output: true

Input: "([)]"
Output: false`,
        starterCode: `def isValid(s):
    """
    Check if the parentheses string is valid.
    """
    # Your code here
    pass`,
        testCases: [
          { input: { s: "()" }, expected: true },
          { input: { s: "()[]{}" }, expected: true },
          { input: { s: "([)]" }, expected: false },
          { input: { s: "(((" }, expected: false },
          { input: { s: "" }, expected: true }
        ] as any,
        createdAt: new Date(),
      },
      {
        id: randomUUID(),
        title: "Fibonacci Sequence",
        description: "Calculate the nth Fibonacci number",
        difficulty: "Easy",
        topic: "Dynamic Programming",
        acceptance: "95.1%",
        problemStatement: `The Fibonacci numbers, commonly denoted F(n) form a sequence, called the Fibonacci sequence, such that each number is the sum of the two preceding ones, starting from 0 and 1.

Given n, calculate F(n).

Example:
Input: n = 4
Output: 3
Explanation: F(4) = F(3) + F(2) = 2 + 1 = 3`,
        starterCode: `def fib(n):
    """
    Calculate the nth Fibonacci number.
    """
    # Your code here
    pass`,
        testCases: [
          { input: { n: 0 }, expected: 0 },
          { input: { n: 1 }, expected: 1 },
          { input: { n: 4 }, expected: 3 },
          { input: { n: 10 }, expected: 55 }
        ] as any,
        createdAt: new Date(),
      },
      {
        id: randomUUID(),
        title: "Maximum Subarray",
        description: "Find the contiguous subarray with the largest sum",
        difficulty: "Medium",
        topic: "Arrays",
        acceptance: "82.3%",
        problemStatement: `Given an integer array nums, find the contiguous subarray (containing at least one number) which has the largest sum and return its sum.

Example:
Input: nums = [-2,1,-3,4,-1,2,1,-5,4]
Output: 6
Explanation: [4,-1,2,1] has the largest sum = 6`,
        starterCode: `def maxSubArray(nums):
    """
    Find the maximum sum of contiguous subarray.
    """
    # Your code here
    pass`,
        testCases: [
          { input: { nums: [-2,1,-3,4,-1,2,1,-5,4] }, expected: 6 },
          { input: { nums: [1] }, expected: 1 },
          { input: { nums: [5,4,-1,7,8] }, expected: 23 }
        ] as any,
        createdAt: new Date(),
      }
    ];

    // Combine all assessments
    const allAssessments = [...seedAssessments, ...additionalProblems];
    
    allAssessments.forEach(assessment => {
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
        technologies: ["React", "Node.js", "MongoDB"] as any,
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
        technologies: ["Python", "TensorFlow", "OpenAI"] as any,
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
        technologies: ["React Native", "Flutter", "Swift"] as any,
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
      level: insertUser.level || 1,
      points: insertUser.points || 0,
      streak: insertUser.streak || 0,
      problemsSolved: insertUser.problemsSolved || 0,
      rank: insertUser.rank || this.users.size + 1,
      title: insertUser.title || "Developer",
      bio: insertUser.bio || null,
      skills: insertUser.skills || null
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
      createdAt: new Date(),
      starterCode: insertAssessment.starterCode || null,
      testCases: insertAssessment.testCases || null
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
      createdAt: new Date(),
      progress: insertPath.progress ?? 0
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
      createdAt: new Date(),
      startDate: insertHackathon.startDate ?? null,
      endDate: insertHackathon.endDate ?? null,
      participants: insertHackathon.participants ?? 0,
      technologies: insertHackathon.technologies ?? null
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
      updatedAt: new Date(),
      progress: insertProgress.progress ?? 0,
      userId: insertProgress.userId ?? null,
      pathId: insertProgress.pathId ?? null
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
      createdAt: new Date(),
      rank: insertSubmission.rank ?? null,
      score: insertSubmission.score ?? null,
      prize: insertSubmission.prize ?? null,
      userId: insertSubmission.userId ?? null,
      hackathonId: insertSubmission.hackathonId ?? null
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
      createdAt: new Date(),
      description: insertActivity.description ?? null,
      userId: insertActivity.userId ?? null
    };
    this.activities.set(id, activity);
    return activity;
  }

  // Leaderboard methods
  async getLeaderboard(): Promise<User[]> {
    return Array.from(this.users.values())
      .sort((a, b) => (b.points || 0) - (a.points || 0))
      .slice(0, 50); // Return top 50 users
  }

  // User Assessment methods
  async getUserAssessments(userId: string): Promise<UserAssessment[]> {
    return Array.from(this.userAssessments.values()).filter(assessment => assessment.userId === userId);
  }

  async getUserAssessmentByChallenge(userId: string, assessmentId: string): Promise<UserAssessment | undefined> {
    return Array.from(this.userAssessments.values())
      .find(assessment => assessment.userId === userId && assessment.assessmentId === assessmentId);
  }

  async createUserAssessment(insertUserAssessment: InsertUserAssessment): Promise<UserAssessment> {
    const id = randomUUID();
    const userAssessment: UserAssessment = { 
      ...insertUserAssessment, 
      id, 
      submissionTime: new Date(),
      userId: insertUserAssessment.userId || null,
      assessmentId: insertUserAssessment.assessmentId || null,
      score: insertUserAssessment.score || null,
      passed: insertUserAssessment.passed || null,
      stdout: insertUserAssessment.stdout || null,
      stderr: insertUserAssessment.stderr || null,
      execTime: insertUserAssessment.execTime || null,
      memory: insertUserAssessment.memory || null,
      extractedSkills: insertUserAssessment.extractedSkills ?? null
    };
    this.userAssessments.set(id, userAssessment);
    return userAssessment;
  }
}

export const storage = new MemStorage();
