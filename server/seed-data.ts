import { storage } from "./database-storage";

// Comprehensive learning paths with real educational content
export const seedLearningPaths = [
  {
    title: "JavaScript Fundamentals",
    description: "Master the basics of JavaScript programming including variables, functions, objects, and DOM manipulation",
    icon: "🟡",
    difficulty: "Beginner",
    lessons: 15,
    duration: "4-6 weeks",
    category: "Programming Languages",
    progress: 0
  },
  {
    title: "Data Structures & Algorithms",
    description: "Learn essential data structures and algorithms for coding interviews and problem-solving",
    icon: "🧠",
    difficulty: "Intermediate",
    lessons: 25,
    duration: "8-12 weeks",
    category: "Computer Science",
    progress: 0
  },
  {
    title: "React Development",
    description: "Build modern web applications with React, hooks, state management, and component architecture",
    icon: "⚛️",
    difficulty: "Intermediate",
    lessons: 20,
    duration: "6-8 weeks",
    category: "Frontend Development",
    progress: 0
  },
  {
    title: "Python for Data Science",
    description: "Learn Python programming with focus on data analysis, pandas, numpy, and machine learning basics",
    icon: "🐍",
    difficulty: "Beginner",
    lessons: 18,
    duration: "6-8 weeks",
    category: "Data Science",
    progress: 0
  },
  {
    title: "System Design",
    description: "Master distributed systems, scalability, and architectural design patterns for large-scale applications",
    icon: "🏗️",
    difficulty: "Advanced",
    lessons: 30,
    duration: "10-12 weeks",
    category: "System Architecture",
    progress: 0
  },
  {
    title: "Node.js Backend Development",
    description: "Build scalable backend services with Node.js, Express, databases, and API design",
    icon: "🟢",
    difficulty: "Intermediate",
    lessons: 22,
    duration: "7-9 weeks",
    category: "Backend Development",
    progress: 0
  },
  {
    title: "Machine Learning Fundamentals",
    description: "Introduction to machine learning concepts, algorithms, and practical implementation",
    icon: "🤖",
    difficulty: "Intermediate",
    lessons: 24,
    duration: "8-10 weeks",
    category: "Machine Learning",
    progress: 0
  },
  {
    title: "DevOps & Cloud Computing",
    description: "Learn deployment, CI/CD, containerization with Docker, and cloud platforms (AWS, Azure)",
    icon: "☁️",
    difficulty: "Advanced",
    lessons: 28,
    duration: "10-14 weeks",
    category: "DevOps",
    progress: 0
  }
];

// Real hackathons data with Devpost integration
export const seedHackathons = [
  {
    title: "NASA Space Apps Challenge 2025",
    description: "A 48-hour hackathon where teams develop solutions to challenges related to space exploration and Earth science",
    status: "Live",
    startDate: new Date("2025-10-04"),
    endDate: new Date("2025-10-06"),
    participants: 25000,
    prize: "$50,000",
    technologies: ["JavaScript", "Python", "Data Science", "Machine Learning", "APIs"],
    devpostUrl: "https://spaceappschallenge.org/"
  },
  {
    title: "Major League Hacking (MLH) Fall 2025",
    description: "Student-focused hackathon promoting innovation and collaboration in technology",
    status: "Upcoming",
    startDate: new Date("2025-11-15"),
    endDate: new Date("2025-11-17"),
    participants: 5000,
    prize: "$25,000",
    technologies: ["Web Development", "Mobile Apps", "AI/ML", "Blockchain"],
    devpostUrl: "https://mlh.io/"
  },
  {
    title: "Google Cloud Next Hackathon",
    description: "Build innovative solutions using Google Cloud Platform services and APIs",
    status: "Live",
    startDate: new Date("2025-08-20"),
    endDate: new Date("2025-08-22"),
    participants: 8000,
    prize: "$100,000",
    technologies: ["Google Cloud", "Firebase", "TensorFlow", "BigQuery"],
    devpostUrl: "https://cloud.google.com/blog/topics/developers-practitioners"
  },
  {
    title: "Microsoft Imagine Cup 2025",
    description: "Global student technology competition for innovative solutions to world challenges",
    status: "Upcoming",
    startDate: new Date("2025-09-10"),
    endDate: new Date("2025-09-12"),
    participants: 12000,
    prize: "$75,000",
    technologies: ["Azure", "AI", "Mixed Reality", "IoT"],
    devpostUrl: "https://imaginecup.microsoft.com/"
  },
  {
    title: "Meta Developer Challenge",
    description: "Create immersive experiences using Meta's AR/VR technologies and social platforms",
    status: "Past",
    startDate: new Date("2025-07-01"),
    endDate: new Date("2025-07-03"),
    participants: 3500,
    prize: "$60,000",
    technologies: ["React", "Meta SDK", "WebVR", "Social APIs"],
    devpostUrl: "https://developers.facebook.com/"
  }
];

// Comprehensive coding assessments
export const seedAssessments = [
  {
    title: "Two Sum",
    description: "Find two numbers that add up to a target value",
    difficulty: "Easy",
    topic: "Arrays & Hashing",
    acceptance: "49.2%",
    problemStatement: `Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

You can return the answer in any order.

Example 1:
Input: nums = [2,7,11,15], target = 9
Output: [0,1]
Explanation: Because nums[0] + nums[1] == 9, we return [0, 1].

Example 2:
Input: nums = [3,2,4], target = 6
Output: [1,2]

Example 3:
Input: nums = [3,3], target = 6
Output: [0,1]`,
    starterCode: `function twoSum(nums, target) {
    // Your code here
    
}`,
    testCases: [
      { input: [[2,7,11,15], 9], expected: [0,1] },
      { input: [[3,2,4], 6], expected: [1,2] },
      { input: [[3,3], 6], expected: [0,1] }
    ]
  },
  {
    title: "Valid Parentheses",
    description: "Determine if parentheses, brackets, and braces are properly matched",
    difficulty: "Easy",
    topic: "Stack",
    acceptance: "40.1%",
    problemStatement: `Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.

An input string is valid if:
1. Open brackets must be closed by the same type of brackets.
2. Open brackets must be closed in the correct order.
3. Every close bracket has a corresponding open bracket of the same type.

Example 1:
Input: s = "()"
Output: true

Example 2:
Input: s = "()[]{}"
Output: true

Example 3:
Input: s = "(]"
Output: false`,
    starterCode: `function isValid(s) {
    // Your code here
    
}`,
    testCases: [
      { input: ["()"], expected: true },
      { input: ["()[]{}"], expected: true },
      { input: ["(]"], expected: false }
    ]
  },
  {
    title: "Merge Two Sorted Lists",
    description: "Merge two sorted linked lists into one sorted list",
    difficulty: "Easy",
    topic: "Linked Lists",
    acceptance: "62.3%",
    problemStatement: `You are given the heads of two sorted linked lists list1 and list2.

Merge the two lists into one sorted list. The list should be made by splicing together the nodes of the first two lists.

Return the head of the merged linked list.

Example 1:
Input: list1 = [1,2,4], list2 = [1,3,4]
Output: [1,1,2,3,4,4]

Example 2:
Input: list1 = [], list2 = []
Output: []

Example 3:
Input: list1 = [], list2 = [0]
Output: [0]`,
    starterCode: `function mergeTwoLists(list1, list2) {
    // Your code here
    
}`,
    testCases: [
      { input: [[1,2,4], [1,3,4]], expected: [1,1,2,3,4,4] },
      { input: [[], []], expected: [] },
      { input: [[], [0]], expected: [0] }
    ]
  }
];

export async function seedDatabase() {
  try {
    console.log("Seeding learning paths...");
    for (const path of seedLearningPaths) {
      await storage.createLearningPath(path);
    }

    console.log("Seeding hackathons...");
    for (const hackathon of seedHackathons) {
      await storage.createHackathon(hackathon);
    }

    console.log("Seeding assessments...");
    for (const assessment of seedAssessments) {
      await storage.createAssessment(assessment);
    }

    console.log("Database seeded successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}