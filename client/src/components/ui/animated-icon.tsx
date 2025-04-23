import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

// Animation variants for different effects
const animationVariants = {
  pulse: {
    scale: [1, 1.1, 1],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      repeatType: "mirror"
    }
  },
  bounce: {
    y: [0, -10, 0],
    transition: {
      duration: 1,
      repeat: Infinity,
      repeatType: "mirror"
    }
  },
  rotate: {
    rotate: [0, 360],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "linear"
    }
  },
  shake: {
    x: [0, -5, 5, -5, 5, 0],
    transition: {
      duration: 0.5,
      repeat: Infinity,
      repeatDelay: 5
    }
  },
  float: {
    y: [0, -10, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      repeatType: "mirror"
    }
  }
};

// Animation component props
interface AnimatedIconProps {
  icon: React.ReactNode;
  animation?: keyof typeof animationVariants | 'none';
  color?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  onClick?: () => void;
  className?: string;
  hoverEffect?: boolean;
  background?: boolean;
  glow?: boolean;
}

/**
 * AnimatedIcon Component
 * A wrapper that adds animation effects to icons or elements
 */
const AnimatedIcon: React.FC<AnimatedIconProps> = ({
  icon,
  animation = 'none',
  color = 'text-white',
  size = 'md',
  onClick,
  className,
  hoverEffect = true,
  background = false,
  glow = false
}) => {
  const [isHovering, setIsHovering] = useState(false);
  
  // Size mappings
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-10 h-10",
    xl: "w-14 h-14"
  };
  
  return (
    <motion.div
      className={cn(
        "flex items-center justify-center",
        onClick && "cursor-pointer",
        background && "rounded-full p-2 bg-black/20",
        color,
        sizeClasses[size],
        className
      )}
      animate={animation !== 'none' ? animationVariants[animation] : undefined}
      onClick={onClick}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      whileHover={hoverEffect ? { scale: 1.1 } : undefined}
      whileTap={onClick ? { scale: 0.95 } : undefined}
    >
      {/* The icon */}
      {icon}
      
      {/* Glow effect */}
      {glow && (
        <div className={cn(
          "absolute inset-0 rounded-full -z-10 opacity-50 blur-md",
          color.replace('text-', 'bg-')
        )}></div>
      )}
      
      {/* Hover effect animation */}
      <AnimatePresence>
        {isHovering && hoverEffect && (
          <motion.div
            className="absolute inset-0 bg-white rounded-full"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 0.2, scale: 1.2 }}
            exit={{ opacity: 0, scale: 1.4 }}
            transition={{ duration: 0.3 }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export { AnimatedIcon };
