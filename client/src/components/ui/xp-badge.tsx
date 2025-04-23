import React from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface XpBadgeProps {
  level: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showAnimation?: boolean;
}

/**
 * XP Badge Component
 * A stylized level indicator badge for displaying user's level
 */
const XpBadge: React.FC<XpBadgeProps> = ({ 
  level, 
  size = 'md', 
  className,
  showAnimation = false
}) => {
  // Size mappings
  const sizeClasses = {
    sm: "w-8 h-8 text-xs",
    md: "w-12 h-12 text-sm",
    lg: "w-16 h-16 text-base"
  };
  
  // Badge styles based on level ranges
  const getBadgeStyle = (level: number) => {
    if (level < 5) return "from-blue-500 to-blue-700";
    if (level < 10) return "from-green-500 to-green-700";
    if (level < 15) return "from-yellow-500 to-yellow-700";
    if (level < 20) return "from-orange-500 to-orange-700";
    if (level < 30) return "from-red-500 to-red-700";
    if (level < 40) return "from-purple-500 to-purple-700";
    return "from-primary to-violet-800";
  };
  
  const badgeStyle = getBadgeStyle(level);
  
  return (
    <div className={cn(
      "relative flex items-center justify-center rounded-full font-bold text-white",
      sizeClasses[size],
      className
    )}>
      {/* Badge background */}
      <div className={cn(
        "absolute inset-0 rounded-full bg-gradient-to-br", 
        badgeStyle
      )} />
      
      {/* Animated glow ring for high levels */}
      {level >= 10 && (
        <motion.div 
          className={cn(
            "absolute inset-0 rounded-full bg-gradient-to-br opacity-40",
            badgeStyle
          )}
          initial={{ scale: 0.9 }}
          animate={{ scale: showAnimation ? [0.9, 1.1, 0.9] : 0.9 }}
          transition={{ 
            duration: 2,
            repeat: showAnimation ? Infinity : 0,
            repeatType: "mirror" 
          }}
        />
      )}
      
      {/* Shine effect */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-b from-white/30 to-transparent overflow-hidden">
        <div className="absolute inset-0 rounded-full bg-gradient-to-t from-black/30 to-transparent" />
      </div>
      
      {/* Level text with possible animation */}
      <motion.span 
        className="relative z-10"
        animate={showAnimation ? { scale: [1, 1.2, 1] } : undefined}
        transition={{ 
          duration: 0.3,
          repeat: showAnimation ? 0 : 0,
          repeatType: "mirror" 
        }}
      >
        {level}
      </motion.span>
    </div>
  );
};

export { XpBadge };
