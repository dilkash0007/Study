import { motion } from 'framer-motion';
import SubjectManager from '@/components/subjects/SubjectManager';

/**
 * Subject Settings Page
 * Allows users to manage their subjects (add, edit, delete)
 */
const SubjectSettings = () => {
  return (
    <div className="min-h-screen px-4 pt-6 pb-24">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 mr-2 text-primary">
            <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
            <path d="M2 17l10 5 10-5"></path>
            <path d="M2 12l10 5 10-5"></path>
          </svg>
          Subject Settings
        </h1>
        <p className="text-gray-300 text-sm mt-1">Customize your subjects and learning materials</p>
      </div>
      
      {/* Subject Manager component */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <SubjectManager />
      </motion.div>
      
      {/* Additional help text */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-black/30 p-4 rounded-lg text-sm text-gray-300"
      >
        <h3 className="font-medium text-white mb-2">Tips for Subject Management</h3>
        <ul className="list-disc pl-5 space-y-1">
          <li>Create specific subjects for better tracking of your progress</li>
          <li>Use distinctive colors to make subjects easily identifiable</li>
          <li>Default subjects cannot be deleted but can be customized</li>
          <li>All of your study data is saved per subject</li>
        </ul>
      </motion.div>
    </div>
  );
};

export default SubjectSettings;