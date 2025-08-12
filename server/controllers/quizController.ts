import { Request, Response } from "express";
import { storage } from "../storage";
import { allQuizzes, quizCategories } from "../../shared/comprehensive-quiz-data";
import type { Quiz, QuizSubmission } from "../../shared/quiz-schema";
import type { AuthenticatedRequest, User } from "../../shared/schema";

// Get all available quizzes
export const getAllQuizzes = async (req: Request, res: Response) => {
  try {
    const { language, category, difficulty } = req.query;
    
    let filteredQuizzes = allQuizzes;
    
    // Filter by language
    if (language && typeof language === 'string') {
      filteredQuizzes = filteredQuizzes.filter(quiz => 
        quiz.language.toLowerCase() === language.toLowerCase()
      );
    }
    
    // Filter by difficulty (filter questions within quizzes)
    if (difficulty && typeof difficulty === 'string') {
      filteredQuizzes = filteredQuizzes.map(quiz => ({
        ...quiz,
        questions: quiz.questions.filter(q => 
          q.difficulty.toLowerCase() === difficulty.toLowerCase()
        )
      })).filter(quiz => quiz.questions.length > 0);
    }
    
    res.json({
      quizzes: filteredQuizzes,
      categories: quizCategories
    });
  } catch (error) {
    console.error('Error fetching quizzes:', error);
    res.status(500).json({ message: 'Failed to fetch quizzes' });
  }
};

// Get a specific quiz by ID
export const getQuizById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const quiz = allQuizzes.find(q => q.id === id);
    
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }
    
    res.json(quiz);
  } catch (error) {
    console.error('Error fetching quiz:', error);
    res.status(500).json({ message: 'Failed to fetch quiz' });
  }
};

// Submit quiz answers and calculate score
export const submitQuiz = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const { quizId, answers, timeSpent } = req.body;
    
    if (!quizId || !Array.isArray(answers)) {
      return res.status(400).json({ message: "Quiz ID and answers are required" });
    }
    
    const quiz = allQuizzes.find(q => q.id === quizId);
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }
    
    // Calculate score
    let correctAnswers = 0;
    const questionResults = quiz.questions.map((question, index) => {
      const userAnswer = answers[index];
      const isCorrect = userAnswer === question.correctAnswer;
      if (isCorrect) correctAnswers++;
      
      return {
        questionId: question.id,
        question: question.question,
        userAnswer,
        correctAnswer: question.correctAnswer,
        isCorrect,
        explanation: question.explanation,
        difficulty: question.difficulty,
        topic: question.topic
      };
    });
    
    const score = Math.round((correctAnswers / quiz.questions.length) * 100);
    
    // Analyze performance by topic and difficulty
    const topicAnalysis = analyzePerformanceByTopic(questionResults);
    const difficultyAnalysis = analyzePerformanceByDifficulty(questionResults);
    
    // Store submission (you might want to add this to your storage interface)
    const submissionId = `quiz-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    // Generate personalized recommendations based on performance
    const recommendations = generateQuizRecommendations(quiz.language, topicAnalysis, difficultyAnalysis, score);
    
    // Update user's skill strengths based on quiz results
    await updateUserSkillsFromQuiz(req.user.id, quiz.language, topicAnalysis, score);
    
    const result = {
      submissionId,
      quizId,
      score,
      correctAnswers,
      totalQuestions: quiz.questions.length,
      timeSpent: timeSpent || 0,
      questionResults,
      topicAnalysis,
      difficultyAnalysis,
      recommendations,
      submittedAt: new Date()
    };
    
    res.json(result);
    
    console.log(`Quiz submitted: User ${req.user.id}, Quiz: ${quizId}, Score: ${score}%`);
    
  } catch (error) {
    console.error('Error submitting quiz:', error);
    res.status(500).json({ message: 'Failed to submit quiz' });
  }
};

// Get user's quiz history
export const getUserQuizHistory = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required" });
    }
    
    // This would typically fetch from database
    // For now, return empty array as we haven't implemented quiz storage yet
    res.json([]);
  } catch (error) {
    console.error('Error fetching quiz history:', error);
    res.status(500).json({ message: 'Failed to fetch quiz history' });
  }
};

// Helper function to analyze performance by topic
function analyzePerformanceByTopic(questionResults: any[]) {
  const topicStats: Record<string, { correct: number; total: number; percentage: number }> = {};
  
  questionResults.forEach(result => {
    if (!topicStats[result.topic]) {
      topicStats[result.topic] = { correct: 0, total: 0, percentage: 0 };
    }
    topicStats[result.topic].total++;
    if (result.isCorrect) {
      topicStats[result.topic].correct++;
    }
  });
  
  // Calculate percentages
  Object.keys(topicStats).forEach(topic => {
    const stats = topicStats[topic];
    stats.percentage = Math.round((stats.correct / stats.total) * 100);
  });
  
  return topicStats;
}

// Helper function to analyze performance by difficulty
function analyzePerformanceByDifficulty(questionResults: any[]) {
  const difficultyStats: Record<string, { correct: number; total: number; percentage: number }> = {};
  
  questionResults.forEach(result => {
    if (!difficultyStats[result.difficulty]) {
      difficultyStats[result.difficulty] = { correct: 0, total: 0, percentage: 0 };
    }
    difficultyStats[result.difficulty].total++;
    if (result.isCorrect) {
      difficultyStats[result.difficulty].correct++;
    }
  });
  
  // Calculate percentages
  Object.keys(difficultyStats).forEach(difficulty => {
    const stats = difficultyStats[difficulty];
    stats.percentage = Math.round((stats.correct / stats.total) * 100);
  });
  
  return difficultyStats;
}

// Generate personalized recommendations based on quiz performance
function generateQuizRecommendations(language: string, topicAnalysis: any, difficultyAnalysis: any, score: number) {
  const recommendations = [];
  
  // Find weak topics (< 70% accuracy)
  const weakTopics = Object.entries(topicAnalysis)
    .filter(([_, stats]: [string, any]) => stats.percentage < 70)
    .map(([topic, _]) => topic);
  
  if (weakTopics.length > 0) {
    recommendations.push({
      type: 'topic_improvement',
      title: `Focus on ${weakTopics.join(', ')}`,
      description: `You scored below 70% in these topics. Consider reviewing fundamentals and practicing more problems.`,
      action: 'Take targeted practice quizzes',
      priority: 'high'
    });
  }
  
  // Recommend difficulty progression
  if (difficultyAnalysis.Easy?.percentage >= 80 && (!difficultyAnalysis.Medium || difficultyAnalysis.Medium.percentage < 70)) {
    recommendations.push({
      type: 'difficulty_progression',
      title: 'Ready for Medium Difficulty',
      description: 'You\'re doing well with easy questions. Challenge yourself with medium difficulty problems.',
      action: 'Take medium difficulty quizzes',
      priority: 'medium'
    });
  }
  
  if (difficultyAnalysis.Medium?.percentage >= 80 && (!difficultyAnalysis.Hard || difficultyAnalysis.Hard.percentage < 70)) {
    recommendations.push({
      type: 'difficulty_progression', 
      title: 'Ready for Advanced Topics',
      description: 'Your medium-level performance is strong. Time to tackle hard problems.',
      action: 'Take advanced difficulty quizzes',
      priority: 'medium'
    });
  }
  
  // Overall performance recommendations
  if (score >= 90) {
    recommendations.push({
      type: 'achievement',
      title: 'Excellent Performance!',
      description: `Outstanding ${score}% score! Consider exploring advanced ${language} topics or a new language.`,
      action: 'Explore advanced topics or new languages',
      priority: 'low'
    });
  } else if (score >= 70) {
    recommendations.push({
      type: 'improvement',
      title: 'Good Progress!',
      description: `Solid ${score}% score. Focus on weak areas to reach expert level.`,
      action: 'Review missed concepts and practice more',
      priority: 'medium'
    });
  } else {
    recommendations.push({
      type: 'review',
      title: 'Review Fundamentals',
      description: `${score}% indicates need for fundamental review. Don't worry - practice makes perfect!`,
      action: 'Study core concepts and retake quiz',
      priority: 'high'
    });
  }
  
  return recommendations;
}

// Update user's skill strengths based on quiz performance
async function updateUserSkillsFromQuiz(userId: string, language: string, topicAnalysis: any, score: number) {
  try {
    const user = await storage.getUserById(userId);
    if (!user) return;
    
    const skillStrengths = user.skillStrengths || {};
    
    // Update or add skill based on quiz performance
    const skillLevel = score >= 90 ? 0.9 : 
                      score >= 80 ? 0.8 : 
                      score >= 70 ? 0.7 : 
                      score >= 60 ? 0.6 : 0.5;
    
    skillStrengths[language] = skillLevel;
    
    // Update topic-specific skills if they performed well (>80%)
    Object.entries(topicAnalysis).forEach(([topic, stats]: [string, any]) => {
      if (stats.percentage >= 80) {
        const topicSkill = `${language} ${topic}`;
        skillStrengths[topicSkill] = Math.min(stats.percentage / 100, 1.0);
      }
    });
    
    await storage.updateUser(userId, { skillStrengths });
    
  } catch (error) {
    console.error('Error updating user skills from quiz:', error);
  }
}