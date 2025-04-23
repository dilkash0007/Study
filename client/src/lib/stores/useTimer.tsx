import { create } from "zustand";
import { persist } from "zustand/middleware";

// Timer states
export enum TimerState {
  READY = 'ready',
  RUNNING = 'running',
  PAUSED = 'paused',
  COMPLETED = 'completed'
}

// Timer modes
export enum TimerMode {
  FOCUS = 'focus',
  BREAK = 'break',
  LONG_BREAK = 'longBreak'
}

interface TimerStore {
  // Timer state
  state: TimerState;
  mode: TimerMode;
  timeRemaining: number; // in seconds
  currentSession: number;
  totalSessions: number;
  
  // Timer settings
  focusDuration: number; // in seconds
  breakDuration: number; // in seconds
  longBreakDuration: number; // in seconds
  sessionsBeforeLongBreak: number;
  
  // Last update timestamp for background processing
  lastUpdateTime: number;
  
  // Actions
  startTimer: () => void;
  pauseTimer: () => void;
  resumeTimer: () => void;
  resetTimer: () => void;
  completeSession: () => void;
  setFocusDuration: (duration: number) => void;
  setBreakDuration: (duration: number) => void;
  setLongBreakDuration: (duration: number) => void;
  setSessions: (sessions: number) => void;
  syncTimerState: () => void; // Will update time based on elapsed time in background
}

const DEFAULT_FOCUS_DURATION = 25 * 60; // 25 minutes
const DEFAULT_BREAK_DURATION = 5 * 60; // 5 minutes
const DEFAULT_LONG_BREAK_DURATION = 15 * 60; // 15 minutes
const DEFAULT_SESSIONS = 4;

export const useTimer = create<TimerStore>()(
  persist(
    (set, get) => ({
      // Initial state
      state: TimerState.READY,
      mode: TimerMode.FOCUS,
      timeRemaining: DEFAULT_FOCUS_DURATION,
      currentSession: 1,
      totalSessions: DEFAULT_SESSIONS,
      focusDuration: DEFAULT_FOCUS_DURATION,
      breakDuration: DEFAULT_BREAK_DURATION,
      longBreakDuration: DEFAULT_LONG_BREAK_DURATION,
      sessionsBeforeLongBreak: DEFAULT_SESSIONS,
      lastUpdateTime: Date.now(),

      // Handle timer synchronization for background operation
      syncTimerState: () => {
        const { 
          state, 
          lastUpdateTime, 
          timeRemaining 
        } = get();
        
        // Only process if timer is running
        if (state === TimerState.RUNNING) {
          const now = Date.now();
          const elapsedTimeInSec = Math.floor((now - lastUpdateTime) / 1000);
          
          // If time has passed since last update
          if (elapsedTimeInSec > 0) {
            const newTimeRemaining = Math.max(0, timeRemaining - elapsedTimeInSec);
            
            // If timer is finished while in background
            if (newTimeRemaining === 0) {
              set({ 
                state: TimerState.COMPLETED,
                timeRemaining: 0
              });
            } else {
              set({ 
                timeRemaining: newTimeRemaining,
                lastUpdateTime: now
              });
            }
          }
        }
      },
      
      // Start the timer
      startTimer: () => {
        const { focusDuration } = get();
        set({ 
          state: TimerState.RUNNING, 
          mode: TimerMode.FOCUS,
          timeRemaining: focusDuration,
          lastUpdateTime: Date.now(),
          currentSession: 1
        });
      },
      
      // Pause the timer
      pauseTimer: () => {
        set({ 
          state: TimerState.PAUSED,
          lastUpdateTime: Date.now() 
        });
      },
      
      // Resume the timer
      resumeTimer: () => {
        set({ 
          state: TimerState.RUNNING,
          lastUpdateTime: Date.now() 
        });
      },
      
      // Reset the timer to the starting state
      resetTimer: () => {
        const { focusDuration } = get();
        set({ 
          state: TimerState.READY, 
          mode: TimerMode.FOCUS,
          timeRemaining: focusDuration,
          currentSession: 1,
          lastUpdateTime: Date.now()
        });
      },
      
      // Complete the current session and move to next phase
      completeSession: () => {
        const { 
          mode, 
          currentSession, 
          totalSessions, 
          focusDuration,
          breakDuration,
          longBreakDuration,
          sessionsBeforeLongBreak
        } = get();
        
        // If we just completed a focus session
        if (mode === TimerMode.FOCUS) {
          // Check if it's time for a long break
          const needsLongBreak = currentSession % sessionsBeforeLongBreak === 0;
          const nextMode = needsLongBreak ? TimerMode.LONG_BREAK : TimerMode.BREAK;
          const nextDuration = needsLongBreak ? longBreakDuration : breakDuration;
          
          set({
            state: TimerState.RUNNING,
            mode: nextMode,
            timeRemaining: nextDuration,
            lastUpdateTime: Date.now()
          });
        } 
        // If we just completed a break (regular or long)
        else {
          // Next session is always a focus session
          const nextSession = currentSession < totalSessions ? currentSession + 1 : 1;
          
          set({
            state: TimerState.RUNNING,
            mode: TimerMode.FOCUS,
            timeRemaining: focusDuration,
            currentSession: nextSession,
            lastUpdateTime: Date.now()
          });
        }
      },
      
      // Settings changes
      setFocusDuration: (duration) => {
        set({ focusDuration: duration });
        
        // If we're in READY state and in FOCUS mode, update the timeRemaining too
        const { state, mode } = get();
        if (state === TimerState.READY && mode === TimerMode.FOCUS) {
          set({ timeRemaining: duration });
        }
      },
      
      setBreakDuration: (duration) => {
        set({ breakDuration: duration });
        
        // If we're in READY state and in BREAK mode, update the timeRemaining too
        const { state, mode } = get();
        if (state === TimerState.READY && mode === TimerMode.BREAK) {
          set({ timeRemaining: duration });
        }
      },
      
      setLongBreakDuration: (duration) => {
        set({ longBreakDuration: duration });
        
        // If we're in READY state and in LONG_BREAK mode, update the timeRemaining too
        const { state, mode } = get();
        if (state === TimerState.READY && mode === TimerMode.LONG_BREAK) {
          set({ timeRemaining: duration });
        }
      },
      
      setSessions: (sessions) => {
        set({ 
          totalSessions: sessions,
          sessionsBeforeLongBreak: sessions
        });
      }
    }),
    {
      name: 'study-timer-storage',
      partialize: (state) => ({
        focusDuration: state.focusDuration,
        breakDuration: state.breakDuration,
        longBreakDuration: state.longBreakDuration,
        totalSessions: state.totalSessions,
        state: state.state,
        mode: state.mode,
        timeRemaining: state.timeRemaining,
        currentSession: state.currentSession,
        lastUpdateTime: state.lastUpdateTime,
      }),
    }
  )
);

// Helper to format seconds to MM:SS
export const formatTime = (totalSeconds: number): string => {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};