import { Router } from "express";
import { storage } from "../database-storage";
import { requireAuth } from "../middleware/auth";
import { z } from "zod";

const router = Router();

// Apply auth middleware to all routes
router.use(requireAuth);

// Judge0 API configuration
const JUDGE0_API_BASE = "https://judge0-ce.p.rapidapi.com";
const RAPID_API_KEY = process.env.RAPIDAPI_KEY;

// Language mappings for Judge0
const LANGUAGE_MAP = {
  'javascript': 63,
  'python': 71,
  'java': 62,
  'cpp': 54,
  'c': 50,
  'csharp': 51,
  'go': 60,
  'rust': 73,
  'php': 68,
  'ruby': 72,
  'typescript': 74
};

// Comprehensive coding challenges
const CODING_CHALLENGES = [
  {
    id: "two-sum",
    title: "Two Sum",
    difficulty: "Easy",
    category: "Arrays",
    description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
    examples: [
      {
        input: "nums = [2,7,11,15], target = 9",
        output: "[0,1]",
        explanation: "Because nums[0] + nums[1] == 9, we return [0, 1]."
      }
    ],
    constraints: [
      "2 <= nums.length <= 10^4",
      "-10^9 <= nums[i] <= 10^9",
      "-10^9 <= target <= 10^9",
      "Only one valid answer exists."
    ],
    testCases: [
      { input: "[2,7,11,15]\n9", expectedOutput: "[0,1]" },
      { input: "[3,2,4]\n6", expectedOutput: "[1,2]" },
      { input: "[3,3]\n6", expectedOutput: "[0,1]" }
    ],
    starterCode: {
      javascript: `function twoSum(nums, target) {
    // Your code here
}`,
      python: `def two_sum(nums, target):
    # Your code here
    pass`,
      java: `public class Solution {
    public int[] twoSum(int[] nums, int target) {
        // Your code here
        return new int[]{};
    }
}`
    }
  },
  {
    id: "reverse-string",
    title: "Reverse String",
    difficulty: "Easy",
    category: "Strings",
    description: "Write a function that reverses a string. The input string is given as an array of characters s.",
    examples: [
      {
        input: 's = ["h","e","l","l","o"]',
        output: '["o","l","l","e","h"]'
      }
    ],
    constraints: [
      "1 <= s.length <= 10^5",
      "s[i] is a printable ascii character."
    ],
    testCases: [
      { input: '["h","e","l","l","o"]', expectedOutput: '["o","l","l","e","h"]' },
      { input: '["H","a","n","n","a","h"]', expectedOutput: '["h","a","n","n","a","H"]' }
    ],
    starterCode: {
      javascript: `function reverseString(s) {
    // Your code here
}`,
      python: `def reverse_string(s):
    # Your code here
    pass`,
      java: `public class Solution {
    public void reverseString(char[] s) {
        // Your code here
    }
}`
    }
  },
  {
    id: "palindrome-number",
    title: "Palindrome Number",
    difficulty: "Easy",
    category: "Math",
    description: "Given an integer x, return true if x is a palindrome, and false otherwise.",
    examples: [
      {
        input: "x = 121",
        output: "true",
        explanation: "121 reads as 121 from left to right and from right to left."
      },
      {
        input: "x = -121",
        output: "false",
        explanation: "From left to right, it reads -121. From right to left, it becomes 121-. Therefore it is not a palindrome."
      }
    ],
    constraints: [
      "-2^31 <= x <= 2^31 - 1"
    ],
    testCases: [
      { input: "121", expectedOutput: "true" },
      { input: "-121", expectedOutput: "false" },
      { input: "10", expectedOutput: "false" }
    ],
    starterCode: {
      javascript: `function isPalindrome(x) {
    // Your code here
}`,
      python: `def is_palindrome(x):
    # Your code here
    pass`,
      java: `public class Solution {
    public boolean isPalindrome(int x) {
        // Your code here
        return false;
    }
}`
    }
  },
  {
    id: "maximum-subarray",
    title: "Maximum Subarray",
    difficulty: "Medium",
    category: "Dynamic Programming",
    description: "Given an integer array nums, find the subarray with the largest sum, and return its sum.",
    examples: [
      {
        input: "nums = [-2,1,-3,4,-1,2,1,-5,4]",
        output: "6",
        explanation: "The subarray [4,-1,2,1] has the largest sum 6."
      }
    ],
    constraints: [
      "1 <= nums.length <= 10^5",
      "-10^4 <= nums[i] <= 10^4"
    ],
    testCases: [
      { input: "[-2,1,-3,4,-1,2,1,-5,4]", expectedOutput: "6" },
      { input: "[1]", expectedOutput: "1" },
      { input: "[5,4,-1,7,8]", expectedOutput: "23" }
    ],
    starterCode: {
      javascript: `function maxSubArray(nums) {
    // Your code here
}`,
      python: `def max_sub_array(nums):
    # Your code here
    pass`,
      java: `public class Solution {
    public int maxSubArray(int[] nums) {
        // Your code here
        return 0;
    }
}`
    }
  },
  {
    id: "binary-search",
    title: "Binary Search",
    difficulty: "Easy",
    category: "Search",
    description: "Given an array of integers nums which is sorted in ascending order, and an integer target, write a function to search target in nums. If target exists, then return its index. Otherwise, return -1.",
    examples: [
      {
        input: "nums = [-1,0,3,5,9,12], target = 9",
        output: "4",
        explanation: "9 exists in nums and its index is 4"
      }
    ],
    constraints: [
      "1 <= nums.length <= 10^4",
      "-10^4 < nums[i], target < 10^4",
      "All the integers in nums are unique.",
      "nums is sorted in ascending order."
    ],
    testCases: [
      { input: "[-1,0,3,5,9,12]\n9", expectedOutput: "4" },
      { input: "[-1,0,3,5,9,12]\n2", expectedOutput: "-1" }
    ],
    starterCode: {
      javascript: `function search(nums, target) {
    // Your code here
}`,
      python: `def search(nums, target):
    # Your code here
    pass`,
      java: `public class Solution {
    public int search(int[] nums, int target) {
        // Your code here
        return -1;
    }
}`
    }
  },
  {
    id: "fibonacci-sequence",
    title: "Fibonacci Number",
    difficulty: "Easy",
    category: "Recursion",
    description: "The Fibonacci numbers, commonly denoted F(n) form a sequence, called the Fibonacci sequence, such that each number is the sum of the two preceding ones, starting from 0 and 1.",
    examples: [
      {
        input: "n = 2",
        output: "1",
        explanation: "F(2) = F(1) + F(0) = 1 + 0 = 1."
      },
      {
        input: "n = 3",
        output: "2",
        explanation: "F(3) = F(2) + F(1) = 1 + 1 = 2."
      }
    ],
    constraints: [
      "0 <= n <= 30"
    ],
    testCases: [
      { input: "2", expectedOutput: "1" },
      { input: "3", expectedOutput: "2" },
      { input: "4", expectedOutput: "3" },
      { input: "5", expectedOutput: "5" }
    ],
    starterCode: {
      javascript: `function fib(n) {
    // Your code here
}`,
      python: `def fib(n):
    # Your code here
    pass`,
      java: `public class Solution {
    public int fib(int n) {
        // Your code here
        return 0;
    }
}`
    }
  },
  {
    id: "merge-sorted-arrays",
    title: "Merge Two Sorted Lists",
    difficulty: "Easy",
    category: "Linked Lists",
    description: "You are given the heads of two sorted linked lists list1 and list2. Merge the two lists into one sorted list.",
    examples: [
      {
        input: "list1 = [1,2,4], list2 = [1,3,4]",
        output: "[1,1,2,3,4,4]"
      }
    ],
    constraints: [
      "The number of nodes in both lists is in the range [0, 50].",
      "-100 <= Node.val <= 100",
      "Both list1 and list2 are sorted in non-decreasing order."
    ],
    testCases: [
      { input: "[1,2,4]\n[1,3,4]", expectedOutput: "[1,1,2,3,4,4]" },
      { input: "[]\n[]", expectedOutput: "[]" },
      { input: "[]\n[0]", expectedOutput: "[0]" }
    ],
    starterCode: {
      javascript: `function mergeTwoLists(list1, list2) {
    // Your code here
}`,
      python: `def merge_two_lists(list1, list2):
    # Your code here
    pass`,
      java: `public class Solution {
    public ListNode mergeTwoLists(ListNode list1, ListNode list2) {
        // Your code here
        return null;
    }
}`
    }
  },
  {
    id: "valid-parentheses",
    title: "Valid Parentheses",
    difficulty: "Easy",
    category: "Stack",
    description: "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.",
    examples: [
      {
        input: 's = "()"',
        output: "true"
      },
      {
        input: 's = "()[]{}"',
        output: "true"
      },
      {
        input: 's = "(]"',
        output: "false"
      }
    ],
    constraints: [
      "1 <= s.length <= 10^4",
      "s consists of parentheses only '()[]{}'."
    ],
    testCases: [
      { input: '"()"', expectedOutput: "true" },
      { input: '"()[]{}"', expectedOutput: "true" },
      { input: '"(]"', expectedOutput: "false" },
      { input: '"([)]"', expectedOutput: "false" }
    ],
    starterCode: {
      javascript: `function isValid(s) {
    // Your code here
}`,
      python: `def is_valid(s):
    # Your code here
    pass`,
      java: `public class Solution {
    public boolean isValid(String s) {
        // Your code here
        return false;
    }
}`
    }
  }
];

// Get all challenges
router.get("/", async (req: any, res) => {
  try {
    res.json({
      challenges: CODING_CHALLENGES,
      totalCount: CODING_CHALLENGES.length
    });
  } catch (error) {
    console.error("Error fetching challenges:", error);
    res.status(500).json({ message: "Failed to fetch challenges" });
  }
});

// Get challenge by ID
router.get("/:id", async (req: any, res) => {
  try {
    const { id } = req.params;
    const challenge = CODING_CHALLENGES.find(c => c.id === id);
    
    if (!challenge) {
      return res.status(404).json({ message: "Challenge not found" });
    }
    
    res.json(challenge);
  } catch (error) {
    console.error("Error fetching challenge:", error);
    res.status(500).json({ message: "Failed to fetch challenge" });
  }
});

// Submit solution using Judge0
router.post("/:id/submit", async (req: any, res) => {
  try {
    const { id } = req.params;
    const { code, language } = req.body;
    const userId = req.user.id;
    
    if (!code || !language) {
      return res.status(400).json({ message: "Code and language are required" });
    }
    
    const challenge = CODING_CHALLENGES.find(c => c.id === id);
    if (!challenge) {
      return res.status(404).json({ message: "Challenge not found" });
    }
    
    const languageId = LANGUAGE_MAP[language.toLowerCase()];
    if (!languageId) {
      return res.status(400).json({ message: "Unsupported language" });
    }

    // Execute code with Judge0
    const results = await executeCodeWithJudge0(code, languageId, challenge.testCases);
    
    // Calculate score
    const passedTests = results.filter(r => r.passed).length;
    const totalTests = results.length;
    const score = Math.round((passedTests / totalTests) * 100);
    const passed = passedTests === totalTests;
    
    // Save submission
    const submission = {
      userId,
      challengeId: id,
      code,
      language,
      score,
      passed,
      testResults: results,
      submittedAt: new Date()
    };
    
    // Update user progress
    if (passed) {
      const user = await storage.getUser(userId);
      await storage.updateUser(userId, {
        problemsSolved: (user?.problemsSolved || 0) + 1,
        points: (user?.points || 0) + getDifficultyPoints(challenge.difficulty),
        streak: (user?.streak || 0) + 1
      });
    }
    
    res.json({
      message: passed ? "Solution accepted!" : "Some test cases failed",
      submission,
      score,
      passed,
      passedTests,
      totalTests,
      results
    });
    
  } catch (error) {
    console.error("Error submitting solution:", error);
    res.status(500).json({ message: "Failed to submit solution" });
  }
});

// Get user submissions for a challenge
router.get("/:id/submissions", async (req: any, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    // This would typically come from database
    // For now, return empty array as we don't have submissions storage yet
    res.json({ submissions: [] });
    
  } catch (error) {
    console.error("Error fetching submissions:", error);
    res.status(500).json({ message: "Failed to fetch submissions" });
  }
});

// Execute code with Judge0 API
async function executeCodeWithJudge0(code: string, languageId: number, testCases: any[]) {
  if (!RAPID_API_KEY) {
    throw new Error("RAPIDAPI_KEY not configured");
  }

  const results = [];
  
  for (const testCase of testCases) {
    try {
      // Create submission
      const submissionResponse = await fetch(`${JUDGE0_API_BASE}/submissions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-RapidAPI-Key': RAPID_API_KEY,
          'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
        },
        body: JSON.stringify({
          source_code: code,
          language_id: languageId,
          stdin: testCase.input,
          expected_output: testCase.expectedOutput,
          cpu_time_limit: 2,
          memory_limit: 128000
        })
      });
      
      if (!submissionResponse.ok) {
        throw new Error(`Judge0 submission failed: ${submissionResponse.status}`);
      }
      
      const submission = await submissionResponse.json();
      const token = submission.token;
      
      // Poll for result
      let result;
      let attempts = 0;
      const maxAttempts = 10;
      
      do {
        await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
        
        const resultResponse = await fetch(`${JUDGE0_API_BASE}/submissions/${token}`, {
          headers: {
            'X-RapidAPI-Key': RAPID_API_KEY,
            'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
          }
        });
        
        result = await resultResponse.json();
        attempts++;
        
      } while (result.status.id <= 2 && attempts < maxAttempts); // Status 1=queued, 2=processing
      
      const passed = result.status.id === 3 && 
                    result.stdout?.trim() === testCase.expectedOutput.trim();
      
      results.push({
        input: testCase.input,
        expectedOutput: testCase.expectedOutput,
        actualOutput: result.stdout?.trim() || '',
        passed,
        status: result.status.description,
        executionTime: result.time,
        memoryUsage: result.memory,
        error: result.stderr || result.compile_output || null
      });
      
    } catch (error) {
      results.push({
        input: testCase.input,
        expectedOutput: testCase.expectedOutput,
        actualOutput: '',
        passed: false,
        status: 'Runtime Error',
        error: error.message
      });
    }
  }
  
  return results;
}

function getDifficultyPoints(difficulty: string): number {
  switch (difficulty.toLowerCase()) {
    case 'easy': return 10;
    case 'medium': return 25;
    case 'hard': return 50;
    default: return 10;
  }
}

export default router;