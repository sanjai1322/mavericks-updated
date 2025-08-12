import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import authRoutes from "./controllers/authController";
import profileRoutes from "./controllers/profileController";
import assessmentRoutes from "./controllers/assessmentController";
import learningRoutes from "./controllers/learningController";
import hackathonRoutes from "./controllers/hackathonController";
import leaderboardRoutes from "./controllers/leaderboardController";
import resumeRoutes from "./controllers/resumeRoutes";
import quizRoutes from "./controllers/quizRoutes";
import personalizedLearningRoutes from "./controllers/learningRoutes";

export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication routes
  app.use("/api/auth", authRoutes);
  
  // Profile routes
  app.use("/api/profile", profileRoutes);
  
  // Assessment routes
  app.use("/api/assessments", assessmentRoutes);
  
  // Learning path routes
  app.use("/api/learning-path", learningRoutes);
  
  // Hackathon routes
  app.use("/api/hackathons", hackathonRoutes);
  
  // Leaderboard routes
  app.use("/api/leaderboard", leaderboardRoutes);
  
  // Resume routes
  app.use("/api/resume", resumeRoutes);
  
  // Quiz routes
  app.use("/api/quizzes", quizRoutes);
  
  // Personalized learning routes
  app.use("/api/learning", personalizedLearningRoutes);
  
  // AI-powered recommendation routes
  try {
    const recommenderRoutes = await import('./routes/recommender.js') as any;
    app.use('/api', recommenderRoutes.default);
  } catch (error: any) {
    console.log('Legacy AI routes not available:', error?.message || 'Unknown error');
  }

  // New recommendation system routes
  try {
    const { recommendationRoutes } = await import('./controllers/recommendationController');
    app.use('/api/recommendations', recommendationRoutes);
  } catch (error: any) {
    console.log('Recommendation routes not available:', error?.message || 'Unknown error');
  }

  const httpServer = createServer(app);
  return httpServer;
}
