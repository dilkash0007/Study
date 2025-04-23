import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Achievement, AchievementCategory } from '@/types';
import { toast } from 'sonner';
import { useUser } from './useUser';

// Initial achievements list
const initialAchievements: Achievement[] = [
  // Study achievements
  {
    id: 'study-1',
    title: 'First Steps',
    description: 'Complete your first study session',
    category: AchievementCategory.STUDY,
    xpReward: 50,
    coinReward: 30,
    gemReward: 1,
    isUnlocked: false,
    unlockedAt: null,
    icon: 'timer',
    condition: {
      type: 'study_sessions',
      value: 1
    }
  },
  {
    id: 'study-2',
    title: 'Focus Warrior',
    description: 'Complete 10 study sessions',
    category: AchievementCategory.STUDY,
    xpReward: 150,
    coinReward: 100,
    gemReward: 3,
    isUnlocked: false,
    unlockedAt: null,
    icon: 'brain',
    condition: {
      type: 'study_sessions',
      value: 10
    }
  },
  {
    id: 'study-3',
    title: 'Concentration Master',
    description: 'Complete 50 study sessions',
    category: AchievementCategory.STUDY,
    xpReward: 500,
    coinReward: 300,
    gemReward: 10,
    isUnlocked: false,
    unlockedAt: null,
    icon: 'meditation',
    condition: {
      type: 'study_sessions',
      value: 50
    }
  },
  
  // Quest achievements
  {
    id: 'quest-1',
    title: 'Quester',
    description: 'Complete 5 quests',
    category: AchievementCategory.QUEST,
    xpReward: 100,
    coinReward: 50,
    gemReward: 2,
    isUnlocked: false,
    unlockedAt: null,
    icon: 'scroll',
    condition: {
      type: 'quests_completed',
      value: 5
    }
  },
  {
    id: 'quest-2',
    title: 'Quest Expert',
    description: 'Complete 25 quests',
    category: AchievementCategory.QUEST,
    xpReward: 300,
    coinReward: 200,
    gemReward: 5,
    isUnlocked: false,
    unlockedAt: null,
    icon: 'map',
    condition: {
      type: 'quests_completed',
      value: 25
    }
  },
  {
    id: 'quest-3',
    title: 'Epic Adventurer',
    description: 'Complete 5 epic quests',
    category: AchievementCategory.QUEST,
    xpReward: 400,
    coinReward: 250,
    gemReward: 8,
    isUnlocked: false,
    unlockedAt: null,
    icon: 'treasure',
    condition: {
      type: 'epic_quests_completed',
      value: 5
    }
  },
  
  // Level achievements
  {
    id: 'level-1',
    title: 'Level Up',
    description: 'Reach level 5',
    category: AchievementCategory.LEVEL,
    xpReward: 0, // No XP since you get it from leveling
    coinReward: 100,
    gemReward: 5,
    isUnlocked: false,
    unlockedAt: null,
    icon: 'star',
    condition: {
      type: 'level',
      value: 5
    }
  },
  {
    id: 'level-2',
    title: 'Dedicated Scholar',
    description: 'Reach level 10',
    category: AchievementCategory.LEVEL,
    xpReward: 0,
    coinReward: 250,
    gemReward: 10,
    isUnlocked: false,
    unlockedAt: null,
    icon: 'crown',
    condition: {
      type: 'level',
      value: 10
    }
  },
  {
    id: 'level-3',
    title: 'Educational Champion',
    description: 'Reach level 20',
    category: AchievementCategory.LEVEL,
    xpReward: 0,
    coinReward: 1000,
    gemReward: 25,
    isUnlocked: false,
    unlockedAt: null,
    icon: 'trophy',
    condition: {
      type: 'level',
      value: 20
    }
  },
  
  // Streak achievements
  {
    id: 'streak-1',
    title: 'Consistency',
    description: 'Maintain a 3-day study streak',
    category: AchievementCategory.STREAK,
    xpReward: 75,
    coinReward: 40,
    gemReward: 1,
    isUnlocked: false,
    unlockedAt: null,
    icon: 'calendar',
    condition: {
      type: 'streak',
      value: 3
    }
  },
  {
    id: 'streak-2',
    title: 'Dedication',
    description: 'Maintain a 7-day study streak',
    category: AchievementCategory.STREAK,
    xpReward: 200,
    coinReward: 100,
    gemReward: 3,
    isUnlocked: false,
    unlockedAt: null,
    icon: 'fire',
    condition: {
      type: 'streak',
      value: 7
    }
  },
  {
    id: 'streak-3',
    title: 'Unbreakable',
    description: 'Maintain a 30-day study streak',
    category: AchievementCategory.STREAK,
    xpReward: 1000,
    coinReward: 500,
    gemReward: 15,
    isUnlocked: false,
    unlockedAt: null,
    icon: 'diamond',
    condition: {
      type: 'streak',
      value: 30
    }
  }
];

interface AchievementProgress {
  study_sessions: number;
  quests_completed: number;
  epic_quests_completed: number;
  streak: number;
  // Add more progress tracking as needed
}

interface AchievementsState {
  achievements: Achievement[];
  progress: AchievementProgress;
  recentlyUnlocked: string[];
  
  // Methods
  incrementProgress: (type: keyof AchievementProgress, amount: number) => void;
  checkAchievements: () => void;
  clearRecentlyUnlocked: () => void;
}

export const useAchievements = create<AchievementsState>()(
  persist(
    (set, get) => ({
      achievements: initialAchievements,
      progress: {
        study_sessions: 0,
        quests_completed: 0,
        epic_quests_completed: 0,
        streak: 0
      },
      recentlyUnlocked: [],
      
      // Increment a progress counter and check for newly unlocked achievements
      incrementProgress: (type, amount) => {
        set((state) => {
          const newProgress = {
            ...state.progress,
            [type]: state.progress[type] + amount
          };
          
          return { progress: newProgress };
        });
        
        // Check if any achievements are unlocked with the new progress
        get().checkAchievements();
      },
      
      // Check all achievements against current progress
      checkAchievements: () => set((state) => {
        const { progress } = state;
        let newlyUnlocked: string[] = [];
        
        // Check user level for level-based achievements
        const userLevel = useUser.getState().level;
        
        const updatedAchievements = state.achievements.map(achievement => {
          // Skip already unlocked achievements
          if (achievement.isUnlocked) return achievement;
          
          let isNowUnlocked = false;
          
          // Check condition based on type
          if (achievement.condition.type === 'level') {
            isNowUnlocked = userLevel >= achievement.condition.value;
          } else {
            // For other condition types, check against progress
            const currentProgress = progress[achievement.condition.type as keyof AchievementProgress] || 0;
            isNowUnlocked = currentProgress >= achievement.condition.value;
          }
          
          // If newly unlocked, track it and give rewards
          if (isNowUnlocked) {
            newlyUnlocked.push(achievement.id);
            
            // Grant rewards
            const { addXP, addCoins, addGems } = useUser.getState();
            addXP(achievement.xpReward);
            addCoins(achievement.coinReward);
            
            if (achievement.gemReward > 0) {
              addGems(achievement.gemReward);
            }
            
            // Show achievement unlocked toast
            toast.success(
              <div className="flex flex-col">
                <span className="font-bold text-lg">Achievement Unlocked!</span>
                <span>{achievement.title}</span>
                <div className="flex mt-1 space-x-3">
                  {achievement.xpReward > 0 && <span className="text-blue-400">+{achievement.xpReward} XP</span>}
                  <span className="text-yellow-400">+{achievement.coinReward} Coins</span>
                  {achievement.gemReward > 0 && (
                    <span className="text-green-400">+{achievement.gemReward} Gems</span>
                  )}
                </div>
              </div>,
              { duration: 7000 }
            );
            
            return {
              ...achievement,
              isUnlocked: true,
              unlockedAt: new Date().toISOString()
            };
          }
          
          return achievement;
        });
        
        return {
          achievements: updatedAchievements,
          recentlyUnlocked: [...state.recentlyUnlocked, ...newlyUnlocked]
        };
      }),
      
      // Clear the recently unlocked list after viewing
      clearRecentlyUnlocked: () => set({ recentlyUnlocked: [] })
    }),
    {
      name: 'achievements-storage',
    }
  )
);
