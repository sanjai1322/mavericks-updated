import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useParams } from "wouter";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BookOpen, 
  Clock, 
  Star, 
  PlayCircle, 
  CheckCircle, 
  ArrowLeft,
  Target,
  Users,
  Code,
  Brain
} from "lucide-react";

interface LearningPath {
  id: string;
  title: string;
  description: string;
  icon: string;
  difficulty: string;
  lessons: number;
  duration: string;
  category: string;
  progress: number;
  createdAt: string;
}

interface Lesson {
  id: string;
  title: string;
  description: string;
  type: 'theory' | 'practice' | 'project' | 'quiz';
  duration: number;
  isCompleted: boolean;
  content: string;
}

// Sample detailed learning content
const getLearningContent = (pathTitle: string): Lesson[] => {
  const contentMap: Record<string, Lesson[]> = {
    "Programming Fundamentals": [
      {
        id: "1",
        title: "Variables and Data Types",
        description: "Learn about different data types and how to declare variables",
        type: "theory",
        duration: 45,
        isCompleted: false,
        content: `# Variables and Data Types

## What are Variables?
Variables are containers that store data values. In programming, you use variables to store information that your program can use and manipulate.

## Common Data Types:
- **Numbers**: Integer (1, 2, 3) and Float (1.5, 2.7)
- **Strings**: Text data ("Hello", "World")
- **Booleans**: True or False values
- **Arrays**: Lists of data [1, 2, 3]
- **Objects**: Complex data structures {name: "John", age: 25}

## Examples:
\`\`\`javascript
let age = 25;           // Number
let name = "Alice";     // String
let isStudent = true;   // Boolean
let grades = [85, 90, 78]; // Array
\`\`\``
      },
      {
        id: "2",
        title: "Control Structures - If/Else",
        description: "Make decisions in your code with conditional statements",
        type: "theory",
        duration: 30,
        isCompleted: false,
        content: `# Control Structures - If/Else

## Making Decisions in Code
Control structures allow your program to make decisions based on different conditions.

## If Statement:
\`\`\`javascript
if (age >= 18) {
    console.log("You are an adult");
}
\`\`\`

## If/Else Statement:
\`\`\`javascript
if (score >= 70) {
    console.log("You passed!");
} else {
    console.log("Try again");
}
\`\`\`

## If/Else If/Else:
\`\`\`javascript
if (grade >= 90) {
    console.log("A");
} else if (grade >= 80) {
    console.log("B");
} else {
    console.log("C or below");
}
\`\`\``
      },
      {
        id: "3",
        title: "Loops - For and While",
        description: "Repeat actions efficiently with loop structures",
        type: "theory",
        duration: 40,
        isCompleted: false,
        content: `# Loops - For and While

## For Loops
Use for loops when you know how many times you want to repeat something:

\`\`\`javascript
for (let i = 0; i < 5; i++) {
    console.log("Count: " + i);
}
\`\`\`

## While Loops
Use while loops when you want to repeat something until a condition is false:

\`\`\`javascript
let count = 0;
while (count < 5) {
    console.log("Count: " + count);
    count++;
}
\`\`\`

## Array Loops
\`\`\`javascript
let fruits = ["apple", "banana", "orange"];
for (let fruit of fruits) {
    console.log(fruit);
}
\`\`\``
      },
      {
        id: "4",
        title: "Functions Basics",
        description: "Create reusable blocks of code with functions",
        type: "theory",
        duration: 50,
        isCompleted: false,
        content: `# Functions Basics

## What are Functions?
Functions are reusable blocks of code that perform specific tasks.

## Function Declaration:
\`\`\`javascript
function greet(name) {
    return "Hello, " + name + "!";
}
\`\`\`

## Function with Parameters:
\`\`\`javascript
function add(a, b) {
    return a + b;
}

let result = add(5, 3); // returns 8
\`\`\`

## Arrow Functions (Modern JavaScript):
\`\`\`javascript
const multiply = (a, b) => {
    return a * b;
};

// Or shorter:
const multiply = (a, b) => a * b;
\`\`\``
      },
      {
        id: "5",
        title: "Build a Calculator Project",
        description: "Apply your knowledge to create a working calculator",
        type: "project",
        duration: 240,
        isCompleted: false,
        content: `# Calculator Project

## Project Goals:
Create a simple calculator that can perform basic arithmetic operations.

## Requirements:
1. Add, subtract, multiply, and divide functions
2. Input validation
3. Clear functionality
4. Display results

## Starter Code:
\`\`\`html
<!DOCTYPE html>
<html>
<head>
    <title>Calculator</title>
</head>
<body>
    <div id="calculator">
        <input type="text" id="display" readonly>
        <div>
            <button onclick="clearDisplay()">C</button>
            <button onclick="appendToDisplay('/')">/</button>
            <button onclick="appendToDisplay('*')">*</button>
            <button onclick="deleteLast()">←</button>
        </div>
        <!-- Add more buttons for numbers and operations -->
    </div>

    <script>
        function appendToDisplay(value) {
            document.getElementById('display').value += value;
        }
        
        function clearDisplay() {
            document.getElementById('display').value = '';
        }
        
        function calculate() {
            try {
                let result = eval(document.getElementById('display').value);
                document.getElementById('display').value = result;
            } catch (error) {
                document.getElementById('display').value = 'Error';
            }
        }
    </script>
</body>
</html>
\`\`\`

## Next Steps:
1. Complete the button layout
2. Add CSS styling
3. Implement keyboard support
4. Add more advanced operations`
      }
    ],
    "Data Structures Mastery": [
      {
        id: "1",
        title: "Arrays and Dynamic Arrays",
        description: "Master the fundamental data structure for storing collections",
        type: "theory",
        duration: 60,
        isCompleted: false,
        content: `# Arrays and Dynamic Arrays

## What are Arrays?
Arrays are collections of elements stored at contiguous memory locations.

## Static vs Dynamic Arrays:
- **Static**: Fixed size at compile time
- **Dynamic**: Can grow or shrink during runtime

## JavaScript Arrays (Dynamic by default):
\`\`\`javascript
let numbers = [1, 2, 3, 4, 5];
numbers.push(6);        // Add to end
numbers.pop();          // Remove from end
numbers.unshift(0);     // Add to beginning
numbers.shift();        // Remove from beginning
\`\`\`

## Common Operations:
- Access: O(1)
- Search: O(n)
- Insertion: O(1) at end, O(n) at beginning
- Deletion: O(1) at end, O(n) at beginning

## Array Methods:
\`\`\`javascript
let arr = [1, 2, 3, 4, 5];
arr.map(x => x * 2);     // [2, 4, 6, 8, 10]
arr.filter(x => x > 2);  // [3, 4, 5]
arr.reduce((sum, x) => sum + x, 0); // 15
\`\`\``
      },
      {
        id: "2",
        title: "Linked Lists Implementation",
        description: "Build linked lists from scratch and understand pointer manipulation",
        type: "practice",
        duration: 90,
        isCompleted: false,
        content: `# Linked Lists Implementation

## Node Structure:
\`\`\`javascript
class ListNode {
    constructor(val, next = null) {
        this.val = val;
        this.next = next;
    }
}
\`\`\`

## Singly Linked List:
\`\`\`javascript
class LinkedList {
    constructor() {
        this.head = null;
        this.size = 0;
    }
    
    append(val) {
        const newNode = new ListNode(val);
        if (!this.head) {
            this.head = newNode;
        } else {
            let current = this.head;
            while (current.next) {
                current = current.next;
            }
            current.next = newNode;
        }
        this.size++;
    }
    
    prepend(val) {
        const newNode = new ListNode(val, this.head);
        this.head = newNode;
        this.size++;
    }
    
    delete(val) {
        if (!this.head) return false;
        
        if (this.head.val === val) {
            this.head = this.head.next;
            this.size--;
            return true;
        }
        
        let current = this.head;
        while (current.next && current.next.val !== val) {
            current = current.next;
        }
        
        if (current.next) {
            current.next = current.next.next;
            this.size--;
            return true;
        }
        return false;
    }
}
\`\`\``
      }
    ],
    "JavaScript Fundamentals": [
      {
        id: "1",
        title: "Modern JavaScript Features (ES6+)",
        description: "Learn the latest JavaScript features and syntax",
        type: "theory",
        duration: 75,
        isCompleted: false,
        content: `# Modern JavaScript Features (ES6+)

## Arrow Functions:
\`\`\`javascript
// Traditional function
function add(a, b) {
    return a + b;
}

// Arrow function
const add = (a, b) => a + b;
\`\`\`

## Destructuring:
\`\`\`javascript
// Array destructuring
const [first, second] = [1, 2, 3];

// Object destructuring
const {name, age} = {name: "John", age: 25, city: "NYC"};
\`\`\`

## Template Literals:
\`\`\`javascript
const name = "Alice";
const age = 30;
console.log(\`Hello, my name is \${name} and I'm \${age} years old.\`);
\`\`\`

## Async/Await:
\`\`\`javascript
async function fetchData() {
    try {
        const response = await fetch('/api/data');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error:', error);
    }
}
\`\`\``
      }
    ]
  };

  return contentMap[pathTitle] || [];
};

export default function LearningPathDetail() {
  const { user } = useAuth();
  const params = useParams();
  const pathId = params.id;
  const [activeLesson, setActiveLesson] = useState<string | null>(null);

  const { data: learningPath, isLoading } = useQuery<LearningPath>({
    queryKey: [`/api/learning-paths/${pathId}`],
    enabled: !!user && !!pathId,
  });

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Please log in to access learning paths</h1>
          <Button onClick={() => window.location.href = "/login"}>Go to Login</Button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-muted-foreground">Loading learning path...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!learningPath) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center">
              <h1 className="text-2xl font-bold mb-4">Learning Path Not Found</h1>
              <Button onClick={() => window.location.href = "/learning"}>
                Back to Learning Paths
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const lessons = getLearningContent(learningPath.title);
  const completedLessons = lessons.filter(lesson => lesson.isCompleted).length;
  const progressPercentage = lessons.length > 0 ? (completedLessons / lessons.length) * 100 : 0;

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'beginner':
        return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200';
      case 'intermediate':
        return 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200';
      case 'advanced':
        return 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200';
      default:
        return 'bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'theory':
        return <BookOpen className="w-4 h-4" />;
      case 'practice':
        return <Code className="w-4 h-4" />;
      case 'project':
        return <Target className="w-4 h-4" />;
      case 'quiz':
        return <Brain className="w-4 h-4" />;
      default:
        return <BookOpen className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <Button 
              variant="outline" 
              onClick={() => window.location.href = "/learning"}
              className="mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Learning Paths
            </Button>
          </div>

          {/* Learning Path Header */}
          <div className="mb-8">
            <div className="flex items-start gap-6 mb-6">
              <div className="text-4xl">{learningPath.icon}</div>
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-foreground mb-2">{learningPath.title}</h1>
                <p className="text-muted-foreground text-lg mb-4">{learningPath.description}</p>
                <div className="flex items-center gap-4 mb-4">
                  <Badge className={getDifficultyColor(learningPath.difficulty)}>
                    {learningPath.difficulty}
                  </Badge>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <BookOpen className="w-4 h-4" />
                    <span>{learningPath.lessons} lessons</span>
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>{learningPath.duration}</span>
                  </div>
                </div>
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Progress</span>
                    <span className="text-sm text-muted-foreground">
                      {completedLessons} of {lessons.length} lessons completed
                    </span>
                  </div>
                  <Progress value={progressPercentage} className="h-2" />
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Lessons List */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Lessons</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="space-y-1">
                    {lessons.map((lesson, index) => (
                      <div
                        key={lesson.id}
                        className={`p-4 cursor-pointer hover:bg-muted/50 transition-colors border-l-4 ${
                          activeLesson === lesson.id
                            ? 'border-l-primary bg-muted/50'
                            : 'border-l-transparent'
                        }`}
                        onClick={() => setActiveLesson(lesson.id)}
                      >
                        <div className="flex items-start gap-3">
                          {lesson.isCompleted ? (
                            <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                          ) : (
                            <div className="w-5 h-5 border-2 border-muted-foreground rounded-full mt-0.5" />
                          )}
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              {getTypeIcon(lesson.type)}
                              <h4 className="font-medium text-sm">{lesson.title}</h4>
                            </div>
                            <p className="text-xs text-muted-foreground mb-1">
                              {lesson.description}
                            </p>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Clock className="w-3 h-3" />
                              <span>{lesson.duration} min</span>
                              <Badge variant="outline" className="text-xs">
                                {lesson.type}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Lesson Content */}
            <div className="lg:col-span-2">
              {activeLesson ? (
                <Card>
                  <CardContent className="p-6">
                    {(() => {
                      const lesson = lessons.find(l => l.id === activeLesson);
                      if (!lesson) return null;
                      
                      return (
                        <div>
                          <div className="flex items-center gap-2 mb-4">
                            {getTypeIcon(lesson.type)}
                            <h2 className="text-xl font-semibold">{lesson.title}</h2>
                            <Badge variant="outline">{lesson.type}</Badge>
                          </div>
                          <div className="prose dark:prose-invert max-w-none">
                            <div dangerouslySetInnerHTML={{ 
                              __html: lesson.content.replace(/```(\w+)?\n([\s\S]*?)\n```/g, 
                                '<pre class="bg-muted p-4 rounded-lg overflow-x-auto"><code>$2</code></pre>'
                              ).replace(/`([^`]+)`/g, '<code class="bg-muted px-1 rounded">$1</code>')
                              .replace(/\n/g, '<br>')
                            }} />
                          </div>
                          <div className="mt-6 pt-6 border-t">
                            <Button className="w-full">
                              {lesson.isCompleted ? 'Review Lesson' : 'Mark as Complete'}
                            </Button>
                          </div>
                        </div>
                      );
                    })()}
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="p-12 text-center">
                    <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Select a Lesson</h3>
                    <p className="text-muted-foreground">
                      Choose a lesson from the left sidebar to start learning
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}