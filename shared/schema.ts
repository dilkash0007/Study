import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table - for authentication and basic user info
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});

// User stats table - for game mechanics and progress
export const userStats = pgTable("user_stats", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  level: integer("level").default(1).notNull(),
  xp: integer("xp").default(0).notNull(),
  coins: integer("coins").default(0).notNull(),
  gems: integer("gems").default(0).notNull(),
  streak: integer("streak").default(0).notNull(),
  lastLogin: timestamp("last_login").defaultNow().notNull(),
  selectedAvatar: text("selected_avatar").default("default").notNull(),
  selectedTitle: text("selected_title").default("Novice").notNull(),
  unlockedAvatars: text("unlocked_avatars").array().default(["default"]).notNull(),
  unlockedTitles: text("unlocked_titles").array().default(["Novice"]).notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});

// Subjects table - for tracking study subjects
export const subjects = pgTable("subjects", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  color: text("color").notNull(),
  icon: text("icon").notNull(),
  level: integer("level").default(1).notNull(),
  xp: integer("xp").default(0).notNull(),
  totalStudyTime: integer("total_study_time").default(0).notNull(),
  lastStudied: timestamp("last_studied"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});

// Notes table - for subject notes
export const notes = pgTable("notes", {
  id: serial("id").primaryKey(),
  subjectId: integer("subject_id").references(() => subjects.id).notNull(),
  text: text("text").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

// Study sessions table - for tracking study time
export const studySessions = pgTable("study_sessions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  subjectId: integer("subject_id").references(() => subjects.id).notNull(),
  duration: integer("duration").notNull(), // in minutes
  startedAt: timestamp("started_at").defaultNow().notNull(),
  completedAt: timestamp("completed_at")
});

// Quests table - for tracking daily and epic quests
export const quests = pgTable("quests", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  type: text("type").notNull(), // 'daily' or 'epic'
  difficulty: text("difficulty").notNull(), // 'easy', 'medium', 'hard', 'very_hard'
  xpReward: integer("xp_reward").notNull(),
  coinReward: integer("coin_reward").notNull(),
  gemReward: integer("gem_reward").default(0).notNull(),
  isCompleted: boolean("is_completed").default(false).notNull(),
  progress: integer("progress").default(0).notNull(),
  maxProgress: integer("max_progress").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  completedAt: timestamp("completed_at")
});

// Achievements table - for tracking unlocked achievements
export const achievements = pgTable("achievements", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  achievementId: text("achievement_id").notNull(), // Reference to predefined achievements
  category: text("category").notNull(), // 'Study', 'Quest', 'Level', 'Streak'
  unlockedAt: timestamp("unlocked_at").defaultNow().notNull()
});

// Leaderboard table - for tracking user rankings
export const leaderboard = pgTable("leaderboard", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  weeklyXp: integer("weekly_xp").default(0).notNull(),
  monthlyXp: integer("monthly_xp").default(0).notNull(),
  allTimeXp: integer("all_time_xp").default(0).notNull(),
  weeklyRank: integer("weekly_rank"),
  monthlyRank: integer("monthly_rank"),
  allTimeRank: integer("all_time_rank"),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});

// Zod schemas for validation
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true
});

export const insertSubjectSchema = createInsertSchema(subjects).pick({
  name: true,
  description: true,
  color: true,
  icon: true
});

export const insertStudySessionSchema = createInsertSchema(studySessions).pick({
  subjectId: true,
  duration: true
});

export const insertQuestSchema = createInsertSchema(quests).pick({
  title: true,
  description: true,
  type: true,
  difficulty: true,
  xpReward: true,
  coinReward: true,
  gemReward: true,
  maxProgress: true
});

// Export types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertSubject = z.infer<typeof insertSubjectSchema>;
export type Subject = typeof subjects.$inferSelect;

export type InsertStudySession = z.infer<typeof insertStudySessionSchema>;
export type StudySession = typeof studySessions.$inferSelect;

export type InsertQuest = z.infer<typeof insertQuestSchema>;
export type Quest = typeof quests.$inferSelect;

export type UserStat = typeof userStats.$inferSelect;
export type Note = typeof notes.$inferSelect;
export type Achievement = typeof achievements.$inferSelect;
export type LeaderboardEntry = typeof leaderboard.$inferSelect;
