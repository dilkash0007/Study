import { create } from "zustand";
import axios from "axios";
import * as SecureStore from "expo-secure-store";

interface UserState {
  userId: number | null;
  username: string | null;
  level: number;
  xp: number;
  coins: number;
  gems: number;
  streak: number;
  selectedAvatar: string;
  selectedTitle: string;
  unlockedAvatars: string[];
  unlockedTitles: string[];
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;

  // Actions
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (
    username: string,
    password: string,
    email?: string
  ) => Promise<void>;
  loadUser: () => Promise<void>;
  updateAvatar: (avatarId: string) => Promise<void>;
  updateTitle: (titleId: string) => Promise<void>;
  addXp: (amount: number) => Promise<void>;
  updateCurrency: (coins: number, gems: number) => Promise<void>;
}

// Calculate XP required for next level - same formula as web client
export const xpForNextLevel = (level: number): number => {
  return Math.floor(100 * Math.pow(1.5, level - 1));
};

export const useUserStore = create<UserState>((set, get) => ({
  userId: null,
  username: null,
  level: 1,
  xp: 0,
  coins: 0,
  gems: 0,
  streak: 0,
  selectedAvatar: "default",
  selectedTitle: "Novice",
  unlockedAvatars: ["default"],
  unlockedTitles: ["Novice"],
  isLoading: false,
  error: null,
  isAuthenticated: false,

  login: async (username: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        {
          username,
          password,
        }
      );

      const userData = response.data;
      await SecureStore.setItemAsync("user", JSON.stringify(userData));

      // Load user stats
      const statsResponse = await axios.get(
        `http://localhost:5000/api/users/${userData.id}/stats`
      );

      set({
        userId: userData.id,
        username: userData.username,
        level: statsResponse.data.level,
        xp: statsResponse.data.xp,
        coins: statsResponse.data.coins,
        gems: statsResponse.data.gems,
        streak: statsResponse.data.streak,
        selectedAvatar: statsResponse.data.selectedAvatar,
        selectedTitle: statsResponse.data.selectedTitle,
        unlockedAvatars: statsResponse.data.unlockedAvatars,
        unlockedTitles: statsResponse.data.unlockedTitles,
        isLoading: false,
        isAuthenticated: true,
      });
    } catch (error) {
      set({
        isLoading: false,
        error: error.response?.data?.message || "Failed to login",
        isAuthenticated: false,
      });
      throw error;
    }
  },

  logout: async () => {
    await SecureStore.deleteItemAsync("user");
    set({
      userId: null,
      username: null,
      level: 1,
      xp: 0,
      coins: 0,
      gems: 0,
      streak: 0,
      selectedAvatar: "default",
      selectedTitle: "Novice",
      unlockedAvatars: ["default"],
      unlockedTitles: ["Novice"],
      isAuthenticated: false,
      error: null,
    });
  },

  register: async (username: string, password: string, email?: string) => {
    set({ isLoading: true, error: null });
    try {
      await axios.post("http://localhost:5000/api/auth/register", {
        username,
        password,
        email,
      });
      // Auto login after successful registration
      await get().login(username, password);
    } catch (error) {
      set({
        isLoading: false,
        error: error.response?.data?.message || "Failed to register",
      });
      throw error;
    }
  },

  loadUser: async () => {
    set({ isLoading: true });
    try {
      const storedUser = await SecureStore.getItemAsync("user");
      if (!storedUser) {
        set({ isLoading: false, isAuthenticated: false });
        return;
      }

      const userData = JSON.parse(storedUser);

      // Load user stats
      const statsResponse = await axios.get(
        `http://localhost:5000/api/users/${userData.id}/stats`
      );

      set({
        userId: userData.id,
        username: userData.username,
        level: statsResponse.data.level,
        xp: statsResponse.data.xp,
        coins: statsResponse.data.coins,
        gems: statsResponse.data.gems,
        streak: statsResponse.data.streak,
        selectedAvatar: statsResponse.data.selectedAvatar,
        selectedTitle: statsResponse.data.selectedTitle,
        unlockedAvatars: statsResponse.data.unlockedAvatars,
        unlockedTitles: statsResponse.data.unlockedTitles,
        isLoading: false,
        isAuthenticated: true,
      });
    } catch (error) {
      console.error("Error loading user:", error);
      set({
        isLoading: false,
        error: "Failed to load user data",
        isAuthenticated: false,
      });
      // Clean up stored data if it's invalid
      await SecureStore.deleteItemAsync("user");
    }
  },

  updateAvatar: async (avatarId: string) => {
    const { userId } = get();
    if (!userId) return;

    try {
      const response = await axios.post(
        `http://localhost:5000/api/users/${userId}/avatar`,
        {
          avatarId,
        }
      );

      set({
        selectedAvatar: response.data.selectedAvatar,
        unlockedAvatars: response.data.unlockedAvatars,
      });
    } catch (error) {
      console.error("Error updating avatar:", error);
    }
  },

  updateTitle: async (titleId: string) => {
    const { userId } = get();
    if (!userId) return;

    try {
      const response = await axios.post(
        `http://localhost:5000/api/users/${userId}/title`,
        {
          titleId,
        }
      );

      set({
        selectedTitle: response.data.selectedTitle,
        unlockedTitles: response.data.unlockedTitles,
      });
    } catch (error) {
      console.error("Error updating title:", error);
    }
  },

  addXp: async (amount: number) => {
    const { userId } = get();
    if (!userId) return;

    try {
      const response = await axios.post(
        `http://localhost:5000/api/users/${userId}/xp`,
        {
          amount,
        }
      );

      set({
        level: response.data.level,
        xp: response.data.xp,
      });
    } catch (error) {
      console.error("Error adding XP:", error);
    }
  },

  updateCurrency: async (coins: number, gems: number) => {
    const { userId } = get();
    if (!userId) return;

    try {
      const response = await axios.post(
        `http://localhost:5000/api/users/${userId}/currency`,
        {
          coins,
          gems,
        }
      );

      set({
        coins: response.data.coins,
        gems: response.data.gems,
      });
    } catch (error) {
      console.error("Error updating currency:", error);
    }
  },
}));
