import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { GameCard } from '@/components/ui/game-card';
import { GameButton } from '@/components/ui/game-button';
import { GameProgress } from '@/components/ui/game-progress';
import { XpBadge } from '@/components/ui/xp-badge';
import { AnimatedIcon } from '@/components/ui/animated-icon';
import { useUser } from '@/lib/stores/useUser';
import { useSubjects } from '@/lib/stores/useSubjects';
import { useQuests } from '@/lib/stores/useQuests';
import { useTimer } from '@/lib/stores/useTimer';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { xpForNextLevel } from '@/lib/stores/useUser';
import { toast } from 'sonner';

/**
 * Dashboard Component
 * The main dashboard showing subjects, stats, and quick actions
 */
const Dashboard = () => {
  const { level, xp, coins, gems } = useUser();
  const { subjects, setActiveSubject } = useSubjects();
  const { dailyQuests, checkAndRefreshDailyQuests } = useQuests();
  const navigate = useNavigate();
  const homeRef = useRef<HTMLDivElement>(null);

  // Check and refresh daily quests when component mounts
  useEffect(() => {
    checkAndRefreshDailyQuests();
  }, [checkAndRefreshDailyQuests]);

  // Calculate incomplete daily quests
  const incompleteDailyQuests = dailyQuests.filter(quest => !quest.isCompleted).length;
  
  // XP required for next level
  const nextLevelXP = xpForNextLevel(level);
  const xpProgress = (xp - xpForNextLevel(level - 1)) / (nextLevelXP - xpForNextLevel(level - 1)) * 100;

  return (
    <div ref={homeRef} className="min-h-screen px-4 pt-6 pb-24">
      {/* Header with user stats */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <XpBadge level={level} size="lg" className="mr-3" />
          <div>
            <h1 className="text-xl font-bold text-white">Dashboard</h1>
            <div className="flex items-center space-x-1 text-xs text-blue-300">
              <span>Level {level}</span>
              <span>•</span>
              <span>{xp} XP</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          {/* Coins display */}
          <div className="flex items-center bg-black/30 rounded-full px-3 py-1">
            <AnimatedIcon
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
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
            <span className="ml-1 text-sm font-medium text-yellow-100">{coins}</span>
          </div>
          
          {/* Gems display */}
          <div className="flex items-center bg-black/30 rounded-full px-3 py-1">
            <AnimatedIcon
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                </svg>
              }
              color="text-emerald-400"
              size="sm"
              animation="pulse"
            />
            <span className="ml-1 text-sm font-medium text-emerald-100">{gems}</span>
          </div>
        </div>
      </div>
      
      {/* XP Progress bar */}
      <div className="mb-8">
        <div className="flex justify-between text-xs mb-1">
          <span>XP Progress</span>
          <span>{xp} / {nextLevelXP}</span>
        </div>
        <GameProgress 
          value={xpProgress} 
          max={100} 
          variant="secondary" 
          size="md" 
        />
      </div>
      
      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <GameButton 
          variant="default" 
          size="lg"
          onClick={() => navigate('/study-arena')}
          leftIcon={
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
          }
        >
          Study Now
        </GameButton>
        
        <GameButton 
          variant="accent" 
          size="lg"
          onClick={() => navigate('/quests')}
          leftIcon={
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
              <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="9" y1="12" x2="15" y2="12"></line>
              <line x1="9" y1="16" x2="15" y2="16"></line>
            </svg>
          }
        >
          {incompleteDailyQuests > 0 ? `Quests (${incompleteDailyQuests})` : 'Quests'}
        </GameButton>
      </div>
      
      {/* Active Study Session */}
      <ActiveStudySession />
      
      {/* Subject Cards */}
      <div className="flex justify-between items-center mb-4 mt-8">
        <h2 className="text-lg font-bold text-white flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 mr-2 text-secondary">
            <path d="M3 19a9 9 0 0 1 9 0 9 9 0 0 1 9 0"></path>
            <path d="M3 6a9 9 0 0 1 9 0 9 9 0 0 1 9 0"></path>
            <path d="M3 6v13"></path>
            <path d="M12 6v13"></path>
            <path d="M21 6v13"></path>
          </svg>
          Your Subjects
        </h2>
        
        <div className="flex gap-2">
          <GameButton 
            variant="secondary" 
            size="sm"
            onClick={() => {
              const { addSubject } = useSubjects.getState();
              const defaultName = `Subject ${subjects.length + 1}`;
              addSubject({
                name: defaultName,
                description: 'My new subject',
                color: '#2196F3',
                icon: 'book'
              });
              toast.success(`Added new subject: ${defaultName}`);
            }}
            leftIcon={
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                <path d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0z"></path>
              </svg>
            }
          >
            Add New
          </GameButton>
          
          <GameButton 
            variant="ghost" 
            size="sm"
            onClick={() => navigate('/subject-settings')}
            leftIcon={
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
            }
          >
            Customize
          </GameButton>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {subjects.map((subject, index) => (
          <motion.div
            key={subject.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <GameCard 
              className="h-full" 
              animate="float"
              shimmer
              onClick={() => {
                setActiveSubject(subject.id);
                navigate('/study-arena');
              }}
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center">
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center mr-3"
                    style={{ backgroundColor: subject.color + '33', color: subject.color }}
                  >
                    {renderSubjectIcon(subject.icon)}
                  </div>
                  <div>
                    <h3 className="font-bold text-white">{subject.name}</h3>
                    <p className="text-xs text-gray-300">{subject.description}</p>
                  </div>
                </div>
                <XpBadge level={subject.level} size="sm" />
              </div>
              
              {/* Subject Stats */}
              <div className="mt-4">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-300">Subject XP</span>
                  <span className="text-blue-300">{subject.xp} XP</span>
                </div>
                <GameProgress 
                  value={subject.xp} 
                  max={subject.level * subject.level * subject.level * 5}
                  size="sm"
                  variant="secondary" 
                />
              </div>
              
              {/* Last studied indicator */}
              {subject.lastStudied && (
                <div className="mt-3 text-xs text-gray-400">
                  Last studied: {new Date(subject.lastStudied).toLocaleDateString()}
                </div>
              )}
            </GameCard>
          </motion.div>
        ))}
      </div>
      
      {/* Quick Access Sections */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8">
        {/* Daily Quests Section */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-bold text-white flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 mr-2 text-accent">
                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
              </svg>
              Daily Quests
            </h2>
            <GameButton
              variant="ghost"
              size="sm"
              onClick={() => navigate('/quests')}
            >
              View All
            </GameButton>
          </div>
          
          <GameCard className="p-3">
            {dailyQuests.filter(quest => !quest.isCompleted).slice(0, 3).map((quest, index) => (
              <div key={quest.id} className={`flex items-center justify-between py-2 ${index !== 0 ? 'border-t border-gray-800' : ''}`}>
                <div className="flex items-center">
                  <div className="mr-3 text-accent">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                      <line x1="16" y1="2" x2="16" y2="6"></line>
                      <line x1="8" y1="2" x2="8" y2="6"></line>
                      <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white">{quest.title}</div>
                    <div className="text-xs text-gray-400">{quest.description}</div>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="text-yellow-400 mr-2 text-xs font-medium">+{quest.xpReward} XP</div>
                </div>
              </div>
            ))}
            
            {dailyQuests.filter(quest => !quest.isCompleted).length === 0 && (
              <div className="text-center py-4">
                <div className="text-gray-500">All quests completed!</div>
                <div className="text-xs text-gray-400 mt-1">Come back tomorrow for new quests</div>
              </div>
            )}
          </GameCard>
        </div>
        
        {/* Rank Section */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-bold text-white flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 mr-2 text-primary">
                <path d="M18 20V10"></path>
                <path d="M12 20V4"></path>
                <path d="M6 20V14"></path>
              </svg>
              Your Rank
            </h2>
            <GameButton
              variant="ghost"
              size="sm"
              onClick={() => navigate('/leaderboard')}
            >
              View All
            </GameButton>
          </div>
          
          <GameCard className="p-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center text-white font-bold text-xl mr-4">
                  #12
                </div>
                <div>
                  <div className="text-white font-medium">Your Weekly Position</div>
                  <div className="text-xs text-gray-400">Top 15% of all users</div>
                </div>
              </div>
              <div className="text-lg font-bold text-amber-400">★ 3,254</div>
            </div>
            
            <div className="mt-4">
              <div className="flex justify-between items-center text-xs mb-1">
                <span className="text-gray-400">To Next Rank</span>
                <span className="text-amber-400">146 points needed</span>
              </div>
              <GameProgress
                value={70}
                max={100}
                size="sm"
                variant="secondary"
              />
            </div>
          </GameCard>
        </div>
      </div>
    </div>
  );
};

// Active Study Session Component
const ActiveStudySession = () => {
  const { isActive, timeLeft, sessionType, pauseTimer, resumeTimer } = useTimer();
  
  if (!isActive) return null;
  
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  
  return (
    <div className="mt-6">
      <h2 className="text-lg font-bold text-white flex items-center mb-3">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 mr-2 text-green-500">
          <circle cx="12" cy="12" r="10"></circle>
          <polyline points="12 6 12 12 16 14"></polyline>
        </svg>
        Current Study Session
      </h2>
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <GameCard className="border border-green-700/50" shimmer>
          <div className="flex justify-between items-center">
            <div>
              <div className="text-white font-semibold">{sessionType === 'focus' ? 'Focus Time' : 'Break Time'}</div>
              <div className="text-xs text-gray-400 mt-1">Session in progress</div>
            </div>
            
            <div className="flex items-center">
              <span className="mr-3 text-2xl font-bold text-white">{formattedTime}</span>
              
              {/* Pause/Resume Button */}
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => isActive && timeLeft > 0 ? pauseTimer() : resumeTimer()}
                className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center"
              >
                {timeLeft > 0 && isActive ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="6" y="4" width="4" height="16"></rect>
                    <rect x="14" y="4" width="4" height="16"></rect>
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="5 3 19 12 5 21 5 3"></polygon>
                  </svg>
                )}
              </motion.button>
            </div>
          </div>
          
          <div className="mt-3">
            <GameButton 
              variant="outline" 
              size="sm" 
              className="w-full"
              onClick={() => navigate('/study-arena')}
            >
              Go to Study Arena
            </GameButton>
          </div>
        </GameCard>
      </motion.div>
    </div>
  );
};

// Helper function to render subject icons
const renderSubjectIcon = (iconName: string) => {
  switch (iconName) {
    case 'calculator':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
          <rect x="4" y="2" width="16" height="20" rx="2"></rect>
          <line x1="8" x2="16" y1="6" y2="6"></line>
          <line x1="8" x2="8" y1="14" y2="14"></line>
          <line x1="8" x2="8" y1="18" y2="18"></line>
          <line x1="12" x2="12" y1="14" y2="14"></line>
          <line x1="12" x2="12" y1="18" y2="18"></line>
          <line x1="16" x2="16" y1="14" y2="14"></line>
          <line x1="16" x2="16" y1="18" y2="18"></line>
        </svg>
      );
    case 'flask':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
          <path d="M9 3h6v2l-1 1v2l4 3h-5"></path>
          <path d="M8 8H7C4.79 8 3 9.79 3 12v0c0 2.21 1.79 4 4 4h10c2.21 0 4-1.79 4-4v0c0-2.21-1.79-4-4-4h-1"></path>
          <path d="M7 16l1.5 2"></path>
          <path d="M16.5 18 18 16"></path>
          <path d="M12 12v-1"></path>
        </svg>
      );
    case 'book':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
        </svg>
      );
    case 'clock':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
          <circle cx="12" cy="12" r="10"></circle>
          <polyline points="12 6 12 12 16 14"></polyline>
        </svg>
      );
    default:
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
          <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48"></path>
        </svg>
      );
  }
};

export default Dashboard;