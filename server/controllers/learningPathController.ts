import { Request, Response } from "express";
import { storage } from "../storage";
import type { AuthenticatedRequest, User, LearningPath, LearningPathInsert } from "../../shared/schema";

interface UserSkillAnalysis {
  strongSkills: string[];
  moderateSkills: string[];
  weakSkills: string[];
  primaryDomain: string;
  overallLevel: string;
  totalSkills: number;
}

// Generate personalized learning path based on user's skills, resume, and quiz results
export const generatePersonalizedLearningPath = async (req: Request, res: Response) => {
  const authenticatedReq = req as AuthenticatedRequest;
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

    // Store learning path using the existing interface
    await storage.createLearningPath({
      title: learningPath.title,
      description: learningPath.description,
      icon: "🎯", // Default icon for personalized paths
      difficulty: learningPath.difficulty,
      lessons: learningPath.content?.length || 1,
      duration: `${learningPath.estimatedHours} hours`,
      category: learningPath.category,
      progress: 0
    });
    
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

    // For now, we'll store progress in user's personalizedPlan
    const currentPlan = user.personalizedPlan as any || {};
    const learningProgress = currentPlan.learningProgress || {};
    learningProgress[pathId] = {
      completedSections: completedSections || [],
      currentSection: currentSection || 0,
      progress: progress || 0,
      lastUpdated: new Date()
    };

    await storage.updateUser(req.user.id, {
      personalizedPlan: {
        ...currentPlan,
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

function calculateEstimatedHours(skillAnalysis: UserSkillAnalysis, recommendations: any[]) {
  // Base hours calculation
  let totalHours = 0;
  
  // Add hours for weak skills (more intensive)
  totalHours += skillAnalysis.weakSkills.length * 8;
  
  // Add hours for moderate skills
  totalHours += skillAnalysis.moderateSkills.length * 6;
  
  // Add hours for advancing strong skills
  totalHours += skillAnalysis.strongSkills.length * 4;
  
  // Adjust based on overall level
  if (skillAnalysis.overallLevel === 'Beginner') {
    totalHours *= 1.5; // Beginners need more time
  } else if (skillAnalysis.overallLevel === 'Advanced') {
    totalHours *= 0.8; // Advanced learners are more efficient
  }
  
  return Math.round(totalHours);
}

function determinePrimaryDomain(skills: string[]) {
  // Domain classification based on skills
  const domainKeywords = {
    'Frontend Development': ['React', 'Vue', 'Angular', 'JavaScript', 'TypeScript', 'CSS', 'HTML', 'Redux'],
    'Backend Development': ['Node.js', 'Express', 'Django', 'Flask', 'FastAPI', 'Spring', 'ASP.NET'],
    'Data Science': ['Python', 'Pandas', 'NumPy', 'Scikit-learn', 'TensorFlow', 'PyTorch', 'R'],
    'Mobile Development': ['React Native', 'Flutter', 'Swift', 'Kotlin', 'Xamarin'],
    'DevOps': ['Docker', 'Kubernetes', 'AWS', 'Azure', 'GCP', 'Jenkins', 'Terraform'],
    'Database': ['PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'SQLite'],
    'Machine Learning': ['Machine Learning', 'Deep Learning', 'Neural Networks', 'AI']
  };

  let bestMatch = 'Full Stack Development';
  let maxMatches = 0;

  for (const [domain, keywords] of Object.entries(domainKeywords)) {
    const matches = skills.filter(skill => 
      keywords.some(keyword => 
        skill.toLowerCase().includes(keyword.toLowerCase())
      )
    ).length;

    if (matches > maxMatches) {
      maxMatches = matches;
      bestMatch = domain;
    }
  }

  return bestMatch;
}

function getComplementarySkills(domain: string) {
  const complementarySkillsMap: { [key: string]: string[] } = {
    'Frontend Development': ['Node.js', 'MongoDB', 'Express', 'API Design'],
    'Backend Development': ['React', 'Vue', 'Database Design', 'System Design'],
    'Data Science': ['SQL', 'Cloud Computing', 'MLOps', 'Data Visualization'],
    'Mobile Development': ['Backend APIs', 'Cloud Services', 'UI/UX Design'],
    'DevOps': ['System Architecture', 'Security', 'Monitoring', 'Automation'],
    'Database': ['Backend Development', 'Query Optimization', 'Data Modeling'],
    'Machine Learning': ['Python', 'Statistics', 'Data Engineering', 'MLOps']
  };

  return complementarySkillsMap[domain] || ['System Design', 'Problem Solving', 'Testing'];
}

function calculatePathProgress(path: LearningPath, user: User) {
  // Get user's learning progress from personalizedPlan
  const personalizedPlan = user.personalizedPlan as any || {};
  const learningProgress = personalizedPlan.learningProgress || {};
  const pathProgress = learningProgress[path.id];
  
  if (!pathProgress) {
    return 0;
  }
  
  return pathProgress.progress || 0;
}

function getPathStatus(path: LearningPath, user: User) {
  const progress = calculatePathProgress(path, user);
  
  if (progress === 0) return 'Not Started';
  if (progress < 100) return 'In Progress';
  return 'Completed';
}

function analyzeSkillGaps(user: User) {
  const skillStrengths = user.skillStrengths as any || {};
  const extractedSkills = user.extractedSkills as any || {};
  
  // Identify skills that are mentioned but have low confidence
  const skillGaps = Object.entries(skillStrengths)
    .filter(([skill, strength]: [string, any]) => strength < 0.5)
    .map(([skill, strength]: [string, any]) => ({
      skill,
      currentLevel: strength,
      recommendedAction: strength < 0.3 ? 'Learn fundamentals' : 'Practice more'
    }));
    
  return skillGaps.slice(0, 5); // Top 5 skill gaps
}

function getNextRecommendations(user: User, learningPaths: any[]) {
  const inProgressPaths = learningPaths.filter(p => p.status === 'In Progress');
  const completedPaths = learningPaths.filter(p => p.status === 'Completed');
  
  const recommendations = [];
  
  // Recommend continuing in-progress paths
  if (inProgressPaths.length > 0) {
    recommendations.push({
      type: 'continue',
      title: 'Continue Learning',
      description: `You have ${inProgressPaths.length} path(s) in progress`,
      paths: inProgressPaths.slice(0, 2)
    });
  }
  
  // Recommend new paths based on completed ones
  if (completedPaths.length > 0) {
    recommendations.push({
      type: 'expand',
      title: 'Expand Your Skills',
      description: 'Based on your completed paths, here are some recommendations',
      suggestion: 'Consider exploring advanced topics in your strongest areas'
    });
  }
  
  return recommendations;
}

async function updateSkillsFromProgress(userId: string, pathId: string, completedSections: string[]) {
  try {
    const user = await storage.getUser(userId);
    if (!user) return;
    
    // Extract skills from completed sections and update user's skill strengths
    const currentStrengths = user.skillStrengths as any || {};
    
    // For each completed section, boost related skills
    completedSections.forEach(section => {
      // This is a simplified implementation - in practice, you'd map sections to specific skills
      const relatedSkills = extractSkillsFromSection(section);
      relatedSkills.forEach(skill => {
        const currentStrength = currentStrengths[skill] || 0;
        currentStrengths[skill] = Math.min(1.0, currentStrength + 0.1); // Boost by 0.1, max 1.0
      });
    });
    
    await storage.updateUser(userId, {
      skillStrengths: currentStrengths
    });
    
  } catch (error) {
    console.error('Error updating skills from progress:', error);
  }
}

function extractSkillsFromSection(sectionName: string): string[] {
  // Simple skill extraction based on section names
  // In practice, this would be more sophisticated
  const skillMap: { [key: string]: string[] } = {
    'React Fundamentals': ['React', 'JavaScript', 'Frontend Development'],
    'Node.js Basics': ['Node.js', 'JavaScript', 'Backend Development'],
    'Python Fundamentals': ['Python', 'Programming'],
    'Database Design': ['SQL', 'Database', 'Data Modeling']
  };
  
  return skillMap[sectionName] || [];
}

