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
  skills: text("skills").array(),
  level: integer("level").default(1),
  points: integer("points").default(0),
  streak: integer("streak").default(0),
  problemsSolved: integer("problems_solved").default(0),
  rank: integer("rank").default(0),
  createdAt: timestamp("created_at").defaultNow(),
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
  submissionTime: timestamp("submission_time").defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertAssessmentSchema = createInsertSchema(assessments).omit({
  id: true,
  createdAt: true,
});

export const insertLearningPathSchema = createInsertSchema(learningPaths).omit({
  id: true,
  createdAt: true,
});

export const insertHackathonSchema = createInsertSchema(hackathons).omit({
  id: true,
  createdAt: true,
});

export const insertUserProgressSchema = createInsertSchema(userProgress).omit({
  id: true,
});

export const insertSubmissionSchema = createInsertSchema(submissions).omit({
  id: true,
  createdAt: true,
});

export const insertActivitySchema = createInsertSchema(activities).omit({
  id: true,
  createdAt: true,
});

export const insertUserAssessmentSchema = createInsertSchema(userAssessments).omit({
  id: true,
  submissionTime: true,
});

// Login schema
export const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertAssessment = z.infer<typeof insertAssessmentSchema>;
export type Assessment = typeof assessments.$inferSelect;
export type InsertLearningPath = z.infer<typeof insertLearningPathSchema>;
export type LearningPath = typeof learningPaths.$inferSelect;
export type InsertHackathon = z.infer<typeof insertHackathonSchema>;
export type Hackathon = typeof hackathons.$inferSelect;
export type InsertUserProgress = z.infer<typeof insertUserProgressSchema>;
export type UserProgress = typeof userProgress.$inferSelect;
export type InsertSubmission = z.infer<typeof insertSubmissionSchema>;
export type Submission = typeof submissions.$inferSelect;
export type InsertActivity = z.infer<typeof insertActivitySchema>;
export type Activity = typeof activities.$inferSelect;
export type InsertUserAssessment = z.infer<typeof insertUserAssessmentSchema>;
export type UserAssessment = typeof userAssessments.$inferSelect;
export type LoginCredentials = z.infer<typeof loginSchema>;

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
