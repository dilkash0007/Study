import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Subject } from '@/types';
import { toast } from 'sonner';
import { useUser } from './useUser';

// Default subjects
const defaultSubjects: Subject[] = [
  {
    id: 'math',
    name: 'Mathematics',
    description: 'Numbers, algebra, geometry and more',
    color: '#FF5757', // Red
    icon: 'calculator',
    level: 1,
    xp: 0,
    totalStudyTime: 0,
    lastStudied: null,
    notes: []
  },
  {
    id: 'science',
    name: 'Science',
    description: 'Physics, chemistry, biology and more',
    color: '#4CAF50', // Green
    icon: 'flask',
    level: 1,
    xp: 0,
    totalStudyTime: 0,
    lastStudied: null,
    notes: []
  },
  {
    id: 'language',
    name: 'Language Arts',
    description: 'Reading, writing, grammar and more',
    color: '#2196F3', // Blue
    icon: 'book',
    level: 1,
    xp: 0,
    totalStudyTime: 0,
    lastStudied: null,
    notes: []
  },
  {
    id: 'history',
    name: 'History',
    description: 'Past events, civilizations and more',
    color: '#FF9800', // Orange
    icon: 'clock',
    level: 1,
    xp: 0,
    totalStudyTime: 0,
    lastStudied: null,
    notes: []
  }
];

interface SubjectsState {
  subjects: Subject[];
  activeSubjectId: string | null;
  
  // Methods
  addSubject: (subject: Omit<Subject, 'id' | 'level' | 'xp' | 'totalStudyTime' | 'lastStudied' | 'notes'>) => void;
  removeSubject: (subjectId: string) => void;
  setActiveSubject: (subjectId: string | null) => void;
  addStudyTime: (subjectId: string, minutes: number) => void;
  addNote: (subjectId: string, note: string) => void;
  removeNote: (subjectId: string, index: number) => void;
}

// Calculate level based on subject XP (different curve than user level)
const calculateSubjectLevel = (xp: number): number => {
  return Math.floor(Math.cbrt(xp / 5)) + 1;
};

// XP required for next level
export const xpForNextSubjectLevel = (level: number): number => {
  return (level * level * level) * 5;
};

export const useSubjects = create<SubjectsState>()(
  persist(
    (set, get) => ({
      subjects: defaultSubjects,
      activeSubjectId: null,
      
      // Add a new subject
      addSubject: (subjectData) => set((state) => {
        const id = subjectData.name.toLowerCase().replace(/\s+/g, '-');
        
        // Check if a subject with this ID already exists
        if (state.subjects.some(s => s.id === id)) {
          toast.error("A subject with this name already exists");
          return {};
        }
        
        const newSubject: Subject = {
          ...subjectData,
          id,
          level: 1,
          xp: 0,
          totalStudyTime: 0,
          lastStudied: null,
          notes: []
        };
        
        return { subjects: [...state.subjects, newSubject] };
      }),
      
      // Remove a subject
      removeSubject: (subjectId) => set((state) => {
        // Don't allow removing default subjects
        if (defaultSubjects.some(s => s.id === subjectId)) {
          toast.error("Default subjects cannot be removed");
          return {};
        }
        
        return {
          subjects: state.subjects.filter(s => s.id !== subjectId),
          activeSubjectId: state.activeSubjectId === subjectId ? null : state.activeSubjectId
        };
      }),
      
      // Set active subject
      setActiveSubject: (subjectId) => set({ activeSubjectId: subjectId }),
      
      // Add study time and XP to a subject
      addStudyTime: (subjectId, minutes) => set((state) => {
        const subjectIndex = state.subjects.findIndex(s => s.id === subjectId);
        if (subjectIndex === -1) return {};
        
        const subject = state.subjects[subjectIndex];
        
        // Calculate XP (1 minute = 2 XP)
        const earnedXP = minutes * 2;
        const newXP = subject.xp + earnedXP;
        const newLevel = calculateSubjectLevel(newXP);
        const leveledUp = newLevel > subject.level;
        
        // Update the subject
        const updatedSubject = {
          ...subject,
          xp: newXP,
          level: newLevel,
          totalStudyTime: subject.totalStudyTime + minutes,
          lastStudied: new Date().toISOString()
        };
        
        // Add XP to user as well (at half rate)
        const { addXP } = useUser.getState();
        addXP(earnedXP / 2);
        
        // Show toast for subject XP
        toast.success(
          <div className="flex flex-col">
            <span className="font-bold">{subject.name}</span>
            <span>+{earnedXP} Subject XP</span>
            <span>+{earnedXP / 2} User XP</span>
            {leveledUp && (
              <span className="font-bold text-yellow-400">
                Level Up! Now level {newLevel}
              </span>
            )}
          </div>
        );
        
        // Update subjects array
        const updatedSubjects = [...state.subjects];
        updatedSubjects[subjectIndex] = updatedSubject;
        
        return { subjects: updatedSubjects };
      }),
      
      // Add a note to a subject
      addNote: (subjectId, note) => set((state) => {
        const subjectIndex = state.subjects.findIndex(s => s.id === subjectId);
        if (subjectIndex === -1) return {};
        
        const subject = state.subjects[subjectIndex];
        const updatedSubject = {
          ...subject,
          notes: [...subject.notes, {
            text: note,
            createdAt: new Date().toISOString()
          }]
        };
        
        const updatedSubjects = [...state.subjects];
        updatedSubjects[subjectIndex] = updatedSubject;
        
        return { subjects: updatedSubjects };
      }),
      
      // Remove a note from a subject
      removeNote: (subjectId, index) => set((state) => {
        const subjectIndex = state.subjects.findIndex(s => s.id === subjectId);
        if (subjectIndex === -1) return {};
        
        const subject = state.subjects[subjectIndex];
        const updatedNotes = [...subject.notes];
        updatedNotes.splice(index, 1);
        
        const updatedSubject = {
          ...subject,
          notes: updatedNotes
        };
        
        const updatedSubjects = [...state.subjects];
        updatedSubjects[subjectIndex] = updatedSubject;
        
        return { subjects: updatedSubjects };
      })
    }),
    {
      name: 'subjects-storage',
    }
  )
);
