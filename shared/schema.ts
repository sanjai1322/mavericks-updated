import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  title: text("title").default("Developer"),
  bio: text("bio"),
  role: text("role").default("user"), // user, admin
  skills: text("skills").array(),
  extractedSkills: jsonb("extracted_skills"), // AI-extracted skills from resume
  resumeText: text("resume_text"), // Parsed resume content
  skillStrengths: jsonb("skill_strengths"), // Skill confidence levels
  personalizedPlan: jsonb("personalized_plan"), // Generated learning plan
  level: integer("level").default(1),
  points: integer("points").default(0),
  streak: integer("streak").default(0),
  problemsSolved: integer("problems_solved").default(0),
  rank: integer("rank").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  resumeUpdatedAt: timestamp("resume_updated_at"),
});

export const assessments = pgTable("assessments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description").notNull(),
  difficulty: text("difficulty").notNull(), // Easy, Medium, Hard
  topic: text("topic").notNull(),
  acceptance: text("acceptance").notNull(),
  problemStatement: text("problem_statement").notNull(),
  starterCode: text("starter_code"),
  testCases: jsonb("test_cases"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const learningPaths = pgTable("learning_paths", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description").notNull(),
  icon: text("icon").notNull(),
  difficulty: text("difficulty").notNull(),
  lessons: integer("lessons").notNull(),
  duration: text("duration").notNull(),
  progress: integer("progress").default(0),
  category: text("category").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const hackathons = pgTable("hackathons", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description").notNull(),
  status: text("status").notNull(), // Live, Upcoming, Past
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
  participants: integer("participants").default(0),
  prize: text("prize").notNull(),
  technologies: jsonb("technologies"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const userProgress = pgTable("user_progress", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  pathId: varchar("path_id").references(() => learningPaths.id),
  progress: integer("progress").default(0),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const submissions = pgTable("submissions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  hackathonId: varchar("hackathon_id").references(() => hackathons.id),
  title: text("title").notNull(),
  description: text("description").notNull(),
  rank: integer("rank"),
  score: integer("score"),
  prize: text("prize"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const activities = pgTable("activities", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  type: text("type").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const userAssessments = pgTable("user_assessments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  assessmentId: varchar("assessment_id").references(() => assessments.id),
  languageId: integer("language_id").notNull(),
  sourceCode: text("source_code").notNull(),
  score: integer("score").default(0),
  passed: boolean("passed").default(false),
  stdout: text("stdout"),
  stderr: text("stderr"),
  execTime: text("exec_time"),
  memory: integer("memory"),
  extractedSkills: text("extracted_skills").array(),
  submissionTime: timestamp("submission_time").defaultNow(),
});

// New table for resume files and metadata
export const resumes = pgTable("resumes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  fileName: text("file_name").notNull(),
  fileSize: integer("file_size").notNull(),
  mimeType: text("mime_type").notNull(),
  extractedText: text("extracted_text"),
  extractedSkills: jsonb("extracted_skills"),
  aiAnalysis: jsonb("ai_analysis"), // Full AI analysis results
  uploadedAt: timestamp("uploaded_at").defaultNow(),
});

// Personalized learning paths table
export const personalizedLearningPaths = pgTable("personalized_learning_paths", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  title: text("title").notNull(),
  description: text("description").notNull(),
  difficulty: text("difficulty").notNull(),
  estimatedDuration: text("estimated_duration").notNull(),
  skills: text("skills").array(),
  lessons: jsonb("lessons"), // Array of lesson objects
  progress: integer("progress").default(0),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Insert schemas with validation
export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true });
export const insertAssessmentSchema = createInsertSchema(assessments).omit({ id: true, createdAt: true });
export const insertLearningPathSchema = createInsertSchema(learningPaths).omit({ id: true, createdAt: true });
export const insertHackathonSchema = createInsertSchema(hackathons).omit({ id: true, createdAt: true });
export const insertUserProgressSchema = createInsertSchema(userProgress).omit({ id: true });
export const insertSubmissionSchema = createInsertSchema(submissions).omit({ id: true, createdAt: true });
export const insertActivitySchema = createInsertSchema(activities).omit({ id: true, createdAt: true });
export const insertUserAssessmentSchema = createInsertSchema(userAssessments).omit({ id: true, submissionTime: true });
export const insertResumeSchema = createInsertSchema(resumes).omit({ id: true, uploadedAt: true });
export const insertPersonalizedLearningPathSchema = createInsertSchema(personalizedLearningPaths).omit({ id: true, createdAt: true, updatedAt: true });

// Login schema
export const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

// Resume upload schema
export const resumeUploadSchema = z.object({
  fileName: z.string().min(1, "File name is required"),
  fileSize: z.number().min(1, "File size must be greater than 0"),
  mimeType: z.string().min(1, "MIME type is required"),
  fileContent: z.string().min(1, "File content is required"),
});

// Type exports
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Assessment = typeof assessments.$inferSelect;
export type InsertAssessment = z.infer<typeof insertAssessmentSchema>;
export type LearningPath = typeof learningPaths.$inferSelect;
export type InsertLearningPath = z.infer<typeof insertLearningPathSchema>;
export type Hackathon = typeof hackathons.$inferSelect;
export type InsertHackathon = z.infer<typeof insertHackathonSchema>;
export type UserProgress = typeof userProgress.$inferSelect;
export type InsertUserProgress = z.infer<typeof insertUserProgressSchema>;
export type Submission = typeof submissions.$inferSelect;
export type InsertSubmission = z.infer<typeof insertSubmissionSchema>;
export type Activity = typeof activities.$inferSelect;
export type InsertActivity = z.infer<typeof insertActivitySchema>;
export type UserAssessment = typeof userAssessments.$inferSelect;
export type InsertUserAssessment = z.infer<typeof insertUserAssessmentSchema>;
export type Resume = typeof resumes.$inferSelect;
export type InsertResume = z.infer<typeof insertResumeSchema>;
export type PersonalizedLearningPath = typeof personalizedLearningPaths.$inferSelect;
export type InsertPersonalizedLearningPath = z.infer<typeof insertPersonalizedLearningPathSchema>;
export type LoginCredentials = z.infer<typeof loginSchema>;
export type ResumeUpload = z.infer<typeof resumeUploadSchema>;

// Authentication types
export interface AuthenticatedRequest extends Request {
  user: { id: string; username: string; };
}

// Type alias for compatibility
export type LearningPathInsert = InsertPersonalizedLearningPath;

// Judge0 related types
export type Judge0Language = {
  id: number;
  name: string;
  is_archived: boolean;
  source_file: string;
  compile_cmd: string;
  run_cmd: string;
};

export type Judge0Submission = {
  language_id: number;
  source_code: string;
  stdin: string;
  expected_output: string;
};

export type Judge0Result = {
  token: string;
  status: {
    id: number;
    description: string;
  };
  stdout: string;
  stderr: string;
  compile_output: string;
  time: string;
  memory: number;
};
