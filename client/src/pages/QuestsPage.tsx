import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GameCard } from '@/components/ui/game-card';
import { GameButton } from '@/components/ui/game-button';
import { GameProgress } from '@/components/ui/game-progress';
import { AnimatedIcon } from '@/components/ui/animated-icon';
import { useQuests } from '@/lib/stores/useQuests';
import { useAudio } from '@/lib/stores/useAudio';
import { QuestType, QuestDifficulty } from '@/types';
import { cn } from '@/lib/utils';
import ParticleEffect from '@/components/effects/ParticleEffect';

// Helper functions to handle quest difficulty
// Get difficulty badge color
const getDifficultyColor = (difficulty: QuestDifficulty) => {
  switch (difficulty) {
    case QuestDifficulty.EASY:
      return 'bg-green-500/80';
    case QuestDifficulty.MEDIUM:
      return 'bg-blue-500/80';
    case QuestDifficulty.HARD:
      return 'bg-purple-500/80';
    case QuestDifficulty.VERY_HARD:
      return 'bg-red-500/80';
    default:
      return 'bg-gray-500/80';
  }
};

// Get difficulty text
const getDifficultyText = (difficulty: QuestDifficulty) => {
  switch (difficulty) {
    case QuestDifficulty.EASY:
      return 'Easy';
    case QuestDifficulty.MEDIUM:
      return 'Medium';
    case QuestDifficulty.HARD:
      return 'Hard';
    case QuestDifficulty.VERY_HARD:
      return 'Very Hard';
    default:
      return 'Unknown';
  }
};

/**
 * Quests Page Component
 * Displays daily and epic quests for the player to complete
 */
const QuestsPage = () => {
  const { dailyQuests, epicQuests, completeQuest, updateQuestProgress } = useQuests();
  const { playHit, playSuccess } = useAudio();
  const [activeTab, setActiveTab] = useState<'daily' | 'epic'>('daily');
  const [completingQuest, setCompletingQuest] = useState<string | null>(null);
  
  // Filter completed and incomplete quests
  const incompleteDailyQuests = dailyQuests.filter(q => !q.isCompleted);
  const completedDailyQuests = dailyQuests.filter(q => q.isCompleted);
  const incompleteEpicQuests = epicQuests.filter(q => !q.isCompleted);
  const completedEpicQuests = epicQuests.filter(q => q.isCompleted);
  
  // Handle quest completion
  const handleCompleteQuest = (questId: string) => {
    setCompletingQuest(questId);
    playHit();
    
    // For visual effect, delay the actual completion
    setTimeout(() => {
      completeQuest(questId);
      playSuccess();
      
      // Clear completing state after effects
      setTimeout(() => {
        setCompletingQuest(null);
      }, 2000);
    }, 800);
  };
  
  // Handle quest progress update
  const handleUpdateProgress = (questId: string, progress: number) => {
    playHit();
    updateQuestProgress(questId, progress);
  };

  return (
    <div className="min-h-screen px-4 pt-6 pb-24">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 mr-2 text-accent">
            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="9" y1="12" x2="15" y2="12"></line>
            <line x1="9" y1="16" x2="15" y2="16"></line>
          </svg>
          Quests
        </h1>
        <p className="text-gray-300 text-sm mt-1">Complete quests to earn rewards</p>
      </div>
      
      {/* Quests Tabs */}
      <div className="flex gap-2 mb-6">
        <GameButton 
          variant={activeTab === 'daily' ? 'default' : 'ghost'} 
          onClick={() => setActiveTab('daily')}
        >
          Daily Missions
          {incompleteDailyQuests.length > 0 && (
            <span className="ml-2 px-1.5 py-0.5 text-xs bg-primary/30 rounded-full">
              {incompleteDailyQuests.length}
            </span>
          )}
        </GameButton>
        
        <GameButton 
          variant={activeTab === 'epic' ? 'default' : 'ghost'} 
          onClick={() => setActiveTab('epic')}
        >
          Epic Quests
          {incompleteEpicQuests.length > 0 && (
            <span className="ml-2 px-1.5 py-0.5 text-xs bg-primary/30 rounded-full">
              {incompleteEpicQuests.length}
            </span>
          )}
        </GameButton>
      </div>
      
      {/* Active quests */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'daily' ? (
            <>
              {/* Daily Quests */}
              <h2 className="text-lg font-bold text-white mb-3 flex items-center">
                <AnimatedIcon
                  icon={
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                      <line x1="16" y1="2" x2="16" y2="6"></line>
                      <line x1="8" y1="2" x2="8" y2="6"></line>
                      <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                  }
                  color="text-accent"
                  size="sm"
                  className="mr-2"
                  animation="pulse"
                />
                Daily Missions
              </h2>
              
              {incompleteDailyQuests.length === 0 && (
                <GameCard className="mb-6 text-center py-10">
                  <AnimatedIcon
                    icon={
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-12 h-12">
                        <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
                        <path d="m9 12 2 2 4-4"></path>
                      </svg>
                    }
                    color="text-green-400"
                    size="xl"
                    className="mx-auto mb-3"
                    animation="float"
                  />
                  <h3 className="text-lg font-bold text-white mb-2">All Daily Missions Completed!</h3>
                  <p className="text-gray-300 text-sm">Come back tomorrow for new missions</p>
                </GameCard>
              )}
              
              {incompleteDailyQuests.map((quest, index) => (
                <QuestCard
                  key={quest.id}
                  quest={quest}
                  index={index}
                  onComplete={handleCompleteQuest}
                  onUpdateProgress={handleUpdateProgress}
                  isCompleting={completingQuest === quest.id}
                />
              ))}
              
              {/* Completed Daily Quests */}
              {completedDailyQuests.length > 0 && (
                <>
                  <h3 className="text-md font-medium text-gray-400 mt-6 mb-3">
                    Completed ({completedDailyQuests.length})
                  </h3>
                  
                  {completedDailyQuests.map((quest, index) => (
                    <QuestCard
                      key={quest.id}
                      quest={quest}
                      index={index}
                      onComplete={handleCompleteQuest}
                      onUpdateProgress={handleUpdateProgress}
                      isComplete={true}
                    />
                  ))}
                </>
              )}
            </>
          ) : (
            <>
              {/* Epic Quests */}
              <h2 className="text-lg font-bold text-white mb-3 flex items-center">
                <AnimatedIcon
                  icon={
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"></path>
                      <path d="M5 3v4"></path>
                      <path d="M19 17v4"></path>
                      <path d="M3 5h4"></path>
                      <path d="M17 19h4"></path>
                    </svg>
                  }
                  color="text-accent"
                  size="sm"
                  className="mr-2"
                  animation="pulse"
                />
                Epic Quests
              </h2>
              
              {incompleteEpicQuests.length === 0 && (
                <GameCard className="mb-6 text-center py-10">
                  <AnimatedIcon
                    icon={
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-12 h-12">
                        <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
                        <path d="m9 12 2 2 4-4"></path>
                      </svg>
                    }
                    color="text-green-400"
                    size="xl"
                    className="mx-auto mb-3"
                    animation="float"
                  />
                  <h3 className="text-lg font-bold text-white mb-2">All Epic Quests Completed!</h3>
                  <p className="text-gray-300 text-sm">You've mastered all epic challenges</p>
                </GameCard>
              )}
              
              {incompleteEpicQuests.map((quest, index) => (
                <QuestCard
                  key={quest.id}
                  quest={quest}
                  index={index}
                  onComplete={handleCompleteQuest}
                  onUpdateProgress={handleUpdateProgress}
                  isCompleting={completingQuest === quest.id}
                />
              ))}
              
              {/* Completed Epic Quests */}
              {completedEpicQuests.length > 0 && (
                <>
                  <h3 className="text-md font-medium text-gray-400 mt-6 mb-3">
                    Completed ({completedEpicQuests.length})
                  </h3>
                  
                  {completedEpicQuests.map((quest, index) => (
                    <QuestCard
                      key={quest.id}
                      quest={quest}
                      index={index}
                      onComplete={handleCompleteQuest}
                      onUpdateProgress={handleUpdateProgress}
                      isComplete={true}
                    />
                  ))}
                </>
              )}
            </>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

// Quest Card Component
interface QuestCardProps {
  quest: any;
  index: number;
  onComplete: (id: string) => void;
  onUpdateProgress: (id: string, progress: number) => void;
  isComplete?: boolean;
  isCompleting?: boolean;
}

const QuestCard: React.FC<QuestCardProps> = ({ 
  quest, 
  index, 
  onComplete, 
  onUpdateProgress,
  isComplete = false,
  isCompleting = false
}) => {
  // Calculate progress percentage
  const progressPercentage = (quest.progress / quest.maxProgress) * 100;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="mb-3 relative"
    >
      <GameCard 
        className={cn(
          "transition-colors duration-300",
          isComplete && "opacity-60"
        )}
      >
        {/* Completion particles effect */}
        {isCompleting && (
          <div className="absolute inset-0 z-20">
            <ParticleEffect 
              type="coins" 
              trigger={true} 
              count={10} 
              originX={20} 
              originY={50}
              colors={['#FFBB38', '#FFD700']}
            />
          </div>
        )}
        
        <div className="flex items-start gap-3">
          {/* Quest icon */}
          <div className={cn(
            "w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0",
            quest.type === QuestType.DAILY ? "bg-blue-500/20" : "bg-purple-500/20"
          )}>
            <AnimatedIcon
              icon={
                quest.type === QuestType.DAILY ? (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"></path>
                  </svg>
                )
              }
              animation={isComplete ? "none" : "pulse"}
              color={quest.type === QuestType.DAILY ? "text-blue-400" : "text-purple-400"}
              size="md"
            />
          </div>
          
          <div className="flex-1">
            {/* Quest title and difficulty */}
            <div className="flex justify-between items-start">
              <h3 className="font-bold text-white">{quest.title}</h3>
              <span className={cn(
                "text-xs px-2 py-0.5 rounded-full text-white",
                getDifficultyColor(quest.difficulty)
              )}>
                {getDifficultyText(quest.difficulty)}
              </span>
            </div>
            
            {/* Quest description */}
            <p className="text-sm text-gray-300 mt-1 mb-3">{quest.description}</p>
            
            {/* Progress bar */}
            <div className="mb-3">
              <div className="flex justify-between text-xs mb-1">
                <span>Progress</span>
                <span>{quest.progress} / {quest.maxProgress}</span>
              </div>
              <GameProgress 
                value={progressPercentage} 
                max={100} 
                variant={isComplete ? "success" : "secondary"} 
                size="sm" 
              />
            </div>
            
            {/* Rewards */}
            <div className="flex items-center gap-3 mb-3">
              {quest.xpReward > 0 && (
                <div className="flex items-center text-blue-300 text-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 mr-1">
                    <path d="M2.5 18.5A9 9 0 1 1 21.5 9"></path>
                    <path d="m2.5 14 5 5"></path>
                    <path d="m7.5 9 5 5"></path>
                  </svg>
                  {quest.xpReward} XP
                </div>
              )}
              
              <div className="flex items-center text-yellow-300 text-sm">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 mr-1">
                  <circle cx="12" cy="12" r="8"></circle>
                  <path d="M12 2v2"></path>
                  <path d="M12 20v2"></path>
                  <path d="M20 12h2"></path>
                  <path d="M2 12h2"></path>
                </svg>
                {quest.coinReward} Coins
              </div>
              
              {quest.gemReward > 0 && (
                <div className="flex items-center text-green-300 text-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 mr-1">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                  </svg>
                  {quest.gemReward} Gems
                </div>
              )}
            </div>
            
            {/* Action buttons */}
            <div className="flex gap-2">
              {!isComplete && quest.progress < quest.maxProgress && quest.maxProgress > 1 && (
                <GameButton 
                  variant="secondary" 
                  size="sm"
                  onClick={() => onUpdateProgress(quest.id, quest.progress + 1)}
                >
                  Progress +1
                </GameButton>
              )}
              
              {!isComplete && quest.progress < quest.maxProgress && (
                <GameButton 
                  variant="default" 
                  size="sm"
                  onClick={() => onComplete(quest.id)}
                  isSuccess={true}
                >
                  Complete
                </GameButton>
              )}
              
              {isComplete && (
                <div className="text-green-400 text-sm flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 mr-1">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                  Completed
                  {quest.completedAt && (
                    <span className="text-xs text-gray-400 ml-2">
                      {new Date(quest.completedAt).toLocaleDateString()}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </GameCard>
    </motion.div>
  );
};

export default QuestsPage;
