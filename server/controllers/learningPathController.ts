import { Request, Response } from "express";
import { storage } from "../storage";
import type { AuthenticatedRequest, User, LearningPath, LearningPathInsert } from "../../shared/schema";

// Generate personalized learning path based on user's skills, resume, and quiz results
export const generatePersonalizedLearningPath = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const user = await storage.getUser(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Analyze user's current skill level and gaps
    const skillAnalysis = analyzeUserSkills(user);
    const recommendations = generateLearningRecommendations(skillAnalysis, user);
    
    // Create a structured learning path
    const learningPath = await createStructuredLearningPath(user, skillAnalysis, recommendations);
    
    // Store the learning path
    const pathId = `path-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const learningPathData: LearningPathInsert = {
      id: pathId,
      userId: user.id,
      title: learningPath.title,
      description: learningPath.description,
      category: learningPath.category,
      difficulty: learningPath.difficulty,
      estimatedHours: learningPath.estimatedHours,
      content: learningPath.content,
      prerequisites: learningPath.prerequisites,
      learningObjectives: learningPath.learningObjectives,
      tags: learningPath.tags
    };

    await storage.createLearningPath(learningPathData);
    
    res.json({
      learningPath: {
        ...learningPath,
        id: pathId
      },
      skillAnalysis,
      recommendations
    });

    console.log(`Generated personalized learning path for user ${user.id}: ${learningPath.title}`);

  } catch (error) {
    console.error('Error generating learning path:', error);
    res.status(500).json({ message: 'Failed to generate learning path' });
  }
};

// Get user's current learning progress
export const getUserLearningProgress = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const user = await storage.getUser(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Get user's learning paths
    const learningPaths = await storage.getUserLearningPaths(req.user.id);
    
    // Calculate progress for each path (this would typically involve tracking completion)
    const pathsWithProgress = learningPaths.map(path => ({
      ...path,
      progress: calculatePathProgress(path, user),
      status: getPathStatus(path, user)
    }));

    // Generate progress summary
    const progressSummary = {
      totalPaths: pathsWithProgress.length,
      completedPaths: pathsWithProgress.filter(p => p.progress >= 100).length,
      inProgressPaths: pathsWithProgress.filter(p => p.progress > 0 && p.progress < 100).length,
      averageProgress: pathsWithProgress.length > 0 
        ? Math.round(pathsWithProgress.reduce((sum, p) => sum + p.progress, 0) / pathsWithProgress.length)
        : 0
    };

    res.json({
      learningPaths: pathsWithProgress,
      progressSummary,
      skillGaps: analyzeSkillGaps(user),
      nextRecommendations: getNextRecommendations(user, pathsWithProgress)
    });

  } catch (error) {
    console.error('Error fetching learning progress:', error);
    res.status(500).json({ message: 'Failed to fetch learning progress' });
  }
};

// Update learning path progress
export const updateLearningProgress = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const { pathId, completedSections, currentSection, progress } = req.body;

    if (!pathId) {
      return res.status(400).json({ message: "Learning path ID is required" });
    }

    // Update user's progress (you might want to create a separate progress tracking table)
    const user = await storage.getUser(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // For now, we'll store progress in user's metadata
    const learningProgress = user.metadata?.learningProgress || {};
    learningProgress[pathId] = {
      completedSections: completedSections || [],
      currentSection: currentSection || 0,
      progress: progress || 0,
      lastUpdated: new Date()
    };

    await storage.updateUser(req.user.id, {
      metadata: {
        ...user.metadata,
        learningProgress
      }
    });

    // Update skill strengths based on completed sections
    if (completedSections && completedSections.length > 0) {
      await updateSkillsFromProgress(req.user.id, pathId, completedSections);
    }

    res.json({
      message: "Progress updated successfully",
      progress: learningProgress[pathId]
    });

  } catch (error) {
    console.error('Error updating learning progress:', error);
    res.status(500).json({ message: 'Failed to update progress' });
  }
};

// Helper Functions

function analyzeUserSkills(user: User) {
  const skillStrengths = user.skillStrengths || {};
  const extractedSkills = user.extractedSkills;
  
  // Categorize skills by strength level
  const strongSkills = Object.entries(skillStrengths)
    .filter(([_, strength]) => strength >= 0.8)
    .map(([skill, _]) => skill);
  
  const moderateSkills = Object.entries(skillStrengths)
    .filter(([_, strength]) => strength >= 0.6 && strength < 0.8)
    .map(([skill, _]) => skill);
    
  const weakSkills = Object.entries(skillStrengths)
    .filter(([_, strength]) => strength < 0.6)
    .map(([skill, _]) => skill);

  // Determine primary domain based on skills
  const primaryDomain = determinePrimaryDomain(strongSkills.concat(moderateSkills));
  
  // Assess overall level
  const overallLevel = strongSkills.length > 5 ? 'Advanced' : 
                      strongSkills.length > 2 ? 'Intermediate' : 'Beginner';

  return {
    strongSkills,
    moderateSkills,
    weakSkills,
    primaryDomain,
    overallLevel,
    totalSkills: Object.keys(skillStrengths).length
  };
}

function generateLearningRecommendations(skillAnalysis: any, user: User) {
  const recommendations = [];
  
  // Recommend strengthening weak skills
  if (skillAnalysis.weakSkills.length > 0) {
    recommendations.push({
      type: 'skill_improvement',
      priority: 'high',
      title: 'Strengthen Foundation Skills',
      skills: skillAnalysis.weakSkills.slice(0, 3), // Top 3 weak skills
      reason: 'These skills show room for improvement based on your assessments'
    });
  }
  
  // Recommend advanced topics for strong skills
  if (skillAnalysis.strongSkills.length > 0) {
    recommendations.push({
      type: 'skill_advancement',
      priority: 'medium',
      title: 'Advance Your Expertise',
      skills: skillAnalysis.strongSkills,
      reason: 'Build on your strong foundation with advanced concepts'
    });
  }
  
  // Recommend complementary skills based on domain
  const complementarySkills = getComplementarySkills(skillAnalysis.primaryDomain);
  if (complementarySkills.length > 0) {
    recommendations.push({
      type: 'skill_expansion',
      priority: 'medium',
      title: 'Expand Your Toolkit',
      skills: complementarySkills,
      reason: `These skills complement your ${skillAnalysis.primaryDomain} expertise`
    });
  }

  return recommendations;
}

async function createStructuredLearningPath(user: User, skillAnalysis: any, recommendations: any[]) {
  const primarySkill = skillAnalysis.strongSkills[0] || skillAnalysis.moderateSkills[0] || 'Programming Fundamentals';
  
  // Create path based on user's level and domain
  const learningPath = {
    title: `${skillAnalysis.primaryDomain} Mastery Path`,
    description: `Personalized learning journey to advance your ${skillAnalysis.primaryDomain} skills from ${skillAnalysis.overallLevel} to expert level`,
    category: skillAnalysis.primaryDomain,
    difficulty: skillAnalysis.overallLevel,
    estimatedHours: calculateEstimatedHours(skillAnalysis, recommendations),
    prerequisites: skillAnalysis.strongSkills.slice(0, 2),
    learningObjectives: generateLearningObjectives(skillAnalysis, recommendations),
    tags: [...skillAnalysis.strongSkills, ...skillAnalysis.moderateSkills].slice(0, 5),
    content: generatePathContent(skillAnalysis, recommendations)
  };

  return learningPath;
}

function generateLearningObjectives(skillAnalysis: any, recommendations: any[]) {
  const objectives = [];
  
  // Add objectives based on weak skills
  if (skillAnalysis.weakSkills.length > 0) {
    objectives.push(`Master fundamental concepts in ${skillAnalysis.weakSkills.slice(0, 2).join(' and ')}`);
  }
  
  // Add objectives based on strong skills
  if (skillAnalysis.strongSkills.length > 0) {
    objectives.push(`Advance to expert level in ${skillAnalysis.strongSkills[0]}`);
  }
  
  // Add domain-specific objectives
  objectives.push(`Build production-ready applications in ${skillAnalysis.primaryDomain}`);
  objectives.push(`Implement best practices and design patterns`);
  
  return objectives.slice(0, 4); // Limit to 4 objectives
}

function generatePathContent(skillAnalysis: any, recommendations: any[]) {
  const content = [];
  
  // Foundation section for weak skills
  if (skillAnalysis.weakSkills.length > 0) {
    content.push({
      section: "Foundation",
      topics: skillAnalysis.weakSkills.map(skill => ({
        title: `${skill} Fundamentals`,
        description: `Master the basics of ${skill}`,
        estimatedHours: 4,
        resources: [
          { type: 'quiz', title: `${skill} Quiz`, difficulty: 'Easy' },
          { type: 'practice', title: `${skill} Exercises` }
        ]
      }))
    });
  }
  
  // Intermediate section for moderate skills
  if (skillAnalysis.moderateSkills.length > 0) {
    content.push({
      section: "Intermediate",
      topics: skillAnalysis.moderateSkills.map(skill => ({
        title: `Advanced ${skill}`,
        description: `Deepen your understanding of ${skill}`,
        estimatedHours: 6,
        resources: [
          { type: 'quiz', title: `${skill} Advanced Quiz`, difficulty: 'Medium' },
          { type: 'project', title: `${skill} Project` }
        ]
      }))
    });
  }
  
  // Advanced section for strong skills
  if (skillAnalysis.strongSkills.length > 0) {
    content.push({
      section: "Advanced",
      topics: skillAnalysis.strongSkills.map(skill => ({
        title: `${skill} Mastery`,
        description: `Achieve expert-level proficiency in ${skill}`,
        estimatedHours: 8,
        resources: [
          { type: 'quiz', title: `${skill} Expert Quiz`, difficulty: 'Hard' },
          { type: 'capstone', title: `${skill} Capstone Project` }
        ]
      }))
    });
  }
  
  return content;
}

function calculateEstimatedHours(skillAnalysis: any, recommendations: any[]) {
  const baseHours = 20;
  const skillHours = (skillAnalysis.weakSkills.length * 4) + 
                   (skillAnalysis.moderateSkills.length * 6) + 
                   (skillAnalysis.strongSkills.length * 8);
  return Math.min(baseHours + skillHours, 100); // Cap at 100 hours
}

function calculatePathProgress(path: LearningPath, user: User): number {
  const progress = user.metadata?.learningProgress?.[path.id];
  return progress?.progress || 0;
}

function getPathStatus(path: LearningPath, user: User): string {
  const progress = calculatePathProgress(path, user);
  if (progress === 0) return 'Not Started';
  if (progress >= 100) return 'Completed';
  return 'In Progress';
}

function analyzeSkillGaps(user: User) {
  // This would analyze gaps in user's skill set compared to industry standards
  // For now, return placeholder data
  return [
    { skill: 'Advanced React Patterns', importance: 'High', currentLevel: 0.4 },
    { skill: 'System Design', importance: 'High', currentLevel: 0.2 },
    { skill: 'Testing Strategies', importance: 'Medium', currentLevel: 0.6 }
  ];
}

function getNextRecommendations(user: User, paths: any[]) {
  // Generate next steps based on current progress
  return [
    {
      title: 'Complete Current Module',
      description: 'Finish your current learning section to maintain momentum',
      action: 'Continue Learning',
      priority: 'immediate'
    },
    {
      title: 'Take Skills Assessment',
      description: 'Validate your knowledge with targeted quizzes',
      action: 'Take Quiz',
      priority: 'soon'
    }
  ];
}

function determinePrimaryDomain(skills: string[]): string {
  const domainKeywords = {
    'Frontend Development': ['React', 'Vue', 'Angular', 'JavaScript', 'TypeScript', 'HTML', 'CSS'],
    'Backend Development': ['Node.js', 'Express', 'Python', 'Django', 'Flask', 'Java', 'Spring'],
    'Mobile Development': ['React Native', 'Flutter', 'Swift', 'Kotlin', 'iOS', 'Android'],
    'Data Science': ['Python', 'R', 'Machine Learning', 'Pandas', 'NumPy', 'TensorFlow'],
    'DevOps': ['Docker', 'Kubernetes', 'AWS', 'CI/CD', 'Jenkins', 'Terraform']
  };
  
  let maxScore = 0;
  let primaryDomain = 'Full Stack Development';
  
  Object.entries(domainKeywords).forEach(([domain, keywords]) => {
    const score = keywords.filter(keyword => 
      skills.some(skill => skill.toLowerCase().includes(keyword.toLowerCase()))
    ).length;
    
    if (score > maxScore) {
      maxScore = score;
      primaryDomain = domain;
    }
  });
  
  return primaryDomain;
}

function getComplementarySkills(domain: string): string[] {
  const complementaryMap: Record<string, string[]> = {
    'Frontend Development': ['Backend APIs', 'Database Design', 'Testing', 'Performance Optimization'],
    'Backend Development': ['Frontend Frameworks', 'Database Administration', 'System Architecture', 'Security'],
    'Mobile Development': ['Backend Services', 'UI/UX Design', 'App Store Optimization', 'Cross-platform Tools'],
    'Data Science': ['Machine Learning', 'Data Visualization', 'Big Data Tools', 'Statistical Analysis'],
    'DevOps': ['Infrastructure as Code', 'Monitoring', 'Security', 'Cloud Architecture']
  };
  
  return complementaryMap[domain] || ['Problem Solving', 'Communication', 'Project Management'];
}

async function updateSkillsFromProgress(userId: string, pathId: string, completedSections: string[]) {
  try {
    const user = await storage.getUser(userId);
    if (!user) return;
    
    const skillStrengths = user.skillStrengths || {};
    
    // Increase skill strength based on completed sections
    completedSections.forEach(section => {
      const skillName = extractSkillFromSection(section);
      if (skillName) {
        const currentStrength = skillStrengths[skillName] || 0.5;
        skillStrengths[skillName] = Math.min(currentStrength + 0.1, 1.0); // Increase by 0.1, max 1.0
      }
    });
    
    await storage.updateUser(userId, { skillStrengths });
    
  } catch (error) {
    console.error('Error updating skills from progress:', error);
  }
}

function extractSkillFromSection(section: string): string | null {
  // Extract skill name from section title
  // This is a simplified version - you'd want more sophisticated parsing
  const skills = ['JavaScript', 'React', 'Python', 'Java', 'Node.js', 'Express', 'Django', 'Flask'];
  return skills.find(skill => section.toLowerCase().includes(skill.toLowerCase())) || null;
}