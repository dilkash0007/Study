import { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useAudio } from '@/lib/stores/useAudio';

// Navigation items configuration
const navItems = [
  { path: '/', icon: 'home', label: 'Home' },
  { path: '/study-arena', icon: 'arena', label: 'Arena' },
  { path: '/quests', icon: 'quests', label: 'Quests' },
  { path: '/leaderboard', icon: 'leaderboard', label: 'Ranks' },
  { path: '/achievements', icon: 'achievements', label: 'Vault' },
  { path: '/profile', icon: 'profile', label: 'Character' },
  { path: '/subject-settings', icon: 'settings', label: 'Settings' },
];

// Icon components for the navigation buttons
const NavIcons: Record<string, React.ReactNode> = {
  home: (
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
      <polyline points="9 22 9 12 15 12 15 22"></polyline>
    </svg>
  ),
  arena: (
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"></circle>
      <polyline points="12 6 12 12 16 14"></polyline>
    </svg>
  ),
  quests: (
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
      <polyline points="14 2 14 8 20 8"></polyline>
      <line x1="9" y1="12" x2="15" y2="12"></line>
      <line x1="9" y1="16" x2="15" y2="16"></line>
    </svg>
  ),
  leaderboard: (
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 20V10"></path>
      <path d="M12 20V4"></path>
      <path d="M6 20V14"></path>
    </svg>
  ),
  achievements: (
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="6"></circle>
      <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"></path>
    </svg>
  ),
  profile: (
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
      <circle cx="12" cy="7" r="4"></circle>
    </svg>
  ),
  settings: (
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path>
      <circle cx="12" cy="12" r="3"></circle>
    </svg>
  ),
};

/**
 * Game Navigation Bar
 * A mobile game-like bottom navigation with animated icons and highlights
 */
const GameNavBar = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(location.pathname);
  const { playHit } = useAudio();

  // Update active tab when location changes
  useEffect(() => {
    setActiveTab(location.pathname);
  }, [location.pathname]);

  return (
    <nav className="fixed bottom-0 left-0 w-full z-40">
      {/* Decorative top highlight */}
      <div className="h-1 w-full bg-gradient-to-r from-primary via-secondary to-accent opacity-70"></div>
      
      {/* Main navigation background */}
      <div className="bg-black/70 backdrop-blur-lg px-2 py-2 border-t border-primary/30">
        <div className="max-w-screen-sm mx-auto">
          <div className="flex justify-around items-center">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => playHit()}
                className={({ isActive }) => 
                  cn("relative flex flex-col items-center", 
                     isActive ? "text-white" : "text-white/60")
                }
              >
                {({ isActive }) => (
                  <>
                    {/* Animated highlight for active tab */}
                    {isActive && (
                      <motion.div 
                        className="absolute -top-1 left-0 right-0 mx-auto w-8 h-1 bg-primary rounded-full"
                        layoutId="activeTab"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      />
                    )}
                    
                    {/* Icon */}
                    <div className={cn("nav-icon", isActive && "active")}>
                      {NavIcons[item.icon]}
                      
                      {/* Glow effect for active tab */}
                      {isActive && (
                        <div className="absolute inset-0 rounded-full bg-primary animate-pulse-glow opacity-30" />
                      )}
                    </div>
                    
                    {/* Label */}
                    <span className="text-xs mt-1 font-medium">
                      {item.label}
                    </span>
                  </>
                )}
              </NavLink>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default GameNavBar;
