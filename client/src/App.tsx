import { HashRouter as Router, Route, Routes } from "react-router-dom";
import { useState, useEffect, createContext } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { useAudio } from "./lib/stores/useAudio";
import { useTimer } from "./lib/stores/useTimer";
import { useWebSocket } from "./lib/websocket";
import GameLayout from "./components/layout/GameLayout";
import Dashboard from "./pages/Dashboard";
import StudyArena from "./pages/StudyArena";
import QuestsPage from "./pages/QuestsPage";
import LeaderboardPage from "./pages/LeaderboardPage";
import AchievementsPage from "./pages/AchievementsPage";
import ProfilePage from "./pages/ProfilePage";
import SocialPage from "./pages/SocialPage";
import SubjectSettings from "./pages/SubjectSettings";
import CalendarPage from "./pages/calendar";
import NotFound from "./pages/not-found";
import SoundManager from "./components/audio/SoundManager";
import { Toaster } from "sonner";

// Create WebSocket context
export const WebSocketContext = createContext<{
  isConnected: boolean;
  lastMessage: any;
  sendMessage: (data: any) => void;
}>({
  isConnected: false,
  lastMessage: null,
  sendMessage: () => {},
});

// Main App component
function App() {
  const [isLoading, setIsLoading] = useState(true);
  const { setBackgroundMusic, setHitSound, setSuccessSound } = useAudio();
  const { syncTimerState } = useTimer();

  // Create a token for WebSocket authentication
  // In a real app, you'd use a proper auth token from your auth system
  const [wsToken, setWsToken] = useState("user123");
  const wsConnection = useWebSocket(wsToken);

  // Preload all audio resources
  useEffect(() => {
    // Create audio elements
    const backgroundMusic = new Audio("/sounds/background.mp3");
    backgroundMusic.loop = true;
    backgroundMusic.volume = 0.3;

    const hitSound = new Audio("/sounds/hit.mp3");
    hitSound.volume = 0.5;

    const successSound = new Audio("/sounds/success.mp3");
    successSound.volume = 0.5;

    // Store audio elements in the global state
    setBackgroundMusic(backgroundMusic);
    setHitSound(hitSound);
    setSuccessSound(successSound);

    // Simulate loading time for more appealing intro
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, [setBackgroundMusic, setHitSound, setSuccessSound]);

  // Set up the global timer background sync
  useEffect(() => {
    // Initial sync when app mounts
    syncTimerState();

    // Set up regular sync for background processing (every second)
    const syncInterval = setInterval(() => {
      syncTimerState();
    }, 1000);

    // Set up visibility change listener for when the app is minimized/restored
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        syncTimerState();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      clearInterval(syncInterval);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [syncTimerState]);

  // Loading screen
  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#1a0b2e] text-white">
        <div className="w-24 h-24 mb-8 border-4 border-t-4 border-t-[#9945FF] border-l-[#9945FF] border-r-[#14F195] border-b-[#14F195] rounded-full animate-spin"></div>
        <h1 className="text-3xl font-bold mb-2 animate-pulse">EduQuest</h1>
        <p className="text-blue-300">Loading your adventure...</p>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <WebSocketContext.Provider value={wsConnection}>
        <Router>
          <SoundManager />
          <Toaster position="top-center" richColors closeButton />
          <Routes>
            <Route path="/" element={<GameLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="study-arena" element={<StudyArena />} />
              <Route path="quests" element={<QuestsPage />} />
              <Route path="calendar" element={<CalendarPage />} />
              <Route path="social" element={<SocialPage />} />
              <Route path="leaderboard" element={<LeaderboardPage />} />
              <Route path="achievements" element={<AchievementsPage />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="subject-settings" element={<SubjectSettings />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </Router>
      </WebSocketContext.Provider>
    </QueryClientProvider>
  );
}

export default App;
