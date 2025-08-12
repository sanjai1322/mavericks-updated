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
  type InsertUserAssessment,
  type Resume,
  type InsertResume
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
  getUserLearningPaths(userId: string): Promise<LearningPath[]>;
  
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
  
  // Resume methods
  getUserResumes(userId: string): Promise<Resume[]>;
  getLatestUserResume(userId: string): Promise<Resume | undefined>;
  createResume(resume: InsertResume): Promise<Resume>;
  updateResume(id: string, updates: Partial<Resume>): Promise<Resume | undefined>;
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
  private resumes: Map<string, Resume>;

  constructor() {
    this.users = new Map();
    this.assessments = new Map();
    this.learningPaths = new Map();
    this.hackathons = new Map();
    this.userProgress = new Map();
    this.submissions = new Map();
    this.activities = new Map();
    this.userAssessments = new Map();
    this.resumes = new Map();
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
        starterCode: `def twoSum(nums, target):
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

    // Add comprehensive quiz-based assessments by difficulty levels
    const additionalProblems = [
      // COMPREHENSIVE QUIZ SYSTEM - MULTIPLE LANGUAGES AND LEVELS
      
      // === PYTHON SECTION ===
      
      // BEGINNER LEVEL (Easy Problems)
      {
        id: randomUUID(),
        title: "Sum of Two Integers",
        description: "Calculate the sum of two numbers",
        difficulty: "Easy",
        topic: "Math",
        acceptance: "98.5%",
        problemStatement: `Write a function that takes two integers and returns their sum.
        
Example:
Input: a = 5, b = 3
Output: 8`,
        starterCode: `def add_numbers(a, b):
    """Add two numbers and return the sum."""
    # Your code here
    pass`,
        testCases: [
          { input: { a: 5, b: 3 }, expected: 8 },
          { input: { a: -1, b: 1 }, expected: 0 },
          { input: { a: 0, b: 0 }, expected: 0 },
          { input: { a: -5, b: -3 }, expected: -8 }
        ] as any,
        createdAt: new Date(),
      },
      {
        id: randomUUID(),
        title: "Find Maximum Number",
        description: "Find the largest number in a list",
        difficulty: "Easy",
        topic: "Arrays",
        acceptance: "94.2%",
        problemStatement: `Write a function that finds the maximum number in a list of integers.
        
Example:
Input: nums = [1, 5, 3, 9, 2]
Output: 9`,
        starterCode: `def find_max(nums):
    """Find the maximum number in the list."""
    # Your code here
    pass`,
        testCases: [
          { input: { nums: [1, 5, 3, 9, 2] }, expected: 9 },
          { input: { nums: [-1, -5, -3] }, expected: -1 },
          { input: { nums: [42] }, expected: 42 },
          { input: { nums: [0, 0, 0] }, expected: 0 }
        ] as any,
        createdAt: new Date(),
      },
      {
        id: randomUUID(),
        title: "Count Vowels",
        description: "Count the number of vowels in a string",
        difficulty: "Easy",
        topic: "Strings",
        acceptance: "91.7%",
        problemStatement: `Write a function that counts the number of vowels (a, e, i, o, u) in a given string.
        
Example:
Input: s = "hello world"
Output: 3`,
        starterCode: `def count_vowels(s):
    """Count vowels in the string."""
    # Your code here
    pass`,
        testCases: [
          { input: { s: "hello world" }, expected: 3 },
          { input: { s: "PROGRAMMING" }, expected: 3 },
          { input: { s: "xyz" }, expected: 0 },
          { input: { s: "aeiou" }, expected: 5 }
        ] as any,
        createdAt: new Date(),
      },
      {
        id: randomUUID(),
        title: "Reverse String",
        description: "Reverse the characters in a string",
        difficulty: "Easy",
        topic: "Strings",
        acceptance: "96.1%",
        problemStatement: `Write a function that reverses a string.
        
Example:
Input: s = "hello"
Output: "olleh"`,
        starterCode: `def reverse_string(s):
    """Reverse the input string."""
    # Your code here
    pass`,
        testCases: [
          { input: { s: "hello" }, expected: "olleh" },
          { input: { s: "Python" }, expected: "nohtyP" },
          { input: { s: "a" }, expected: "a" },
          { input: { s: "" }, expected: "" }
        ] as any,
        createdAt: new Date(),
      },
      {
        id: randomUUID(),
        title: "Even or Odd",
        description: "Check if a number is even or odd",
        difficulty: "Easy",
        topic: "Math",
        acceptance: "99.1%",
        problemStatement: `Write a function that determines if a number is even or odd.
        
Example:
Input: n = 4
Output: "even"
        
Input: n = 7
Output: "odd"`,
        starterCode: `def check_even_odd(n):
    """Check if number is even or odd."""
    # Your code here
    pass`,
        testCases: [
          { input: { n: 4 }, expected: "even" },
          { input: { n: 7 }, expected: "odd" },
          { input: { n: 0 }, expected: "even" },
          { input: { n: -3 }, expected: "odd" }
        ] as any,
        createdAt: new Date(),
      },

      // INTERMEDIATE LEVEL (Medium Problems)
      {
        id: randomUUID(),
        title: "Find Duplicates",
        description: "Find duplicate numbers in an array",
        difficulty: "Medium",
        topic: "Arrays",
        acceptance: "73.4%",
        problemStatement: `Given an array of integers, find all numbers that appear more than once.
        
Example:
Input: nums = [1, 2, 3, 2, 4, 3]
Output: [2, 3]`,
        starterCode: `def find_duplicates(nums):
    """Find all duplicate numbers in the array."""
    # Your code here
    pass`,
        testCases: [
          { input: { nums: [1, 2, 3, 2, 4, 3] }, expected: [2, 3] },
          { input: { nums: [1, 1, 1] }, expected: [1] },
          { input: { nums: [1, 2, 3] }, expected: [] },
          { input: { nums: [] }, expected: [] }
        ] as any,
        createdAt: new Date(),
      },
      {
        id: randomUUID(),
        title: "Rotate Array",
        description: "Rotate array to the right by k steps",
        difficulty: "Medium",
        topic: "Arrays",
        acceptance: "68.9%",
        problemStatement: `Given an array, rotate the array to the right by k steps.
        
Example:
Input: nums = [1,2,3,4,5,6,7], k = 3
Output: [5,6,7,1,2,3,4]`,
        starterCode: `def rotate_array(nums, k):
    """Rotate array to the right by k steps."""
    # Your code here
    pass`,
        testCases: [
          { input: { nums: [1,2,3,4,5,6,7], k: 3 }, expected: [5,6,7,1,2,3,4] },
          { input: { nums: [1,2], k: 1 }, expected: [2,1] },
          { input: { nums: [1], k: 1 }, expected: [1] },
          { input: { nums: [1,2,3], k: 4 }, expected: [3,1,2] }
        ] as any,
        createdAt: new Date(),
      },
      {
        id: randomUUID(),
        title: "Longest Common Prefix",
        description: "Find the longest common prefix among strings",
        difficulty: "Medium",
        topic: "Strings",
        acceptance: "71.8%",
        problemStatement: `Write a function to find the longest common prefix string amongst an array of strings.
        
Example:
Input: strs = ["flower","flow","flight"]
Output: "fl"`,
        starterCode: `def longest_common_prefix(strs):
    """Find longest common prefix among all strings."""
    # Your code here
    pass`,
        testCases: [
          { input: { strs: ["flower","flow","flight"] }, expected: "fl" },
          { input: { strs: ["dog","racecar","car"] }, expected: "" },
          { input: { strs: ["test","test","test"] }, expected: "test" },
          { input: { strs: [""] }, expected: "" }
        ] as any,
        createdAt: new Date(),
      },
      {
        id: randomUUID(),
        title: "Binary Search",
        description: "Implement binary search algorithm",
        difficulty: "Medium",
        topic: "Search Algorithms",
        acceptance: "77.2%",
        problemStatement: `Given a sorted array and a target value, return the index if the target is found. If not, return -1.
        
Example:
Input: nums = [1,3,5,7,9], target = 5
Output: 2`,
        starterCode: `def binary_search(nums, target):
    """Find target using binary search."""
    # Your code here
    pass`,
        testCases: [
          { input: { nums: [1,3,5,7,9], target: 5 }, expected: 2 },
          { input: { nums: [1,3,5,7,9], target: 6 }, expected: -1 },
          { input: { nums: [1], target: 1 }, expected: 0 },
          { input: { nums: [], target: 1 }, expected: -1 }
        ] as any,
        createdAt: new Date(),
      },

      // === JAVA SECTION ===
      {
        id: randomUUID(),
        title: "Simple Java Calculator",
        description: "Create a basic calculator with add, subtract operations",
        difficulty: "Easy",
        topic: "Java Basics",
        acceptance: "89.3%",
        problemStatement: `Write a Java class with methods to add and subtract two integers.
        
Example:
Input: a = 10, b = 5
add(10, 5) should return 15
subtract(10, 5) should return 5`,
        starterCode: `public class Calculator {
    public int add(int a, int b) {
        // Your code here
        return 0;
    }
    
    public int subtract(int a, int b) {
        // Your code here  
        return 0;
    }
    
    public static void main(String[] args) {
        Calculator calc = new Calculator();
        System.out.println(calc.add(10, 5));
        System.out.println(calc.subtract(10, 5));
    }
}`,
        testCases: [
          { input: { a: 10, b: 5 }, expected: [15, 5] },
          { input: { a: 0, b: 0 }, expected: [0, 0] },
          { input: { a: -5, b: 3 }, expected: [-2, -8] },
          { input: { a: 100, b: 25 }, expected: [125, 75] }
        ] as any,
        createdAt: new Date(),
      },
      {
        id: randomUUID(),
        title: "String Length Counter",
        description: "Count characters in a Java string",
        difficulty: "Easy", 
        topic: "Java Strings",
        acceptance: "94.7%",
        problemStatement: `Write a Java method that returns the length of a given string.
        
Example:
Input: "Hello World"
Output: 11`,
        starterCode: `public class StringCounter {
    public int getStringLength(String str) {
        // Your code here
        return 0;
    }
    
    public static void main(String[] args) {
        StringCounter counter = new StringCounter();
        System.out.println(counter.getStringLength("Hello World"));
    }
}`,
        testCases: [
          { input: { str: "Hello World" }, expected: 11 },
          { input: { str: "Java" }, expected: 4 },
          { input: { str: "" }, expected: 0 },
          { input: { str: "Programming is fun!" }, expected: 19 }
        ] as any,
        createdAt: new Date(),
      },

      // === C++ SECTION ===
      {
        id: randomUUID(),
        title: "C++ Array Sum",
        description: "Calculate sum of array elements in C++",
        difficulty: "Easy",
        topic: "C++ Arrays",
        acceptance: "91.2%",
        problemStatement: `Write a C++ function that calculates the sum of all elements in an integer array.
        
Example:
Input: arr = {1, 2, 3, 4, 5}, size = 5
Output: 15`,
        starterCode: `#include <iostream>
using namespace std;

int arraySum(int arr[], int size) {
    // Your code here
    return 0;
}

int main() {
    int arr1[] = {1, 2, 3, 4, 5};
    cout << arraySum(arr1, 5) << endl;
    return 0;
}`,
        testCases: [
          { input: { arr: [1,2,3,4,5], size: 5 }, expected: 15 },
          { input: { arr: [10,20,30], size: 3 }, expected: 60 },
          { input: { arr: [0], size: 1 }, expected: 0 },
          { input: { arr: [-1,-2,-3], size: 3 }, expected: -6 }
        ] as any,
        createdAt: new Date(),
      },

      // === GO SECTION ===
      {
        id: randomUUID(),
        title: "Go Basic Functions",
        description: "Learn Go syntax and basic function creation",
        difficulty: "Easy",
        topic: "Go Programming",
        acceptance: "87.5%",
        problemStatement: `Write a Go function that adds two integers and returns the result.
        
Example:
Input: a = 10, b = 5
Output: 15`,
        starterCode: `package main

import "fmt"

func addNumbers(a int, b int) int {
    // Your code here
    return 0
}

func main() {
    fmt.Println(addNumbers(10, 5))
    fmt.Println(addNumbers(3, 7))
}`,
        testCases: [
          { input: { a: 10, b: 5 }, expected: 15 },
          { input: { a: 3, b: 7 }, expected: 10 },
          { input: { a: 0, b: 0 }, expected: 0 },
          { input: { a: -5, b: 8 }, expected: 3 }
        ] as any,
        createdAt: new Date(),
      },
      {
        id: randomUUID(),
        title: "Go Slice Operations",
        description: "Work with Go slices and arrays",
        difficulty: "Medium",
        topic: "Go Data Structures",
        acceptance: "73.2%",
        problemStatement: `Write a Go function that finds the maximum element in a slice of integers.
        
Example:
Input: []int{3, 7, 2, 9, 1}
Output: 9`,
        starterCode: `package main

import "fmt"

func findMax(numbers []int) int {
    // Your code here
    return 0
}

func main() {
    nums := []int{3, 7, 2, 9, 1}
    fmt.Println(findMax(nums))
}`,
        testCases: [
          { input: { numbers: [3,7,2,9,1] }, expected: 9 },
          { input: { numbers: [1] }, expected: 1 },
          { input: { numbers: [-1,-5,-2] }, expected: -1 },
          { input: { numbers: [10,20,15] }, expected: 20 }
        ] as any,
        createdAt: new Date(),
      },

      // === RUST SECTION ===
      {
        id: randomUUID(),
        title: "Rust Ownership Basics",
        description: "Learn Rust ownership and borrowing",
        difficulty: "Medium",
        topic: "Rust Programming",
        acceptance: "64.8%",
        problemStatement: `Write a Rust function that calculates the length of a string slice.
        
Example:
Input: "Hello Rust"
Output: 10`,
        starterCode: `fn string_length(s: &str) -> usize {
    // Your code here
    0
}

fn main() {
    println!("{}", string_length("Hello Rust"));
    println!("{}", string_length("Rust"));
}`,
        testCases: [
          { input: { s: "Hello Rust" }, expected: 10 },
          { input: { s: "Rust" }, expected: 4 },
          { input: { s: "" }, expected: 0 },
          { input: { s: "Programming" }, expected: 11 }
        ] as any,
        createdAt: new Date(),
      },

      // === KOTLIN SECTION ===
      {
        id: randomUUID(),
        title: "Kotlin Data Classes",
        description: "Work with Kotlin data classes and functions",
        difficulty: "Easy",
        topic: "Kotlin Programming",
        acceptance: "82.7%",
        problemStatement: `Write a Kotlin function that checks if a number is even.
        
Example:
Input: 4
Output: true

Input: 7
Output: false`,
        starterCode: `fun isEven(number: Int): Boolean {
    // Your code here
    return false
}

fun main() {
    println(isEven(4))
    println(isEven(7))
    println(isEven(0))
}`,
        testCases: [
          { input: { number: 4 }, expected: true },
          { input: { number: 7 }, expected: false },
          { input: { number: 0 }, expected: true },
          { input: { number: -2 }, expected: true }
        ] as any,
        createdAt: new Date(),
      },

      // === SWIFT SECTION ===
      {
        id: randomUUID(),
        title: "Swift Optionals",
        description: "Learn Swift optional handling",
        difficulty: "Medium",
        topic: "Swift Programming",
        acceptance: "71.4%",
        problemStatement: `Write a Swift function that safely divides two numbers and returns nil if dividing by zero.
        
Example:
Input: a = 10, b = 2
Output: Optional(5.0)

Input: a = 10, b = 0
Output: nil`,
        starterCode: `func safeDivide(_ a: Double, _ b: Double) -> Double? {
    // Your code here
    return nil
}

print(safeDivide(10, 2))
print(safeDivide(10, 0))`,
        testCases: [
          { input: { a: 10, b: 2 }, expected: 5.0 },
          { input: { a: 10, b: 0 }, expected: null },
          { input: { a: 8, b: 4 }, expected: 2.0 },
          { input: { a: 7, b: 2 }, expected: 3.5 }
        ] as any,
        createdAt: new Date(),
      },

      // === PHP SECTION ===
      {
        id: randomUUID(),
        title: "PHP Array Functions",
        description: "Work with PHP arrays and built-in functions",
        difficulty: "Easy",
        topic: "PHP Programming",
        acceptance: "89.1%",
        problemStatement: `Write a PHP function that returns the sum of all elements in an array.
        
Example:
Input: [1, 2, 3, 4, 5]
Output: 15`,
        starterCode: `<?php
function arraySum($numbers) {
    // Your code here
    return 0;
}

echo arraySum([1, 2, 3, 4, 5]) . "\\n";
echo arraySum([10, 20]) . "\\n";
?>`,
        testCases: [
          { input: { numbers: [1,2,3,4,5] }, expected: 15 },
          { input: { numbers: [10,20] }, expected: 30 },
          { input: { numbers: [] }, expected: 0 },
          { input: { numbers: [-1,1,-2,2] }, expected: 0 }
        ] as any,
        createdAt: new Date(),
      },

      // === RUBY SECTION ===
      {
        id: randomUUID(),
        title: "Ruby Blocks and Iterators",
        description: "Use Ruby blocks for array manipulation",
        difficulty: "Medium",
        topic: "Ruby Programming",
        acceptance: "75.6%",
        problemStatement: `Write a Ruby method that returns an array of squares of all even numbers from the input array.
        
Example:
Input: [1, 2, 3, 4, 5, 6]
Output: [4, 16, 36]`,
        starterCode: `def squares_of_evens(numbers)
  # Your code here using Ruby blocks
  []
end

puts squares_of_evens([1, 2, 3, 4, 5, 6]).inspect
puts squares_of_evens([1, 3, 5]).inspect`,
        testCases: [
          { input: { numbers: [1,2,3,4,5,6] }, expected: [4, 16, 36] },
          { input: { numbers: [1,3,5] }, expected: [] },
          { input: { numbers: [2,4,8] }, expected: [4, 16, 64] },
          { input: { numbers: [] }, expected: [] }
        ] as any,
        createdAt: new Date(),
      },

      // === C# SECTION ===
      {
        id: randomUUID(),
        title: "C# LINQ Operations",
        description: "Use C# LINQ for data manipulation",
        difficulty: "Medium",
        topic: "C# Programming",
        acceptance: "68.9%",
        problemStatement: `Write a C# method that uses LINQ to find all strings longer than a specified length.
        
Example:
Input: ["hello", "world", "C#", "programming"], minLength = 4
Output: ["hello", "world", "programming"]`,
        starterCode: `using System;
using System.Collections.Generic;
using System.Linq;

class Program 
{
    static List<string> FilterByLength(List<string> strings, int minLength)
    {
        // Your code here using LINQ
        return new List<string>();
    }
    
    static void Main()
    {
        var words = new List<string> {"hello", "world", "C#", "programming"};
        Console.WriteLine(string.Join(", ", FilterByLength(words, 4)));
    }
}`,
        testCases: [
          { input: { strings: ["hello", "world", "C#", "programming"], minLength: 4 }, expected: ["hello", "world", "programming"] },
          { input: { strings: ["a", "bb", "ccc"], minLength: 2 }, expected: ["bb", "ccc"] },
          { input: { strings: ["short"], minLength: 10 }, expected: [] },
          { input: { strings: [], minLength: 3 }, expected: [] }
        ] as any,
        createdAt: new Date(),
      },

      // === C SECTION ===
      {
        id: randomUUID(),
        title: "C Factorial Function",
        description: "Calculate factorial using C language",
        difficulty: "Medium",
        topic: "C Programming",
        acceptance: "76.8%",
        problemStatement: `Write a C function to calculate the factorial of a given number.
        
Example:
Input: n = 5
Output: 120 (5! = 5*4*3*2*1 = 120)`,
        starterCode: `#include <stdio.h>

int factorial(int n) {
    // Your code here
    return 0;
}

int main() {
    printf("%d\\n", factorial(5));
    printf("%d\\n", factorial(0));
    return 0;
}`,
        testCases: [
          { input: { n: 5 }, expected: 120 },
          { input: { n: 0 }, expected: 1 },
          { input: { n: 1 }, expected: 1 },
          { input: { n: 4 }, expected: 24 }
        ] as any,
        createdAt: new Date(),
      },

      // === MORE PYTHON ADVANCED PROBLEMS ===
      {
        id: randomUUID(),
        title: "Python List Comprehension",
        description: "Use list comprehension to filter and transform data",
        difficulty: "Medium",
        topic: "Python Advanced",
        acceptance: "68.4%",
        problemStatement: `Write a Python function that takes a list of numbers and returns a new list containing only the squares of even numbers.
        
Example:
Input: [1, 2, 3, 4, 5, 6]
Output: [4, 16, 36]`,
        starterCode: `def squares_of_evens(numbers):
    """Return squares of even numbers using list comprehension."""
    # Your code here
    pass`,
        testCases: [
          { input: { numbers: [1,2,3,4,5,6] }, expected: [4, 16, 36] },
          { input: { numbers: [1,3,5] }, expected: [] },
          { input: { numbers: [2,4,8] }, expected: [4, 16, 64] },
          { input: { numbers: [] }, expected: [] }
        ] as any,
        createdAt: new Date(),
      },
      {
        id: randomUUID(),
        title: "Python Dictionary Operations",
        description: "Manipulate dictionaries and count occurrences",
        difficulty: "Medium", 
        topic: "Python Data Structures",
        acceptance: "72.1%",
        problemStatement: `Write a Python function that takes a list of strings and returns a dictionary with each string as key and its length as value.
        
Example:
Input: ["hello", "world", "python"]
Output: {"hello": 5, "world": 5, "python": 6}`,
        starterCode: `def string_lengths(strings):
    """Create dictionary mapping strings to their lengths."""
    # Your code here
    pass`,
        testCases: [
          { input: { strings: ["hello", "world", "python"] }, expected: {"hello": 5, "world": 5, "python": 6} },
          { input: { strings: ["a", "bb", "ccc"] }, expected: {"a": 1, "bb": 2, "ccc": 3} },
          { input: { strings: [] }, expected: {} },
          { input: { strings: [""] }, expected: {"": 0} }
        ] as any,
        createdAt: new Date(),
      },

      // === JAVASCRIPT ADVANCED ===
      {
        id: randomUUID(),
        title: "JavaScript Array Methods",
        description: "Use modern JavaScript array methods",
        difficulty: "Medium",
        topic: "JavaScript ES6+",
        acceptance: "74.3%",
        problemStatement: `Write a JavaScript function that takes an array of numbers and returns the sum of all numbers greater than 10.
        
Example:
Input: [5, 15, 8, 12, 3, 20]
Output: 47 (15 + 12 + 20)`,
        starterCode: `function sumGreaterThan10(numbers) {
    // Your code here using array methods
    return 0;
}`,
        testCases: [
          { input: { numbers: [5, 15, 8, 12, 3, 20] }, expected: 47 },
          { input: { numbers: [1, 2, 3, 4] }, expected: 0 },
          { input: { numbers: [11, 12, 13] }, expected: 36 },
          { input: { numbers: [] }, expected: 0 }
        ] as any,
        createdAt: new Date(),
      },

      // ADVANCED LEVEL (Hard Problems)
      {
        id: randomUUID(),
        title: "Merge Sort Implementation",
        description: "Implement the merge sort algorithm",
        difficulty: "Hard",
        topic: "Sorting",
        acceptance: "54.7%",
        problemStatement: `Implement merge sort to sort an array of integers in ascending order.
        
Example:
Input: nums = [3,1,4,1,5,9,2,6]
Output: [1,1,2,3,4,5,6,9]`,
        starterCode: `def merge_sort(nums):
    """Sort array using merge sort algorithm."""
    # Your code here
    pass`,
        testCases: [
          { input: { nums: [3,1,4,1,5,9,2,6] }, expected: [1,1,2,3,4,5,6,9] },
          { input: { nums: [1] }, expected: [1] },
          { input: { nums: [] }, expected: [] },
          { input: { nums: [5,4,3,2,1] }, expected: [1,2,3,4,5] }
        ] as any,
        createdAt: new Date(),
      },
      {
        id: randomUUID(),
        title: "Dynamic Programming - Fibonacci",
        description: "Implement efficient Fibonacci using memoization",
        difficulty: "Hard",
        topic: "Dynamic Programming",
        acceptance: "62.8%",
        problemStatement: `Implement an efficient Fibonacci function using dynamic programming (memoization).
        
Example:
Input: n = 10
Output: 55`,
        starterCode: `def fibonacci_dp(n, memo=None):
    """Calculate Fibonacci number using dynamic programming."""
    if memo is None:
        memo = {}
    # Your code here
    pass`,
        testCases: [
          { input: { n: 10 }, expected: 55 },
          { input: { n: 0 }, expected: 0 },
          { input: { n: 1 }, expected: 1 },
          { input: { n: 15 }, expected: 610 }
        ] as any,
        createdAt: new Date(),
      },
      {
        id: randomUUID(),
        title: "Graph Algorithms - BFS",
        description: "Implement breadth-first search on a graph",
        difficulty: "Hard",
        topic: "Graph Algorithms",
        acceptance: "45.2%",
        problemStatement: `Implement breadth-first search (BFS) to find the shortest path between two nodes in an unweighted graph.
        
Example:
Input: graph = {'A': ['B', 'C'], 'B': ['A', 'D'], 'C': ['A'], 'D': ['B']}, start = 'A', end = 'D'
Output: ['A', 'B', 'D']`,
        starterCode: `from collections import deque

def bfs_shortest_path(graph, start, end):
    """Find shortest path using BFS."""
    # Your code here
    pass`,
        testCases: [
          { input: { graph: {'A': ['B', 'C'], 'B': ['A', 'D'], 'C': ['A'], 'D': ['B']}, start: 'A', end: 'D' }, expected: ['A', 'B', 'D'] },
          { input: { graph: {'A': ['B'], 'B': ['C'], 'C': []}, start: 'A', end: 'C' }, expected: ['A', 'B', 'C'] },
          { input: { graph: {'A': ['B'], 'B': []}, start: 'A', end: 'C' }, expected: null },
          { input: { graph: {'A': []}, start: 'A', end: 'A' }, expected: ['A'] }
        ] as any,
        createdAt: new Date(),
      },
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
        starterCode: `def is_valid_parentheses(s):
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
      },

      // === MULTILINGUAL QUIZ EXPANSION - FINAL ADDITIONS ===
      
      // Perl Text Processing
      {
        id: randomUUID(),
        title: "Perl Pattern Matching",
        description: "Advanced regex and text processing in Perl",
        difficulty: "Hard",
        topic: "Perl Programming",
        acceptance: "45.8%",
        problemStatement: `Extract all valid email addresses from a text string using Perl regex.
        
Example:
Input: "Contact us at hello@example.com or support@test.org for help"
Output: ["hello@example.com", "support@test.org"]`,
        starterCode: `#!/usr/bin/perl
use strict;
use warnings;

sub extract_emails {
    my $text = shift;
    my @emails = ();
    # Your regex code here
    return @emails;
}

my $text = "Contact us at hello@example.com or support@test.org for help";
my @result = extract_emails($text);
print join(", ", @result) . "\\n";`,
        testCases: [
          { input: { text: "Contact us at hello@example.com or support@test.org" }, expected: ["hello@example.com", "support@test.org"] },
          { input: { text: "No emails here!" }, expected: [] },
          { input: { text: "Email: user@domain.com" }, expected: ["user@domain.com"] }
        ] as any,
        createdAt: new Date(),
      },

      // MATLAB Scientific Computing
      {
        id: randomUUID(),
        title: "MATLAB Signal Processing",
        description: "Basic signal processing operations",
        difficulty: "Medium",
        topic: "MATLAB Programming",
        acceptance: "67.8%",
        problemStatement: `Calculate the moving average of a signal with window size n.
        
Example:
Input: signal = [1, 2, 3, 4, 5], window = 3  
Output: [2, 3, 4] (averages of [1,2,3], [2,3,4], [3,4,5])`,
        starterCode: `function result = moving_average(signal, window_size)
    % Your code here
    result = [];
end

signal = [1, 2, 3, 4, 5];
result = moving_average(signal, 3);
disp(result);`,
        testCases: [
          { input: { signal: [1,2,3,4,5], window_size: 3 }, expected: [2, 3, 4] },
          { input: { signal: [10,20,30], window_size: 2 }, expected: [15, 25] },
          { input: { signal: [1,1,1,1], window_size: 4 }, expected: [1] }
        ] as any,
        createdAt: new Date(),
      },

      // R Statistical Analysis
      {
        id: randomUUID(),
        title: "R Correlation Analysis",
        description: "Statistical correlation and analysis",
        difficulty: "Medium",
        topic: "R Programming",
        acceptance: "71.5%",
        problemStatement: `Calculate Pearson correlation coefficient between two vectors.
        
Example:
Input: x = c(1,2,3,4,5), y = c(2,4,6,8,10)
Output: 1.0 (perfect positive correlation)`,
        starterCode: `calculate_correlation <- function(x, y) {
  # Your code here
  correlation <- 0
  return(correlation)
}

x <- c(1, 2, 3, 4, 5)
y <- c(2, 4, 6, 8, 10)
result <- calculate_correlation(x, y)
print(result)`,
        testCases: [
          { input: { x: [1,2,3,4,5], y: [2,4,6,8,10] }, expected: 1.0 },
          { input: { x: [1,2,3], y: [3,2,1] }, expected: -1.0 },
          { input: { x: [1,1,1], y: [2,2,2] }, expected: null }
        ] as any,
        createdAt: new Date(),
      }
    ];

    // Combine all multilingual assessments  
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
      skills: insertUser.skills || null,
      extractedSkills: insertUser.extractedSkills || null,
      resumeText: insertUser.resumeText || null,
      skillStrengths: insertUser.skillStrengths || null,
      personalizedPlan: insertUser.personalizedPlan || null,
      resumeUpdatedAt: insertUser.resumeUpdatedAt || null
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

  async getUserLearningPaths(userId: string): Promise<LearningPath[]> {
    return Array.from(this.learningPaths.values()).filter(path => path.userId === userId);
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

  // Resume methods
  async getUserResumes(userId: string): Promise<Resume[]> {
    return Array.from(this.resumes.values()).filter(resume => resume.userId === userId);
  }

  async getLatestUserResume(userId: string): Promise<Resume | undefined> {
    const userResumes = Array.from(this.resumes.values())
      .filter(resume => resume.userId === userId)
      .sort((a, b) => {
        const aTime = a.uploadedAt ? new Date(a.uploadedAt).getTime() : 0;
        const bTime = b.uploadedAt ? new Date(b.uploadedAt).getTime() : 0;
        return bTime - aTime;
      });
    return userResumes[0];
  }

  async createResume(insertResume: InsertResume): Promise<Resume> {
    const id = randomUUID();
    const resume: Resume = { 
      ...insertResume, 
      id, 
      uploadedAt: new Date(),
      userId: insertResume.userId || null,
      extractedText: insertResume.extractedText || null,
      extractedSkills: insertResume.extractedSkills || null,
      aiAnalysis: insertResume.aiAnalysis || null
    };
    this.resumes.set(id, resume);
    return resume;
  }

  async updateResume(id: string, updates: Partial<Resume>): Promise<Resume | undefined> {
    const resume = this.resumes.get(id);
    if (!resume) return undefined;

    const updatedResume = { ...resume, ...updates };
    this.resumes.set(id, updatedResume);
    return updatedResume;
  }
}

export const storage = new MemStorage();
