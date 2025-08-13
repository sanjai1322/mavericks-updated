import { Router } from "express";
import { storage } from "../storage";
import { verifyToken } from "./authController";
import type { Request, Response } from "express";
import { insertUserAssessmentSchema, type Judge0Language, type Judge0Submission, type Judge0Result } from "@shared/schema";
import fetch from "node-fetch";

const router = Router();

// Judge0 API configuration
const JUDGE0_API_URL = "https://judge0-ce.p.rapidapi.com";
const JUDGE0_API_KEY = process.env.RAPIDAPI_KEY || "demo-key"; // You can use demo or get a real API key

// Fallback skill extraction function
function extractSkillsFallback(code: string, language: string): string[] {
  const skills = [];
  
  // Language-specific patterns
  if (language === "Python") {
    if (code.includes("def ")) skills.push("function definition");
    if (code.includes("for ") || code.includes("while ")) skills.push("loops");
    if (code.includes("if ")) skills.push("conditionals");
    if (code.includes("[") && code.includes("for") && code.includes("in")) skills.push("list comprehension");
    if (code.includes("class ")) skills.push("object-oriented programming");
    if (code.includes("import ")) skills.push("module usage");
    if (code.includes("return ")) skills.push("function return values");
  } else if (language === "JavaScript") {
    if (code.includes("function") || code.includes("=>")) skills.push("function definition");
    if (code.includes("for") || code.includes("while")) skills.push("loops");
    if (code.includes("if")) skills.push("conditionals");
    if (code.includes("array") || code.includes("[")) skills.push("array manipulation");
    if (code.includes("class")) skills.push("object-oriented programming");
    if (code.includes("return")) skills.push("function return values");
  }

  // General programming concepts
  if (code.includes("sort")) skills.push("sorting algorithms");
  if (code.includes("hash") || code.includes("map") || code.includes("dict")) skills.push("hash tables");
  if (code.includes("recursion") || code.match(/(\w+)\s*\(\s*\1\s*\(/)) skills.push("recursion");
  if (code.includes("binary") || code.includes("divide")) skills.push("divide and conquer");
  if (code.includes("dynamic") || code.includes("memo")) skills.push("dynamic programming");
  
  return skills.slice(0, 8); // Limit to 8 skills
}

// Get all challenges with optional skill-based filtering
router.get("/challenges", verifyToken, async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const userId = user?.id;
    const { filter } = req.query;

    let assessments = await storage.getAssessments();

    // If user has resume skills and skill-based filtering is requested
    if (filter === 'skills' && userId) {
      const userProfile = await storage.getUser(userId);
      
      if (userProfile?.extractedSkills) {
        const userSkills = userProfile.extractedSkills as any;
        const skillsList: string[] = [];
        
        // Extract skills from various categories
        if (userSkills.technical_skills) skillsList.push(...userSkills.technical_skills);
        if (userSkills.programming_languages) skillsList.push(...userSkills.programming_languages);
        if (userSkills.frameworks) skillsList.push(...userSkills.frameworks);
        if (userSkills.databases) skillsList.push(...userSkills.databases);
        if (userSkills.tools) skillsList.push(...userSkills.tools);
        
        // Convert skills to lowercase for matching
        const normalizedUserSkills = skillsList.map(skill => skill.toLowerCase());
        
        // Filter assessments based on topic/skill relevance
        const skillBasedAssessments = assessments.filter(assessment => {
          const topic = assessment.topic.toLowerCase();
          const title = assessment.title.toLowerCase();
          const description = assessment.description.toLowerCase();
          
          // Check if any user skill matches assessment topic, title, or description
          return normalizedUserSkills.some(skill => {
            return topic.includes(skill) || 
                   title.includes(skill) || 
                   description.includes(skill) ||
                   skill.includes(topic) ||
                   // Programming language mappings
                   (skill.includes('javascript') || skill.includes('js')) && (topic.includes('javascript') || topic.includes('array') || topic.includes('string')) ||
                   (skill.includes('python') || skill.includes('py')) && (topic.includes('python') || topic.includes('algorithm') || topic.includes('data')) ||
                   (skill.includes('java') && !skill.includes('javascript')) && (topic.includes('java') || topic.includes('oop')) ||
                   skill.includes('react') && (topic.includes('javascript') || topic.includes('frontend')) ||
                   skill.includes('algorithm') && (topic.includes('sorting') || topic.includes('search')) ||
                   skill.includes('data') && topic.includes('structure') ||
                   skill.includes('sql') && topic.includes('database') ||
                   skill.includes('web') && (topic.includes('api') || topic.includes('frontend')) ||
                   skill.includes('backend') && (topic.includes('api') || topic.includes('server'))
          });
        });
        
        // If skill-based filtering found matches, prioritize them
        if (skillBasedAssessments.length > 0) {
          // Add a relevance score and mix with general assessments
          const scoredAssessments = skillBasedAssessments.map(assessment => ({ ...assessment, skillRelevant: true }));
          const otherAssessments = assessments.filter(a => !skillBasedAssessments.find(s => s.id === a.id))
            .map(assessment => ({ ...assessment, skillRelevant: false }));
          
          // Return skill-relevant first, then others
          assessments = [...scoredAssessments, ...otherAssessments.slice(0, 10)];
        }
      }
    }
    
    res.json(assessments);
  } catch (error: any) {
    console.error("Error fetching challenges:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get Judge0 languages
router.get("/languages", async (req: Request, res: Response) => {
  try {
    const response = await fetch(`${JUDGE0_API_URL}/languages`, {
      headers: {
        "X-RapidAPI-Key": JUDGE0_API_KEY,
        "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com"
      }
    });
    
    if (!response.ok) {
      throw new Error(`Judge0 API error: ${response.status}`);
    }
    
    const languages: Judge0Language[] = await response.json() as Judge0Language[];
    
    // Filter to commonly used languages for coding assessments
    const filteredLanguages = languages.filter(lang => 
      !lang.is_archived && [
        "JavaScript", "Python", "Java", "C++", "C", "C#", 
        "Ruby", "Go", "Rust", "TypeScript", "PHP", "Swift"
      ].some(name => lang.name.includes(name))
    );
    
    res.json(filteredLanguages);
  } catch (error: any) {
    console.error("Error fetching languages:", error);
    // Fallback to common languages if Judge0 API fails
    const fallbackLanguages = [
      { id: 63, name: "JavaScript (Node.js 12.14.0)", is_archived: false, source_file: "script.js", compile_cmd: "", run_cmd: "node script.js" },
      { id: 71, name: "Python (3.8.1)", is_archived: false, source_file: "script.py", compile_cmd: "", run_cmd: "python3 script.py" },
      { id: 62, name: "Java (OpenJDK 13.0.1)", is_archived: false, source_file: "Main.java", compile_cmd: "javac Main.java", run_cmd: "java Main" },
      { id: 54, name: "C++ (GCC 9.2.0)", is_archived: false, source_file: "main.cpp", compile_cmd: "g++ -o main main.cpp", run_cmd: "./main" }
    ];
    res.json(fallbackLanguages);
  }
});

// Submit code for assessment
router.post("/submit", verifyToken, async (req: Request, res: Response) => {
  try {
    const { assessmentId, languageId, sourceCode } = req.body;
    const user = (req as any).user;
    const userId = user?.id;

    if (!userId || !assessmentId || !languageId || !sourceCode) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Get the assessment to retrieve test cases
    const assessment = await storage.getAssessment(assessmentId);
    if (!assessment) {
      return res.status(404).json({ message: "Assessment not found" });
    }

    // Run proper test cases evaluation
    let passed = false;
    let stdout = "";
    let stderr = "";
    let score = 0;
    let testResults = [];

    try {
      // If assessment has test cases, run them  
      if (assessment.testCases && Array.isArray(assessment.testCases) && assessment.testCases.length > 0) {
        let passedTests = 0;
        
        for (const testCase of assessment.testCases) {
          try {
            // Prepare test input based on function signature
            let testCode = sourceCode;
            
            if (sourceCode.includes("def ")) {
              // Python function - add test call
              const funcMatch = sourceCode.match(/def\s+(\w+)\s*\(/);
              if (funcMatch) {
                const funcName = funcMatch[1];
                console.log(`Python function detected: ${funcName}`);
                console.log(`Test case input:`, testCase.input);
                
                // Handle different input formats
                let paramValues;
                if (testCase.input && typeof testCase.input === 'object') {
                  paramValues = Object.values(testCase.input).map(v => JSON.stringify(v)).join(', ');
                } else {
                  paramValues = JSON.stringify(testCase.input);
                }
                
                testCode += `\n\n# Test execution\ntest_input = ${JSON.stringify(testCase.input)}\nif isinstance(test_input, dict):\n    result = ${funcName}(**test_input)\nelse:\n    result = ${funcName}(test_input)\nprint(result)`;
              }
            } else if (sourceCode.includes("function") || sourceCode.includes("var ") || sourceCode.includes("const ")) {
              // JavaScript function - add test call
              const funcMatch = sourceCode.match(/(?:function\s+(\w+)|(?:var|const|let)\s+(\w+)\s*=)/);
              if (funcMatch) {
                const funcName = funcMatch[1] || funcMatch[2];
                console.log(`JavaScript function detected: ${funcName}`);
                console.log(`Test case input:`, testCase.input);
                
                let paramValues;
                if (testCase.input && typeof testCase.input === 'object') {
                  paramValues = Object.values(testCase.input).map(v => JSON.stringify(v)).join(', ');
                } else {
                  paramValues = JSON.stringify(testCase.input);
                }
                
                testCode += `\n\n// Test execution\nconst testInput = ${JSON.stringify(testCase.input)};\nlet result;\nif (typeof testInput === 'object' && !Array.isArray(testInput)) {\n    result = ${funcName}(...Object.values(testInput));\n} else {\n    result = ${funcName}(testInput);\n}\nconsole.log(JSON.stringify(result));`;
              }
            }

            // Submit to Judge0
            const submission: Judge0Submission = {
              language_id: languageId,
              source_code: testCode,
              stdin: "",
              expected_output: ""
            };

            const submitResponse = await fetch(`${JUDGE0_API_URL}/submissions?base64_encoded=false&wait=true`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "X-RapidAPI-Key": JUDGE0_API_KEY,
                "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com"
              },
              body: JSON.stringify(submission)
            });

            if (submitResponse.ok) {
              const result: Judge0Result = await submitResponse.json() as Judge0Result;
              const output = result.stdout?.trim() || "";
              
              // Better output comparison logic
              let expectedStr: string;
              let actualStr: string = output;
              
              if (typeof testCase.expected === 'string') {
                expectedStr = testCase.expected;
              } else if (Array.isArray(testCase.expected)) {
                expectedStr = JSON.stringify(testCase.expected);
              } else if (typeof testCase.expected === 'object') {
                expectedStr = JSON.stringify(testCase.expected);
              } else {
                expectedStr = String(testCase.expected);
              }
              
              // Normalize both strings for comparison
              const normalizeOutput = (str: string) => {
                return str.replace(/\s+/g, ' ').trim().toLowerCase();
              };
              
              // Enhanced output comparison logic with robust array handling
              console.log(`Comparing outputs:`);
              console.log(`Expected: ${expectedStr} (type: ${typeof testCase.expected})`);
              console.log(`Actual: ${actualStr} (status: ${result.status.id})`);
              
              let isCorrect = false;
              const testResult = {
                input: testCase.input,
                expected: testCase.expected,
                actual: actualStr,
                passed: false,
                executionTime: result.time || "N/A",
                memory: result.memory || "N/A",
                status: result.status.description || "Unknown",
                stderr: result.stderr || ""
              };
              
              if (result.status.id === 3 || result.status.id === 4) { // Successful execution (3) or Memory Limit Exceeded but with output (4)
                // Direct comparison first
                if (actualStr === expectedStr) {
                  isCorrect = true;
                  console.log('✓ Direct string match');
                }
                // Handle array comparisons specifically
                else if (Array.isArray(testCase.expected)) {
                  try {
                    // Remove all whitespace and compare
                    const cleanedActual = actualStr.trim().replace(/\s+/g, '');
                    const cleanedExpected = JSON.stringify(testCase.expected).replace(/\s+/g, '');
                    
                    console.log(`Cleaned actual: "${cleanedActual}"`);
                    console.log(`Cleaned expected: "${cleanedExpected}"`);
                    
                    if (cleanedActual === cleanedExpected) {
                      isCorrect = true;
                      console.log('✓ Array whitespace-normalized match');
                    } else {
                      // Try JSON parsing the actual output
                      try {
                        const actualParsed = JSON.parse(actualStr);
                        if (JSON.stringify(actualParsed) === JSON.stringify(testCase.expected)) {
                          isCorrect = true;
                          console.log('✓ JSON parsed array match');
                        }
                      } catch (parseError) {
                        // Manual array parsing as fallback
                        const actualArray = actualStr.replace(/[\[\]\s]/g, '').split(',').map(x => {
                          const num = parseInt(x.trim());
                          return isNaN(num) ? x.trim() : num;
                        });
                        
                        if (JSON.stringify(actualArray) === JSON.stringify(testCase.expected)) {
                          isCorrect = true;
                          console.log('✓ Manual array parsing match');
                        }
                      }
                    }
                  } catch (error: any) {
                    console.log('Array comparison error:', error?.message || 'Unknown error');
                  }
                }
                // String/primitive comparisons
                else {
                  // Normalized comparison for strings/numbers
                  if (normalizeOutput(actualStr) === normalizeOutput(expectedStr)) {
                    isCorrect = true;
                    console.log('✓ Normalized match');
                  } else {
                    // Try type conversion
                    try {
                      const actualParsed = JSON.parse(actualStr);
                      if (actualParsed === testCase.expected || String(actualParsed) === String(testCase.expected)) {
                        isCorrect = true;
                        console.log('✓ Type-converted match');
                      }
                    } catch {
                      // Direct value comparison
                      if (String(actualStr).trim() === String(testCase.expected)) {
                        isCorrect = true;
                        console.log('✓ String conversion match');
                      }
                    }
                  }
                }
              }
              
              console.log(`Final result: ${isCorrect ? 'PASSED' : 'FAILED'}`);
              
              testResult.passed = isCorrect;
              if (isCorrect) {
                passedTests++;
              }
              testResults.push(testResult);
            } else {
              testResults.push({ 
                input: testCase.input,
                expected: testCase.expected,
                actual: "",
                passed: false,
                executionTime: "N/A",
                memory: "N/A",
                status: "Execution Failed",
                stderr: "Failed to execute code"
              });
            }
          } catch (testError: any) {
            testResults.push({ 
              input: testCase.input,
              expected: testCase.expected,
              actual: "",
              passed: false,
              executionTime: "N/A",
              memory: "N/A",
              status: "Error",
              stderr: testError?.message || "Unknown error"
            });
          }
        }

        const totalTests = Array.isArray(assessment.testCases) ? assessment.testCases.length : 0;
        passed = passedTests === totalTests;
        score = totalTests > 0 ? Math.round((passedTests / totalTests) * 100) : 0;
        stdout = `Passed ${passedTests}/${totalTests} test cases`;
        stderr = passed ? "" : `Failed ${totalTests - passedTests} test cases`;
      } else {
        // Fallback: basic code execution without specific test cases
        const submission: Judge0Submission = {
          language_id: languageId,
          source_code: sourceCode,
          stdin: "",
          expected_output: ""
        };

        const submitResponse = await fetch(`${JUDGE0_API_URL}/submissions?base64_encoded=false&wait=true`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-RapidAPI-Key": JUDGE0_API_KEY,
            "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com"
          },
          body: JSON.stringify(submission)
        });

        if (submitResponse.ok) {
          const result: Judge0Result = await submitResponse.json() as Judge0Result;
          stdout = result.stdout || "";
          stderr = result.stderr || result.compile_output || "";
          
          // Basic pass criteria: code executed without errors
          passed = result.status.id === 3 && !stderr;
          score = passed ? 100 : 0;
        } else {
          // Enhanced fallback evaluation when Judge0 responds but execution fails
          const hasFunction = sourceCode.includes("function") || sourceCode.includes("def") || sourceCode.includes("public") || sourceCode.includes("main");
          const hasLogic = sourceCode.includes("if") || sourceCode.includes("for") || sourceCode.includes("while");
          const hasReturn = sourceCode.includes("return") || sourceCode.includes("print") || sourceCode.includes("console.log");
          const hasMinLength = sourceCode.trim().length > 30;
          
          const passedChecks = [hasFunction, hasLogic, hasReturn, hasMinLength].filter(Boolean).length;
          passed = passedChecks >= 3;
          score = Math.min(passedChecks * 25, 100);
          stdout = passed ? `Code validation complete (${passedChecks}/4 checks passed)` : "Code validation failed";
          stderr = passed ? "" : `Missing required elements: ${4 - passedChecks} checks failed`;
        }
      }
    } catch (apiError) {
      console.error("Judge0 API error:", apiError);
      // Enhanced fallback evaluation
      const hasFunction = sourceCode.includes("function") || sourceCode.includes("def") || sourceCode.includes("public") || sourceCode.includes("main");
      const hasLogic = sourceCode.includes("if") || sourceCode.includes("for") || sourceCode.includes("while");
      const hasReturn = sourceCode.includes("return") || sourceCode.includes("print") || sourceCode.includes("console.log");
      const hasMinLength = sourceCode.trim().length > 30;
      
      const passedChecks = [hasFunction, hasLogic, hasReturn, hasMinLength].filter(Boolean).length;
      passed = passedChecks >= 3;
      score = Math.min(passedChecks * 25, 100);
      stdout = passed ? `Code evaluation complete (${passedChecks}/4 checks passed)` : "Basic validation failed";
      stderr = passed ? "" : `Failed checks: missing ${4 - passedChecks} required elements`;
    }

    // Extract skills from submitted code using AI Profile Agent
    let extractedSkills: string[] = [];
    try {
      // Try to import and use the AI profile agent
      const profileAgent = await import('../agents/profileAgent.js') as any;
      if (profileAgent && profileAgent.extractSkillsFromCode) {
        const languageName = languageId === 71 ? "Python" : languageId === 63 ? "JavaScript" : "Unknown";
        console.log("Extracting skills for language:", languageName);
        extractedSkills = await profileAgent.extractSkillsFromCode(sourceCode, languageName);
        console.log("Extracted skills:", extractedSkills);
      } else {
        throw new Error("Profile agent not available");
      }
    } catch (skillError: any) {
      console.error("Error extracting skills:", skillError?.message || 'Unknown error');
      // Fallback skill extraction based on code analysis
      extractedSkills = extractSkillsFallback(sourceCode, languageId === 71 ? "Python" : languageId === 63 ? "JavaScript" : "Unknown");
    }



    // Store the assessment result with extracted skills  
    const userAssessmentData = {
      userId,
      assessmentId,
      languageId,
      sourceCode,
      score,
      passed,
      stdout,
      stderr,
      execTime: "0.1s",
      memory: 1024
    };

    const userAssessment = await storage.createUserAssessment(userAssessmentData);

    // Update user stats if passed
    if (passed) {
      const currentUser = await storage.getUser(userId);
      if (currentUser) {
        await storage.updateUser(userId, {
          points: (currentUser.points || 0) + score,
          problemsSolved: (currentUser.problemsSolved || 0) + 1,
          streak: (currentUser.streak || 0) + 1
        });

        // Create activity
        await storage.createActivity({
          userId,
          type: "assessment_completed",
          title: `Completed ${assessment.title}`,
          description: `Solved ${assessment.title} problem in ${assessment.difficulty} difficulty`
        });
      }
    }

    res.json({
      passed,
      score,
      stdout,
      stderr,
      extractedSkills,
      submissionId: userAssessment.id,
      testResults: testResults,
      totalTests: testResults.length,
      passedTests: testResults.filter(t => t.passed).length,
      failedTests: testResults.filter(t => !t.passed).length,
      executionDetails: testResults.length > 0 ? {
        averageExecutionTime: testResults.reduce((sum, t) => {
          const time = parseFloat(t.executionTime) || 0;
          return sum + time;
        }, 0) / testResults.length,
        totalMemoryUsed: Math.max(...testResults.map(t => parseInt(String(t.memory)) || 0)),
        statusCounts: testResults.reduce((acc, t) => {
          acc[t.status] = (acc[t.status] || 0) + 1;
          return acc;
        }, {} as Record<string, number>)
      } : null
    });

  } catch (error: any) {
    console.error("Error submitting assessment:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get user's assessment history
router.get("/history", verifyToken, async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const userId = user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const assessments = await storage.getUserAssessments(userId);
    res.json(assessments);
  } catch (error: any) {
    console.error("Error fetching user assessments:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get all assessments (legacy endpoint)
router.get("/", verifyToken, async (req: Request, res: Response) => {
  try {
    const assessments = await storage.getAssessments();
    res.json(assessments);
  } catch (error: any) {
    res.status(500).json({ 
      message: "Failed to get assessments", 
      error: error.message 
    });
  }
});

// Get specific assessment
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const assessment = await storage.getAssessment(req.params.id);
    if (!assessment) {
      return res.status(404).json({ message: "Assessment not found" });
    }
    res.json(assessment);
  } catch (error: any) {
    console.error("Error fetching assessment:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Helper function to get language name from ID
function getLanguageName(languageId: number): string {
  const languageMap: { [key: number]: string } = {
    63: 'javascript',
    71: 'python', 
    62: 'java',
    54: 'cpp'
  };
  return languageMap[languageId] || 'unknown';
}

// Basic skill extraction fallback
function getBasicSkills(code: string, language: string): string[] {
  const skills: string[] = [];
  const codeStr = code.toLowerCase();
  
  // Basic patterns
  if (codeStr.includes('for') || codeStr.includes('while')) skills.push('loops');
  if (codeStr.includes('if') || codeStr.includes('else')) skills.push('conditionals');
  if (codeStr.includes('function') || codeStr.includes('def')) skills.push('functions');
  if (codeStr.includes('array') || codeStr.includes('list')) skills.push('arrays');
  
  return skills.slice(0, 5);
}

export default router;
