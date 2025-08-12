export interface PersonalInfo {
  name?: string | null;
  title?: string | null;
  email?: string | null;
  location?: string | null;
}

export interface Skills {
  technical?: string[];
  soft?: string[];
  categories?: {
    programming?: string[];
    frameworks?: string[];
    tools?: string[];
    databases?: string[];
    cloud?: string[];
  };
}

export interface Experience {
  title?: string;
  company?: string;
  duration?: string;
  description?: string;
  skillsUsed?: string[];
}

export interface Education {
  degree?: string;
  institution?: string;
  field?: string;
  year?: string;
}

export interface Project {
  name?: string;
  description?: string;
  technologies?: string[];
}

export interface ResumeAnalysis {
  personalInfo?: PersonalInfo;
  skills?: Skills;
  experience?: Experience[];
  education?: Education[];
  projects?: Project[];
  summary?: string;
  skillLevel?: 'beginner' | 'intermediate' | 'advanced';
  primaryDomain?: string;
}

export interface SkillRecommendation {
  skill: string;
  assessments: string[];
  priority: string;
  reason: string;
}

export interface SkillCoverage {
  coveredSkills: string[];
  coveragePercentage: number;
  gapSkills: string[];
}

export interface LearningPath {
  strengthAreas: string[];
  improvementAreas: string[];
  recommendedCourses: string[];
  timeline: string;
}

export interface AssessmentAlignment {
  recommendations: SkillRecommendation[];
  skillCoverage: SkillCoverage;
  suggestedDifficulty: string[];
  learningPath: LearningPath;
}

export declare class ResumeAgent {
  constructor();
  parseResume(resumeText: string): Promise<ResumeAnalysis>;
  generateAssessmentAlignment(extractedSkills: ResumeAnalysis, existingAssessments?: any[]): Promise<AssessmentAlignment>;
}

export declare const resumeAgent: ResumeAgent;