import React from 'react';

/**
 * Themed background patterns for different sections of the application
 * Using SVG patterns to create game-like atmospheric backgrounds
 */

// Fantasy-inspired background patterns
export const BackgroundPatterns = {
  // Home screen background - magical starfield with floating particles
  homeBackground: (
    <svg className="absolute inset-0 w-full h-full opacity-10 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="starsPattern" width="100" height="100" patternUnits="userSpaceOnUse">
          <circle cx="10" cy="10" r="1" fill="white" />
          <circle cx="30" cy="25" r="0.5" fill="white" />
          <circle cx="50" cy="15" r="0.75" fill="white" />
          <circle cx="70" cy="45" r="1.25" fill="white" />
          <circle cx="90" cy="30" r="0.5" fill="white" />
          <circle cx="15" cy="80" r="1" fill="white" />
          <circle cx="35" cy="70" r="0.5" fill="white" />
          <circle cx="65" cy="85" r="0.75" fill="white" />
          <circle cx="85" cy="65" r="0.5" fill="white" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#starsPattern)" />
    </svg>
  ),
  
  // Study arena background - mystical battle arena with energy flows
  studyArenaBackground: (
    <svg className="absolute inset-0 w-full h-full opacity-10 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="arenaGradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
          <stop offset="0%" stopColor="#9945FF" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#9945FF" stopOpacity="0" />
        </radialGradient>
        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="10" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>
      <rect width="100%" height="100%" fill="url(#arenaGradient)" />
      <path d="M0,50 Q250,30 500,50 T1000,50" stroke="#9945FF" strokeWidth="2" fill="none" opacity="0.2" filter="url(#glow)" />
      <path d="M0,70 Q250,90 500,70 T1000,70" stroke="#14F195" strokeWidth="2" fill="none" opacity="0.2" filter="url(#glow)" />
    </svg>
  ),
  
  // Quests background - scroll and map-like pattern
  questsBackground: (
    <svg className="absolute inset-0 w-full h-full opacity-10 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="questPattern" width="100" height="100" patternUnits="userSpaceOnUse">
          <path d="M10,10 L90,10 L90,90 L10,90 Z" stroke="#FFBB38" strokeWidth="0.5" fill="none" />
          <path d="M30,30 L70,30 L70,70 L30,70 Z" stroke="#FFBB38" strokeWidth="0.5" fill="none" />
          <path d="M50,10 L50,90" stroke="#FFBB38" strokeWidth="0.5" fill="none" opacity="0.5" />
          <path d="M10,50 L90,50" stroke="#FFBB38" strokeWidth="0.5" fill="none" opacity="0.5" />
          <circle cx="50" cy="50" r="5" fill="#FFBB38" opacity="0.2" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#questPattern)" />
    </svg>
  ),
  
  // Leaderboard background - trophy and podium themed
  leaderboardBackground: (
    <svg className="absolute inset-0 w-full h-full opacity-10 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="leaderboardPattern" width="100" height="100" patternUnits="userSpaceOnUse">
          <circle cx="50" cy="20" r="10" stroke="#FFD700" strokeWidth="0.5" fill="none" />
          <path d="M40,30 L40,50 L60,50 L60,30" stroke="#FFD700" strokeWidth="0.5" fill="none" />
          <rect x="35" y="50" width="30" height="10" stroke="#FFD700" strokeWidth="0.5" fill="none" />
          <rect x="30" y="60" width="40" height="10" stroke="#FFD700" strokeWidth="0.5" fill="none" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#leaderboardPattern)" />
    </svg>
  ),
  
  // Achievements background - badge and star themed
  achievementsBackground: (
    <svg className="absolute inset-0 w-full h-full opacity-10 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="achievementPattern" width="200" height="200" patternUnits="userSpaceOnUse">
          <path d="M100,20 L120,70 L180,70 L130,100 L150,160 L100,130 L50,160 L70,100 L20,70 L80,70 Z" 
                stroke="#FFBB38" strokeWidth="0.5" fill="none" />
          <circle cx="100" cy="100" r="30" stroke="#9945FF" strokeWidth="0.5" fill="none" />
          <circle cx="100" cy="100" r="20" stroke="#14F195" strokeWidth="0.5" fill="none" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#achievementPattern)" />
    </svg>
  ),
  
  // Profile background - character sheet themed
  profileBackground: (
    <svg className="absolute inset-0 w-full h-full opacity-10 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="profilePattern" width="100" height="100" patternUnits="userSpaceOnUse">
          <circle cx="50" cy="30" r="15" stroke="#9945FF" strokeWidth="0.5" fill="none" />
          <path d="M35,45 L65,45" stroke="#9945FF" strokeWidth="0.5" fill="none" />
          <path d="M35,55 L65,55" stroke="#9945FF" strokeWidth="0.5" fill="none" />
          <path d="M35,65 L65,65" stroke="#9945FF" strokeWidth="0.5" fill="none" />
          <path d="M35,75 L50,75" stroke="#9945FF" strokeWidth="0.5" fill="none" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#profilePattern)" />
    </svg>
  )
};

// Animated background effects that can be applied to any section
export const AnimatedBackgroundEffects = {
  // Floating particles effect
  floatingParticles: (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBvcGFjaXR5PSIwLjA1Ij48Y2lyY2xlIGN4PSIxMCIgY3k9IjEwIiByPSIyIiBmaWxsPSJ3aGl0ZSIvPjxjaXJjbGUgY3g9IjQwIiBjeT0iMjAiIHI9IjEiIGZpbGw9IndoaXRlIi8+PGNpcmNsZSBjeD0iNzAiIGN5PSIxMCIgcj0iMSIgZmlsbD0id2hpdGUiLz48Y2lyY2xlIGN4PSIxMDAiIGN5PSIzMCIgcj0iMiIgZmlsbD0id2hpdGUiLz48Y2lyY2xlIGN4PSIxMzAiIGN5PSIxMCIgcj0iMSIgZmlsbD0id2hpdGUiLz48Y2lyY2xlIGN4PSIxNjAiIGN5PSIyMCIgcj0iMSIgZmlsbD0id2hpdGUiLz48Y2lyY2xlIGN4PSIxOTAiIGN5PSIxMCIgcj0iMiIgZmlsbD0id2hpdGUiLz48Y2lyY2xlIGN4PSIxMCIgY3k9IjQwIiByPSIxIiBmaWxsPSJ3aGl0ZSIvPjxjaXJjbGUgY3g9IjQwIiBjeT0iNTAiIHI9IjIiIGZpbGw9IndoaXRlIi8+PGNpcmNsZSBjeD0iNzAiIGN5PSI0MCIgcj0iMSIgZmlsbD0id2hpdGUiLz48Y2lyY2xlIGN4PSIxMDAiIGN5PSI2MCIgcj0iMSIgZmlsbD0id2hpdGUiLz48Y2lyY2xlIGN4PSIxMzAiIGN5PSI0MCIgcj0iMiIgZmlsbD0id2hpdGUiLz48Y2lyY2xlIGN4PSIxNjAiIGN5PSI1MCIgcj0iMSIgZmlsbD0id2hpdGUiLz48Y2lyY2xlIGN4PSIxOTAiIGN5PSI0MCIgcj0iMSIgZmlsbD0id2hpdGUiLz48Y2lyY2xlIGN4PSIxMCIgY3k9IjcwIiByPSIyIiBmaWxsPSJ3aGl0ZSIvPjxjaXJjbGUgY3g9IjQwIiBjeT0iODAiIHI9IjEiIGZpbGw9IndoaXRlIi8+PGNpcmNsZSBjeD0iNzAiIGN5PSI3MCIgcj0iMSIgZmlsbD0id2hpdGUiLz48Y2lyY2xlIGN4PSIxMDAiIGN5PSI5MCIgcj0iMiIgZmlsbD0id2hpdGUiLz48Y2lyY2xlIGN4PSIxMzAiIGN5PSI3MCIgcj0iMSIgZmlsbD0id2hpdGUiLz48Y2lyY2xlIGN4PSIxNjAiIGN5PSI4MCIgcj0iMSIgZmlsbD0id2hpdGUiLz48Y2lyY2xlIGN4PSIxOTAiIGN5PSI3MCIgcj0iMiIgZmlsbD0id2hpdGUiLz48Y2lyY2xlIGN4PSIxMCIgY3k9IjEwMCIgcj0iMSIgZmlsbD0id2hpdGUiLz48Y2lyY2xlIGN4PSI0MCIgY3k9IjExMCIgcj0iMiIgZmlsbD0id2hpdGUiLz48Y2lyY2xlIGN4PSI3MCIgY3k9IjEwMCIgcj0iMSIgZmlsbD0id2hpdGUiLz48Y2lyY2xlIGN4PSIxMDAiIGN5PSIxMjAiIHI9IjEiIGZpbGw9IndoaXRlIi8+PGNpcmNsZSBjeD0iMTMwIiBjeT0iMTAwIiByPSIyIiBmaWxsPSJ3aGl0ZSIvPjxjaXJjbGUgY3g9IjE2MCIgY3k9IjExMCIgcj0iMSIgZmlsbD0id2hpdGUiLz48Y2lyY2xlIGN4PSIxOTAiIGN5PSIxMDAiIHI9IjEiIGZpbGw9IndoaXRlIi8+PGNpcmNsZSBjeD0iMTAiIGN5PSIxMzAiIHI9IjIiIGZpbGw9IndoaXRlIi8+PGNpcmNsZSBjeD0iNDAiIGN5PSIxNDAiIHI9IjEiIGZpbGw9IndoaXRlIi8+PGNpcmNsZSBjeD0iNzAiIGN5PSIxMzAiIHI9IjEiIGZpbGw9IndoaXRlIi8+PGNpcmNsZSBjeD0iMTAwIiBjeT0iMTUwIiByPSIyIiBmaWxsPSJ3aGl0ZSIvPjxjaXJjbGUgY3g9IjEzMCIgY3k9IjEzMCIgcj0iMSIgZmlsbD0id2hpdGUiLz48Y2lyY2xlIGN4PSIxNjAiIGN5PSIxNDAiIHI9IjEiIGZpbGw9IndoaXRlIi8+PGNpcmNsZSBjeD0iMTkwIiBjeT0iMTMwIiByPSIyIiBmaWxsPSJ3aGl0ZSIvPjxjaXJjbGUgY3g9IjEwIiBjeT0iMTYwIiByPSIxIiBmaWxsPSJ3aGl0ZSIvPjxjaXJjbGUgY3g9IjQwIiBjeT0iMTcwIiByPSIyIiBmaWxsPSJ3aGl0ZSIvPjxjaXJjbGUgY3g9IjcwIiBjeT0iMTYwIiByPSIxIiBmaWxsPSJ3aGl0ZSIvPjxjaXJjbGUgY3g9IjEwMCIgY3k9IjE4MCIgcj0iMSIgZmlsbD0id2hpdGUiLz48Y2lyY2xlIGN4PSIxMzAiIGN5PSIxNjAiIHI9IjIiIGZpbGw9IndoaXRlIi8+PGNpcmNsZSBjeD0iMTYwIiBjeT0iMTcwIiByPSIxIiBmaWxsPSJ3aGl0ZSIvPjxjaXJjbGUgY3g9IjE5MCIgY3k9IjE2MCIgcj0iMSIgZmlsbD0id2hpdGUiLz48Y2lyY2xlIGN4PSIxMCIgY3k9IjE5MCIgcj0iMiIgZmlsbD0id2hpdGUiLz48Y2lyY2xlIGN4PSI0MCIgY3k9IjIwMCIgcj0iMSIgZmlsbD0id2hpdGUiLz48Y2lyY2xlIGN4PSI3MCIgY3k9IjE5MCIgcj0iMSIgZmlsbD0id2hpdGUiLz48Y2lyY2xlIGN4PSIxMDAiIGN5PSIyMDAiIHI9IjIiIGZpbGw9IndoaXRlIi8+PGNpcmNsZSBjeD0iMTMwIiBjeT0iMTkwIiByPSIxIiBmaWxsPSJ3aGl0ZSIvPjxjaXJjbGUgY3g9IjE2MCIgY3k9IjIwMCIgcj0iMSIgZmlsbD0id2hpdGUiLz48Y2lyY2xlIGN4PSIxOTAiIGN5PSIxOTAiIHI9IjIiIGZpbGw9IndoaXRlIi8+PC9nPjwvc3ZnPg==')]
          animate-subtle-rotate opacity-50"></div>
    </div>
  ),
  
  // Energy pulse effect
  energyPulse: (
    <div className="absolute inset-0 pointer-events-none">
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[200%] h-[200%]">
        <div className="absolute inset-0 bg-primary/5 rounded-full animate-pulse-glow"></div>
        <div className="absolute inset-0 bg-secondary/5 rounded-full animate-pulse-glow" style={{ animationDelay: '1s' }}></div>
        <div className="absolute inset-0 bg-accent/5 rounded-full animate-pulse-glow" style={{ animationDelay: '2s' }}></div>
      </div>
    </div>
  ),
  
  // Glowing border effect
  glowingBorder: (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <div className="absolute inset-0 border-2 border-primary/20 rounded-lg"></div>
      <div className="absolute inset-0 border-2 border-primary/10 rounded-lg animate-pulse-glow"></div>
    </div>
  )
};

export default BackgroundPatterns;
