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
import adminRoutes from "./controllers/adminController";

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
  try {
    const resumeController = await import('./controllers/resumeController.js');
    app.use("/api/resume", resumeController.default);
  } catch (error: any) {
    console.log('Resume controller not available:', error?.message || 'Unknown error');
  }
  
  // Quiz routes
  app.use("/api/quizzes", quizRoutes);
  
  // Personalized learning routes
  app.use("/api/learning", personalizedLearningRoutes);

  // Admin routes
  try {
    const adminRouter = await import('./routes/admin.js');
    app.use("/api/admin", adminRouter.default);
  } catch (error: any) {
    console.log('Admin routes not available:', error?.message || 'Unknown error');
  }

  // Career recommendation routes
  try {
    const careerController = await import('./controllers/careerController');
    app.use("/api/career", careerController.default);
  } catch (error: any) {
    console.log('Career controller not available:', error?.message || 'Unknown error');
  }

  // Coding challenges routes
  try {
    const challengeController = await import('./controllers/challengeController');
    app.use("/api/challenges", challengeController.default);
  } catch (error: any) {
    console.log('Challenge controller not available:', error?.message || 'Unknown error');
  }
  
  // AI-powered recommendation routes
  try {
    const recommenderRoutes = await import('./routes/recommender.js');
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
