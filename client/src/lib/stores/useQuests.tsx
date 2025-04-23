import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Quest, QuestType, QuestDifficulty } from '@/types';
import { toast } from 'sonner';
import { useUser } from './useUser';

// Initial daily quests
const initialDailyQuests: Quest[] = [
  {
    id: 'daily-1',
    title: 'Study Session',
    description: 'Complete a 25-minute study session',
    type: QuestType.DAILY,
    difficulty: QuestDifficulty.EASY,
    xpReward: 25,
    coinReward: 15,
    gemReward: 0,
    isCompleted: false,
    createdAt: new Date().toISOString(),
    completedAt: null,
    progress: 0,
    maxProgress: 1
  },
  {
    id: 'daily-2',
    title: 'Note Taking',
    description: 'Take notes for any subject',
    type: QuestType.DAILY,
    difficulty: QuestDifficulty.EASY,
    xpReward: 20,
    coinReward: 10,
    gemReward: 0,
    isCompleted: false,
    createdAt: new Date().toISOString(),
    completedAt: null,
    progress: 0,
    maxProgress: 1
  },
  {
    id: 'daily-3',
    title: 'Vocabulary Builder',
    description: 'Learn 5 new vocabulary words',
    type: QuestType.DAILY,
    difficulty: QuestDifficulty.MEDIUM,
    xpReward: 35,
    coinReward: 20,
    gemReward: 1,
    isCompleted: false,
    createdAt: new Date().toISOString(),
    completedAt: null,
    progress: 0,
    maxProgress: 5
  }
];

// Initial epic quests
const initialEpicQuests: Quest[] = [
  {
    id: 'epic-1',
    title: 'Knowledge Seeker',
    description: 'Complete 10 study sessions',
    type: QuestType.EPIC,
    difficulty: QuestDifficulty.HARD,
    xpReward: 150,
    coinReward: 100,
    gemReward: 5,
    isCompleted: false,
    createdAt: new Date().toISOString(),
    completedAt: null,
    progress: 0,
    maxProgress: 10
  },
  {
    id: 'epic-2',
    title: 'Subject Master',
    description: 'Reach level 5 in any subject',
    type: QuestType.EPIC,
    difficulty: QuestDifficulty.VERY_HARD,
    xpReward: 300,
    coinReward: 200,
    gemReward: 10,
    isCompleted: false,
    createdAt: new Date().toISOString(),
    completedAt: null,
    progress: 0,
    maxProgress: 5
  },
  {
    id: 'epic-3',
    title: 'Consistent Scholar',
    description: 'Complete 5 daily quests',
    type: QuestType.EPIC,
    difficulty: QuestDifficulty.MEDIUM,
    xpReward: 100,
    coinReward: 75,
    gemReward: 3,
    isCompleted: false,
    createdAt: new Date().toISOString(),
    completedAt: null,
    progress: 0,
    maxProgress: 5
  }
];

interface QuestsState {
  dailyQuests: Quest[];
  epicQuests: Quest[];
  lastDailyRefresh: string | null;
  
  // Methods
  addQuest: (quest: Omit<Quest, 'id' | 'createdAt' | 'completedAt' | 'isCompleted'>) => void;
  updateQuestProgress: (questId: string, progress: number) => void;
  completeQuest: (questId: string) => void;
  checkAndRefreshDailyQuests: () => void;
}

export const useQuests = create<QuestsState>()(
  persist(
    (set, get) => ({
      dailyQuests: initialDailyQuests,
      epicQuests: initialEpicQuests,
      lastDailyRefresh: new Date().toISOString(),
      
      // Add a new quest
      addQuest: (quest) => set((state) => {
        const newQuest: Quest = {
          ...quest,
          id: `custom-${Date.now()}`,
          createdAt: new Date().toISOString(),
          completedAt: null,
          isCompleted: false
        };
        
        if (quest.type === QuestType.DAILY) {
          return { dailyQuests: [...state.dailyQuests, newQuest] };
        } else {
          return { epicQuests: [...state.epicQuests, newQuest] };
        }
      }),
      
      // Update quest progress
      updateQuestProgress: (questId, progress) => set((state) => {
        // Check in daily quests
        const dailyIndex = state.dailyQuests.findIndex(q => q.id === questId);
        if (dailyIndex >= 0) {
          const newDailyQuests = [...state.dailyQuests];
          const quest = newDailyQuests[dailyIndex];
          
          // Cap progress at max
          const newProgress = Math.min(progress, quest.maxProgress);
          
          // Update progress
          newDailyQuests[dailyIndex] = {
            ...quest,
            progress: newProgress,
            isCompleted: newProgress >= quest.maxProgress,
            completedAt: newProgress >= quest.maxProgress ? new Date().toISOString() : quest.completedAt
          };
          
          // Auto-complete quest if reached max progress
          if (newProgress >= quest.maxProgress && !quest.isCompleted) {
            // Call completeQuest to give rewards
            setTimeout(() => get().completeQuest(questId), 100);
          }
          
          return { dailyQuests: newDailyQuests };
        }
        
        // Check in epic quests
        const epicIndex = state.epicQuests.findIndex(q => q.id === questId);
        if (epicIndex >= 0) {
          const newEpicQuests = [...state.epicQuests];
          const quest = newEpicQuests[epicIndex];
          
          // Cap progress at max
          const newProgress = Math.min(progress, quest.maxProgress);
          
          // Update progress
          newEpicQuests[epicIndex] = {
            ...quest,
            progress: newProgress,
            isCompleted: newProgress >= quest.maxProgress,
            completedAt: newProgress >= quest.maxProgress ? new Date().toISOString() : quest.completedAt
          };
          
          // Auto-complete quest if reached max progress
          if (newProgress >= quest.maxProgress && !quest.isCompleted) {
            // Call completeQuest to give rewards
            setTimeout(() => get().completeQuest(questId), 100);
          }
          
          return { epicQuests: newEpicQuests };
        }
        
        return {};
      }),
      
      // Complete a quest and grant rewards
      completeQuest: (questId) => {
        // Find the quest
        const dailyQuest = get().dailyQuests.find(q => q.id === questId);
        const epicQuest = get().epicQuests.find(q => q.id === questId);
        const quest = dailyQuest || epicQuest;
        
        if (!quest || quest.isCompleted) return;
        
        // Grant rewards
        const { addXP, addCoins, addGems } = useUser.getState();
        addXP(quest.xpReward);
        addCoins(quest.coinReward);
        if (quest.gemReward > 0) {
          addGems(quest.gemReward);
        }
        
        // Show toast notification
        toast.success(
          <div className="flex flex-col">
            <span className="font-bold text-lg">Quest Completed!</span>
            <span>{quest.title}</span>
            <div className="flex mt-1 space-x-3">
              <span className="text-blue-400">+{quest.xpReward} XP</span>
              <span className="text-yellow-400">+{quest.coinReward} Coins</span>
              {quest.gemReward > 0 && (
                <span className="text-green-400">+{quest.gemReward} Gems</span>
              )}
            </div>
          </div>,
          { duration: 5000 }
        );
        
        // Mark quest as completed
        set((state) => {
          if (dailyQuest) {
            const newDailyQuests = [...state.dailyQuests];
            const index = newDailyQuests.findIndex(q => q.id === questId);
            if (index >= 0) {
              newDailyQuests[index] = {
                ...newDailyQuests[index],
                isCompleted: true,
                progress: quest.maxProgress,
                completedAt: new Date().toISOString()
              };
            }
            return { dailyQuests: newDailyQuests };
          } else if (epicQuest) {
            const newEpicQuests = [...state.epicQuests];
            const index = newEpicQuests.findIndex(q => q.id === questId);
            if (index >= 0) {
              newEpicQuests[index] = {
                ...newEpicQuests[index],
                isCompleted: true,
                progress: quest.maxProgress,
                completedAt: new Date().toISOString()
              };
            }
            return { epicQuests: newEpicQuests };
          }
          return {};
        });
        
        // If an epic quest for completing daily quests exists, update its progress
        if (dailyQuest) {
          const consistentScholarQuest = get().epicQuests.find(
            q => q.title === 'Consistent Scholar' && !q.isCompleted
          );
          
          if (consistentScholarQuest) {
            get().updateQuestProgress(consistentScholarQuest.id, consistentScholarQuest.progress + 1);
          }
        }
      },
      
      // Check and refresh daily quests if needed
      checkAndRefreshDailyQuests: () => set((state) => {
        const now = new Date();
        const lastRefresh = state.lastDailyRefresh ? new Date(state.lastDailyRefresh) : null;
        
        // If no refresh has happened or it was yesterday
        if (!lastRefresh || !isSameDay(now, lastRefresh)) {
          // Reset daily quests
          const refreshedQuests = initialDailyQuests.map(quest => ({
            ...quest,
            createdAt: new Date().toISOString(),
            completedAt: null,
            isCompleted: false,
            progress: 0
          }));
          
          return {
            dailyQuests: refreshedQuests,
            lastDailyRefresh: now.toISOString()
          };
        }
        
        return {};
      })
    }),
    {
      name: 'quests-storage',
    }
  )
);

// Helper function to check if two dates are the same day
function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}
