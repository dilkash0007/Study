import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { GameCard } from '@/components/ui/game-card';
import { GameButton } from '@/components/ui/game-button';
import { XpBadge } from '@/components/ui/xp-badge';
import { AnimatedIcon } from '@/components/ui/animated-icon';
import { useUser } from '@/lib/stores/useUser';
import { cn } from '@/lib/utils';

// Sample leaderboard data (in a real app, this would come from the backend)
const SAMPLE_PLAYERS = [
  { id: 'p1', username: 'MindMaster', level: 15, xp: 2250, avatarId: 'wizard' },
  { id: 'p2', username: 'BrainWave', level: 12, xp: 1500, avatarId: 'knight' },
  { id: 'p3', username: 'StudyLegend', level: 10, xp: 1000, avatarId: 'archer' },
  { id: 'p4', username: 'KnowledgeSeeker', level: 8, xp: 700, avatarId: 'mage' },
  { id: 'p5', username: 'FocusChampion', level: 7, xp: 550, avatarId: 'warrior' },
  { id: 'p6', username: 'MemoryKing', level: 5, xp: 300, avatarId: 'healer' },
  { id: 'p7', username: 'QuizWhiz', level: 4, xp: 200, avatarId: 'rogue' },
  { id: 'p8', username: 'NoteNinja', level: 3, xp: 150, avatarId: 'bard' }
];

// Leaderboard timeframes
type Timeframe = 'weekly' | 'monthly' | 'allTime';

/**
 * Leaderboard Page Component
 * Displays player rankings with gamified tower visuals
 */
const LeaderboardPage = () => {
  const { level, xp, selectedAvatar } = useUser();
  const [timeframe, setTimeframe] = useState<Timeframe>('weekly');
  const [players, setPlayers] = useState<any[]>([]);
  const [userRank, setUserRank] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  // Fetch leaderboard data (simulated)
  useEffect(() => {
    setIsLoading(true);
    
    // Simulate API call delay
    const timer = setTimeout(() => {
      // Add the current user to the sample data
      const currentUser = {
        id: 'current',
        username: 'You',
        level,
        xp,
        avatarId: selectedAvatar,
        isCurrentUser: true
      };
      
      // Create a copy of sample players and add user
      const allPlayers = [...SAMPLE_PLAYERS, currentUser];
      
      // Sort by XP (descending)
      allPlayers.sort((a, b) => b.xp - a.xp);
      
      // Find user's rank
      const rank = allPlayers.findIndex(p => p.isCurrentUser) + 1;
      
      setPlayers(allPlayers);
      setUserRank(rank);
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [level, xp, selectedAvatar, timeframe]);
  
  // Get players for the tower visualization (top 3)
  const topPlayers = players.slice(0, 3);

  return (
    <div className="min-h-screen px-4 pt-6 pb-24">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 mr-2 text-secondary">
            <path d="M18 20V10"></path>
            <path d="M12 20V4"></path>
            <path d="M6 20V14"></path>
          </svg>
          Leaderboard
        </h1>
        <p className="text-gray-300 text-sm mt-1">Compare your progress with other students</p>
      </div>
      
      {/* Timeframe selector */}
      <div className="flex gap-2 mb-6">
        <GameButton 
          variant={timeframe === 'weekly' ? 'default' : 'ghost'} 
          onClick={() => setTimeframe('weekly')}
        >
          Weekly
        </GameButton>
        
        <GameButton 
          variant={timeframe === 'monthly' ? 'default' : 'ghost'} 
          onClick={() => setTimeframe('monthly')}
        >
          Monthly
        </GameButton>
        
        <GameButton 
          variant={timeframe === 'allTime' ? 'default' : 'ghost'} 
          onClick={() => setTimeframe('allTime')}
        >
          All Time
        </GameButton>
      </div>
      
      {/* Top 3 podium visualization */}
      <GameCard className="mb-6 overflow-hidden">
        <h2 className="font-bold text-white mb-6 text-center">Top Students</h2>
        
        {isLoading ? (
          <div className="flex justify-center items-center py-10">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="relative h-64 flex items-end justify-center gap-2">
            {/* Podium platforms */}
            <div className="absolute bottom-0 left-0 right-0 flex justify-center items-end">
              {/* 2nd place platform */}
              <div className="w-24 h-32 bg-gradient-to-t from-[#C0C0C0]/80 to-[#E0E0E0]/60 rounded-t-lg mx-1 flex flex-col items-center justify-end relative overflow-hidden">
                <div className="text-4xl font-bold text-white absolute top-4">2</div>
                <div className="w-full h-1/3 bg-[#C0C0C0]/30 backdrop-blur-sm"></div>
              </div>
              
              {/* 1st place platform (taller) */}
              <div className="w-24 h-44 bg-gradient-to-t from-[#FFD700]/80 to-[#FFF3A3]/60 rounded-t-lg mx-1 flex flex-col items-center justify-end relative overflow-hidden">
                <div className="text-4xl font-bold text-white absolute top-4">1</div>
                <div className="w-full h-1/3 bg-[#FFD700]/30 backdrop-blur-sm"></div>
              </div>
              
              {/* 3rd place platform (shortest) */}
              <div className="w-24 h-24 bg-gradient-to-t from-[#CD7F32]/80 to-[#E9BB8D]/60 rounded-t-lg mx-1 flex flex-col items-center justify-end relative overflow-hidden">
                <div className="text-4xl font-bold text-white absolute top-4">3</div>
                <div className="w-full h-1/3 bg-[#CD7F32]/30 backdrop-blur-sm"></div>
              </div>
            </div>
            
            {/* Player avatars on podiums */}
            {topPlayers.map((player, index) => {
              // Position avatars on the correct platforms
              const position = index === 0 ? 1 : index === 1 ? 0 : 2;
              const offsetX = position === 0 ? -50 : position === 2 ? 50 : 0;
              
              return (
                <motion.div
                  key={player.id}
                  className="absolute bottom-0 z-10"
                  initial={{ y: 100, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ 
                    type: "spring", 
                    delay: position * 0.2,
                    duration: 0.5 
                  }}
                  style={{ transform: `translateX(${offsetX}px)` }}
                >
                  {/* Player avatar */}
                  <div className="flex flex-col items-center mb-2">
                    <div className={cn(
                      "w-16 h-16 rounded-full flex items-center justify-center mb-1",
                      player.isCurrentUser ? "bg-primary" : "bg-gray-700"
                    )}>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 text-white">
                        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                      </svg>
                      
                      {/* Crown for 1st place */}
                      {position === 1 && (
                        <div className="absolute -top-6">
                          <AnimatedIcon
                            icon={
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                              </svg>
                            }
                            animation="float"
                            color="text-yellow-400"
                          />
                        </div>
                      )}
                    </div>
                    
                    {/* Player name and level */}
                    <XpBadge level={player.level} size="sm" className="mb-1" />
                    <div className={cn(
                      "text-xs font-medium px-2 py-0.5 rounded-full",
                      player.isCurrentUser ? "bg-primary/30 text-white" : "bg-gray-700/50 text-gray-200"
                    )}>
                      {player.username}
                    </div>
                  </div>
                </motion.div>
              );
            })}
            
            {/* Decorative elements */}
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
              <AnimatedIcon
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10">
                    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path>
                    <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path>
                    <path d="M4 22h16"></path>
                    <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"></path>
                    <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"></path>
                    <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"></path>
                  </svg>
                }
                animation="float"
                color="text-accent"
                size="xl"
              />
            </div>
          </div>
        )}
      </GameCard>
      
      {/* Full leaderboard */}
      <GameCard>
        <h2 className="font-bold text-white mb-4">Rankings</h2>
        
        {isLoading ? (
          <div className="flex justify-center items-center py-10">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="space-y-2">
            {players.map((player, index) => (
              <motion.div
                key={player.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <div className={cn(
                  "flex items-center p-3 rounded-lg transition-colors",
                  player.isCurrentUser 
                    ? "bg-primary/20 border border-primary/30" 
                    : "bg-black/20 hover:bg-black/30"
                )}>
                  {/* Rank number */}
                  <div className="w-8 h-8 rounded-full bg-black/30 flex items-center justify-center mr-3">
                    <span className="text-sm font-bold">{index + 1}</span>
                  </div>
                  
                  {/* Avatar */}
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center mr-3",
                    player.isCurrentUser ? "bg-primary" : "bg-gray-700"
                  )}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-white">
                      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                  </div>
                  
                  {/* Username and XP */}
                  <div className="flex-1">
                    <div className="font-medium flex items-center">
                      {player.username}
                      {player.isCurrentUser && (
                        <span className="ml-1 text-xs bg-primary/30 text-white px-1.5 rounded-full">
                          You
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-blue-300">{player.xp} XP</div>
                  </div>
                  
                  {/* Level badge */}
                  <XpBadge level={player.level} size="sm" />
                </div>
              </motion.div>
            ))}
          </div>
        )}
        
        {/* User's rank indicator */}
        {!isLoading && (
          <div className="mt-6 bg-black/30 rounded-lg p-4 text-center">
            <p className="text-sm text-gray-300 mb-1">Your Rank</p>
            <div className="text-2xl font-bold text-white">
              {userRank}
              <span className="text-sm ml-1 text-gray-400">of {players.length}</span>
            </div>
          </div>
        )}
      </GameCard>
    </div>
  );
};

export default LeaderboardPage;
