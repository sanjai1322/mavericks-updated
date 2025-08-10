// Quiz schema for programming language quizzes
export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: "Easy" | "Medium" | "Hard";
  topic: string;
  language: string;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  language: string;
  questions: QuizQuestion[];
  timeLimit: number; // in minutes
  createdAt: Date;
}

export interface QuizSubmission {
  id: string;
  userId: string;
  quizId: string;
  answers: number[];
  score: number;
  timeSpent: number;
  submittedAt: Date;
}

// Sample quiz data
export const sampleQuizzes: Quiz[] = [
  {
    id: "javascript-basics-quiz",
    title: "JavaScript Fundamentals",
    description: "Test your knowledge of JavaScript basics including variables, functions, and data types",
    language: "JavaScript",
    timeLimit: 15,
    questions: [
      {
        id: "js-q1",
        question: "What is the correct way to declare a variable in JavaScript?",
        options: [
          "variable myVar = 5;",
          "var myVar = 5;",
          "declare myVar = 5;",
          "int myVar = 5;"
        ],
        correctAnswer: 1,
        explanation: "In JavaScript, variables are declared using 'var', 'let', or 'const' keywords.",
        difficulty: "Easy",
        topic: "Variables",
        language: "JavaScript"
      },
      {
        id: "js-q2",
        question: "Which of the following is NOT a primitive data type in JavaScript?",
        options: [
          "string",
          "boolean",
          "array",
          "number"
        ],
        correctAnswer: 2,
        explanation: "Arrays are objects in JavaScript, not primitive data types. The primitive types are: string, number, boolean, null, undefined, symbol, and bigint.",
        difficulty: "Easy",
        topic: "Data Types",
        language: "JavaScript"
      },
      {
        id: "js-q3",
        question: "What does the '===' operator do in JavaScript?",
        options: [
          "Assigns a value",
          "Compares values with type coercion",
          "Compares values without type coercion",
          "Checks if a variable is defined"
        ],
        correctAnswer: 2,
        explanation: "The '===' operator performs strict equality comparison without type coercion, while '==' performs loose equality with type coercion.",
        difficulty: "Medium",
        topic: "Operators",
        language: "JavaScript"
      },
      {
        id: "js-q4",
        question: "What will console.log(typeof null) output?",
        options: [
          "'null'",
          "'undefined'",
          "'object'",
          "'boolean'"
        ],
        correctAnswer: 2,
        explanation: "This is a well-known bug in JavaScript. typeof null returns 'object' instead of 'null'.",
        difficulty: "Medium",
        topic: "Data Types",
        language: "JavaScript"
      },
      {
        id: "js-q5",
        question: "Which method is used to add an element to the end of an array?",
        options: [
          "array.add()",
          "array.append()",
          "array.push()",
          "array.insert()"
        ],
        correctAnswer: 2,
        explanation: "The push() method adds one or more elements to the end of an array and returns the new length of the array.",
        difficulty: "Easy",
        topic: "Arrays",
        language: "JavaScript"
      }
    ],
    createdAt: new Date(),
  },
  {
    id: "python-basics-quiz",
    title: "Python Fundamentals",
    description: "Test your understanding of Python syntax, data structures, and basic programming concepts",
    language: "Python",
    timeLimit: 20,
    questions: [
      {
        id: "py-q1",
        question: "What is the correct way to create a list in Python?",
        options: [
          "list = {1, 2, 3}",
          "list = [1, 2, 3]",
          "list = (1, 2, 3)",
          "list = <1, 2, 3>"
        ],
        correctAnswer: 1,
        explanation: "Lists in Python are created using square brackets [].",
        difficulty: "Easy",
        topic: "Data Structures",
        language: "Python"
      },
      {
        id: "py-q2",
        question: "Which keyword is used to define a function in Python?",
        options: [
          "function",
          "def",
          "func",
          "define"
        ],
        correctAnswer: 1,
        explanation: "The 'def' keyword is used to define functions in Python.",
        difficulty: "Easy",
        topic: "Functions",
        language: "Python"
      },
      {
        id: "py-q3",
        question: "What does the len() function return when applied to a string?",
        options: [
          "The memory size of the string",
          "The number of words in the string",
          "The number of characters in the string",
          "The ASCII value of the first character"
        ],
        correctAnswer: 2,
        explanation: "The len() function returns the number of characters (including spaces and special characters) in a string.",
        difficulty: "Easy",
        topic: "Strings",
        language: "Python"
      },
      {
        id: "py-q4",
        question: "What is the difference between a list and a tuple in Python?",
        options: [
          "Lists are immutable, tuples are mutable",
          "Lists are mutable, tuples are immutable",
          "There is no difference",
          "Lists store numbers, tuples store strings"
        ],
        correctAnswer: 1,
        explanation: "Lists are mutable (can be changed after creation) while tuples are immutable (cannot be changed after creation).",
        difficulty: "Medium",
        topic: "Data Structures",
        language: "Python"
      },
      {
        id: "py-q5",
        question: "What will 'print(2 ** 3)' output?",
        options: [
          "5",
          "6",
          "8",
          "9"
        ],
        correctAnswer: 2,
        explanation: "The ** operator in Python is used for exponentiation. 2 ** 3 means 2 to the power of 3, which equals 8.",
        difficulty: "Easy",
        topic: "Operators",
        language: "Python"
      }
    ],
    createdAt: new Date(),
  }
];