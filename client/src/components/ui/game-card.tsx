import React from 'react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { cva, type VariantProps } from 'class-variance-authority';

// Card variants using class-variance-authority
const cardVariants = cva(
  "game-card relative",
  {
    variants: {
      variant: {
        default: "bg-card/50 border-primary/30",
        secondary: "bg-card/50 border-secondary/30",
        accent: "bg-card/50 border-accent/30",
        ghost: "bg-transparent border-transparent shadow-none",
      },
      size: {
        default: "p-5",
        sm: "p-3",
        lg: "p-7",
        xl: "p-9"
      },
      animate: {
        float: "animate-float",
        pulse: "animate-pulse-glow",
        none: "",
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      animate: "none"
    },
  }
);

// Card component props
export interface GameCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  children: React.ReactNode;
  contentClassName?: string;
  shimmer?: boolean;
}

/**
 * GameCard Component
 * A stylized game-like card container with various visual options
 */
const GameCard = React.forwardRef<HTMLDivElement, GameCardProps>(
  ({ className, variant, size, animate, children, contentClassName, shimmer = false, ...props }, ref) => {
    return (
      <div
        className={cn(cardVariants({ variant, size, animate, className }))}
        ref={ref}
        {...props}
      >
        {/* Card content */}
        <div className={cn("relative z-10", contentClassName)}>
          {children}
        </div>
        
        {/* Shimmer effect - animated gradient that moves across the card */}
        {shimmer && (
          <AnimatePresence>
            <motion.div 
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none"
              initial={{ x: '-100%' }}
              animate={{ x: '200%' }}
              transition={{ 
                repeat: Infinity, 
                repeatType: 'loop', 
                duration: 2, 
                ease: "linear",
                repeatDelay: 5 
              }}
            />
          </AnimatePresence>
        )}
      </div>
    );
  }
);

GameCard.displayName = "GameCard";

export { GameCard, cardVariants };
