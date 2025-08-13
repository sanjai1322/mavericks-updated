import { 
  type User, 
  type InsertUser, 
  type Assessment,
  type InsertAssessment,
  type LearningPath,
  type InsertLearningPath,
  type Hackathon,
  type InsertHackathon,
  type UserProgress,
  type InsertUserProgress,
  type Submission,
  type InsertSubmission,
  type Activity,
  type InsertActivity,
  type UserAssessment,
  type InsertUserAssessment,
  type Resume,
  type InsertResume,
  users,
  assessments,
  learningPaths,
  hackathons,
  userProgress,
  submissions,
  activities,
  userAssessments,
  resumes
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, sql } from "drizzle-orm";
import type { IStorage } from "./storage";

export class DatabaseStorage implements IStorage {
  // User methods
  async getUsers(): Promise<User[]> {
    return await db.select().from(users).orderBy(desc(users.createdAt));
  }

  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(user: InsertUser): Promise<User> {
    const [newUser] = await db.insert(users).values(user).returning();
    return newUser;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | undefined> {
    const [updatedUser] = await db.update(users).set(updates).where(eq(users.id, id)).returning();
    return updatedUser || undefined;
  }

  // Assessment methods
  async getAssessments(): Promise<Assessment[]> {
    return await db.select().from(assessments).orderBy(desc(assessments.createdAt));
  }

  async getAssessment(id: string): Promise<Assessment | undefined> {
    const [assessment] = await db.select().from(assessments).where(eq(assessments.id, id));
    return assessment || undefined;
  }

  async createAssessment(assessment: InsertAssessment): Promise<Assessment> {
    const [newAssessment] = await db.insert(assessments).values(assessment).returning();
    return newAssessment;
  }

  async updateAssessment(id: string, updates: Partial<Assessment>): Promise<Assessment | undefined> {
    const [updatedAssessment] = await db.update(assessments).set(updates).where(eq(assessments.id, id)).returning();
    return updatedAssessment || undefined;
  }

  async deleteAssessment(id: string): Promise<boolean> {
    const result = await db.delete(assessments).where(eq(assessments.id, id));
    return result.rowCount! > 0;
  }

  // Learning Path methods
  async getLearningPaths(): Promise<LearningPath[]> {
    return await db.select().from(learningPaths).orderBy(desc(learningPaths.createdAt));
  }

  async getLearningPath(id: string): Promise<LearningPath | undefined> {
    const [path] = await db.select().from(learningPaths).where(eq(learningPaths.id, id));
    return path || undefined;
  }

  async createLearningPath(path: InsertLearningPath): Promise<LearningPath> {
    const [newPath] = await db.insert(learningPaths).values(path).returning();
    return newPath;
  }

  async getUserLearningPaths(userId: string): Promise<LearningPath[]> {
    const progressData = await db
      .select({
        path: learningPaths,
        progress: userProgress.progress
      })
      .from(learningPaths)
      .leftJoin(userProgress, eq(learningPaths.id, userProgress.pathId))
      .where(eq(userProgress.userId, userId));

    return progressData.map(item => ({
      ...item.path,
      progress: item.progress || 0
    }));
  }

  // Hackathon methods
  async getHackathons(): Promise<Hackathon[]> {
    return await db.select().from(hackathons).orderBy(desc(hackathons.createdAt));
  }

  async getHackathonsByStatus(status: string): Promise<Hackathon[]> {
    return await db.select().from(hackathons).where(eq(hackathons.status, status));
  }

  async getHackathon(id: string): Promise<Hackathon | undefined> {
    const [hackathon] = await db.select().from(hackathons).where(eq(hackathons.id, id));
    return hackathon || undefined;
  }

  async createHackathon(hackathon: InsertHackathon): Promise<Hackathon> {
    const [newHackathon] = await db.insert(hackathons).values(hackathon).returning();
    return newHackathon;
  }

  // User Progress methods
  async getUserProgress(userId: string): Promise<UserProgress[]> {
    return await db.select().from(userProgress).where(eq(userProgress.userId, userId));
  }

  async updateUserProgress(progress: InsertUserProgress): Promise<UserProgress> {
    const existing = await db
      .select()
      .from(userProgress)
      .where(eq(userProgress.userId, progress.userId!) && eq(userProgress.pathId, progress.pathId!));

    if (existing.length > 0) {
      const [updated] = await db
        .update(userProgress)
        .set({ progress: progress.progress, updatedAt: new Date() })
        .where(eq(userProgress.userId, progress.userId!) && eq(userProgress.pathId, progress.pathId!))
        .returning();
      return updated;
    } else {
      const [newProgress] = await db.insert(userProgress).values(progress).returning();
      return newProgress;
    }
  }

  // Submission methods
  async getUserSubmissions(userId: string): Promise<Submission[]> {
    return await db.select().from(submissions).where(eq(submissions.userId, userId));
  }

  async createSubmission(submission: InsertSubmission): Promise<Submission> {
    const [newSubmission] = await db.insert(submissions).values(submission).returning();
    return newSubmission;
  }

  // Activity methods
  async getUserActivities(userId: string): Promise<Activity[]> {
    return await db.select().from(activities).where(eq(activities.userId, userId)).orderBy(desc(activities.createdAt));
  }

  async createActivity(activity: InsertActivity): Promise<Activity> {
    const [newActivity] = await db.insert(activities).values(activity).returning();
    return newActivity;
  }

  // Leaderboard methods
  async getLeaderboard(): Promise<User[]> {
    return await db.select().from(users).orderBy(desc(users.points), desc(users.problemsSolved));
  }

  // User Assessment methods
  async getUserAssessments(userId: string): Promise<UserAssessment[]> {
    return await db.select().from(userAssessments).where(eq(userAssessments.userId, userId));
  }

  async getUserAssessmentByChallenge(userId: string, assessmentId: string): Promise<UserAssessment | undefined> {
    const [assessment] = await db
      .select()
      .from(userAssessments)
      .where(eq(userAssessments.userId, userId) && eq(userAssessments.assessmentId, assessmentId));
    return assessment || undefined;
  }

  async createUserAssessment(assessment: InsertUserAssessment): Promise<UserAssessment> {
    const [newAssessment] = await db.insert(userAssessments).values(assessment).returning();
    return newAssessment;
  }

  // Resume methods
  async getUserResumes(userId: string): Promise<Resume[]> {
    return await db.select().from(resumes).where(eq(resumes.userId, userId)).orderBy(desc(resumes.uploadedAt));
  }

  async getLatestUserResume(userId: string): Promise<Resume | undefined> {
    const [resume] = await db
      .select()
      .from(resumes)
      .where(eq(resumes.userId, userId))
      .orderBy(desc(resumes.uploadedAt))
      .limit(1);
    return resume || undefined;
  }

  async createResume(resume: InsertResume): Promise<Resume> {
    const [newResume] = await db.insert(resumes).values(resume).returning();
    return newResume;
  }

  async updateResume(id: string, updates: Partial<Resume>): Promise<Resume | undefined> {
    const [updatedResume] = await db.update(resumes).set(updates).where(eq(resumes.id, id)).returning();
    return updatedResume || undefined;
  }

  // Resume analysis methods
  async getResumeAnalysis(userId: string): Promise<any> {
    const resume = await this.getLatestUserResume(userId);
    return resume?.aiAnalysis || null;
  }

  async saveResumeAnalysis(userId: string, analysis: any): Promise<void> {
    const resume = await this.getLatestUserResume(userId);
    if (resume) {
      await this.updateResume(resume.id, { aiAnalysis: analysis });
    }
  }

  // Generated content methods
  async saveGeneratedContent(userId: string, content: any): Promise<void> {
    await this.updateUser(userId, { personalizedPlan: content });
  }

  async getGeneratedContent(userId: string): Promise<any> {
    const user = await this.getUser(userId);
    return user?.personalizedPlan || null;
  }
}

export const storage = new DatabaseStorage();