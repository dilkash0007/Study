// User-related types
export interface User {
  id: string;
  username: string;
  email?: string;
  avatar?: string;
  createdAt: string;
}

// Subject-related types
export interface Note {
  text: string;
  createdAt: string;
}

export interface Subject {
  id: string;
  name: string;
  description: string;
  color: string;
  icon: string;
  level: number;
  xp: number;
  totalStudyTime: number;
  lastStudied: string | null;
  notes: Note[];
}

// Quest-related types
export enum QuestType {
  DAILY = 'daily',
  EPIC = 'epic'
}

export enum QuestDifficulty {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard',
  VERY_HARD = 'very_hard'
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  type: QuestType;
  difficulty: QuestDifficulty;
  xpReward: number;
  coinReward: number;
  gemReward: number;
  isCompleted: boolean;
  createdAt: string;
  completedAt: string | null;
  progress: number;
  maxProgress: number;
}

// Achievement-related types
export enum AchievementCategory {
  STUDY = 'Study',
  QUEST = 'Quest',
  LEVEL = 'Level',
  STREAK = 'Streak'
}

export interface AchievementCondition {
  type: string;
  value: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  category: AchievementCategory;
  xpReward: number;
  coinReward: number;
  gemReward: number;
  isUnlocked: boolean;
  unlockedAt: string | null;
  icon: string;
  condition: AchievementCondition;
}

// Leaderboard-related types
export interface LeaderboardEntry {
  userId: string;
  username: string;
  avatar: string;
  level: number;
  xp: number;
  rank: number;
}

// Settings and preferences
export interface UserSettings {
  soundEnabled: boolean;
  musicEnabled: boolean;
  notificationsEnabled: boolean;
  colorTheme: string;
  language: string;
}
