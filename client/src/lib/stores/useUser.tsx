import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/types';

interface UserState {
  // User data
  user: User | null;
  isLoading: boolean;
  xp: number;
  level: number;
  coins: number;
  gems: number;
  
  // Avatar customization
  selectedAvatar: string;
  unlockedAvatars: string[];
  selectedTitle: string;
  unlockedTitles: string[];
  
  // Methods
  setUser: (user: User | null) => void;
  addXP: (amount: number) => void;
  addCoins: (amount: number) => void;
  addGems: (amount: number) => void;
  unlockAvatar: (avatarId: string) => void;
  selectAvatar: (avatarId: string) => void;
  unlockTitle: (titleId: string) => void;
  selectTitle: (titleId: string) => void;
}

// Calculate level based on XP using standard RPG progression
const calculateLevel = (xp: number): number => {
  return Math.floor(Math.sqrt(xp / 10)) + 1;
};

// Calculate XP needed for next level
export const xpForNextLevel = (level: number): number => {
  return (level * level) * 10;
};

export const useUser = create<UserState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      isLoading: true,
      xp: 0,
      level: 1,
      coins: 0,
      gems: 0,
      selectedAvatar: 'default',
      unlockedAvatars: ['default'],
      selectedTitle: 'Novice',
      unlockedTitles: ['Novice'],
      
      // Set user information
      setUser: (user) => set({ user, isLoading: false }),
      
      // Add XP and update level if needed
      addXP: (amount) => set((state) => {
        const newXP = state.xp + amount;
        const newLevel = calculateLevel(newXP);
        const leveledUp = newLevel > state.level;
        
        // If leveled up, give bonus rewards
        if (leveledUp) {
          const bonusCoins = (newLevel - state.level) * 50;
          const bonusGems = (newLevel - state.level) * 5;
          
          return {
            xp: newXP,
            level: newLevel,
            coins: state.coins + bonusCoins,
            gems: state.gems + bonusGems
          };
        }
        
        return { xp: newXP, level: newLevel };
      }),
      
      // Add coins
      addCoins: (amount) => set((state) => ({
        coins: state.coins + amount
      })),
      
      // Add gems
      addGems: (amount) => set((state) => ({
        gems: state.gems + amount
      })),
      
      // Unlock a new avatar
      unlockAvatar: (avatarId) => set((state) => ({
        unlockedAvatars: [...state.unlockedAvatars, avatarId]
      })),
      
      // Select an avatar from unlocked ones
      selectAvatar: (avatarId) => set((state) => {
        if (state.unlockedAvatars.includes(avatarId)) {
          return { selectedAvatar: avatarId };
        }
        return {};
      }),
      
      // Unlock a new title
      unlockTitle: (titleId) => set((state) => ({
        unlockedTitles: [...state.unlockedTitles, titleId]
      })),
      
      // Select a title from unlocked ones
      selectTitle: (titleId) => set((state) => {
        if (state.unlockedTitles.includes(titleId)) {
          return { selectedTitle: titleId };
        }
        return {};
      })
    }),
    {
      name: 'user-storage',
      partialize: (state) => ({
        xp: state.xp,
        level: state.level,
        coins: state.coins,
        gems: state.gems,
        selectedAvatar: state.selectedAvatar,
        unlockedAvatars: state.unlockedAvatars,
        selectedTitle: state.selectedTitle,
        unlockedTitles: state.unlockedTitles
      })
    }
  )
);
