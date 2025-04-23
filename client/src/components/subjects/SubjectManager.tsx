import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GameCard } from '@/components/ui/game-card';
import { GameButton } from '@/components/ui/game-button';
import { useSubjects } from '@/lib/stores/useSubjects';
import { cn } from '@/lib/utils';
import { XpBadge } from '@/components/ui/xp-badge';
import type { Subject } from '@/types';
import { toast } from 'sonner';

// List of available colors for subjects
const COLORS = [
  '#FF5757', // Red
  '#4CAF50', // Green
  '#2196F3', // Blue
  '#FF9800', // Orange
  '#9C27B0', // Purple
  '#009688', // Teal
  '#795548', // Brown
  '#607D8B', // Blue Grey
];

// List of available icons for subjects
const ICONS = [
  'calculator',
  'flask',
  'book',
  'clock',
  'code',
  'globe',
  'music',
  'palette',
];

interface SubjectManagerProps {
  onClose?: () => void;
}

const SubjectManager = ({ onClose }: SubjectManagerProps) => {
  const { subjects, addSubject, removeSubject, editSubject } = useSubjects();
  const [isAddingSubject, setIsAddingSubject] = useState(false);
  const [editingSubjectId, setEditingSubjectId] = useState<string | null>(null);
  
  // Form states
  const [subjectName, setSubjectName] = useState('');
  const [subjectDescription, setSubjectDescription] = useState('');
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);
  const [selectedIcon, setSelectedIcon] = useState(ICONS[0]);
  
  // Get currently editing subject
  const editingSubject = editingSubjectId 
    ? subjects.find(s => s.id === editingSubjectId) 
    : null;
  
  // Start adding a new subject
  const handleStartAddSubject = () => {
    setIsAddingSubject(true);
    setEditingSubjectId(null);
    resetForm();
  };
  
  // Start editing an existing subject
  const handleStartEditSubject = (subject: Subject) => {
    setIsAddingSubject(false);
    setEditingSubjectId(subject.id);
    setSubjectName(subject.name);
    setSubjectDescription(subject.description);
    setSelectedColor(subject.color);
    setSelectedIcon(subject.icon);
  };
  
  // Reset form values
  const resetForm = () => {
    setSubjectName('');
    setSubjectDescription('');
    setSelectedColor(COLORS[0]);
    setSelectedIcon(ICONS[0]);
  };
  
  // Cancel add/edit mode
  const handleCancel = () => {
    setIsAddingSubject(false);
    setEditingSubjectId(null);
    resetForm();
  };
  
  // Save new subject
  const handleSaveNewSubject = () => {
    if (!subjectName.trim()) {
      toast.error("Please enter a subject name");
      return;
    }
    
    addSubject({
      name: subjectName,
      description: subjectDescription || 'No description',
      color: selectedColor,
      icon: selectedIcon
    });
    
    setIsAddingSubject(false);
    resetForm();
  };
  
  // Save edited subject
  const handleSaveEditedSubject = () => {
    if (!editingSubjectId) return;
    
    if (!subjectName.trim()) {
      toast.error("Please enter a subject name");
      return;
    }
    
    editSubject(editingSubjectId, {
      name: subjectName,
      description: subjectDescription || 'No description',
      color: selectedColor,
      icon: selectedIcon
    });
    
    setEditingSubjectId(null);
    resetForm();
  };
  
  // Delete a subject
  const handleDeleteSubject = (subjectId: string) => {
    if (window.confirm("Are you sure you want to delete this subject? All progress will be lost.")) {
      removeSubject(subjectId);
    }
  };
  
  // Determine if subject is a default one
  const isDefaultSubject = (subjectId: string) => {
    return ['math', 'science', 'language', 'history'].includes(subjectId);
  };
  
  // Icon component for subjects
  const renderSubjectIcon = (iconName: string) => {
    switch (iconName) {
      case 'calculator':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
            <rect x="4" y="2" width="16" height="20" rx="2"></rect>
            <line x1="8" y1="6" x2="16" y2="6"></line>
            <line x1="8" y1="10" x2="10" y2="10"></line>
            <line x1="12" y1="10" x2="14" y2="10"></line>
            <line x1="16" y1="10" x2="16" y2="10"></line>
            <line x1="8" y1="14" x2="10" y2="14"></line>
            <line x1="12" y1="14" x2="14" y2="14"></line>
            <line x1="16" y1="14" x2="16" y2="14"></line>
            <line x1="8" y1="18" x2="10" y2="18"></line>
            <line x1="12" y1="18" x2="14" y2="18"></line>
            <line x1="16" y1="18" x2="16" y2="18"></line>
          </svg>
        );
      case 'flask':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
            <path d="M9 3h6v4l3 8.5-3.5 1-4.5-3-4.5 3-3.5-1L6 7V3z"></path>
            <path d="M10 9l2 2"></path>
          </svg>
        );
      case 'book':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
          </svg>
        );
      case 'clock':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
        );
      case 'code':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
            <polyline points="16 18 22 12 16 6"></polyline>
            <polyline points="8 6 2 12 8 18"></polyline>
          </svg>
        );
      case 'globe':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="2" y1="12" x2="22" y2="12"></line>
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
          </svg>
        );
      case 'music':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
            <path d="M9 18V5l12-2v13"></path>
            <circle cx="6" cy="18" r="3"></circle>
            <circle cx="18" cy="16" r="3"></circle>
          </svg>
        );
      case 'palette':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
            <circle cx="13.5" cy="6.5" r=".5"></circle>
            <circle cx="17.5" cy="10.5" r=".5"></circle>
            <circle cx="8.5" cy="7.5" r=".5"></circle>
            <circle cx="6.5" cy="12.5" r=".5"></circle>
            <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"></path>
          </svg>
        );
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
          </svg>
        );
    }
  };
  
  return (
    <GameCard className="mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-bold text-white">Manage Subjects</h2>
        
        {!isAddingSubject && !editingSubjectId && (
          <GameButton 
            onClick={handleStartAddSubject}
            variant="secondary"
            size="sm"
          >
            Add New Subject
          </GameButton>
        )}
      </div>
      
      <AnimatePresence mode="wait">
        {/* Add/Edit Subject Form */}
        {(isAddingSubject || editingSubjectId) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-black/30 rounded-lg p-4 mb-4"
          >
            <h3 className="font-medium text-white mb-3">
              {isAddingSubject ? 'Add New Subject' : 'Edit Subject'}
            </h3>
            
            <div className="space-y-3">
              <div>
                <label className="block text-sm text-gray-300 mb-1">Name</label>
                <input
                  type="text"
                  value={subjectName}
                  onChange={(e) => setSubjectName(e.target.value)}
                  className="w-full bg-black/50 border border-white/10 rounded-md px-3 py-2 text-white"
                  placeholder="e.g. Mathematics"
                />
              </div>
              
              <div>
                <label className="block text-sm text-gray-300 mb-1">Description</label>
                <textarea
                  value={subjectDescription}
                  onChange={(e) => setSubjectDescription(e.target.value)}
                  className="w-full bg-black/50 border border-white/10 rounded-md px-3 py-2 text-white h-20 resize-none"
                  placeholder="Brief description of the subject"
                />
              </div>
              
              <div>
                <label className="block text-sm text-gray-300 mb-1">Color</label>
                <div className="flex flex-wrap gap-2">
                  {COLORS.map((color) => (
                    <button
                      key={color}
                      className={cn(
                        "w-8 h-8 rounded-full border-2",
                        selectedColor === color 
                          ? "border-white" 
                          : "border-transparent"
                      )}
                      style={{ backgroundColor: color }}
                      onClick={() => setSelectedColor(color)}
                      type="button"
                    />
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm text-gray-300 mb-1">Icon</label>
                <div className="grid grid-cols-4 gap-2">
                  {ICONS.map((icon) => (
                    <button
                      key={icon}
                      className={cn(
                        "p-2 rounded-md transition-colors flex items-center justify-center",
                        selectedIcon === icon 
                          ? "bg-primary/20 border border-primary" 
                          : "bg-black/30 border border-transparent hover:bg-black/50"
                      )}
                      onClick={() => setSelectedIcon(icon)}
                      type="button"
                      style={{ color: selectedColor }}
                    >
                      {renderSubjectIcon(icon)}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-end gap-2 pt-2">
                <GameButton 
                  onClick={handleCancel}
                  variant="ghost"
                  size="sm"
                >
                  Cancel
                </GameButton>
                
                <GameButton 
                  onClick={isAddingSubject ? handleSaveNewSubject : handleSaveEditedSubject}
                  variant="default"
                  size="sm"
                >
                  {isAddingSubject ? 'Add Subject' : 'Save Changes'}
                </GameButton>
              </div>
            </div>
          </motion.div>
        )}
        
        {/* Subjects List */}
        {!isAddingSubject && !editingSubjectId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-3"
          >
            {subjects.map((subject) => (
              <div 
                key={subject.id}
                className="bg-black/30 rounded-lg p-3 flex justify-between items-center"
              >
                <div className="flex items-center">
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center mr-3"
                    style={{ backgroundColor: subject.color + '33', color: subject.color }}
                  >
                    {renderSubjectIcon(subject.icon)}
                  </div>
                  
                  <div>
                    <div className="font-medium text-white flex items-center">
                      {subject.name}
                      <XpBadge level={subject.level} size="sm" className="ml-2" />
                    </div>
                    <div className="text-xs text-gray-300">{subject.description}</div>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => handleStartEditSubject(subject)}
                    className="p-1 rounded-md hover:bg-black/30 transition-colors text-blue-400"
                    title="Edit Subject"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                      <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
                    </svg>
                  </button>
                  
                  {!isDefaultSubject(subject.id) && (
                    <button
                      onClick={() => handleDeleteSubject(subject.id)}
                      className="p-1 rounded-md hover:bg-black/30 transition-colors text-red-400"
                      title="Delete Subject"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        <line x1="10" y1="11" x2="10" y2="17"></line>
                        <line x1="14" y1="11" x2="14" y2="17"></line>
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            ))}
            
            {subjects.length === 0 && (
              <div className="bg-black/20 rounded-lg p-4 text-center">
                <p className="text-gray-300">No subjects added yet. Add your first subject!</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Close button when used in modal */}
      {onClose && (
        <div className="flex justify-end mt-4">
          <GameButton onClick={onClose}>
            Close
          </GameButton>
        </div>
      )}
    </GameCard>
  );
};

export default SubjectManager;