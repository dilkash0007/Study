import { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import GameNavBar from '../navigation/GameNavBar';
import { motion, AnimatePresence } from 'framer-motion';
import { useAudio } from '@/lib/stores/useAudio';

// Define background images for different routes
const routeBackgrounds: Record<string, string> = {
  '/': 'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#2e026d] via-[#100a30] to-[#0d0a14]',
  '/study-arena': 'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#480a0a] via-[#270f1c] to-[#0d0a14]',
  '/quests': 'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#063d69] via-[#091b3a] to-[#0d0a14]',
  '/leaderboard': 'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#2d4b0f] via-[#152a1c] to-[#0d0a14]',
  '/achievements': 'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#6d3102] via-[#3a1c09] to-[#0d0a14]',
  '/profile': 'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#4f0275] via-[#1e0c30] to-[#0d0a14]'
};

// Animation variants for page transitions
const pageVariants = {
  initial: { opacity: 0, y: 20 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -20 }
};

const pageTransition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.5
};

/**
 * Main layout component for the game UI
 * Provides the consistent layout and animated page transitions
 */
const GameLayout = () => {
  const location = useLocation();
  const [bgClass, setBgClass] = useState(routeBackgrounds['/']);
  const { isMuted, toggleMute } = useAudio();

  // Update background based on route
  useEffect(() => {
    setBgClass(routeBackgrounds[location.pathname] || routeBackgrounds['/']);
  }, [location.pathname]);

  return (
    <div className={`min-h-screen w-full flex flex-col ${bgClass} transition-colors duration-1000`}>
      {/* Animated background particles via a pseudo-element to avoid expensive re-renders */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBvcGFjaXR5PSIwLjA1Ij48Y2lyY2xlIGN4PSIxMCIgY3k9IjEwIiByPSIyIiBmaWxsPSJ3aGl0ZSIvPjxjaXJjbGUgY3g9IjQwIiBjeT0iMjAiIHI9IjEiIGZpbGw9IndoaXRlIi8+PGNpcmNsZSBjeD0iNzAiIGN5PSIxMCIgcj0iMSIgZmlsbD0id2hpdGUiLz48Y2lyY2xlIGN4PSIxMDAiIGN5PSIzMCIgcj0iMiIgZmlsbD0id2hpdGUiLz48Y2lyY2xlIGN4PSIxMzAiIGN5PSIxMCIgcj0iMSIgZmlsbD0id2hpdGUiLz48Y2lyY2xlIGN4PSIxNjAiIGN5PSIyMCIgcj0iMSIgZmlsbD0id2hpdGUiLz48Y2lyY2xlIGN4PSIxOTAiIGN5PSIxMCIgcj0iMiIgZmlsbD0id2hpdGUiLz48Y2lyY2xlIGN4PSIxMCIgY3k9IjQwIiByPSIxIiBmaWxsPSJ3aGl0ZSIvPjxjaXJjbGUgY3g9IjQwIiBjeT0iNTAiIHI9IjIiIGZpbGw9IndoaXRlIi8+PGNpcmNsZSBjeD0iNzAiIGN5PSI0MCIgcj0iMSIgZmlsbD0id2hpdGUiLz48Y2lyY2xlIGN4PSIxMDAiIGN5PSI2MCIgcj0iMSIgZmlsbD0id2hpdGUiLz48Y2lyY2xlIGN4PSIxMzAiIGN5PSI0MCIgcj0iMiIgZmlsbD0id2hpdGUiLz48Y2lyY2xlIGN4PSIxNjAiIGN5PSI1MCIgcj0iMSIgZmlsbD0id2hpdGUiLz48Y2lyY2xlIGN4PSIxOTAiIGN5PSI0MCIgcj0iMSIgZmlsbD0id2hpdGUiLz48Y2lyY2xlIGN4PSIxMCIgY3k9IjcwIiByPSIyIiBmaWxsPSJ3aGl0ZSIvPjxjaXJjbGUgY3g9IjQwIiBjeT0iODAiIHI9IjEiIGZpbGw9IndoaXRlIi8+PGNpcmNsZSBjeD0iNzAiIGN5PSI3MCIgcj0iMSIgZmlsbD0id2hpdGUiLz48Y2lyY2xlIGN4PSIxMDAiIGN5PSI5MCIgcj0iMiIgZmlsbD0id2hpdGUiLz48Y2lyY2xlIGN4PSIxMzAiIGN5PSI3MCIgcj0iMSIgZmlsbD0id2hpdGUiLz48Y2lyY2xlIGN4PSIxNjAiIGN5PSI4MCIgcj0iMSIgZmlsbD0id2hpdGUiLz48Y2lyY2xlIGN4PSIxOTAiIGN5PSI3MCIgcj0iMiIgZmlsbD0id2hpdGUiLz48Y2lyY2xlIGN4PSIxMCIgY3k9IjEwMCIgcj0iMSIgZmlsbD0id2hpdGUiLz48Y2lyY2xlIGN4PSI0MCIgY3k9IjExMCIgcj0iMiIgZmlsbD0id2hpdGUiLz48Y2lyY2xlIGN4PSI3MCIgY3k9IjEwMCIgcj0iMSIgZmlsbD0id2hpdGUiLz48Y2lyY2xlIGN4PSIxMDAiIGN5PSIxMjAiIHI9IjEiIGZpbGw9IndoaXRlIi8+PGNpcmNsZSBjeD0iMTMwIiBjeT0iMTAwIiByPSIyIiBmaWxsPSJ3aGl0ZSIvPjxjaXJjbGUgY3g9IjE2MCIgY3k9IjExMCIgcj0iMSIgZmlsbD0id2hpdGUiLz48Y2lyY2xlIGN4PSIxOTAiIGN5PSIxMDAiIHI9IjEiIGZpbGw9IndoaXRlIi8+PGNpcmNsZSBjeD0iMTAiIGN5PSIxMzAiIHI9IjIiIGZpbGw9IndoaXRlIi8+PGNpcmNsZSBjeD0iNDAiIGN5PSIxNDAiIHI9IjEiIGZpbGw9IndoaXRlIi8+PGNpcmNsZSBjeD0iNzAiIGN5PSIxMzAiIHI9IjEiIGZpbGw9IndoaXRlIi8+PGNpcmNsZSBjeD0iMTAwIiBjeT0iMTUwIiByPSIyIiBmaWxsPSJ3aGl0ZSIvPjxjaXJjbGUgY3g9IjEzMCIgY3k9IjEzMCIgcj0iMSIgZmlsbD0id2hpdGUiLz48Y2lyY2xlIGN4PSIxNjAiIGN5PSIxNDAiIHI9IjEiIGZpbGw9IndoaXRlIi8+PGNpcmNsZSBjeD0iMTkwIiBjeT0iMTMwIiByPSIyIiBmaWxsPSJ3aGl0ZSIvPjxjaXJjbGUgY3g9IjEwIiBjeT0iMTYwIiByPSIxIiBmaWxsPSJ3aGl0ZSIvPjxjaXJjbGUgY3g9IjQwIiBjeT0iMTcwIiByPSIyIiBmaWxsPSJ3aGl0ZSIvPjxjaXJjbGUgY3g9IjcwIiBjeT0iMTYwIiByPSIxIiBmaWxsPSJ3aGl0ZSIvPjxjaXJjbGUgY3g9IjEwMCIgY3k9IjE4MCIgcj0iMSIgZmlsbD0id2hpdGUiLz48Y2lyY2xlIGN4PSIxMzAiIGN5PSIxNjAiIHI9IjIiIGZpbGw9IndoaXRlIi8+PGNpcmNsZSBjeD0iMTYwIiBjeT0iMTcwIiByPSIxIiBmaWxsPSJ3aGl0ZSIvPjxjaXJjbGUgY3g9IjE5MCIgY3k9IjE2MCIgcj0iMSIgZmlsbD0id2hpdGUiLz48Y2lyY2xlIGN4PSIxMCIgY3k9IjE5MCIgcj0iMiIgZmlsbD0id2hpdGUiLz48Y2lyY2xlIGN4PSI0MCIgY3k9IjIwMCIgcj0iMSIgZmlsbD0id2hpdGUiLz48Y2lyY2xlIGN4PSI3MCIgY3k9IjE5MCIgcj0iMSIgZmlsbD0id2hpdGUiLz48Y2lyY2xlIGN4PSIxMDAiIGN5PSIyMDAiIHI9IjIiIGZpbGw9IndoaXRlIi8+PGNpcmNsZSBjeD0iMTMwIiBjeT0iMTkwIiByPSIxIiBmaWxsPSJ3aGl0ZSIvPjxjaXJjbGUgY3g9IjE2MCIgY3k9IjIwMCIgcj0iMSIgZmlsbD0id2hpdGUiLz48Y2lyY2xlIGN4PSIxOTAiIGN5PSIxOTAiIHI9IjIiIGZpbGw9IndoaXRlIi8+PC9nPjwvc3ZnPg==')]
          animate-subtle-rotate opacity-50"></div>
      </div>
      
      {/* Sound toggle button */}
      <button 
        onClick={toggleMute}
        className="fixed top-4 right-4 z-50 w-10 h-10 flex items-center justify-center rounded-full bg-black/30 text-white hover:bg-black/50 transition-colors"
        aria-label={isMuted ? "Unmute sound" : "Mute sound"}
      >
        {isMuted ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="1" y1="1" x2="23" y2="23"></line>
            <path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6"></path>
            <path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23"></path>
            <line x1="12" y1="19" x2="12" y2="23"></line>
            <line x1="8" y1="23" x2="16" y2="23"></line>
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
          </svg>
        )}
      </button>
      
      {/* Main content with animated page transitions */}
      <main className="flex-1 relative overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
            className="w-full h-full overflow-y-auto no-scrollbar pb-24"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
      
      {/* Navigation bar */}
      <GameNavBar />
    </div>
  );
};

export default GameLayout;
