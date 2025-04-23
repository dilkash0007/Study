import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GameCard } from '@/components/ui/game-card';
import { GameButton } from '@/components/ui/game-button';
import { GameProgress } from '@/components/ui/game-progress';
import { XpBadge } from '@/components/ui/xp-badge';
import { AnimatedIcon } from '@/components/ui/animated-icon';
import { useUser } from '@/lib/stores/useUser';
import { useAudio } from '@/lib/stores/useAudio';
import { useSubjects } from '@/lib/stores/useSubjects';
import { useAchievements } from '@/lib/stores/useAchievements';
import { useQuests } from '@/lib/stores/useQuests';
import { getAvatarById } from '@/assets/avatars';
import { cn } from '@/lib/utils';
import { xpForNextLevel } from '@/lib/stores/useUser';
import { toast } from 'sonner';
import { AchievementCategory } from '@/types';
import ParticleEffect from '@/components/effects/ParticleEffect';

// Available avatar IDs
const availableAvatars = [
  'default', 'wizard', 'knight', 'archer', 'mage', 'warrior', 'healer', 'rogue', 'bard'
];

// Available title IDs
const availableTitles = [
  'Novice', 'Focus Master', 'Task Warrior', 'Knowledge Seeker', 
  'Study Champion', 'Quiz Genius', 'Streak Keeper', 'XP Hunter'
];

// Stats tabs
type StatsTab = 'overview' | 'subjects' | 'achievements' | 'quests';

/**
 * Profile Page Component
 * Displays user stats and allows customization of avatar and title
 */
const ProfilePage = () => {
  // Global state
  const { 
    level, xp, coins, gems, 
    selectedAvatar, unlockedAvatars, selectAvatar,
    selectedTitle, unlockedTitles, selectTitle
  } = useUser();
  const { subjects } = useSubjects();
  const { achievements } = useAchievements();
  const { dailyQuests, epicQuests } = useQuests();
  const { playHit, playSuccess } = useAudio();
  
  // Local state
  const [activeTab, setActiveTab] = useState<StatsTab>('overview');
  const [showAvatarSelector, setShowAvatarSelector] = useState(false);
  const [showTitleSelector, setShowTitleSelector] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  
  // XP progress for next level
  const nextLevelXP = xpForNextLevel(level);
  const prevLevelXP = xpForNextLevel(level - 1);
  const currentLevelProgress = xp - prevLevelXP;
  const requiredLevelProgress = nextLevelXP - prevLevelXP;
  const xpProgressPercentage = (currentLevelProgress / requiredLevelProgress) * 100;
  
  // Stats calculations
  const totalStudyTime = subjects.reduce((total, subject) => total + subject.totalStudyTime, 0);
  const totalCompletedQuests = dailyQuests.filter(q => q.isCompleted).length + epicQuests.filter(q => q.isCompleted).length;
  const totalUnlockedAchievements = achievements.filter(a => a.isUnlocked).length;
  
  // Select a new avatar
  const handleSelectAvatar = (avatarId: string) => {
    playHit();
    
    if (unlockedAvatars.includes(avatarId)) {
      selectAvatar(avatarId);
      setShowAvatarSelector(false);
      toast.success(`Avatar changed to ${avatarId}`);
    } else {
      // Check if player has enough gems
      if (gems >= 10) {
        // Here we would call a function to deduct gems and unlock the avatar
        // For this example, we'll just show a toast
        toast.error("Avatar unlocking functionality not implemented yet");
      } else {
        toast.error("Not enough gems to unlock this avatar");
      }
    }
  };
  
  // Select a new title
  const handleSelectTitle = (titleId: string) => {
    playHit();
    
    if (unlockedTitles.includes(titleId)) {
      selectTitle(titleId);
      setShowTitleSelector(false);
      
      // Show celebration effect when changing title
      setShowCelebration(true);
      playSuccess();
      setTimeout(() => setShowCelebration(false), 2000);
      
      toast.success(`Title changed to ${titleId}`);
    } else {
      // Check if player has enough coins
      if (coins >= 100) {
        // Here we would call a function to deduct coins and unlock the title
        // For this example, we'll just show a toast
        toast.error("Title unlocking functionality not implemented yet");
      } else {
        toast.error("Not enough coins to unlock this title");
      }
    }
  };

  return (
    <div className="min-h-screen px-4 pt-6 pb-24">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 mr-2 text-primary">
            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
          Character
        </h1>
        <p className="text-gray-300 text-sm mt-1">Customize your profile and view stats</p>
      </div>
      
      {/* Profile Card */}
      <GameCard className="mb-6 relative overflow-hidden" shimmer>
        {/* Celebration particles */}
        {showCelebration && (
          <div className="absolute inset-0 z-40">
            <ParticleEffect 
              type="confetti" 
              trigger={showCelebration} 
              originX={50}
              originY={50}
              count={50}
            />
          </div>
        )}
        
        {/* Background glow effect */}
        <div className="absolute -inset-[100px] bg-gradient-radial from-primary/30 to-transparent opacity-30 blur-3xl pointer-events-none z-0"></div>
        
        <div className="relative z-10">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 p-2">
            {/* Avatar section */}
            <div className="relative">
              <motion.div 
                className="w-28 h-28 sm:w-32 sm:h-32 rounded-full flex items-center justify-center relative overflow-hidden"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowAvatarSelector(true)}
                style={{
                  background: 'linear-gradient(135deg, rgba(153, 69, 255, 0.3), rgba(20, 241, 149, 0.1))',
                  boxShadow: '0 0 20px rgba(153, 69, 255, 0.5), inset 0 0 15px rgba(153, 69, 255, 0.3)'
                }}
              >
                <div className="scale-125 animate-float">
                  {getAvatarById(selectedAvatar)}
                </div>
                
                <div className="absolute inset-0 rounded-full bg-gradient-to-b from-white/10 to-transparent pointer-events-none"></div>
                
                {/* Animated ring */}
                <div className="absolute inset-0 rounded-full border-4 border-primary/50 animate-pulse-glow pointer-events-none"></div>
                
                {/* Edit indicator */}
                <div className="absolute bottom-0 right-0 w-9 h-9 bg-black/70 rounded-full flex items-center justify-center border-2 border-primary shadow-lg shadow-primary/30 animate-pulse-glow">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-white">
                    <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"></path>
                  </svg>
                </div>
              </motion.div>
              
              <XpBadge level={level} size="lg" className="absolute -bottom-2 -left-2" showAnimation={true} />
            </div>
            
            {/* Character details */}
            <div className="flex-1 text-center sm:text-left">
              <motion.div 
                className="flex flex-col items-center sm:items-start"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <div 
                  className="text-2xl font-bold mb-1 cursor-pointer flex items-center justify-center sm:justify-start"
                  onClick={() => setShowTitleSelector(true)}
                  style={{
                    background: 'linear-gradient(90deg, #f5f7fa, #c3cfe2, #f5f7fa)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }}
                >
                  <span>{selectedTitle}</span>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 ml-1 text-gray-400">
                    <path d="m7 11 5 5 5-5"></path>
                  </svg>
                </div>
                
                <div className="text-blue-300 mb-4 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 mr-1 text-blue-400">
                    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"></path>
                  </svg>
                  <span className="font-medium">Level {level} Explorer</span>
                </div>
                
                {/* XP Progress */}
                <div className="w-full max-w-xs mx-auto sm:mx-0">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-medium">XP Progress</span>
                    <span className="text-blue-200 font-medium">{currentLevelProgress} / {requiredLevelProgress}</span>
                  </div>
                  <GameProgress 
                    value={xpProgressPercentage} 
                    max={100} 
                    variant="secondary" 
                    size="md" 
                  />
                  
                  <div className="text-xs text-gray-400 mt-1 text-right">
                    {Math.floor(requiredLevelProgress - currentLevelProgress)} XP until Level {level + 1}
                  </div>
                </div>
                
                {/* Currency display */}
                <div className="flex items-center justify-center sm:justify-start gap-4 mt-5">
                  <motion.div 
                    className="flex items-center bg-gradient-to-r from-yellow-900/40 to-yellow-600/20 rounded-full px-4 py-2 border border-yellow-500/30 shadow-lg shadow-yellow-500/10"
                    whileHover={{ scale: 1.05 }}
                  >
                    <AnimatedIcon
                      icon={
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                          <circle cx="12" cy="12" r="8"></circle>
                          <path d="M12 2v2"></path>
                          <path d="M12 20v2"></path>
                          <path d="M20 12h2"></path>
                          <path d="M2 12h2"></path>
                        </svg>
                      }
                      color="text-yellow-400"
                      size="sm"
                      animation="pulse"
                    />
                    <span className="ml-2 font-bold text-yellow-100">{coins} Coins</span>
                  </motion.div>
                  
                  <motion.div 
                    className="flex items-center bg-gradient-to-r from-emerald-900/40 to-emerald-600/20 rounded-full px-4 py-2 border border-emerald-500/30 shadow-lg shadow-emerald-500/10"
                    whileHover={{ scale: 1.05 }}
                  >
                    <AnimatedIcon
                      icon={
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                        </svg>
                      }
                      color="text-emerald-400"
                      size="sm"
                      animation="pulse"
                    />
                    <span className="ml-2 font-bold text-emerald-100">{gems} Gems</span>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </GameCard>
      
      {/* Stats tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto no-scrollbar py-2">
        <GameButton 
          variant={activeTab === 'overview' ? 'default' : 'ghost'} 
          onClick={() => setActiveTab('overview')}
          size="sm"
        >
          Overview
        </GameButton>
        
        <GameButton 
          variant={activeTab === 'subjects' ? 'default' : 'ghost'} 
          onClick={() => setActiveTab('subjects')}
          size="sm"
        >
          Subjects
        </GameButton>
        
        <GameButton 
          variant={activeTab === 'achievements' ? 'default' : 'ghost'} 
          onClick={() => setActiveTab('achievements')}
          size="sm"
        >
          Achievements
        </GameButton>
        
        <GameButton 
          variant={activeTab === 'quests' ? 'default' : 'ghost'} 
          onClick={() => setActiveTab('quests')}
          size="sm"
        >
          Quests
        </GameButton>
      </div>
      
      {/* Stats content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'overview' && (
            <GameCard>
              <h2 className="font-bold text-white mb-4">Stats Overview</h2>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-black/30 rounded-lg p-3 text-center">
                  <div className="text-xl font-bold text-white">{totalStudyTime}</div>
                  <div className="text-xs text-gray-300">Minutes Studied</div>
                </div>
                
                <div className="bg-black/30 rounded-lg p-3 text-center">
                  <div className="text-xl font-bold text-white">{subjects.length}</div>
                  <div className="text-xs text-gray-300">Active Subjects</div>
                </div>
                
                <div className="bg-black/30 rounded-lg p-3 text-center">
                  <div className="text-xl font-bold text-white">{totalCompletedQuests}</div>
                  <div className="text-xs text-gray-300">Quests Completed</div>
                </div>
                
                <div className="bg-black/30 rounded-lg p-3 text-center">
                  <div className="text-xl font-bold text-white">{totalUnlockedAchievements}</div>
                  <div className="text-xs text-gray-300">Achievements Unlocked</div>
                </div>
              </div>
              
              <div className="mt-6">
                <h3 className="font-medium text-white mb-3">Unlocked Items</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-black/30 rounded-lg p-3">
                    <div className="text-sm font-medium text-white mb-1">Avatars</div>
                    <div className="text-xs text-blue-300">{unlockedAvatars.length} / {availableAvatars.length}</div>
                  </div>
                  
                  <div className="bg-black/30 rounded-lg p-3">
                    <div className="text-sm font-medium text-white mb-1">Titles</div>
                    <div className="text-xs text-blue-300">{unlockedTitles.length} / {availableTitles.length}</div>
                  </div>
                </div>
              </div>
            </GameCard>
          )}
          
          {activeTab === 'subjects' && (
            <GameCard>
              <h2 className="font-bold text-white mb-4">Subject Progress</h2>
              {subjects.map((subject, index) => (
                <div key={subject.id} className={cn(
                  "p-3 rounded-lg transition-colors",
                  index < subjects.length - 1 && "mb-3",
                  subject.totalStudyTime > 0 ? "bg-black/30" : "bg-black/10" 
                )}>
                  <div className="flex items-center">
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center mr-3"
                      style={{ backgroundColor: subject.color + '33', color: subject.color }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                        <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                        <path d="M2 17l10 5 10-5"></path>
                        <path d="M2 12l10 5 10-5"></path>
                      </svg>
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <h3 className="font-medium text-white">{subject.name}</h3>
                        <XpBadge level={subject.level} size="sm" />
                      </div>
                      
                      <div className="text-xs text-gray-300 mb-1 mt-1">
                        <span className="text-blue-300">{subject.xp} XP</span>
                        {subject.totalStudyTime > 0 && (
                          <> • {subject.totalStudyTime} min studied</>
                        )}
                        {subject.lastStudied && (
                          <> • Last: {new Date(subject.lastStudied).toLocaleDateString()}</>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </GameCard>
          )}
          
          {activeTab === 'achievements' && (
            <GameCard>
              <h2 className="font-bold text-white mb-4">Achievement Stats</h2>
              
              <div className="mb-4">
                <div className="flex justify-between text-xs mb-1">
                  <span>Completion</span>
                  <span>{achievements.filter(a => a.isUnlocked).length} / {achievements.length}</span>
                </div>
                <GameProgress 
                  value={(achievements.filter(a => a.isUnlocked).length / achievements.length) * 100} 
                  max={100} 
                  variant="accent" 
                  size="md" 
                />
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                {/* Group achievements by category */}
                {['Study', 'Quest', 'Level', 'Streak'].map(category => {
                  const categoryAchievements = achievements.filter(a => a.category === category);
                  const unlockedInCategory = categoryAchievements.filter(a => a.isUnlocked).length;
                  
                  return (
                    <div key={category} className="bg-black/30 rounded-lg p-3">
                      <div className="text-sm font-medium text-white mb-1">{category}</div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-300">Progress</span>
                        <span className="text-blue-300">{unlockedInCategory} / {categoryAchievements.length}</span>
                      </div>
                      <GameProgress 
                        value={(unlockedInCategory / categoryAchievements.length) * 100} 
                        max={100} 
                        variant="secondary" 
                        size="sm" 
                      />
                    </div>
                  );
                })}
              </div>
            </GameCard>
          )}
          
          {activeTab === 'quests' && (
            <GameCard>
              <h2 className="font-bold text-white mb-4">Quest Stats</h2>
              
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-black/30 rounded-lg p-3 text-center">
                  <div className="text-xl font-bold text-white">{dailyQuests.filter(q => q.isCompleted).length}</div>
                  <div className="text-xs text-gray-300">Daily Quests Completed</div>
                </div>
                
                <div className="bg-black/30 rounded-lg p-3 text-center">
                  <div className="text-xl font-bold text-white">{epicQuests.filter(q => q.isCompleted).length}</div>
                  <div className="text-xs text-gray-300">Epic Quests Completed</div>
                </div>
              </div>
              
              <h3 className="font-medium text-white mb-2">Active Quests</h3>
              
              {[...dailyQuests, ...epicQuests]
                .filter(q => !q.isCompleted)
                .map((quest, index) => (
                  <div key={quest.id} className={cn(
                    "p-3 rounded-lg bg-black/20 transition-colors",
                    index < dailyQuests.filter(q => !q.isCompleted).length - 1 && "mb-2"
                  )}>
                    <div className="flex justify-between items-center">
                      <h4 className="text-sm font-medium text-white">{quest.title}</h4>
                      <span className={cn(
                        "text-xs px-2 py-0.5 rounded-full",
                        quest.type === 'daily' ? "bg-blue-500/30 text-blue-100" : "bg-purple-500/30 text-purple-100"
                      )}>
                        {quest.type === 'daily' ? 'Daily' : 'Epic'}
                      </span>
                    </div>
                    
                    <div className="text-xs text-gray-300 mt-1">
                      Progress: {quest.progress} / {quest.maxProgress}
                    </div>
                  </div>
                ))}
                
              {[...dailyQuests, ...epicQuests].filter(q => !q.isCompleted).length === 0 && (
                <div className="p-3 rounded-lg bg-black/10 text-center">
                  <span className="text-sm text-gray-400">No active quests</span>
                </div>
              )}
            </GameCard>
          )}
        </motion.div>
      </AnimatePresence>
      
      {/* Avatar Selector Modal */}
      <AnimatePresence>
        {showAvatarSelector && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
            onClick={() => setShowAvatarSelector(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="w-full max-w-md"
              onClick={e => e.stopPropagation()}
            >
              <GameCard>
                <h2 className="font-bold text-white mb-4 text-center">Select Avatar</h2>
                
                <div className="grid grid-cols-3 gap-3 mb-4">
                  {availableAvatars.map((avatarId) => {
                    const isUnlocked = unlockedAvatars.includes(avatarId);
                    const isSelected = selectedAvatar === avatarId;
                    
                    return (
                      <motion.div
                        key={avatarId}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={cn(
                          "relative cursor-pointer p-2 rounded-lg transition-colors border-2",
                          isSelected ? "border-primary bg-primary/20" : 
                            isUnlocked ? "border-transparent hover:bg-black/30" : "border-transparent opacity-50 grayscale"
                        )}
                        onClick={() => handleSelectAvatar(avatarId)}
                      >
                        <div className="w-16 h-16 mx-auto rounded-full bg-black/30 flex items-center justify-center overflow-hidden">
                          {getAvatarById(avatarId)}
                        </div>
                        
                        <div className="text-center mt-1 text-xs">
                          {avatarId}
                        </div>
                        
                        {!isUnlocked && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-lg">
                            <div className="flex items-center text-yellow-300 text-sm font-medium">
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 mr-1">
                                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                              </svg>
                              10 Gems
                            </div>
                          </div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
                
                <div className="flex justify-end">
                  <GameButton onClick={() => setShowAvatarSelector(false)}>
                    Close
                  </GameButton>
                </div>
              </GameCard>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Title Selector Modal */}
      <AnimatePresence>
        {showTitleSelector && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
            onClick={() => setShowTitleSelector(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="w-full max-w-md"
              onClick={e => e.stopPropagation()}
            >
              <GameCard>
                <h2 className="font-bold text-white mb-4 text-center">Select Title</h2>
                
                <div className="space-y-2 mb-4">
                  {availableTitles.map((titleId) => {
                    const isUnlocked = unlockedTitles.includes(titleId);
                    const isSelected = selectedTitle === titleId;
                    
                    return (
                      <motion.div
                        key={titleId}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={cn(
                          "cursor-pointer p-3 rounded-lg transition-colors border-2",
                          isSelected ? "border-primary bg-primary/20" : 
                            isUnlocked ? "border-transparent hover:bg-black/30" : "border-transparent opacity-50"
                        )}
                        onClick={() => handleSelectTitle(titleId)}
                      >
                        <div className="flex justify-between items-center">
                          <div className="font-medium text-white">{titleId}</div>
                          
                          {isSelected && (
                            <div className="bg-primary/30 text-white text-xs px-2 py-0.5 rounded-full">
                              Selected
                            </div>
                          )}
                        </div>
                        
                        {!isUnlocked && (
                          <div className="mt-1 flex items-center text-yellow-300 text-sm">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 mr-1">
                              <circle cx="12" cy="12" r="8"></circle>
                              <path d="M12 2v2"></path>
                              <path d="M12 20v2"></path>
                              <path d="M20 12h2"></path>
                              <path d="M2 12h2"></path>
                            </svg>
                            100 Coins to Unlock
                          </div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
                
                <div className="flex justify-end">
                  <GameButton onClick={() => setShowTitleSelector(false)}>
                    Close
                  </GameButton>
                </div>
              </GameCard>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProfilePage;
