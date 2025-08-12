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
  },
  {
    id: "c-basics-quiz",
    title: "C Programming Fundamentals",
    description: "Test your knowledge of C language basics including pointers, memory management, and data types",
    language: "C",
    timeLimit: 18,
    questions: [
      {
        id: "c-q1",
        question: "What is the correct way to declare a pointer to an integer in C?",
        options: [
          "int ptr;",
          "int *ptr;",
          "pointer int ptr;",
          "int &ptr;"
        ],
        correctAnswer: 1,
        explanation: "In C, pointers are declared using the asterisk (*) operator. 'int *ptr;' declares a pointer to an integer.",
        difficulty: "Easy",
        topic: "Pointers",
        language: "C"
      },
      {
        id: "c-q2",
        question: "Which function is used to allocate memory dynamically in C?",
        options: [
          "alloc()",
          "malloc()",
          "new()",
          "memory()"
        ],
        correctAnswer: 1,
        explanation: "malloc() (memory allocation) is the standard library function used to allocate memory dynamically in C.",
        difficulty: "Medium",
        topic: "Memory Management",
        language: "C"
      },
      {
        id: "c-q3",
        question: "What is the size of 'int' data type in C (on most 32-bit systems)?",
        options: [
          "2 bytes",
          "4 bytes",
          "8 bytes",
          "1 byte"
        ],
        correctAnswer: 1,
        explanation: "On most 32-bit systems, the 'int' data type is 4 bytes (32 bits) in size.",
        difficulty: "Easy",
        topic: "Data Types",
        language: "C"
      },
      {
        id: "c-q4",
        question: "What does the 'static' keyword do when used with a variable in C?",
        options: [
          "Makes the variable constant",
          "Allocates memory on the heap",
          "Preserves the variable's value between function calls",
          "Makes the variable global"
        ],
        correctAnswer: 2,
        explanation: "The 'static' keyword preserves a variable's value between function calls by storing it in the data segment instead of the stack.",
        difficulty: "Medium",
        topic: "Storage Classes",
        language: "C"
      },
      {
        id: "c-q5",
        question: "Which header file must be included to use printf() function?",
        options: [
          "<iostream>",
          "<stdio.h>",
          "<stdlib.h>",
          "<string.h>"
        ],
        correctAnswer: 1,
        explanation: "The <stdio.h> header file contains declarations for standard input/output functions including printf().",
        difficulty: "Easy",
        topic: "Headers",
        language: "C"
      }
    ],
    createdAt: new Date(),
  },
  {
    id: "cpp-basics-quiz",
    title: "C++ Programming Fundamentals",
    description: "Test your understanding of C++ features including classes, objects, and object-oriented programming",
    language: "C++",
    timeLimit: 20,
    questions: [
      {
        id: "cpp-q1",
        question: "What is the correct way to define a class in C++?",
        options: [
          "class MyClass { };",
          "Class MyClass { };",
          "define class MyClass { };",
          "struct class MyClass { };"
        ],
        correctAnswer: 0,
        explanation: "Classes in C++ are defined using the 'class' keyword followed by the class name and body enclosed in braces.",
        difficulty: "Easy",
        topic: "Classes",
        language: "C++"
      },
      {
        id: "cpp-q2",
        question: "Which operator is used for dynamic memory allocation in C++?",
        options: [
          "malloc",
          "alloc",
          "new",
          "create"
        ],
        correctAnswer: 2,
        explanation: "The 'new' operator is used for dynamic memory allocation in C++, while 'delete' is used to free the memory.",
        difficulty: "Medium",
        topic: "Memory Management",
        language: "C++"
      },
      {
        id: "cpp-q3",
        question: "What is function overloading in C++?",
        options: [
          "Calling a function multiple times",
          "Having multiple functions with the same name but different parameters",
          "A function that calls itself",
          "A function with no return type"
        ],
        correctAnswer: 1,
        explanation: "Function overloading allows multiple functions to have the same name but different parameter lists (different number or types of parameters).",
        difficulty: "Medium",
        topic: "Functions",
        language: "C++"
      },
      {
        id: "cpp-q4",
        question: "Which access specifier makes class members accessible only within the class?",
        options: [
          "public",
          "protected",
          "private",
          "internal"
        ],
        correctAnswer: 2,
        explanation: "The 'private' access specifier restricts access to class members only within the class itself.",
        difficulty: "Easy",
        topic: "Access Specifiers",
        language: "C++"
      },
      {
        id: "cpp-q5",
        question: "What is a constructor in C++?",
        options: [
          "A function that destroys objects",
          "A special function called when an object is created",
          "A function that copies objects",
          "A function that compares objects"
        ],
        correctAnswer: 1,
        explanation: "A constructor is a special member function that is automatically called when an object of the class is created. It typically initializes the object's data members.",
        difficulty: "Medium",
        topic: "Constructors",
        language: "C++"
      }
    ],
    createdAt: new Date(),
  },
  {
    id: "java-basics-quiz",
    title: "Java Programming Fundamentals",
    description: "Test your knowledge of Java basics including OOP concepts, inheritance, and Java-specific features",
    language: "Java",
    timeLimit: 22,
    questions: [
      {
        id: "java-q1",
        question: "Which keyword is used to inherit a class in Java?",
        options: [
          "inherits",
          "extends",
          "implements",
          "super"
        ],
        correctAnswer: 1,
        explanation: "The 'extends' keyword is used in Java to inherit from a class, establishing an 'is-a' relationship.",
        difficulty: "Easy",
        topic: "Inheritance",
        language: "Java"
      },
      {
        id: "java-q2",
        question: "What is the correct way to declare a constant in Java?",
        options: [
          "const int VALUE = 10;",
          "final int VALUE = 10;",
          "static int VALUE = 10;",
          "readonly int VALUE = 10;"
        ],
        correctAnswer: 1,
        explanation: "In Java, constants are declared using the 'final' keyword. 'const' is a reserved word but not used.",
        difficulty: "Medium",
        topic: "Variables",
        language: "Java"
      },
      {
        id: "java-q3",
        question: "Which method is called when an object is created in Java?",
        options: [
          "initializer()",
          "constructor()",
          "create()",
          "The constructor method"
        ],
        correctAnswer: 3,
        explanation: "The constructor method (with the same name as the class) is automatically called when an object is instantiated in Java.",
        difficulty: "Easy",
        topic: "Constructors",
        language: "Java"
      },
      {
        id: "java-q4",
        question: "What does the 'static' keyword mean in Java?",
        options: [
          "The variable cannot be changed",
          "The method or variable belongs to the class rather than instances",
          "The method cannot be overridden",
          "The variable is private"
        ],
        correctAnswer: 1,
        explanation: "The 'static' keyword means the method or variable belongs to the class itself, not to any specific instance of the class.",
        difficulty: "Medium",
        topic: "Keywords",
        language: "Java"
      },
      {
        id: "java-q5",
        question: "Which of these is NOT a primitive data type in Java?",
        options: [
          "int",
          "boolean",
          "String",
          "char"
        ],
        correctAnswer: 2,
        explanation: "String is not a primitive data type in Java; it's a class. The primitive types are byte, short, int, long, float, double, boolean, and char.",
        difficulty: "Easy",
        topic: "Data Types",
        language: "Java"
      }
    ],
    createdAt: new Date(),
  },
  {
    id: "php-basics-quiz",
    title: "PHP Programming Fundamentals",
    description: "Test your understanding of PHP syntax, variables, functions, and web development concepts",
    language: "PHP",
    timeLimit: 18,
    questions: [
      {
        id: "php-q1",
        question: "How do you declare a variable in PHP?",
        options: [
          "var $variable;",
          "$variable;",
          "declare $variable;",
          "variable $name;"
        ],
        correctAnswer: 1,
        explanation: "In PHP, variables are declared by simply using the dollar sign ($) followed by the variable name.",
        difficulty: "Easy",
        topic: "Variables",
        language: "PHP"
      },
      {
        id: "php-q2",
        question: "Which of the following is the correct way to start a PHP script?",
        options: [
          "<script>",
          "<?php",
          "<php>",
          "<?>"
        ],
        correctAnswer: 1,
        explanation: "PHP scripts start with the opening tag '<?php' and can end with the closing tag '?>' (though the closing tag is optional at the end of a file).",
        difficulty: "Easy",
        topic: "Syntax",
        language: "PHP"
      },
      {
        id: "php-q3",
        question: "What does the '.' operator do in PHP?",
        options: [
          "Addition",
          "String concatenation",
          "Object property access",
          "Array access"
        ],
        correctAnswer: 1,
        explanation: "The dot (.) operator in PHP is used for string concatenation, combining two or more strings together.",
        difficulty: "Medium",
        topic: "Operators",
        language: "PHP"
      },
      {
        id: "php-q4",
        question: "Which superglobal array contains data sent via HTTP POST method?",
        options: [
          "$_GET",
          "$_POST",
          "$_REQUEST",
          "$_SESSION"
        ],
        correctAnswer: 1,
        explanation: "$_POST is a superglobal array that contains data sent to the script via the HTTP POST method.",
        difficulty: "Medium",
        topic: "Superglobals",
        language: "PHP"
      },
      {
        id: "php-q5",
        question: "How do you output text in PHP?",
        options: [
          "print_r()",
          "console.log()",
          "echo or print",
          "printf()"
        ],
        correctAnswer: 2,
        explanation: "In PHP, you can output text using 'echo' or 'print' statements. 'echo' is more commonly used and can output multiple parameters.",
        difficulty: "Easy",
        topic: "Output",
        language: "PHP"
      }
    ],
    createdAt: new Date(),
  },
  {
    id: "typescript-basics-quiz",
    title: "TypeScript Programming Fundamentals",
    description: "Test your knowledge of TypeScript features including types, interfaces, and advanced typing concepts",
    language: "TypeScript",
    timeLimit: 20,
    questions: [
      {
        id: "ts-q1",
        question: "What is the main advantage of TypeScript over JavaScript?",
        options: [
          "Faster execution",
          "Static type checking",
          "Smaller file size",
          "Better browser compatibility"
        ],
        correctAnswer: 1,
        explanation: "TypeScript's main advantage is static type checking, which helps catch errors at compile time rather than runtime.",
        difficulty: "Easy",
        topic: "Types",
        language: "TypeScript"
      },
      {
        id: "ts-q2",
        question: "How do you define an interface in TypeScript?",
        options: [
          "interface MyInterface { }",
          "define interface MyInterface { }",
          "type interface MyInterface { }",
          "class interface MyInterface { }"
        ],
        correctAnswer: 0,
        explanation: "Interfaces in TypeScript are defined using the 'interface' keyword followed by the interface name and body.",
        difficulty: "Easy",
        topic: "Interfaces",
        language: "TypeScript"
      },
      {
        id: "ts-q3",
        question: "What does the '?' symbol mean when used with object properties in TypeScript?",
        options: [
          "The property is required",
          "The property is optional",
          "The property is nullable",
          "The property is readonly"
        ],
        correctAnswer: 1,
        explanation: "The '?' symbol makes a property optional in TypeScript interfaces and object types, meaning it may or may not be present.",
        difficulty: "Medium",
        topic: "Optional Properties",
        language: "TypeScript"
      },
      {
        id: "ts-q4",
        question: "Which TypeScript feature allows you to create reusable code with type parameters?",
        options: [
          "Interfaces",
          "Generics",
          "Enums",
          "Modules"
        ],
        correctAnswer: 1,
        explanation: "Generics in TypeScript allow you to create reusable components and functions that work with multiple types while maintaining type safety.",
        difficulty: "Medium",
        topic: "Generics",
        language: "TypeScript"
      },
      {
        id: "ts-q5",
        question: "What is the 'any' type in TypeScript?",
        options: [
          "A type that represents any object",
          "A type that disables type checking for that variable",
          "A type for arrays only",
          "A type for functions only"
        ],
        correctAnswer: 1,
        explanation: "The 'any' type disables TypeScript's type checking for that variable, essentially making it behave like regular JavaScript.",
        difficulty: "Easy",
        topic: "Types",
        language: "TypeScript"
      }
    ],
    createdAt: new Date(),
  },
  {
    id: "go-basics-quiz",
    title: "Go Programming Fundamentals",
    description: "Test your understanding of Go language features including goroutines, channels, and Go-specific syntax",
    language: "Go",
    timeLimit: 20,
    questions: [
      {
        id: "go-q1",
        question: "How do you declare a variable in Go?",
        options: [
          "var name string",
          "string name",
          "declare name string",
          "name := string"
        ],
        correctAnswer: 0,
        explanation: "In Go, variables are declared using 'var' followed by the variable name and type, or using short declaration ':=' for type inference.",
        difficulty: "Easy",
        topic: "Variables",
        language: "Go"
      },
      {
        id: "go-q2",
        question: "What is a goroutine in Go?",
        options: [
          "A type of loop",
          "A lightweight thread managed by Go runtime",
          "A function parameter",
          "A package manager"
        ],
        correctAnswer: 1,
        explanation: "A goroutine is a lightweight thread managed by the Go runtime, enabling concurrent execution of functions.",
        difficulty: "Medium",
        topic: "Concurrency",
        language: "Go"
      },
      {
        id: "go-q3",
        question: "Which keyword is used to start a goroutine?",
        options: [
          "async",
          "go",
          "thread",
          "concurrent"
        ],
        correctAnswer: 1,
        explanation: "The 'go' keyword is used to start a goroutine, which runs the function concurrently.",
        difficulty: "Easy",
        topic: "Concurrency",
        language: "Go"
      },
      {
        id: "go-q4",
        question: "What are channels used for in Go?",
        options: [
          "Error handling",
          "Memory management",
          "Communication between goroutines",
          "Package imports"
        ],
        correctAnswer: 2,
        explanation: "Channels in Go are used for communication between goroutines, allowing them to send and receive values safely.",
        difficulty: "Medium",
        topic: "Channels",
        language: "Go"
      },
      {
        id: "go-q5",
        question: "How do you handle multiple return values in Go?",
        options: [
          "Using arrays",
          "Using structs only",
          "Multiple assignment with comma",
          "Using pointers"
        ],
        correctAnswer: 2,
        explanation: "Go functions can return multiple values, which are handled using multiple assignment with comma separation: 'result, err := function()'.",
        difficulty: "Medium",
        topic: "Functions",
        language: "Go"
      }
    ],
    createdAt: new Date(),
  },
  {
    id: "ruby-basics-quiz",
    title: "Ruby Programming Fundamentals",
    description: "Test your knowledge of Ruby syntax, object-oriented features, and Ruby-specific conventions",
    language: "Ruby",
    timeLimit: 18,
    questions: [
      {
        id: "ruby-q1",
        question: "How do you define a method in Ruby?",
        options: [
          "function method_name",
          "def method_name",
          "method method_name",
          "define method_name"
        ],
        correctAnswer: 1,
        explanation: "In Ruby, methods are defined using the 'def' keyword followed by the method name, and end with the 'end' keyword.",
        difficulty: "Easy",
        topic: "Methods",
        language: "Ruby"
      },
      {
        id: "ruby-q2",
        question: "What is the difference between a symbol and a string in Ruby?",
        options: [
          "Symbols are mutable, strings are immutable",
          "Symbols are immutable, strings are mutable",
          "There is no difference",
          "Symbols can only contain numbers"
        ],
        correctAnswer: 1,
        explanation: "Symbols in Ruby are immutable and are typically used as identifiers, while strings are mutable objects that can be changed.",
        difficulty: "Medium",
        topic: "Data Types",
        language: "Ruby"
      },
      {
        id: "ruby-q3",
        question: "Which method is used to iterate over an array in Ruby?",
        options: [
          "for",
          "foreach",
          "each",
          "iterate"
        ],
        correctAnswer: 2,
        explanation: "The 'each' method is the idiomatic way to iterate over arrays and other enumerable objects in Ruby.",
        difficulty: "Easy",
        topic: "Iteration",
        language: "Ruby"
      },
      {
        id: "ruby-q4",
        question: "What does the '||=' operator do in Ruby?",
        options: [
          "Logical OR",
          "Assignment if the variable is nil or false",
          "String concatenation",
          "Array concatenation"
        ],
        correctAnswer: 1,
        explanation: "The '||=' operator assigns a value to a variable only if the variable is currently nil or false, providing a default value.",
        difficulty: "Medium",
        topic: "Operators",
        language: "Ruby"
      },
      {
        id: "ruby-q5",
        question: "How do you create a class in Ruby?",
        options: [
          "class ClassName end",
          "Class ClassName End",
          "define class ClassName",
          "create class ClassName"
        ],
        correctAnswer: 0,
        explanation: "Classes in Ruby are defined using the 'class' keyword followed by the class name (in CamelCase) and terminated with 'end'.",
        difficulty: "Easy",
        topic: "Classes",
        language: "Ruby"
      }
    ],
    createdAt: new Date(),
  },
  {
    id: "kotlin-basics-quiz",
    title: "Kotlin Programming Fundamentals",
    description: "Test your understanding of Kotlin features including null safety, data classes, and modern language features",
    language: "Kotlin",
    timeLimit: 20,
    questions: [
      {
        id: "kotlin-q1",
        question: "How do you declare a nullable variable in Kotlin?",
        options: [
          "var name: String",
          "var name: String?",
          "var name: String nullable",
          "var name: nullable String"
        ],
        correctAnswer: 1,
        explanation: "In Kotlin, nullable types are declared by adding a '?' after the type name, indicating the variable can hold null values.",
        difficulty: "Easy",
        topic: "Null Safety",
        language: "Kotlin"
      },
      {
        id: "kotlin-q2",
        question: "What is the difference between 'val' and 'var' in Kotlin?",
        options: [
          "val is for integers, var is for strings",
          "val is immutable (read-only), var is mutable",
          "val is public, var is private",
          "There is no difference"
        ],
        correctAnswer: 1,
        explanation: "'val' declares a read-only (immutable) variable that can only be assigned once, while 'var' declares a mutable variable that can be reassigned.",
        difficulty: "Easy",
        topic: "Variables",
        language: "Kotlin"
      },
      {
        id: "kotlin-q3",
        question: "What is a data class in Kotlin?",
        options: [
          "A class that can only hold data types",
          "A class automatically generated with equals, hashCode, and toString methods",
          "A class for database operations",
          "A class that cannot be inherited"
        ],
        correctAnswer: 1,
        explanation: "Data classes in Kotlin automatically generate useful methods like equals(), hashCode(), toString(), and copy() based on the properties declared in the primary constructor.",
        difficulty: "Medium",
        topic: "Data Classes",
        language: "Kotlin"
      },
      {
        id: "kotlin-q4",
        question: "Which operator is used for safe calls in Kotlin?",
        options: [
          "?.",
          "!!",
          "?:",
          "?!"
        ],
        correctAnswer: 0,
        explanation: "The safe call operator '?.' allows you to call methods or access properties on nullable objects safely, returning null if the object is null.",
        difficulty: "Medium",
        topic: "Null Safety",
        language: "Kotlin"
      },
      {
        id: "kotlin-q5",
        question: "How do you define a function in Kotlin?",
        options: [
          "function myFunction()",
          "fun myFunction()",
          "def myFunction()",
          "func myFunction()"
        ],
        correctAnswer: 1,
        explanation: "Functions in Kotlin are defined using the 'fun' keyword followed by the function name and parameters.",
        difficulty: "Easy",
        topic: "Functions",
        language: "Kotlin"
      }
    ],
    createdAt: new Date(),
  }
];