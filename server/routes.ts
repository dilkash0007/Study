import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

// Helper function to handle async routes
const asyncHandler = (fn: Function) => (req: Request, res: Response) => {
  Promise.resolve(fn(req, res)).catch((err) => {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  });
};

export async function registerRoutes(app: Express): Promise<Server> {
  // AUTH ROUTES
  // Register a new user
  app.post("/api/auth/register", asyncHandler(async (req: Request, res: Response) => {
    const { username, password, email } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }
    
    try {
      const existingUser = await storage.getUserByUsername(username);
      if (existingUser) {
        return res.status(409).json({ message: "Username already exists" });
      }
      
      const user = await storage.createUser({ username, password, email });
      
      // Initialize user stats and default data
      await storage.initializeUserData(user.id);
      
      // Return user data (without password)
      const { password: _, ...userData } = user;
      res.status(201).json(userData);
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ message: "Failed to register user" });
    }
  }));
  
  // Login user
  app.post("/api/auth/login", asyncHandler(async (req: Request, res: Response) => {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }
    
    try {
      const user = await storage.getUserByUsername(username);
      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid username or password" });
      }
      
      // Update login streak
      await storage.updateLoginStreak(user.id);
      
      // Return user data (without password)
      const { password: _, ...userData } = user;
      res.status(200).json(userData);
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Failed to login" });
    }
  }));
  
  // USER STATS ROUTES
  // Get user stats
  app.get("/api/users/:userId/stats", asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.params;
    
    try {
      const userStats = await storage.getUserStats(parseInt(userId));
      if (!userStats) {
        return res.status(404).json({ message: "User stats not found" });
      }
      
      res.status(200).json(userStats);
    } catch (error) {
      console.error("Get user stats error:", error);
      res.status(500).json({ message: "Failed to get user stats" });
    }
  }));
  
  // Update user XP
  app.post("/api/users/:userId/xp", asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.params;
    const { amount } = req.body;
    
    if (isNaN(amount)) {
      return res.status(400).json({ message: "Amount must be a number" });
    }
    
    try {
      const updatedStats = await storage.addUserXP(parseInt(userId), amount);
      res.status(200).json(updatedStats);
    } catch (error) {
      console.error("Update XP error:", error);
      res.status(500).json({ message: "Failed to update XP" });
    }
  }));
  
  // Update user currency (coins/gems)
  app.post("/api/users/:userId/currency", asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.params;
    const { coins, gems } = req.body;
    
    try {
      const updatedStats = await storage.updateUserCurrency(parseInt(userId), coins || 0, gems || 0);
      res.status(200).json(updatedStats);
    } catch (error) {
      console.error("Update currency error:", error);
      res.status(500).json({ message: "Failed to update currency" });
    }
  }));
  
  // Update user avatar
  app.post("/api/users/:userId/avatar", asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.params;
    const { avatarId } = req.body;
    
    if (!avatarId) {
      return res.status(400).json({ message: "Avatar ID is required" });
    }
    
    try {
      const updatedStats = await storage.updateUserAvatar(parseInt(userId), avatarId);
      res.status(200).json(updatedStats);
    } catch (error) {
      console.error("Update avatar error:", error);
      res.status(500).json({ message: "Failed to update avatar" });
    }
  }));
  
  // Update user title
  app.post("/api/users/:userId/title", asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.params;
    const { titleId } = req.body;
    
    if (!titleId) {
      return res.status(400).json({ message: "Title ID is required" });
    }
    
    try {
      const updatedStats = await storage.updateUserTitle(parseInt(userId), titleId);
      res.status(200).json(updatedStats);
    } catch (error) {
      console.error("Update title error:", error);
      res.status(500).json({ message: "Failed to update title" });
    }
  }));
  
  // SUBJECT ROUTES
  // Get user subjects
  app.get("/api/users/:userId/subjects", asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.params;
    
    try {
      const subjects = await storage.getUserSubjects(parseInt(userId));
      res.status(200).json(subjects);
    } catch (error) {
      console.error("Get subjects error:", error);
      res.status(500).json({ message: "Failed to get subjects" });
    }
  }));
  
  // Create a new subject
  app.post("/api/users/:userId/subjects", asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.params;
    const { name, description, color, icon } = req.body;
    
    if (!name || !description || !color || !icon) {
      return res.status(400).json({ message: "Name, description, color, and icon are required" });
    }
    
    try {
      const subject = await storage.createSubject(parseInt(userId), { name, description, color, icon });
      res.status(201).json(subject);
    } catch (error) {
      console.error("Create subject error:", error);
      res.status(500).json({ message: "Failed to create subject" });
    }
  }));
  
  // Add study time to a subject
  app.post("/api/subjects/:subjectId/study", asyncHandler(async (req: Request, res: Response) => {
    const { subjectId } = req.params;
    const { userId, duration } = req.body;
    
    if (!userId || !duration) {
      return res.status(400).json({ message: "User ID and duration are required" });
    }
    
    try {
      const result = await storage.addSubjectStudyTime(parseInt(userId), parseInt(subjectId), duration);
      res.status(200).json(result);
    } catch (error) {
      console.error("Add study time error:", error);
      res.status(500).json({ message: "Failed to add study time" });
    }
  }));
  
  // Add a note to a subject
  app.post("/api/subjects/:subjectId/notes", asyncHandler(async (req: Request, res: Response) => {
    const { subjectId } = req.params;
    const { text } = req.body;
    
    if (!text) {
      return res.status(400).json({ message: "Note text is required" });
    }
    
    try {
      const note = await storage.addSubjectNote(parseInt(subjectId), text);
      res.status(201).json(note);
    } catch (error) {
      console.error("Add note error:", error);
      res.status(500).json({ message: "Failed to add note" });
    }
  }));
  
  // QUEST ROUTES
  // Get user quests
  app.get("/api/users/:userId/quests", asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.params;
    const { type } = req.query; // optional filter by type (daily/epic)
    
    try {
      const quests = await storage.getUserQuests(parseInt(userId), type as string);
      res.status(200).json(quests);
    } catch (error) {
      console.error("Get quests error:", error);
      res.status(500).json({ message: "Failed to get quests" });
    }
  }));
  
  // Update quest progress
  app.post("/api/quests/:questId/progress", asyncHandler(async (req: Request, res: Response) => {
    const { questId } = req.params;
    const { userId, progress } = req.body;
    
    if (isNaN(progress)) {
      return res.status(400).json({ message: "Progress must be a number" });
    }
    
    try {
      const quest = await storage.updateQuestProgress(parseInt(userId), parseInt(questId), progress);
      res.status(200).json(quest);
    } catch (error) {
      console.error("Update quest progress error:", error);
      res.status(500).json({ message: "Failed to update quest progress" });
    }
  }));
  
  // Complete a quest
  app.post("/api/quests/:questId/complete", asyncHandler(async (req: Request, res: Response) => {
    const { questId } = req.params;
    const { userId } = req.body;
    
    try {
      const result = await storage.completeQuest(parseInt(userId), parseInt(questId));
      res.status(200).json(result);
    } catch (error) {
      console.error("Complete quest error:", error);
      res.status(500).json({ message: "Failed to complete quest" });
    }
  }));
  
  // Refresh daily quests
  app.post("/api/users/:userId/quests/refresh", asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.params;
    
    try {
      const refreshedQuests = await storage.refreshDailyQuests(parseInt(userId));
      res.status(200).json(refreshedQuests);
    } catch (error) {
      console.error("Refresh quests error:", error);
      res.status(500).json({ message: "Failed to refresh quests" });
    }
  }));
  
  // ACHIEVEMENT ROUTES
  // Get user achievements
  app.get("/api/users/:userId/achievements", asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.params;
    
    try {
      const achievements = await storage.getUserAchievements(parseInt(userId));
      res.status(200).json(achievements);
    } catch (error) {
      console.error("Get achievements error:", error);
      res.status(500).json({ message: "Failed to get achievements" });
    }
  }));
  
  // Check for new achievements (after various actions)
  app.post("/api/users/:userId/achievements/check", asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.params;
    const { type, value } = req.body;
    
    try {
      const newlyUnlocked = await storage.checkAchievements(parseInt(userId), type, value);
      res.status(200).json({ newlyUnlocked });
    } catch (error) {
      console.error("Check achievements error:", error);
      res.status(500).json({ message: "Failed to check achievements" });
    }
  }));
  
  // LEADERBOARD ROUTES
  // Get leaderboard
  app.get("/api/leaderboard", asyncHandler(async (req: Request, res: Response) => {
    const { timeframe = 'weekly', limit = 10 } = req.query;
    
    try {
      const leaderboard = await storage.getLeaderboard(timeframe as string, parseInt(limit as string));
      res.status(200).json(leaderboard);
    } catch (error) {
      console.error("Get leaderboard error:", error);
      res.status(500).json({ message: "Failed to get leaderboard" });
    }
  }));
  
  // Get user rank
  app.get("/api/users/:userId/rank", asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.params;
    const { timeframe = 'weekly' } = req.query;
    
    try {
      const rank = await storage.getUserRank(parseInt(userId), timeframe as string);
      res.status(200).json(rank);
    } catch (error) {
      console.error("Get user rank error:", error);
      res.status(500).json({ message: "Failed to get user rank" });
    }
  }));
  
  const httpServer = createServer(app);
  return httpServer;
}
