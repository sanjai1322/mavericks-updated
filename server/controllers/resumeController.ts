import { Request, Response } from "express";
import { storage } from "../storage";
import { resumeUploadSchema, type ResumeUpload, type User } from "@shared/schema";
import { resumeAgent } from "../agents/resumeAgent.js";
import type { ResumeAnalysis } from "../agents/resumeAgent.d.ts";

interface AuthenticatedRequest extends Request {
  user?: User;
}

/**
 * Upload and parse resume
 */
export const uploadResume = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const validationResult = resumeUploadSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({ 
        message: "Invalid resume data", 
        errors: validationResult.error.errors 
      });
    }

    const { fileName, fileSize, mimeType, fileContent } = validationResult.data;

    // Validate file type
    const allowedTypes = ['application/pdf', 'text/plain', 'application/msword', 
                         'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(mimeType)) {
      return res.status(400).json({ 
        message: "Unsupported file type. Please upload PDF, DOC, DOCX, or TXT files." 
      });
    }

    // Validate file size (max 5MB)
    if (fileSize > 5 * 1024 * 1024) {
      return res.status(400).json({ 
        message: "File size too large. Maximum size is 5MB." 
      });
    }

    // Decode base64 content and extract text
    let extractedText: string;
    try {
      if (mimeType === 'text/plain') {
        extractedText = Buffer.from(fileContent, 'base64').toString('utf-8');
      } else {
        // For PDF/DOC files, we'll treat the base64 as text for now
        // In production, you'd use libraries like pdf-parse or mammoth
        extractedText = Buffer.from(fileContent, 'base64').toString('utf-8');
      }
    } catch (error) {
      return res.status(400).json({ 
        message: "Failed to extract text from file" 
      });
    }

    if (!extractedText.trim()) {
      return res.status(400).json({ 
        message: "No text content found in the uploaded file" 
      });
    }

    console.log(`Processing resume for user ${req.user.id}: ${fileName} (${fileSize} bytes)`);

    // Parse resume using AI
    let aiAnalysis: ResumeAnalysis | null = null;
    try {
      aiAnalysis = await resumeAgent.parseResume(extractedText);
      console.log('Resume parsed successfully:', aiAnalysis?.summary || 'Analysis completed');
    } catch (error) {
      console.error('Resume parsing failed:', error);
      
      // Provide more specific error details for debugging
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Full error details:', errorMessage);
      
      return res.status(500).json({ 
        message: "Failed to parse resume content. Please ensure the file contains readable text and try again.",
        error: errorMessage
      });
    }

    // Create resume record
    const resume = await storage.createResume({
      userId: req.user.id,
      fileName,
      fileSize,
      mimeType,
      extractedText,
      extractedSkills: aiAnalysis?.skills || null,
      aiAnalysis
    });

    // Update user profile with extracted skills and analysis
    const userUpdates: Partial<User> = {
      resumeText: extractedText,
      extractedSkills: aiAnalysis?.skills || null,
      resumeUpdatedAt: new Date()
    };

    // Generate skill strengths mapping
    if (aiAnalysis?.skills?.technical) {
      const skillStrengths: Record<string, number> = {};
      aiAnalysis.skills.technical.forEach((skill: string) => {
        skillStrengths[skill] = 0.8; // Default confidence level
      });
      userUpdates.skillStrengths = skillStrengths;
    }

    // Generate personalized learning plan
    if (aiAnalysis) {
      try {
        const assessments = await storage.getAssessments();
        const alignmentData = await resumeAgent.generateAssessmentAlignment(aiAnalysis, assessments);
        
        userUpdates.personalizedPlan = {
          learningPath: alignmentData.learningPath,
          recommendations: alignmentData.recommendations,
          skillCoverage: alignmentData.skillCoverage,
          suggestedDifficulty: alignmentData.suggestedDifficulty,
          generatedAt: new Date().toISOString()
        } as any;
      } catch (error) {
        console.error('Failed to generate learning plan:', error);
      }
    }

    await storage.updateUser(req.user.id, userUpdates);

    res.json({
      message: "Resume uploaded and processed successfully",
      resume: {
        id: resume.id,
        fileName: resume.fileName,
        uploadedAt: resume.uploadedAt
      },
      analysis: {
        skillsFound: aiAnalysis?.skills?.technical?.length || 0,
        primaryDomain: aiAnalysis?.primaryDomain,
        skillLevel: aiAnalysis?.skillLevel,
        summary: aiAnalysis?.summary
      },
      recommendations: userUpdates.personalizedPlan?.recommendations || []
    });

  } catch (error) {
    console.error('Resume upload error:', error);
    res.status(500).json({ 
      message: "Internal server error during resume processing" 
    });
  }
};

/**
 * Get user's resume history
 */
export const getUserResumes = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const resumes = await storage.getUserResumes(req.user.id);
    
    const resumeList = resumes.map(resume => ({
      id: resume.id,
      fileName: resume.fileName,
      fileSize: resume.fileSize,
      uploadedAt: resume.uploadedAt,
      skillsExtracted: resume.extractedSkills ? 
        Object.keys(resume.extractedSkills).length : 0,
      primaryDomain: (resume.aiAnalysis as ResumeAnalysis)?.primaryDomain || null
    }));

    res.json({
      resumes: resumeList,
      total: resumeList.length
    });

  } catch (error) {
    console.error('Get resumes error:', error);
    res.status(500).json({ 
      message: "Failed to retrieve resume history" 
    });
  }
};

/**
 * Get latest resume analysis
 */
export const getLatestResumeAnalysis = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const latestResume = await storage.getLatestUserResume(req.user.id);
    
    if (!latestResume) {
      return res.json({
        hasResume: false,
        message: "No resume uploaded yet"
      });
    }

    res.json({
      hasResume: true,
      analysis: latestResume.aiAnalysis,
      extractedSkills: latestResume.extractedSkills,
      uploadedAt: latestResume.uploadedAt,
      fileName: latestResume.fileName
    });

  } catch (error) {
    console.error('Get resume analysis error:', error);
    res.status(500).json({ 
      message: "Failed to retrieve resume analysis" 
    });
  }
};

/**
 * Get skill-based assessment recommendations
 */
export const getSkillBasedRecommendations = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required" });
    }

    // Get user's latest resume
    const latestResume = await storage.getLatestUserResume(req.user.id);
    if (!latestResume?.aiAnalysis) {
      return res.status(404).json({ 
        message: "No resume analysis found. Please upload a resume first." 
      });
    }

    // Get available assessments
    const assessments = await storage.getAssessments();
    
    // Generate fresh recommendations
    const alignmentData = await resumeAgent.generateAssessmentAlignment(
      latestResume.aiAnalysis, 
      assessments
    );

    // Filter assessments based on user skills
    const recommendedAssessments = assessments.filter(assessment => {
      const userSkills = (latestResume.aiAnalysis as ResumeAnalysis)?.skills?.technical || [];
      return userSkills.some((skill: string) => 
        assessment.topic.toLowerCase().includes(skill.toLowerCase()) ||
        assessment.title.toLowerCase().includes(skill.toLowerCase())
      );
    });

    res.json({
      recommendations: alignmentData.recommendations,
      skillCoverage: alignmentData.skillCoverage,
      suggestedDifficulty: alignmentData.suggestedDifficulty,
      recommendedAssessments: recommendedAssessments.slice(0, 10), // Limit to 10
      learningPath: alignmentData.learningPath
    });

  } catch (error) {
    console.error('Get skill recommendations error:', error);
    res.status(500).json({ 
      message: "Failed to generate skill-based recommendations" 
    });
  }
};

/**
 * Update personalized learning plan
 */
export const updateLearningPlan = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const { strengthAreas, improvementAreas, timeline } = req.body;

    const updatedPlan = {
      ...(req.user.personalizedPlan || {}),
      learningPath: {
        strengthAreas: strengthAreas || [],
        improvementAreas: improvementAreas || [],
        timeline: timeline || '4-6 weeks'
      },
      updatedAt: new Date().toISOString()
    } as any;

    await storage.updateUser(req.user.id, {
      personalizedPlan: updatedPlan
    });

    res.json({
      message: "Learning plan updated successfully",
      learningPath: updatedPlan.learningPath
    });

  } catch (error) {
    console.error('Update learning plan error:', error);
    res.status(500).json({ 
      message: "Failed to update learning plan" 
    });
  }
};