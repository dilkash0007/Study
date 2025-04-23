import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GameCard } from '@/components/ui/game-card';
import { GameButton } from '@/components/ui/game-button';
import { GameProgress } from '@/components/ui/game-progress';
import { XpBadge } from '@/components/ui/xp-badge';
import { AnimatedIcon } from '@/components/ui/animated-icon';
import { useSubjects } from '@/lib/stores/useSubjects';
import { useAudio } from '@/lib/stores/useAudio';
import { useAchievements } from '@/lib/stores/useAchievements';
import { useQuests } from '@/lib/stores/useQuests';
import { useTimer, TimerState, TimerMode, formatTime } from '@/lib/stores/useTimer';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import ParticleEffect from '@/components/effects/ParticleEffect';

// Timer modes and durations (in minutes)
const TIMER_MODES = {
  FOCUS_SHORT: { label: 'Focus (25m)', duration: 25 },
  FOCUS_MEDIUM: { label: 'Focus (40m)', duration: 40 },
  FOCUS_LONG: { label: 'Focus (50m)', duration: 50 },
  BREAK_SHORT: { label: 'Break (5m)', duration: 5 },
  BREAK_MEDIUM: { label: 'Break (10m)', duration: 10 }
};

// For compatibility with existing code
const SessionState = TimerState;

/**
 * Study Arena Component
 * A Pomodoro-style timer for focused study sessions with gamified elements
 */
const StudyArena = () => {
  // Global state
  const { subjects, activeSubjectId, setActiveSubject, addStudyTime } = useSubjects();
  const { playSuccess } = useAudio();
  const { incrementProgress } = useAchievements();
  const { updateQuestProgress } = useQuests();
  
  // Timer state from global store
  const {
    state: timerState,
    mode: timerMode,
    timeRemaining,
    currentSession,
    focusDuration,
    setFocusDuration,
    startTimer: startGlobalTimer,
    pauseTimer: pauseGlobalTimer,
    resumeTimer: resumeGlobalTimer,
    resetTimer: resetGlobalTimer,
    completeSession,
    syncTimerState
  } = useTimer();
  
  // Local state
  const [selectedMode, setSelectedMode] = useState(TIMER_MODES.FOCUS_SHORT);
  const [showCelebration, setShowCelebration] = useState(false);
  const [completedSessions, setCompletedSessions] = useState(0);
  const intervalRef = useRef<number | null>(null);
  
  // Get active subject
  const activeSubject = subjects.find(s => s.id === activeSubjectId) || subjects[0];
  
  // Map timer states to session states
  const sessionState = 
    timerState === TimerState.READY ? SessionState.READY :
    timerState === TimerState.RUNNING ? SessionState.RUNNING :
    timerState === TimerState.PAUSED ? SessionState.PAUSED :
    SessionState.COMPLETED;
  
  // Calculate progress percentage
  const totalSeconds = timerMode === TimerMode.FOCUS ? focusDuration : 
                       timerMode === TimerMode.BREAK ? 300 : 900;
  const progressPercentage = ((totalSeconds - timeRemaining) / totalSeconds) * 100;
  
  // Override formatTime function with the one from the timer store
  // to avoid conflicts with the local one
  const displayTime = formatTime;
  
  // No longer need to manually sync the timer as it's done at the App level
  
  // Update focusDuration when selectedMode changes
  useEffect(() => {
    if (sessionState === SessionState.READY) {
      setFocusDuration(selectedMode.duration * 60);
    }
  }, [selectedMode, sessionState, setFocusDuration]);
  
  // Handle timer completion
  useEffect(() => {
    if (timerState === TimerState.COMPLETED && !showCelebration) {
      onTimerComplete();
    }
  }, [timerState]);
  
  // Start the timer
  const startTimer = () => {
    if (!activeSubject) {
      toast.error("Please select a subject first");
      return;
    }
    
    startGlobalTimer();
    toast(`${activeSubject.name} study session started!`, {
      description: `Focus for ${selectedMode.duration} minutes`,
      icon: '🔥'
    });
  };
  
  // Pause the timer
  const pauseTimer = () => {
    pauseGlobalTimer();
  };
  
  // Resume the timer
  const resumeTimer = () => {
    resumeGlobalTimer();
  };
  
  // Reset the timer
  const resetTimer = () => {
    resetGlobalTimer();
  };
  
  // Complete the timer and award XP
  const onTimerComplete = () => {
    playSuccess();
    setShowCelebration(true);
    
    // Add study time to active subject - only if this was a focus session
    if (activeSubject && timerMode === TimerMode.FOCUS) {
      addStudyTime(activeSubject.id, selectedMode.duration);
      
      // Update quest progress for study sessions
      updateQuestProgress('daily-1', 1); // Update daily study session quest
      
      // Update achievement progress
      incrementProgress('study_sessions', 1);
      
      // Increment completed sessions counter
      setCompletedSessions(prev => prev + 1);
    }
    
    // Move to next session after a delay
    setTimeout(() => {
      setShowCelebration(false);
      completeSession(); // This will automatically move to break or next focus
    }, 3000);
  };
  
  // Get battle health percentage based on timer progress
  const getBattleHealth = () => {
    return Math.min(100, Math.max(0, progressPercentage));
  };
  
  // The enemy health decreases as study time progresses
  const getEnemyHealth = () => {
    return Math.max(0, 100 - progressPercentage);
  };
  
  // Dynamic colors based on session state
  const getProgressVariant = () => {
    if (sessionState === SessionState.COMPLETED) return 'success';
    if (sessionState === SessionState.PAUSED) return 'accent';
    return 'default';
  };

  return (
    <div className="min-h-screen px-4 pt-6 pb-24 relative">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 mr-2 text-primary">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
          Study Arena
        </h1>
        <p className="text-gray-300 text-sm mt-1">Fight distractions with focused study time</p>
      </div>
      
      {/* Subject Selector */}
      <GameCard className="mb-6">
        <h2 className="font-bold text-white mb-3">Select Subject</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {subjects.map((subject) => (
            <button
              key={subject.id}
              className={cn(
                "text-white text-sm p-2 rounded-md transition-all duration-200 border",
                subject.id === activeSubjectId 
                  ? "border-primary bg-primary/20 shadow-[0_0_10px_rgba(153,69,255,0.4)]" 
                  : "border-transparent hover:bg-white/5"
              )}
              onClick={() => setActiveSubject(subject.id)}
            >
              <div 
                className="w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-1"
                style={{ backgroundColor: subject.color + '33', color: subject.color }}
              >
                {/* Render subject icon (simplified for this example) */}
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                  <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                  <path d="M2 17l10 5 10-5"></path>
                  <path d="M2 12l10 5 10-5"></path>
                </svg>
              </div>
              <div className="truncate">{subject.name}</div>
              <XpBadge level={subject.level} size="sm" className="mx-auto mt-1" />
            </button>
          ))}
        </div>
      </GameCard>
      
      {/* Battle Arena */}
      <GameCard 
        className="mb-6 p-0 overflow-hidden" 
        variant={sessionState === TimerState.COMPLETED ? "secondary" : "default"}
      >
        <div className="bg-gradient-to-b from-transparent to-black/50 p-5">
          {/* Battle graphics */}
          <div className="relative h-40 mb-4">
            {/* Player character */}
            <motion.div 
              className="absolute bottom-0 left-0 w-20 h-24"
              animate={sessionState === TimerState.RUNNING ? {
                y: [0, -5, 0],
                transition: { duration: 2, repeat: Infinity }
              } : {}}
            >
              <div className="w-16 h-16 bg-primary rounded-full opacity-90 flex items-center justify-center relative overflow-hidden">
                <div className="w-full h-full absolute top-0 left-0 bg-gradient-to-b from-white/30 to-transparent"></div>
                <AnimatedIcon
                  icon={
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
                      <circle cx="12" cy="8" r="5"></circle>
                      <path d="M20 21v-2a7 7 0 0 0-14 0v2"></path>
                    </svg>
                  }
                  animation={sessionState === TimerState.RUNNING ? "pulse" : "none"}
                  color="text-white"
                  size="lg"
                />
                
                {/* Energy effect when studying */}
                {sessionState === TimerState.RUNNING && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-full h-full absolute animate-pulse-glow opacity-60 bg-primary rounded-full"></div>
                    <div className="w-24 h-24 absolute animate-subtle-rotate opacity-30">
                      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                        <path d="M50,0 L60,35 L95,40 L65,60 L75,95 L50,75 L25,95 L35,60 L5,40 L40,35 Z" fill="white"/>
                      </svg>
                    </div>
                  </div>
                )}
              </div>
              <div className="mt-2 px-2 py-1 bg-black/50 rounded-md text-center text-xs">
                Focus
              </div>
            </motion.div>
            
            {/* Enemy (distraction) */}
            <motion.div 
              className="absolute bottom-0 right-0 w-20 h-24"
              initial={{ x: 50 }}
              animate={sessionState === SessionState.RUNNING ? {
                x: [0, 5, 0],
                y: [0, -3, 0],
                rotate: [0, 1, 0, -1, 0],
                transition: { duration: 3, repeat: Infinity }
              } : { x: 0 }}
            >
              <div className="w-16 h-16 bg-red-500 rounded-full opacity-80 flex items-center justify-center relative overflow-hidden">
                <div className="w-full h-full absolute top-0 left-0 bg-gradient-to-b from-white/30 to-transparent"></div>
                <AnimatedIcon
                  icon={
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
                      <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"></path>
                      <path d="M9 18h6"></path>
                      <path d="M10 22h4"></path>
                    </svg>
                  }
                  animation={sessionState === SessionState.RUNNING ? "shake" : "none"}
                  color="text-white"
                  size="lg"
                />
              </div>
              <div className="mt-2 px-2 py-1 bg-black/50 rounded-md text-center text-xs">
                Distraction
              </div>
            </motion.div>
            
            {/* Battle effects */}
            {sessionState === SessionState.RUNNING && (
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div 
                  className="w-12 h-12 text-yellow-500"
                  animate={{
                    x: [0, 50],
                    y: [0, -10, 0],
                    opacity: [1, 0],
                    scale: [1, 0.5]
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    repeatType: "loop"
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                  </svg>
                </motion.div>
              </div>
            )}
            
            {/* Completion celebration */}
            <AnimatePresence>
              {showCelebration && (
                <motion.div 
                  className="absolute inset-0"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <ParticleEffect 
                    type="confetti"
                    trigger={showCelebration}
                    count={40}
                    originX={50}
                    originY={50}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          {/* Health bars */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-blue-300">Your Focus</span>
                <span>{Math.round(getBattleHealth())}%</span>
              </div>
              <GameProgress 
                value={getBattleHealth()} 
                variant="secondary" 
                size="md" 
              />
            </div>
            
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-red-300">Distraction</span>
                <span>{Math.round(getEnemyHealth())}%</span>
              </div>
              <GameProgress 
                value={getEnemyHealth()} 
                variant="destructive" 
                size="md" 
              />
            </div>
          </div>
          
          {/* Timer */}
          <div className="text-center mb-3">
            <div className={cn(
              "font-mono text-4xl font-bold transition-colors duration-500",
              sessionState === TimerState.RUNNING ? "text-primary" : 
              sessionState === TimerState.PAUSED ? "text-yellow-400" :
              sessionState === TimerState.COMPLETED ? "text-green-400" : "text-white"
            )}>
              {displayTime(timeRemaining)}
            </div>
            <div className="text-sm text-gray-300 mb-3">
              {sessionState === TimerState.RUNNING ? "Fighting Distraction..." : 
               sessionState === TimerState.PAUSED ? "Battle Paused" :
               sessionState === TimerState.COMPLETED ? "Victory! Distraction Defeated!" : "Ready to Battle"}
            </div>
            
            {/* Overall session progress */}
            <GameProgress 
              value={progressPercentage} 
              variant={getProgressVariant()} 
              size="sm" 
              className="max-w-xs mx-auto"
            />
          </div>
          
          {/* Timer controls */}
          <div className="flex flex-wrap justify-center gap-2">
            {sessionState === TimerState.READY && (
              <GameButton onClick={startTimer} isSuccess={true}>
                Start Session
              </GameButton>
            )}
            
            {sessionState === TimerState.RUNNING && (
              <>
                <GameButton variant="accent" onClick={pauseTimer}>
                  Pause
                </GameButton>
                <GameButton variant="destructive" onClick={resetTimer}>
                  Cancel
                </GameButton>
              </>
            )}
            
            {sessionState === TimerState.PAUSED && (
              <>
                <GameButton onClick={resumeTimer}>
                  Resume
                </GameButton>
                <GameButton variant="destructive" onClick={resetTimer}>
                  Cancel
                </GameButton>
              </>
            )}
            
            {sessionState === TimerState.COMPLETED && (
              <>
                <GameButton onClick={resetTimer} isSuccess={true}>
                  New Session
                </GameButton>
              </>
            )}
          </div>
        </div>
      </GameCard>
      
      {/* Timer Mode Selector */}
      <GameCard className="mb-6">
        <h2 className="font-bold text-white mb-3">Session Type</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {Object.entries(TIMER_MODES).map(([key, mode]) => (
            <button
              key={key}
              className={cn(
                "text-white text-sm p-2 rounded-md transition-all duration-200 border",
                selectedMode.label === mode.label
                  ? "border-primary bg-primary/20 shadow-[0_0_10px_rgba(153,69,255,0.4)]" 
                  : "border-transparent hover:bg-white/5"
              )}
              onClick={() => {
                if (sessionState === TimerState.READY) {
                  setSelectedMode(mode);
                } else {
                  toast.info("Finish or cancel current session first");
                }
              }}
              disabled={sessionState !== TimerState.READY}
            >
              {mode.label}
            </button>
          ))}
        </div>
      </GameCard>
      
      {/* Stats */}
      <GameCard>
        <h2 className="font-bold text-white mb-3">Session Stats</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-black/30 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-blue-400">{completedSessions}</div>
            <div className="text-xs text-gray-300">Completed Sessions</div>
          </div>
          
          <div className="bg-black/30 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-green-400">
              {Math.floor(completedSessions * selectedMode.duration)}
            </div>
            <div className="text-xs text-gray-300">Minutes Studied</div>
          </div>
        </div>
      </GameCard>
    </div>
  );
};

export default StudyArena;
