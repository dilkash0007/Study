import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GameCard } from '@/components/ui/game-card';
import { GameButton } from '@/components/ui/game-button';
import { GameProgress } from '@/components/ui/game-progress';
import { AnimatedIcon } from '@/components/ui/animated-icon';
import { useAchievements } from '@/lib/stores/useAchievements';
import { AchievementCategory } from '@/types';
import { cn } from '@/lib/utils';
import ParticleEffect from '@/components/effects/ParticleEffect';
import { getAchievementIcon } from '@/assets/achievement-icons';

/**
 * Achievements Page Component
 * Displays unlocked and locked achievements with visual effects
 */
const AchievementsPage = () => {
  const { achievements, recentlyUnlocked, clearRecentlyUnlocked } = useAchievements();
  const [selectedCategory, setSelectedCategory] = useState<AchievementCategory | 'all'>('all');
  const [showRecent, setShowRecent] = useState(true);
  
  // Filter achievements by category
  const filteredAchievements = selectedCategory === 'all' 
    ? achievements 
    : achievements.filter(a => a.category === selectedCategory);
  
  // Calculate overall achievement progress
  const unlockedCount = achievements.filter(a => a.isUnlocked).length;
  const totalCount = achievements.length;
  const completionPercentage = (unlockedCount / totalCount) * 100;
  
  // Effect to clear recently unlocked status
  useEffect(() => {
    if (recentlyUnlocked.length > 0 && !showRecent) {
      clearRecentlyUnlocked();
    }
  }, [showRecent, recentlyUnlocked, clearRecentlyUnlocked]);
  
  // Available achievement categories
  const categories = [
    { id: 'all', name: 'All', icon: 'trophy' },
    { id: AchievementCategory.STUDY, name: 'Study', icon: 'brain' },
    { id: AchievementCategory.QUEST, name: 'Quests', icon: 'scroll' },
    { id: AchievementCategory.LEVEL, name: 'Levels', icon: 'star' },
    { id: AchievementCategory.STREAK, name: 'Streaks', icon: 'fire' }
  ];

  return (
    <div className="min-h-screen px-4 pt-6 pb-24">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 mr-2 text-accent">
            <circle cx="12" cy="8" r="6"></circle>
            <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"></path>
          </svg>
          Achievement Vault
        </h1>
        <p className="text-gray-300 text-sm mt-1">Your collection of earned achievements</p>
      </div>
      
      {/* Achievement progress */}
      <GameCard className="mb-6 relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="font-bold text-white mb-4">Achievement Progress</h2>
          
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-300 text-sm">Completion</span>
            <span className="text-blue-300 text-sm">{unlockedCount} / {totalCount}</span>
          </div>
          
          <GameProgress 
            value={completionPercentage} 
            max={100} 
            variant="accent" 
            size="md"
            showValue
            valueSuffix="%" 
          />
          
          <div className="mt-4 grid grid-cols-2 gap-2">
            <div className="bg-black/30 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-white">{unlockedCount}</div>
              <div className="text-xs text-gray-300">Unlocked</div>
            </div>
            
            <div className="bg-black/30 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-white">{totalCount - unlockedCount}</div>
              <div className="text-xs text-gray-300">Locked</div>
            </div>
          </div>
        </div>
        
        {/* Decorative achievement backgrounds */}
        <div className="absolute -right-8 -bottom-8 opacity-10 transform rotate-12">
          <svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 24 24" fill="currentColor" className="text-accent">
            <path d="M12 15a6 6 0 1 0 0-12 6 6 0 0 0 0 12Z"></path>
            <path d="M15.6 15.2A8 8 0 0 1 8.4 8.4l-.8.8a9 9 0 0 0 8 8l.2-.8Z"></path>
            <path d="m17.8 13.8-.8-.8a11 11 0 0 1-10-10l-.8.8a12 12 0 0 0 11.6 11.6l.4-1.6Z"></path>
            <path d="M12 15v7.4"></path>
            <path d="M8 22h8"></path>
          </svg>
        </div>
        
        <div className="absolute -left-6 -top-6 opacity-10 transform -rotate-12">
          <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="currentColor" className="text-primary">
            <path d="M12 2l2.4 7.4h7.6l-6 4.6 2.3 7-6.3-4.6-6.3 4.6 2.3-7-6-4.6h7.6z"></path>
          </svg>
        </div>
      </GameCard>
      
      {/* Recently unlocked achievements */}
      {recentlyUnlocked.length > 0 && showRecent && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="mb-6"
        >
          <GameCard 
            className="border-2 border-accent animate-pulse-glow"
            shimmer
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-bold text-white flex items-center">
                <AnimatedIcon
                  icon={
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M2.5 18.5A9 9 0 1 1 21.5 9"></path>
                      <path d="m2.5 14 5 5"></path>
                      <path d="m7.5 9 5 5"></path>
                    </svg>
                  }
                  color="text-accent"
                  size="sm"
                  className="mr-2"
                  animation="pulse"
                />
                Recently Unlocked
              </h2>
              
              <GameButton 
                variant="ghost" 
                size="sm"
                onClick={() => setShowRecent(false)}
              >
                Dismiss
              </GameButton>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {recentlyUnlocked.map(id => {
                const achievement = achievements.find(a => a.id === id);
                if (!achievement) return null;
                
                return (
                  <motion.div
                    key={achievement.id}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="relative"
                  >
                    <AchievementItem achievement={achievement} isRecent />
                  </motion.div>
                );
              })}
            </div>
          </GameCard>
        </motion.div>
      )}
      
      {/* Category filter */}
      <div className="flex gap-2 mb-6 overflow-x-auto no-scrollbar py-2">
        {categories.map((category) => (
          <GameButton 
            key={category.id}
            variant={selectedCategory === category.id ? 'default' : 'ghost'} 
            onClick={() => setSelectedCategory(category.id as any)}
            size="sm"
          >
            {category.name}
          </GameButton>
        ))}
      </div>
      
      {/* Achievements grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <AnimatePresence mode="popLayout">
          {filteredAchievements.map((achievement, index) => (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              layout
            >
              <AchievementItem achievement={achievement} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

// Single achievement item component
interface AchievementItemProps {
  achievement: any;
  isRecent?: boolean;
}

const AchievementItem: React.FC<AchievementItemProps> = ({ achievement, isRecent = false }) => {
  return (
    <GameCard 
      className={cn(
        "relative overflow-hidden transition-all",
        !achievement.isUnlocked && "opacity-60 grayscale"
      )}
    >
      {/* Celebration effect for recently unlocked achievements */}
      {isRecent && (
        <ParticleEffect 
          type="sparkle" 
          trigger={true}
          count={20}
          colors={['#FFD700', '#FFFFFF', '#FFC107']}
        />
      )}
      
      <div className="flex items-start gap-4">
        {/* Achievement icon */}
        <div className={cn(
          "w-14 h-14 rounded-lg flex items-center justify-center flex-shrink-0 relative",
          achievement.isUnlocked ? "bg-accent/20" : "bg-gray-700/20"
        )}>
          <AnimatedIcon
            icon={getAchievementIcon(achievement.icon)}
            animation={achievement.isUnlocked ? (isRecent ? "bounce" : "pulse") : "none"}
            color={achievement.isUnlocked ? "text-accent" : "text-gray-500"}
            size="lg"
          />
          
          {/* Locked indicator */}
          {!achievement.isUnlocked && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-gray-400">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
            </div>
          )}
        </div>
        
        <div className="flex-1">
          {/* Achievement title and badge */}
          <div className="flex justify-between items-start">
            <h3 className={cn(
              "font-bold",
              achievement.isUnlocked ? "text-white" : "text-gray-400"
            )}>
              {achievement.title}
            </h3>
            
            {achievement.isUnlocked && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-accent/30 text-white">
                Unlocked
              </span>
            )}
          </div>
          
          {/* Achievement description */}
          <p className="text-sm text-gray-300 mt-1 mb-3">{achievement.description}</p>
          
          {/* Rewards */}
          <div className="flex items-center gap-3 flex-wrap">
            {achievement.xpReward > 0 && (
              <div className="flex items-center text-blue-300 text-sm">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 mr-1">
                  <path d="M2.5 18.5A9 9 0 1 1 21.5 9"></path>
                  <path d="m2.5 14 5 5"></path>
                  <path d="m7.5 9 5 5"></path>
                </svg>
                {achievement.xpReward} XP
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
              {achievement.coinReward} Coins
            </div>
            
            {achievement.gemReward > 0 && (
              <div className="flex items-center text-green-300 text-sm">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 mr-1">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                </svg>
                {achievement.gemReward} Gems
              </div>
            )}
          </div>
          
          {/* Unlock date */}
          {achievement.isUnlocked && achievement.unlockedAt && (
            <div className="mt-2 text-xs text-gray-400">
              Unlocked on {new Date(achievement.unlockedAt).toLocaleDateString()}
            </div>
          )}
        </div>
      </div>
    </GameCard>
  );
};

export default AchievementsPage;
