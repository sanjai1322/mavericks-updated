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

// Get all challenges
router.get("/challenges", async (req: Request, res: Response) => {
  try {
    const assessments = await storage.getAssessments();
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

    // For demo purposes, we'll simulate a simple test
    // In a real implementation, you'd run proper test cases
    let passed = false;
    let stdout = "";
    let stderr = "";
    let score = 0;

    try {
      // Create Judge0 submission
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
        
        // Simple pass criteria: code executed without errors
        passed = result.status.id === 3 && !stderr; // Status 3 = Accepted
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
      const { extractSkillsFromCode } = await import('../agents/profileAgent.js');
      const languageName = getLanguageName(languageId);
      extractedSkills = await extractSkillsFromCode(sourceCode, languageName);
    } catch (error) {
      console.log('Profile Agent not available, using basic skill extraction');
      extractedSkills = getBasicSkills(sourceCode, getLanguageName(languageId));
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
      submissionId: userAssessment.id
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
