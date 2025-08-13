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
  },
  {
    title: "Maximum Subarray",
    description: "Find the contiguous subarray with the largest sum",
    difficulty: "Medium",
    topic: "Dynamic Programming",
    acceptance: "54.5%",
    problemStatement: `Given an integer array nums, find the subarray with the largest sum, and return its sum.

Example 1:
Input: nums = [-2,1,-3,4,-1,2,1,-5,4]
Output: 6
Explanation: The subarray [4,-1,2,1] has the largest sum 6.

Example 2:
Input: nums = [1]
Output: 1

Example 3:
Input: nums = [5,4,-1,7,8]
Output: 23

Constraints:
• 1 <= nums.length <= 10^5
• -10^4 <= nums[i] <= 10^4`,
    starterCode: `function maxSubArray(nums) {
    // Use Kadane's algorithm
    
}`,
    testCases: [
      { input: [[-2,1,-3,4,-1,2,1,-5,4]], expected: 6 },
      { input: [[1]], expected: 1 },
      { input: [[5,4,-1,7,8]], expected: 23 },
      { input: [[-1]], expected: -1 },
      { input: [[-2,-1]], expected: -1 }
    ]
  },
  {
    title: "Binary Tree Inorder Traversal",
    description: "Return the inorder traversal of a binary tree",
    difficulty: "Easy",
    topic: "Binary Trees",
    acceptance: "75.1%",
    problemStatement: `Given the root of a binary tree, return the inorder traversal of its nodes' values.

Example 1:
Input: root = [1,null,2,3]
Output: [1,3,2]

Example 2:
Input: root = []
Output: []

Example 3:
Input: root = [1]
Output: [1]

Constraints:
• The number of nodes in the tree is in the range [0, 100].
• -100 <= Node.val <= 100`,
    starterCode: `function inorderTraversal(root) {
    // Implement recursive or iterative inorder traversal
    
}`,
    testCases: [
      { input: [[1,null,2,3]], expected: [1,3,2] },
      { input: [[]], expected: [] },
      { input: [[1]], expected: [1] }
    ]
  },
  {
    title: "Merge Intervals",
    description: "Merge all overlapping intervals",
    difficulty: "Medium",
    topic: "Intervals",
    acceptance: "46.3%",
    problemStatement: `Given an array of intervals where intervals[i] = [starti, endi], merge all overlapping intervals, and return an array of the non-overlapping intervals that cover all the intervals in the input.

Example 1:
Input: intervals = [[1,3],[2,6],[8,10],[15,18]]
Output: [[1,6],[8,10],[15,18]]
Explanation: Since intervals [1,3] and [2,6] overlaps, merge them into [1,6].

Example 2:
Input: intervals = [[1,4],[4,5]]
Output: [[1,5]]
Explanation: Intervals [1,4] and [4,5] are considered overlapping.

Constraints:
• 1 <= intervals.length <= 10^4
• intervals[i].length == 2
• 0 <= starti <= endi <= 10^4`,
    starterCode: `function merge(intervals) {
    // Sort intervals and merge overlapping ones
    
}`,
    testCases: [
      { input: [[[1,3],[2,6],[8,10],[15,18]]], expected: [[1,6],[8,10],[15,18]] },
      { input: [[[1,4],[4,5]]], expected: [[1,5]] },
      { input: [[[1,4],[0,4]]], expected: [[0,4]] }
    ]
  },
  {
    title: "3Sum",
    description: "Find all unique triplets that sum to zero",
    difficulty: "Medium",
    topic: "Two Pointers",
    acceptance: "33.1%",
    problemStatement: `Given an integer array nums, return all the triplets [nums[i], nums[j], nums[k]] such that i != j, i != k, and j != k, and nums[i] + nums[j] + nums[k] == 0.

Notice that the solution set must not contain duplicate triplets.

Example 1:
Input: nums = [-1,0,1,2,-1,-4]
Output: [[-1,-1,2],[-1,0,1]]
Explanation: 
nums[0] + nums[1] + nums[2] = (-1) + 0 + 1 = 0.
nums[1] + nums[2] + nums[4] = 0 + 1 + (-1) = 0.
The distinct triplets are [-1,0,1] and [-1,-1,2].

Example 2:
Input: nums = [0,1,1]
Output: []
Explanation: The only possible triplet does not sum up to 0.

Example 3:
Input: nums = [0,0,0]
Output: [[0,0,0]]`,
    starterCode: `function threeSum(nums) {
    // Sort array and use two pointers technique
    
}`,
    testCases: [
      { input: [[-1,0,1,2,-1,-4]], expected: [[-1,-1,2],[-1,0,1]] },
      { input: [[0,1,1]], expected: [] },
      { input: [[0,0,0]], expected: [[0,0,0]] }
    ]
  },
  {
    title: "Valid Binary Search Tree",
    description: "Determine if a binary tree is a valid BST",
    difficulty: "Medium",
    topic: "Binary Search Trees",
    acceptance: "32.4%",
    problemStatement: `Given the root of a binary tree, determine if it is a valid binary search tree (BST).

A valid BST is defined as follows:
• The left subtree of a node contains only nodes with keys less than the node's key.
• The right subtree of a node contains only nodes with keys greater than the node's key.
• Both the left and right subtrees must also be binary search trees.

Example 1:
Input: root = [2,1,3]
Output: true

Example 2:
Input: root = [5,1,4,null,null,3,6]
Output: false
Explanation: The root node's value is 5 but its right child's value is 4.`,
    starterCode: `function isValidBST(root) {
    // Use inorder traversal or recursive validation with bounds
    
}`,
    testCases: [
      { input: [[2,1,3]], expected: true },
      { input: [[5,1,4,null,null,3,6]], expected: false },
      { input: [[1]], expected: true }
    ]
  },
  {
    title: "Container With Most Water",
    description: "Find two lines that form container with most water",
    difficulty: "Medium",
    topic: "Two Pointers",
    acceptance: "54.1%",
    problemStatement: `You are given an integer array height of length n. There are n vertical lines drawn such that the two endpoints of the ith line are (i, 0) and (i, height[i]).

Find two lines that together with the x-axis form a container, such that the container contains the most water.

Return the maximum amount of water a container can store.

Notice that you may not slant the container.

Example 1:
Input: height = [1,8,6,2,5,4,8,3,7]
Output: 49
Explanation: The above vertical lines are represented by array [1,8,6,2,5,4,8,3,7]. In this case, the max area of water (blue section) the container can contain is 49.

Example 2:
Input: height = [1,1]
Output: 1`,
    starterCode: `function maxArea(height) {
    // Use two pointers approach
    
}`,
    testCases: [
      { input: [[1,8,6,2,5,4,8,3,7]], expected: 49 },
      { input: [[1,1]], expected: 1 },
      { input: [[4,3,2,1,4]], expected: 16 }
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