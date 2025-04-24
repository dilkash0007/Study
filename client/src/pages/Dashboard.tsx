import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { GameCard } from "@/components/ui/game-card";
import { GameButton } from "@/components/ui/game-button";
import { GameProgress } from "@/components/ui/game-progress";
import { XpBadge } from "@/components/ui/xp-badge";
import { AnimatedIcon } from "@/components/ui/animated-icon";
import { useUser } from "@/lib/stores/useUser";
import { useSubjects } from "@/lib/stores/useSubjects";
import { useQuests } from "@/lib/stores/useQuests";
import { useTimer } from "@/lib/stores/useTimer";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { xpForNextLevel } from "@/lib/stores/useUser";
import { toast } from "sonner";

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
  const incompleteDailyQuests = dailyQuests.filter(
    (quest) => !quest.isCompleted
  ).length;

  // XP required for next level
  const nextLevelXP = xpForNextLevel(level);
  const xpProgress =
    ((xp - xpForNextLevel(level - 1)) /
      (nextLevelXP - xpForNextLevel(level - 1))) *
    100;

  return (
    <div
      ref={homeRef}
      className="min-h-screen bg-gradient-to-b from-gray-900 to-black px-4 pt-6 pb-24"
    >
      {/* Hero Section */}
      <div className="relative mb-8 rounded-2xl overflow-hidden bg-gradient-to-br from-primary/30 via-secondary/20 to-accent/30 p-6 border border-white/10">
        {/* Animated background elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-accent/20 rounded-full blur-2xl -mr-8 -mt-8 z-0 animate-pulse-glow"></div>
        <div
          className="absolute bottom-0 left-0 w-24 h-24 bg-primary/30 rounded-full blur-xl -ml-6 -mb-6 z-0 animate-pulse-glow"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/3 w-16 h-16 bg-secondary/20 rounded-full blur-lg z-0 animate-pulse-glow"
          style={{ animationDelay: "2s" }}
        ></div>

        {/* Decorative gaming elements */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-secondary to-accent opacity-80"></div>
        <div className="absolute top-1 right-0 w-1 h-12 bg-accent opacity-80"></div>
        <div className="absolute bottom-0 right-0 w-full h-1 bg-gradient-to-l from-primary via-secondary to-accent opacity-80"></div>
        <div className="absolute bottom-1 left-0 w-1 h-12 bg-primary opacity-80"></div>

        <div className="relative z-10 flex justify-between">
          <div className="flex items-center">
            <div className="mr-4 relative">
              <XpBadge level={level} size="lg" className="animate-float" />
              <div className="absolute inset-0 rounded-full bg-white/5 animate-pulse-glow"></div>
            </div>

            <div>
              <h1 className="text-2xl font-bold text-white pixel-text game-glow mb-1">
                WELCOME BACK!
              </h1>
              <div className="flex items-center space-x-3 text-xs">
                <div className="bg-black/30 rounded-full px-3 py-1.5 backdrop-blur-sm border border-white/10">
                  <span className="text-blue-300 font-semibold">
                    LEVEL {level}
                  </span>
                </div>
                <div className="bg-black/30 rounded-full px-3 py-1.5 backdrop-blur-sm border border-white/10">
                  <span className="text-blue-300 font-semibold">{xp} XP</span>
                </div>
              </div>
            </div>
          </div>

          {/* Stats display with gaming style */}
          <div className="flex items-center space-x-3 self-start">
            {/* Coins display */}
            <div className="flex items-center bg-black/40 backdrop-blur-sm rounded-lg px-3 py-2 border border-yellow-500/30">
              <AnimatedIcon
                icon={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-4 h-4"
                  >
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
              <span className="ml-2 text-sm font-bold text-yellow-100">
                {coins}
              </span>
            </div>

            {/* Gems display */}
            <div className="flex items-center bg-black/40 backdrop-blur-sm rounded-lg px-3 py-2 border border-emerald-500/30">
              <AnimatedIcon
                icon={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-4 h-4"
                  >
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                  </svg>
                }
                color="text-emerald-400"
                size="sm"
                animation="pulse"
              />
              <span className="ml-2 text-sm font-bold text-emerald-100">
                {gems}
              </span>
            </div>
          </div>
        </div>

        {/* XP Progress bar with gaming style */}
        <div className="relative z-10 mt-6">
          <div className="flex justify-between text-xs mb-2 font-semibold">
            <span className="text-white/90 uppercase tracking-wide">
              XP Progress
            </span>
            <span className="text-blue-300">
              {xp} / {nextLevelXP}
            </span>
          </div>
          <div className="h-4 bg-black/50 rounded-full overflow-hidden border border-white/20 p-0.5">
            <div
              className="h-full rounded-full bg-gradient-to-r from-primary via-secondary to-accent progress-bar"
              style={{ width: `${xpProgress}%` }}
            ></div>
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-[10px] text-white/50">CURRENT LEVEL</span>
            <span className="text-[10px] text-white/50">NEXT LEVEL</span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3 mb-8">
        <GameButton
          variant="default"
          size="lg"
          onClick={() => navigate("/study-arena")}
          className="bg-gradient-to-br from-primary to-primary/70 hover:from-primary hover:to-primary border-2 border-primary/50 py-6 game-button relative overflow-hidden group"
          leftIcon={
            <div className="relative">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-6 h-6 relative z-10"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
              <div className="absolute inset-0 bg-white/30 rounded-full blur-md animate-pulse-glow opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
          }
        >
          <div className="flex flex-col">
            <span className="text-lg font-bold pixel-text">STUDY NOW</span>
            <span className="text-xs opacity-80">Start earning XP</span>
          </div>
        </GameButton>

        <GameButton
          variant="accent"
          size="lg"
          onClick={() => navigate("/quests")}
          className="bg-gradient-to-br from-accent to-accent/70 hover:from-accent hover:to-accent border-2 border-accent/50 py-6 game-button relative overflow-hidden group"
          leftIcon={
            <div className="relative">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-6 h-6 relative z-10"
              >
                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="9" y1="12" x2="15" y2="12"></line>
                <line x1="9" y1="16" x2="15" y2="16"></line>
              </svg>
              <div className="absolute inset-0 bg-white/30 rounded-full blur-md animate-pulse-glow opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
          }
        >
          <div className="flex flex-col relative">
            <span className="text-lg font-bold pixel-text">QUESTS</span>
            <span className="text-xs opacity-80">Complete challenges</span>
            {incompleteDailyQuests > 0 && (
              <div className="absolute -top-1 -right-6 w-5 h-5 rounded-full bg-red-500 flex items-center justify-center animate-bounce-slight">
                <span className="text-xs font-bold">
                  {incompleteDailyQuests}
                </span>
              </div>
            )}
          </div>
        </GameButton>
      </div>

      {/* Active Study Session */}
      <ActiveStudySession />

      {/* Section Heading with Pill Background */}
      <div className="relative mb-5 mt-8">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/30 to-transparent rounded-full blur-sm"></div>
        <div className="relative flex justify-between items-center">
          <h2 className="text-lg font-bold text-white flex items-center pl-6 py-1 pixel-text game-glow">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-5 h-5 mr-2 text-secondary animate-pulse-glow"
            >
              <path d="M3 19a9 9 0 0 1 9 0 9 9 0 0 1 9 0"></path>
              <path d="M3 6a9 9 0 0 1 9 0 9 9 0 0 1 9 0"></path>
              <path d="M3 6v13"></path>
              <path d="M12 6v13"></path>
              <path d="M21 6v13"></path>
            </svg>
            YOUR SUBJECTS
            <div className="ml-2 flex space-x-0.5">
              <div className="w-1 h-1 bg-white"></div>
              <div className="w-1 h-1 bg-white"></div>
              <div className="w-1 h-1 bg-white"></div>
            </div>
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
                  description: "My new subject",
                  color: "#2196F3",
                  icon: "book",
                });
                toast.success(`Added new subject: ${defaultName}`);
              }}
              className="rounded-full border border-secondary/50 shadow-[0_0_10px_rgba(var(--secondary-rgb),0.3)]"
              leftIcon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-4 h-4"
                >
                  <path d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0z"></path>
                </svg>
              }
            >
              ADD
            </GameButton>

            <GameButton
              variant="ghost"
              size="sm"
              onClick={() => navigate("/subject-settings")}
              className="rounded-full border border-white/10"
              leftIcon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-4 h-4"
                >
                  <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
              }
            >
              EDIT
            </GameButton>
          </div>
        </div>
      </div>

      {/* Bottom pixel border */}
      <div className="absolute bottom-0 left-12 right-12 h-0.5 flex justify-between">
        {[...Array(16)].map((_, i) => (
          <div key={i} className="w-2 h-0.5 bg-secondary/60"></div>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {subjects.map((subject, index) => (
          <motion.div
            key={subject.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            <GameCard
              className="h-full border-2 border-gray-800/80 bg-gradient-to-br from-gray-800/60 to-gray-900/80 backdrop-blur-sm relative overflow-hidden group"
              animate="float"
              shimmer
              onClick={() => {
                setActiveSubject(subject.id);
                navigate("/study-arena");
              }}
            >
              {/* Decorative corner elements */}
              <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-primary/60"></div>
              <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-primary/60"></div>
              <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-primary/60"></div>
              <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-primary/60"></div>

              {/* Glow effect for hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#2f80ed]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

              <div className="flex justify-between items-start mb-3 relative z-10">
                <div className="flex items-center">
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center mr-3 shadow-lg transform rotate-3"
                    style={{
                      backgroundColor: `${subject.color}30`,
                      borderColor: subject.color,
                      borderWidth: "2px",
                      color: subject.color,
                      boxShadow: `0 0 15px ${subject.color}40`,
                    }}
                  >
                    {renderSubjectIcon(subject.icon)}
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-lg pixel-text">
                      {subject.name}
                    </h3>
                    <p className="text-xs text-gray-300">
                      {subject.description}
                    </p>
                  </div>
                </div>
                <div className="relative">
                  <XpBadge level={subject.level} size="sm" />
                  <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-white animate-pulse-glow opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
              </div>

              {/* Subject Stats */}
              <div className="mt-4 relative z-10">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-300 font-semibold uppercase tracking-wider">
                    XP
                  </span>
                  <span className="text-blue-300 font-mono">
                    {subject.xp} /{" "}
                    {subject.level * subject.level * subject.level * 5}
                  </span>
                </div>
                <div className="h-3 bg-black/50 rounded-full overflow-hidden border border-white/10 relative">
                  <div
                    className="h-full bg-gradient-to-r from-blue-600 to-blue-400 absolute top-0 left-0 progress-bar"
                    style={{
                      width: `${
                        (subject.xp /
                          (subject.level * subject.level * subject.level * 5)) *
                        100
                      }%`,
                    }}
                  ></div>
                </div>
              </div>

              {/* Last studied indicator */}
              {subject.lastStudied && (
                <div className="mt-3 text-xs text-gray-400 flex items-center relative z-10">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-3 h-3 mr-1 text-gray-500"
                  >
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                  <span>
                    Last studied:{" "}
                    {new Date(subject.lastStudied).toLocaleDateString()}
                  </span>
                </div>
              )}

              {/* Study Now label */}
              <div className="absolute bottom-2 right-2 text-[10px] text-white/60 bg-white/5 px-2 py-0.5 rounded uppercase tracking-wider font-bold border border-white/10">
                Study
              </div>
            </GameCard>
          </motion.div>
        ))}
      </div>

      {/* Quick Access Sections */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8">
        {/* Daily Quests Section */}
        <div>
          <div className="relative mb-3">
            <div className="absolute inset-0 bg-gradient-to-r from-accent/10 to-transparent rounded-full blur-sm"></div>
            <div className="relative flex justify-between items-center">
              <h2 className="text-lg font-bold text-white flex items-center pl-4 py-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-5 h-5 mr-2 text-accent"
                >
                  <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                </svg>
                Daily Quests
              </h2>

              <GameButton
                variant="ghost"
                size="sm"
                onClick={() => navigate("/quests")}
                className="rounded-full"
              >
                View All
              </GameButton>
            </div>
          </div>

          <GameCard className="border border-gray-800 bg-gradient-to-br from-gray-800/40 to-gray-900/60 backdrop-blur-sm">
            {dailyQuests.length > 0 ? (
              <div className="space-y-3">
                {dailyQuests.slice(0, 3).map((quest, index) => (
                  <div
                    key={quest.id}
                    className={cn(
                      "flex items-center p-2 rounded-lg transition-colors",
                      quest.isCompleted
                        ? "bg-green-900/20 border border-green-800/40"
                        : "bg-gray-800/30 border border-gray-700/30 hover:bg-gray-800/50"
                    )}
                  >
                    <div className="mr-3">
                      {quest.isCompleted ? (
                        <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center text-green-500">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="w-5 h-5"
                          >
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                        </div>
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="w-5 h-5"
                          >
                            <circle cx="12" cy="12" r="10"></circle>
                            <polyline points="12 6 12 12 16 14"></polyline>
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-sm text-white">
                        {quest.title}
                      </div>
                      <div className="text-xs text-gray-400">
                        {quest.description}
                      </div>
                    </div>
                    <div className="flex items-center text-xs font-bold text-amber-400">
                      +{quest.reward?.xp || quest.xpReward || 0} XP
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-gray-400">
                No daily quests available. Check back later!
              </div>
            )}
          </GameCard>
        </div>

        {/* Your Rank Section */}
        <div>
          <div className="relative mb-3">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent rounded-full blur-sm"></div>
            <div className="relative flex justify-between items-center">
              <h2 className="text-lg font-bold text-white flex items-center pl-4 py-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-5 h-5 mr-2 text-primary"
                >
                  <path d="M18 20V10"></path>
                  <path d="M12 20V4"></path>
                  <path d="M6 20V14"></path>
                </svg>
                Your Rank
              </h2>

              <GameButton
                variant="ghost"
                size="sm"
                onClick={() => navigate("/leaderboard")}
                className="rounded-full"
              >
                View All
              </GameButton>
            </div>
          </div>

          <GameCard className="p-4 border border-gray-800 bg-gradient-to-br from-gray-800/40 to-gray-900/60 backdrop-blur-sm">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="w-14 h-14 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center text-white font-bold text-xl mr-4 shadow-xl">
                  #12
                </div>
                <div>
                  <div className="text-white font-medium">
                    Your Weekly Position
                  </div>
                  <div className="text-xs text-gray-400">
                    Top 15% of all users
                  </div>
                </div>
              </div>
              <div className="text-lg font-bold text-amber-400 flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  stroke="none"
                  className="w-5 h-5 mr-1"
                >
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                </svg>
                3,254
              </div>
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
  const { state, mode, timeRemaining, pauseTimer, resumeTimer } = useTimer();
  const isActive = state === "running" || state === "paused";

  if (!isActive) return null;

  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;
  const formattedTime = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  const sessionType = mode;

  return (
    <div className="mt-6">
      <h2 className="text-lg font-bold text-white flex items-center mb-3">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-5 h-5 mr-2 text-green-500"
        >
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
              <div className="text-white font-semibold">
                {sessionType === "focus" ? "Focus Time" : "Break Time"}
              </div>
              <div className="text-xs text-gray-400 mt-1">
                Session in progress
              </div>
            </div>

            <div className="flex items-center">
              <span className="mr-3 text-2xl font-bold text-white">
                {formattedTime}
              </span>

              {/* Pause/Resume Button */}
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() =>
                  isActive && timeRemaining > 0 ? pauseTimer() : resumeTimer()
                }
                className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center"
              >
                {timeRemaining > 0 && isActive ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="6" y="4" width="4" height="16"></rect>
                    <rect x="14" y="4" width="4" height="16"></rect>
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polygon points="5 3 19 12 5 21 5 3"></polygon>
                  </svg>
                )}
              </motion.button>
            </div>
          </div>

          <div className="mt-3">
            <GameButton
              variant="ghost"
              size="sm"
              className="w-full"
              onClick={() => navigate("/study-arena")}
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
    case "calculator":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-5 h-5"
        >
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
    case "flask":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-5 h-5"
        >
          <path d="M9 3h6v2l-1 1v2l4 3h-5"></path>
          <path d="M8 8H7C4.79 8 3 9.79 3 12v0c0 2.21 1.79 4 4 4h10c2.21 0 4-1.79 4-4v0c0-2.21-1.79-4-4-4h-1"></path>
          <path d="M7 16l1.5 2"></path>
          <path d="M16.5 18 18 16"></path>
          <path d="M12 12v-1"></path>
        </svg>
      );
    case "book":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-5 h-5"
        >
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
        </svg>
      );
    case "clock":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-5 h-5"
        >
          <circle cx="12" cy="12" r="10"></circle>
          <polyline points="12 6 12 12 16 14"></polyline>
        </svg>
      );
    default:
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-5 h-5"
        >
          <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48"></path>
        </svg>
      );
  }
};

export default Dashboard;
