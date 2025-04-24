import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GameCard } from "@/components/ui/game-card";
import { GameButton } from "@/components/ui/game-button";
import { GameProgress } from "@/components/ui/game-progress";
import { AnimatedIcon } from "@/components/ui/animated-icon";
import { useQuests } from "@/lib/stores/useQuests";
import { useAudio } from "@/lib/stores/useAudio";
import { useSubjects } from "@/lib/stores/useSubjects";
import { QuestType, QuestDifficulty, Quest } from "@/types";
import { cn } from "@/lib/utils";
import ParticleEffect from "@/components/effects/ParticleEffect";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Plus,
  Edit,
  Trash2,
  Save,
  Book,
  Calendar,
  Trophy,
  Pencil,
  Star,
  AlertCircle,
} from "lucide-react";

// Helper functions to handle quest difficulty
// Get difficulty badge color
const getDifficultyColor = (difficulty: QuestDifficulty) => {
  switch (difficulty) {
    case QuestDifficulty.EASY:
      return "bg-green-500/80";
    case QuestDifficulty.MEDIUM:
      return "bg-blue-500/80";
    case QuestDifficulty.HARD:
      return "bg-purple-500/80";
    case QuestDifficulty.VERY_HARD:
      return "bg-red-500/80";
    default:
      return "bg-gray-500/80";
  }
};

// Get difficulty text
const getDifficultyText = (difficulty: QuestDifficulty) => {
  switch (difficulty) {
    case QuestDifficulty.EASY:
      return "Easy";
    case QuestDifficulty.MEDIUM:
      return "Medium";
    case QuestDifficulty.HARD:
      return "Hard";
    case QuestDifficulty.VERY_HARD:
      return "Very Hard";
    default:
      return "Unknown";
  }
};

/**
 * Quests Page Component
 * Displays daily and epic quests for the player to complete
 */
const QuestsPage = () => {
  const {
    dailyQuests,
    epicQuests,
    completeQuest,
    updateQuestProgress,
    addQuest,
    removeQuest,
    editQuest,
  } = useQuests();
  const { subjects } = useSubjects();
  const { playHit, playSuccess, playClick } = useAudio();
  const [activeTab, setActiveTab] = useState<"daily" | "epic">("daily");
  const [completingQuest, setCompletingQuest] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingQuest, setEditingQuest] = useState<Quest | null>(null);

  // Filter completed and incomplete quests
  const incompleteDailyQuests = dailyQuests.filter((q) => !q.isCompleted);
  const completedDailyQuests = dailyQuests.filter((q) => q.isCompleted);
  const incompleteEpicQuests = epicQuests.filter((q) => !q.isCompleted);
  const completedEpicQuests = epicQuests.filter((q) => q.isCompleted);

  // Handle quest completion
  const handleCompleteQuest = (questId: string) => {
    setCompletingQuest(questId);
    playHit();

    // For visual effect, delay the actual completion
    setTimeout(() => {
      completeQuest(questId);
      playSuccess();

      // Clear completing state after effects
      setTimeout(() => {
        setCompletingQuest(null);
      }, 2000);
    }, 800);
  };

  // Handle quest progress update
  const handleUpdateProgress = (questId: string, progress: number) => {
    playHit();
    updateQuestProgress(questId, progress);
  };

  // Open dialog to add new quest
  const handleAddQuest = () => {
    setEditingQuest(null);
    setDialogOpen(true);
  };

  // Open dialog to edit quest
  const handleEditQuest = (quest: Quest) => {
    setEditingQuest(quest);
    setDialogOpen(true);
  };

  // Handle quest deletion with confirmation
  const handleDeleteQuest = (questId: string) => {
    if (confirm("Are you sure you want to delete this quest?")) {
      removeQuest(questId);
      playHit();
    }
  };

  return (
    <div className="min-h-screen px-4 pt-6 pb-24">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-6 h-6 mr-2 text-accent"
            >
              <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="9" y1="12" x2="15" y2="12"></line>
              <line x1="9" y1="16" x2="15" y2="16"></line>
            </svg>
            Quests
          </h1>
          <p className="text-gray-300 text-sm mt-1">
            Complete quests to earn rewards
          </p>
        </div>

        <GameButton
          variant="accent"
          size="sm"
          onClick={handleAddQuest}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Add Quest
        </GameButton>
      </div>

      {/* Quests Tabs */}
      <div className="flex gap-2 mb-6">
        <GameButton
          variant={activeTab === "daily" ? "default" : "ghost"}
          onClick={() => setActiveTab("daily")}
        >
          Daily Missions
          {incompleteDailyQuests.length > 0 && (
            <span className="ml-2 px-1.5 py-0.5 text-xs bg-primary/30 rounded-full">
              {incompleteDailyQuests.length}
            </span>
          )}
        </GameButton>

        <GameButton
          variant={activeTab === "epic" ? "default" : "ghost"}
          onClick={() => setActiveTab("epic")}
        >
          Epic Quests
          {incompleteEpicQuests.length > 0 && (
            <span className="ml-2 px-1.5 py-0.5 text-xs bg-primary/30 rounded-full">
              {incompleteEpicQuests.length}
            </span>
          )}
        </GameButton>
      </div>

      {/* Active quests */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === "daily" ? (
            <>
              {/* Daily Quests */}
              <h2 className="text-lg font-bold text-white mb-3 flex items-center">
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
                    >
                      <rect
                        x="3"
                        y="4"
                        width="18"
                        height="18"
                        rx="2"
                        ry="2"
                      ></rect>
                      <line x1="16" y1="2" x2="16" y2="6"></line>
                      <line x1="8" y1="2" x2="8" y2="6"></line>
                      <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                  }
                  color="text-accent"
                  size="sm"
                  className="mr-2"
                  animation="pulse"
                />
                Daily Missions
              </h2>

              {incompleteDailyQuests.length === 0 && (
                <GameCard className="mb-6 text-center py-10">
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
                        className="w-12 h-12"
                      >
                        <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
                        <path d="m9 12 2 2 4-4"></path>
                      </svg>
                    }
                    color="text-green-400"
                    size="xl"
                    className="mx-auto mb-3"
                    animation="float"
                  />
                  <h3 className="text-lg font-bold text-white mb-2">
                    All Daily Missions Completed!
                  </h3>
                  <p className="text-gray-300 text-sm">
                    Come back tomorrow for new missions
                  </p>
                </GameCard>
              )}

              {incompleteDailyQuests.map((quest, index) => (
                <QuestCard
                  key={quest.id}
                  quest={quest}
                  index={index}
                  onComplete={handleCompleteQuest}
                  onUpdateProgress={handleUpdateProgress}
                  onEdit={handleEditQuest}
                  onDelete={handleDeleteQuest}
                  isCompleting={completingQuest === quest.id}
                />
              ))}

              {/* Completed Daily Quests */}
              {completedDailyQuests.length > 0 && (
                <>
                  <h3 className="text-md font-medium text-gray-400 mt-6 mb-3">
                    Completed ({completedDailyQuests.length})
                  </h3>

                  {completedDailyQuests.map((quest, index) => (
                    <QuestCard
                      key={quest.id}
                      quest={quest}
                      index={index}
                      onComplete={handleCompleteQuest}
                      onUpdateProgress={handleUpdateProgress}
                      onEdit={handleEditQuest}
                      onDelete={handleDeleteQuest}
                      isComplete={true}
                    />
                  ))}
                </>
              )}
            </>
          ) : (
            <>
              {/* Epic Quests */}
              <h2 className="text-lg font-bold text-white mb-3 flex items-center">
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
                    >
                      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"></path>
                      <path d="M5 3v4"></path>
                      <path d="M19 17v4"></path>
                      <path d="M3 5h4"></path>
                      <path d="M17 19h4"></path>
                    </svg>
                  }
                  color="text-accent"
                  size="sm"
                  className="mr-2"
                  animation="pulse"
                />
                Epic Quests
              </h2>

              {incompleteEpicQuests.length === 0 && (
                <GameCard className="mb-6 text-center py-10">
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
                        className="w-12 h-12"
                      >
                        <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
                        <path d="m9 12 2 2 4-4"></path>
                      </svg>
                    }
                    color="text-green-400"
                    size="xl"
                    className="mx-auto mb-3"
                    animation="float"
                  />
                  <h3 className="text-lg font-bold text-white mb-2">
                    All Epic Quests Completed!
                  </h3>
                  <p className="text-gray-300 text-sm">
                    You've mastered all epic challenges
                  </p>
                </GameCard>
              )}

              {incompleteEpicQuests.map((quest, index) => (
                <QuestCard
                  key={quest.id}
                  quest={quest}
                  index={index}
                  onComplete={handleCompleteQuest}
                  onUpdateProgress={handleUpdateProgress}
                  onEdit={handleEditQuest}
                  onDelete={handleDeleteQuest}
                  isCompleting={completingQuest === quest.id}
                />
              ))}

              {/* Completed Epic Quests */}
              {completedEpicQuests.length > 0 && (
                <>
                  <h3 className="text-md font-medium text-gray-400 mt-6 mb-3">
                    Completed ({completedEpicQuests.length})
                  </h3>

                  {completedEpicQuests.map((quest, index) => (
                    <QuestCard
                      key={quest.id}
                      quest={quest}
                      index={index}
                      onComplete={handleCompleteQuest}
                      onUpdateProgress={handleUpdateProgress}
                      onEdit={handleEditQuest}
                      onDelete={handleDeleteQuest}
                      isComplete={true}
                    />
                  ))}
                </>
              )}
            </>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Quest Add/Edit Dialog */}
      <QuestDialog
        open={dialogOpen}
        setOpen={setDialogOpen}
        editingQuest={editingQuest}
        subjects={subjects}
        onSave={(quest) => {
          if (editingQuest) {
            editQuest(editingQuest.id, quest);
          } else {
            addQuest(quest);
          }
          setDialogOpen(false);
          playSuccess();
        }}
      />
    </div>
  );
};

// QuestCard props updated to add edit/delete functionality
interface QuestCardProps {
  quest: Quest;
  index: number;
  onComplete: (id: string) => void;
  onUpdateProgress: (id: string, progress: number) => void;
  onEdit: (quest: Quest) => void;
  onDelete: (id: string) => void;
  isComplete?: boolean;
  isCompleting?: boolean;
}

const QuestCard: React.FC<QuestCardProps> = ({
  quest,
  index,
  onComplete,
  onUpdateProgress,
  onEdit,
  onDelete,
  isComplete = false,
  isCompleting = false,
}) => {
  const { playClick } = useAudio();
  const { subjects } = useSubjects();
  const [showActions, setShowActions] = useState(false);

  // Get subject info if quest has subjectId
  const questSubject = quest.subjectId
    ? subjects.find((s) => s.id === quest.subjectId)
    : null;

  // Determine progress percentage
  const progressPercent =
    quest.maxProgress > 0
      ? Math.min(100, (quest.progress / quest.maxProgress) * 100)
      : 0;

  // Calculate animate delay based on index (staggered animation)
  const animateDelay = index * 0.1;

  // Handle progress increment button click
  const handleIncrementProgress = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click
    onUpdateProgress(quest.id, quest.progress + 1);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: animateDelay, duration: 0.3 }}
      className="mb-3"
    >
      <GameCard
        className={cn(
          "relative overflow-hidden transition-all duration-300",
          isComplete && "opacity-70 grayscale",
          isCompleting && "animate-pulse",
          showActions && "ring-2 ring-primary"
        )}
        onClick={() => setShowActions(!showActions)}
      >
        <div className="flex items-start gap-3 relative">
          {/* Quest icon with difficulty indicator */}
          <div className="flex-shrink-0">
            <div
              className={cn(
                "w-12 h-12 rounded-lg flex items-center justify-center relative",
                getDifficultyColor(quest.difficulty),
                !isComplete && "animate-pulse-glow"
              )}
            >
              {quest.type === QuestType.DAILY ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  className="w-6 h-6 text-white"
                  strokeWidth="2"
                >
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  className="w-6 h-6 text-white"
                  strokeWidth="2"
                >
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                </svg>
              )}

              <span className="sr-only">
                {getDifficultyText(quest.difficulty)}
              </span>
            </div>
          </div>

          {/* Quest details */}
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-white truncate flex items-center">
              {quest.title}
              {questSubject && (
                <span
                  className="ml-2 text-xs px-2 py-0.5 rounded-full"
                  style={{
                    backgroundColor: `${questSubject.color}33`,
                    color: questSubject.color,
                  }}
                >
                  {questSubject.name}
                </span>
              )}
            </h3>
            <p className="text-gray-300 text-sm mb-2">{quest.description}</p>

            {/* Progress bar for multi-step quests */}
            {quest.maxProgress > 1 && (
              <div className="mb-2">
                <GameProgress
                  value={progressPercent}
                  max={100}
                  className="h-2"
                  label={`${quest.progress}/${quest.maxProgress}`}
                />
              </div>
            )}

            {/* Rewards */}
            <div className="flex gap-2 text-xs">
              <div className="bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  className="w-3 h-3 mr-1"
                >
                  <path
                    d="M13.5 3H12H8C6.34315 3 5 4.34315 5 6V18C5 19.6569 6.34315 21 8 21H11M13.5 3L19 8.625M13.5 3V7.625C13.5 8.17728 13.9477 8.625 14.5 8.625H19M19 8.625V11.8125"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path d="M15.89 10.812H17.657V12.578H15.89V10.812Z" />
                  <path d="M17.657 14.344H19.424V16.11H17.657V14.344Z" />
                  <path d="M14.246 14.344H15.891V16.11H14.246V14.344Z" />
                  <path d="M15.89 17.876H17.657V19.642H15.89V17.876Z" />
                </svg>
                {quest.xpReward} XP
              </div>
              <div className="bg-yellow-500/20 text-yellow-300 px-2 py-0.5 rounded-full flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  className="w-3 h-3 mr-1"
                >
                  <circle cx="12" cy="12" r="9" strokeWidth="2" />
                  <path
                    d="M14.8 9H10.8L10 12L11 11H13L12 14H10"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                {quest.coinReward}
              </div>
              {quest.gemReward > 0 && (
                <div className="bg-green-500/20 text-green-300 px-2 py-0.5 rounded-full flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    className="w-3 h-3 mr-1"
                  >
                    <path
                      d="M6 3L3 8L12 22L21 8L18 3H6Z"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path d="M6 8H21" strokeWidth="2" strokeLinecap="round" />
                    <path d="M12 8V22" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                  {quest.gemReward}
                </div>
              )}
              <div className="bg-gray-600/20 text-gray-300 px-2 py-0.5 rounded-full flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  className="w-3 h-3 mr-1"
                >
                  <path
                    d="M12 8V12L15 15"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <circle cx="12" cy="12" r="9" strokeWidth="2" />
                </svg>
                {getDifficultyText(quest.difficulty)}
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex-shrink-0">
            {!isComplete && quest.maxProgress > 1 && (
              <button
                onClick={handleIncrementProgress}
                className="w-8 h-8 rounded-md flex items-center justify-center bg-primary/20 hover:bg-primary/30 text-white transition-all mb-2"
                title="Increment progress"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  className="w-4 h-4"
                >
                  <polyline points="22 12 18 8 14 12"></polyline>
                  <path d="M18 8v8"></path>
                  <path d="M5 5v14"></path>
                  <path d="M5 19h13"></path>
                </svg>
              </button>
            )}

            {!isComplete && quest.maxProgress === 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onComplete(quest.id);
                }}
                className="w-8 h-8 rounded-md flex items-center justify-center bg-green-500/20 hover:bg-green-500/30 text-white transition-all mb-2"
                title="Complete quest"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  className="w-4 h-4"
                >
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Expanded actions when card is clicked */}
        <AnimatePresence>
          {showActions && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-3 pt-3 border-t border-primary/20 flex justify-end gap-2"
            >
              <GameButton
                variant="secondary"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  playClick();
                  onEdit(quest);
                }}
                leftIcon={<Edit className="w-3 h-3" />}
              >
                Edit
              </GameButton>

              <GameButton
                variant="destructive"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  playClick();
                  onDelete(quest.id);
                }}
                leftIcon={<Trash2 className="w-3 h-3" />}
              >
                Delete
              </GameButton>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Show completion status */}
        {isComplete && (
          <div className="absolute top-0 right-0 m-2">
            <div className="bg-green-500/90 text-white text-xs px-2 py-0.5 rounded-full flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                className="w-3 h-3 mr-1"
              >
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              Completed
            </div>
          </div>
        )}

        {/* Visual effect when completing a quest */}
        {isCompleting && (
          <ParticleEffect
            count={50}
            colors={["#9945FF", "#14F195", "#FFBB38"]}
            duration={1.5}
          />
        )}
      </GameCard>
    </motion.div>
  );
};

// Add this new component at the end of the file
interface QuestDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  editingQuest: Quest | null;
  subjects: any[];
  onSave: (
    quest: Omit<Quest, "id" | "createdAt" | "completedAt" | "isCompleted">
  ) => void;
}

const QuestDialog: React.FC<QuestDialogProps> = ({
  open,
  setOpen,
  editingQuest,
  subjects,
  onSave,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<QuestType>(QuestType.DAILY);
  const [difficulty, setDifficulty] = useState<QuestDifficulty>(
    QuestDifficulty.EASY
  );
  const [xpReward, setXpReward] = useState(25);
  const [coinReward, setCoinReward] = useState(15);
  const [gemReward, setGemReward] = useState(0);
  const [maxProgress, setMaxProgress] = useState(1);
  const [subjectId, setSubjectId] = useState<string | null>(null);

  // Reset form when dialog opens
  useEffect(() => {
    if (open) {
      if (editingQuest) {
        // Populate form with editing quest data
        setTitle(editingQuest.title);
        setDescription(editingQuest.description);
        setType(editingQuest.type);
        setDifficulty(editingQuest.difficulty);
        setXpReward(editingQuest.xpReward);
        setCoinReward(editingQuest.coinReward);
        setGemReward(editingQuest.gemReward);
        setMaxProgress(editingQuest.maxProgress);
        setSubjectId(editingQuest.subjectId);
      } else {
        // Reset for new quest
        setTitle("");
        setDescription("");
        setType(QuestType.DAILY);
        setDifficulty(QuestDifficulty.EASY);
        setXpReward(25);
        setCoinReward(15);
        setGemReward(0);
        setMaxProgress(1);
        setSubjectId(null);
      }
    }
  }, [open, editingQuest]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    if (!title.trim() || !description.trim()) {
      alert("Please fill out all required fields");
      return;
    }

    // Create quest object
    const questData = {
      title,
      description,
      type,
      difficulty,
      xpReward,
      coinReward,
      gemReward,
      progress: 0,
      maxProgress,
      subjectId,
    };

    onSave(questData);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="bg-card border-primary/30 max-w-lg w-[95vw] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl text-white">
            {editingQuest ? "Edit Quest" : "Create New Quest"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {/* Quest Title */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Quest Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-background border border-primary/30 rounded-md p-2 text-white focus:ring-2 focus:ring-primary/50 focus:outline-none"
              placeholder="Study Session"
              required
            />
          </div>

          {/* Quest Description */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Description *
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-background border border-primary/30 rounded-md p-2 text-white focus:ring-2 focus:ring-primary/50 focus:outline-none"
              placeholder="Complete a 25-minute study session"
              rows={2}
              required
            />
          </div>

          {/* Quest Type */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Quest Type
            </label>
            <div className="flex gap-4">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  checked={type === QuestType.DAILY}
                  onChange={() => setType(QuestType.DAILY)}
                  className="accent-primary"
                />
                <span className="text-white flex items-center">
                  <Calendar className="w-4 h-4 mr-1 text-blue-400" />
                  Daily
                </span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  checked={type === QuestType.EPIC}
                  onChange={() => setType(QuestType.EPIC)}
                  className="accent-primary"
                />
                <span className="text-white flex items-center">
                  <Trophy className="w-4 h-4 mr-1 text-yellow-400" />
                  Epic
                </span>
              </label>
            </div>
          </div>

          {/* Subject Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Subject (Optional)
            </label>
            <select
              value={subjectId || ""}
              onChange={(e) => setSubjectId(e.target.value || null)}
              className="w-full bg-background border border-primary/30 rounded-md p-2 text-white focus:ring-2 focus:ring-primary/50 focus:outline-none"
            >
              <option value="">Not Subject-Specific</option>
              {subjects.map((subject) => (
                <option key={subject.id} value={subject.id}>
                  {subject.name}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-400 mt-1">
              Link this quest to a specific subject
            </p>
          </div>

          {/* Difficulty Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Difficulty
            </label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as QuestDifficulty)}
              className="w-full bg-background border border-primary/30 rounded-md p-2 text-white focus:ring-2 focus:ring-primary/50 focus:outline-none"
            >
              <option value={QuestDifficulty.EASY}>Easy</option>
              <option value={QuestDifficulty.MEDIUM}>Medium</option>
              <option value={QuestDifficulty.HARD}>Hard</option>
              <option value={QuestDifficulty.VERY_HARD}>Very Hard</option>
            </select>
          </div>

          {/* Progress Tracking */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Progress Steps
            </label>
            <input
              type="number"
              value={maxProgress}
              onChange={(e) =>
                setMaxProgress(Math.max(1, parseInt(e.target.value) || 1))
              }
              min="1"
              max="100"
              className="w-full bg-background border border-primary/30 rounded-md p-2 text-white focus:ring-2 focus:ring-primary/50 focus:outline-none"
            />
            <p className="text-xs text-gray-400 mt-1">
              Number of steps to complete this quest (1 = one-time completion)
            </p>
          </div>

          {/* Rewards Section */}
          <div className="border border-primary/20 rounded-md p-3 bg-background/50">
            <h3 className="text-white font-medium mb-2 flex items-center">
              <Star className="w-4 h-4 mr-1 text-yellow-400" />
              Rewards
            </h3>

            <div className="grid grid-cols-3 gap-2">
              {/* XP Reward */}
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">
                  XP
                </label>
                <input
                  type="number"
                  value={xpReward}
                  onChange={(e) =>
                    setXpReward(Math.max(0, parseInt(e.target.value) || 0))
                  }
                  min="0"
                  className="w-full bg-background border border-primary/30 rounded-md p-2 text-white focus:ring-2 focus:ring-primary/50 focus:outline-none text-sm"
                />
              </div>

              {/* Coin Reward */}
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">
                  Coins
                </label>
                <input
                  type="number"
                  value={coinReward}
                  onChange={(e) =>
                    setCoinReward(Math.max(0, parseInt(e.target.value) || 0))
                  }
                  min="0"
                  className="w-full bg-background border border-primary/30 rounded-md p-2 text-white focus:ring-2 focus:ring-primary/50 focus:outline-none text-sm"
                />
              </div>

              {/* Gem Reward */}
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">
                  Gems
                </label>
                <input
                  type="number"
                  value={gemReward}
                  onChange={(e) =>
                    setGemReward(Math.max(0, parseInt(e.target.value) || 0))
                  }
                  min="0"
                  className="w-full bg-background border border-primary/30 rounded-md p-2 text-white focus:ring-2 focus:ring-primary/50 focus:outline-none text-sm"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <DialogFooter>
            <DialogClose asChild>
              <GameButton variant="ghost" size="sm">
                Cancel
              </GameButton>
            </DialogClose>
            <GameButton
              type="submit"
              variant="accent"
              size="sm"
              leftIcon={<Save className="w-4 h-4" />}
            >
              {editingQuest ? "Save Changes" : "Create Quest"}
            </GameButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default QuestsPage;
