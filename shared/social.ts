import {
  pgTable,
  text,
  serial,
  integer,
  timestamp,
  boolean,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { users } from "./schema";

// Friend relationships between users
export const friendships = pgTable("friendships", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .references(() => users.id)
    .notNull(),
  friendId: integer("friend_id")
    .references(() => users.id)
    .notNull(),
  status: text("status").notNull(), // "pending", "accepted", "rejected", "blocked"
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Study groups for collaborative learning
export const studyGroups = pgTable("study_groups", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  ownerId: integer("owner_id")
    .references(() => users.id)
    .notNull(),
  inviteCode: text("invite_code").notNull().unique(),
  isPrivate: boolean("is_private").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Study group members
export const studyGroupMembers = pgTable("study_group_members", {
  id: serial("id").primaryKey(),
  groupId: integer("group_id")
    .references(() => studyGroups.id)
    .notNull(),
  userId: integer("user_id")
    .references(() => users.id)
    .notNull(),
  role: text("role").default("member").notNull(), // "owner", "admin", "member"
  joinedAt: timestamp("joined_at").defaultNow().notNull(),
});

// Group study sessions - collaborative study time
export const groupStudySessions = pgTable("group_study_sessions", {
  id: serial("id").primaryKey(),
  groupId: integer("group_id")
    .references(() => studyGroups.id)
    .notNull(),
  creatorId: integer("creator_id")
    .references(() => users.id)
    .notNull(),
  title: text("title").notNull(),
  description: text("description"),
  scheduledStart: timestamp("scheduled_start"),
  scheduledEnd: timestamp("scheduled_end"),
  actualStart: timestamp("actual_start"),
  actualEnd: timestamp("actual_end"),
  status: text("status").default("scheduled").notNull(), // "scheduled", "in_progress", "completed", "cancelled"
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Group study session participants
export const groupStudyParticipants = pgTable("group_study_participants", {
  id: serial("id").primaryKey(),
  sessionId: integer("session_id")
    .references(() => groupStudySessions.id)
    .notNull(),
  userId: integer("user_id")
    .references(() => users.id)
    .notNull(),
  joinedAt: timestamp("joined_at").defaultNow().notNull(),
  leftAt: timestamp("left_at"),
  totalTime: integer("total_time"), // in minutes
  status: text("status").default("joined").notNull(), // "joined", "left", "completed"
});

// User challenges - competitive learning goals between friends
export const challenges = pgTable("challenges", {
  id: serial("id").primaryKey(),
  creatorId: integer("creator_id")
    .references(() => users.id)
    .notNull(),
  challengedId: integer("challenged_id")
    .references(() => users.id)
    .notNull(),
  title: text("title").notNull(),
  description: text("description"),
  type: text("type").notNull(), // "study_time", "xp_gain", "quest_completion"
  target: integer("target").notNull(), // target value to reach
  startDate: timestamp("start_date").defaultNow().notNull(),
  endDate: timestamp("end_date").notNull(),
  creatorProgress: integer("creator_progress").default(0).notNull(),
  challengedProgress: integer("challenged_progress").default(0).notNull(),
  status: text("status").default("active").notNull(), // "active", "completed", "cancelled"
  winnerId: integer("winner_id").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Messages for study groups
export const groupMessages = pgTable("group_messages", {
  id: serial("id").primaryKey(),
  groupId: integer("group_id")
    .references(() => studyGroups.id)
    .notNull(),
  userId: integer("user_id")
    .references(() => users.id)
    .notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Direct messages between users
export const directMessages = pgTable("direct_messages", {
  id: serial("id").primaryKey(),
  senderId: integer("sender_id")
    .references(() => users.id)
    .notNull(),
  receiverId: integer("receiver_id")
    .references(() => users.id)
    .notNull(),
  message: text("message").notNull(),
  isRead: boolean("is_read").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Zod schemas for validation
export const insertFriendshipSchema = createInsertSchema(friendships).pick({
  userId: true,
  friendId: true,
  status: true,
});

export const insertStudyGroupSchema = createInsertSchema(studyGroups).pick({
  name: true,
  description: true,
  ownerId: true,
  isPrivate: true,
});

export const insertGroupStudySessionSchema = createInsertSchema(
  groupStudySessions
).pick({
  groupId: true,
  creatorId: true,
  title: true,
  description: true,
  scheduledStart: true,
  scheduledEnd: true,
});

export const insertChallengeSchema = createInsertSchema(challenges).pick({
  creatorId: true,
  challengedId: true,
  title: true,
  description: true,
  type: true,
  target: true,
  endDate: true,
});

// Export types
export type InsertFriendship = z.infer<typeof insertFriendshipSchema>;
export type Friendship = typeof friendships.$inferSelect;

export type InsertStudyGroup = z.infer<typeof insertStudyGroupSchema>;
export type StudyGroup = typeof studyGroups.$inferSelect;

export type InsertGroupStudySession = z.infer<
  typeof insertGroupStudySessionSchema
>;
export type GroupStudySession = typeof groupStudySessions.$inferSelect;

export type InsertChallenge = z.infer<typeof insertChallengeSchema>;
export type Challenge = typeof challenges.$inferSelect;

export type StudyGroupMember = typeof studyGroupMembers.$inferSelect;
export type GroupStudyParticipant = typeof groupStudyParticipants.$inferSelect;
export type GroupMessage = typeof groupMessages.$inferSelect;
export type DirectMessage = typeof directMessages.$inferSelect;
