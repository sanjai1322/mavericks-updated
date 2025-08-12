// Comprehensive quiz database for multiple programming languages
import { Quiz, QuizQuestion } from './quiz-schema';

// JavaScript Quizzes
export const javascriptQuizzes: Quiz[] = [
  {
    id: "javascript-fundamentals",
    title: "JavaScript Fundamentals",
    description: "Core JavaScript concepts including variables, functions, and data types",
    language: "JavaScript",
    timeLimit: 30,
    createdAt: new Date(),
    questions: [
      {
        id: "js-fund-1",
        question: "What is the correct way to declare a block-scoped variable in modern JavaScript?",
        options: ["var name = 'John';", "let name = 'John';", "const name = 'John';", "Both let and const"],
        correctAnswer: 3,
        explanation: "Both 'let' and 'const' are block-scoped. Use 'const' for values that won't change, 'let' for variables that will be reassigned.",
        difficulty: "Easy",
        topic: "Variables",
        language: "JavaScript"
      },
      {
        id: "js-fund-2",
        question: "Which method converts a string to a number in JavaScript?",
        options: ["parseInt()", "Number()", "parseFloat()", "All of the above"],
        correctAnswer: 3,
        explanation: "parseInt() converts to integer, parseFloat() converts to floating-point number, and Number() converts to number type.",
        difficulty: "Easy",
        topic: "Type Conversion",
        language: "JavaScript"
      },
      {
        id: "js-fund-3",
        question: "What is the output of: console.log(typeof [])?",
        options: ["'array'", "'object'", "'undefined'", "'boolean'"],
        correctAnswer: 1,
        explanation: "Arrays are objects in JavaScript, so typeof [] returns 'object'.",
        difficulty: "Medium",
        topic: "Data Types",
        language: "JavaScript"
      },
      {
        id: "js-fund-4",
        question: "What does the spread operator (...) do?",
        options: ["Creates a copy", "Expands iterables", "Merges objects", "All of the above"],
        correctAnswer: 3,
        explanation: "The spread operator can expand arrays/objects, create copies, and merge objects/arrays.",
        difficulty: "Medium",
        topic: "ES6 Features",
        language: "JavaScript"
      },
      {
        id: "js-fund-5",
        question: "What is a closure in JavaScript?",
        options: [
          "A function that returns another function",
          "A function that has access to outer scope variables",
          "A method to close browser windows",
          "A way to end loops"
        ],
        correctAnswer: 1,
        explanation: "A closure is when a function has access to variables from its outer (enclosing) scope even after the outer function has finished executing.",
        difficulty: "Hard",
        topic: "Advanced Concepts",
        language: "JavaScript"
      }
    ]
  }
];

// Python Quizzes
export const pythonQuizzes: Quiz[] = [
  {
    id: "python-fundamentals",
    title: "Python Fundamentals",
    description: "Essential Python concepts including syntax, data structures, and OOP",
    language: "Python",
    timeLimit: 35,
    createdAt: new Date(),
    questions: [
      {
        id: "py-fund-1",
        question: "Which of the following is the correct way to create a list in Python?",
        options: ["list = (1, 2, 3)", "list = [1, 2, 3]", "list = {1, 2, 3}", "list = <1, 2, 3>"],
        correctAnswer: 1,
        explanation: "Square brackets [] are used to create lists in Python. Parentheses create tuples, curly braces create sets or dictionaries.",
        difficulty: "Easy",
        topic: "Data Structures",
        language: "Python"
      },
      {
        id: "py-fund-2",
        question: "What is the output of: print(10 // 3)?",
        options: ["3.33", "3", "4", "3.0"],
        correctAnswer: 1,
        explanation: "The // operator performs floor division, returning the integer part of the division result.",
        difficulty: "Easy",
        topic: "Operators",
        language: "Python"
      },
      {
        id: "py-fund-3",
        question: "How do you create a dictionary in Python?",
        options: [
          "dict = ['key': 'value']",
          "dict = ('key': 'value')",
          "dict = {'key': 'value'}",
          "dict = <'key': 'value'>"
        ],
        correctAnswer: 2,
        explanation: "Dictionaries are created using curly braces {} with key-value pairs separated by colons.",
        difficulty: "Easy",
        topic: "Data Structures",
        language: "Python"
      },
      {
        id: "py-fund-4",
        question: "What is a list comprehension equivalent to [x*2 for x in range(5)]?",
        options: [
          "[0, 2, 4, 6, 8]",
          "[2, 4, 6, 8, 10]",
          "[1, 2, 3, 4, 5]",
          "[0, 1, 2, 3, 4]"
        ],
        correctAnswer: 0,
        explanation: "range(5) generates 0,1,2,3,4. Multiplying each by 2 gives [0,2,4,6,8].",
        difficulty: "Medium",
        topic: "List Comprehensions",
        language: "Python"
      },
      {
        id: "py-fund-5",
        question: "What is the difference between 'is' and '==' in Python?",
        options: [
          "'is' checks value, '==' checks identity",
          "'is' checks identity, '==' checks value",
          "They are the same",
          "'is' is for strings only"
        ],
        correctAnswer: 1,
        explanation: "'is' checks if two variables point to the same object (identity), while '==' checks if values are equal.",
        difficulty: "Medium",
        topic: "Comparisons",
        language: "Python"
      }
    ]
  }
];

// Java Quizzes
export const javaQuizzes: Quiz[] = [
  {
    id: "java-fundamentals",
    title: "Java Fundamentals",
    description: "Core Java concepts including OOP, data types, and basic syntax",
    language: "Java",
    timeLimit: 40,
    createdAt: new Date(),
    questions: [
      {
        id: "java-fund-1",
        question: "Which keyword is used to create a class in Java?",
        options: ["class", "Class", "new", "create"],
        correctAnswer: 0,
        explanation: "The 'class' keyword is used to define a class in Java.",
        difficulty: "Easy",
        topic: "Classes",
        language: "Java"
      },
      {
        id: "java-fund-2",
        question: "What is the correct way to declare a constant in Java?",
        options: [
          "const int MAX = 100;",
          "final int MAX = 100;",
          "static int MAX = 100;",
          "constant int MAX = 100;"
        ],
        correctAnswer: 1,
        explanation: "The 'final' keyword is used to declare constants in Java.",
        difficulty: "Easy",
        topic: "Variables",
        language: "Java"
      },
      {
        id: "java-fund-3",
        question: "Which access modifier makes a member accessible only within the same class?",
        options: ["public", "protected", "private", "default"],
        correctAnswer: 2,
        explanation: "The 'private' access modifier restricts access to within the same class only.",
        difficulty: "Easy",
        topic: "Access Modifiers",
        language: "Java"
      },
      {
        id: "java-fund-4",
        question: "What is method overloading in Java?",
        options: [
          "Same method name, different parameters",
          "Same method name, same parameters",
          "Different method names",
          "Methods in different classes"
        ],
        correctAnswer: 0,
        explanation: "Method overloading allows multiple methods with the same name but different parameter lists in the same class.",
        difficulty: "Medium",
        topic: "OOP",
        language: "Java"
      },
      {
        id: "java-fund-5",
        question: "What is the difference between abstract class and interface in Java 8+?",
        options: [
          "No difference",
          "Abstract classes can have constructors, interfaces cannot",
          "Interfaces can have default methods",
          "Both B and C"
        ],
        correctAnswer: 3,
        explanation: "Abstract classes can have constructors and concrete methods. Java 8+ interfaces can have default and static methods.",
        difficulty: "Hard",
        topic: "Advanced OOP",
        language: "Java"
      }
    ]
  }
];

// React Quizzes
export const reactQuizzes: Quiz[] = [
  {
    id: "react-fundamentals",
    title: "React Fundamentals",
    description: "Core React concepts including components, state, and lifecycle",
    language: "React",
    timeLimit: 35,
    createdAt: new Date(),
    questions: [
      {
        id: "react-fund-1",
        question: "What is JSX in React?",
        options: [
          "A new programming language",
          "JavaScript XML - syntax extension",
          "A database query language",
          "A CSS framework"
        ],
        correctAnswer: 1,
        explanation: "JSX is a syntax extension for JavaScript that allows you to write HTML-like code in JavaScript.",
        difficulty: "Easy",
        topic: "JSX",
        language: "React"
      },
      {
        id: "react-fund-2",
        question: "How do you pass data from parent to child component?",
        options: ["State", "Props", "Context", "Refs"],
        correctAnswer: 1,
        explanation: "Props are used to pass data from parent components to child components in React.",
        difficulty: "Easy",
        topic: "Props",
        language: "React"
      },
      {
        id: "react-fund-3",
        question: "What hook is used to manage component state in functional components?",
        options: ["useEffect", "useState", "useContext", "useReducer"],
        correctAnswer: 1,
        explanation: "useState is the hook used to add state to functional components.",
        difficulty: "Easy",
        topic: "Hooks",
        language: "React"
      },
      {
        id: "react-fund-4",
        question: "When does useEffect hook run?",
        options: [
          "Only on component mount",
          "Only on component unmount",
          "After every render by default",
          "Only when state changes"
        ],
        correctAnswer: 2,
        explanation: "useEffect runs after every render by default. You can control when it runs using the dependency array.",
        difficulty: "Medium",
        topic: "Hooks",
        language: "React"
      },
      {
        id: "react-fund-5",
        question: "What is the virtual DOM in React?",
        options: [
          "A copy of the real DOM kept in memory",
          "A new type of HTML",
          "A database for components",
          "A CSS framework"
        ],
        correctAnswer: 0,
        explanation: "Virtual DOM is a JavaScript representation of the real DOM kept in memory for efficient updates.",
        difficulty: "Medium",
        topic: "Virtual DOM",
        language: "React"
      }
    ]
  }
];

// Combine all quizzes
export const allQuizzes: Quiz[] = [
  ...javascriptQuizzes,
  ...pythonQuizzes,
  ...javaQuizzes,
  ...reactQuizzes
];

// Quiz categories for organization
export const quizCategories = [
  {
    id: "frontend",
    name: "Frontend Development",
    languages: ["JavaScript", "React", "Vue", "Angular"],
    color: "#3B82F6"
  },
  {
    id: "backend",
    name: "Backend Development", 
    languages: ["Python", "Java", "Node.js", "C#"],
    color: "#10B981"
  },
  {
    id: "mobile",
    name: "Mobile Development",
    languages: ["React Native", "Flutter", "Swift", "Kotlin"],
    color: "#F59E0B"
  },
  {
    id: "data",
    name: "Data Science",
    languages: ["Python", "R", "SQL"],
    color: "#8B5CF6"
  }
];