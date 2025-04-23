import React from 'react';
import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import { motion } from 'framer-motion';

// Progress variants using class-variance-authority
const progressVariants = cva(
  "relative h-4 w-full overflow-hidden rounded-full border",
  {
    variants: {
      variant: {
        default: "border-primary/50 bg-primary/20",
        secondary: "border-secondary/50 bg-secondary/20",
        accent: "border-accent/50 bg-accent/20",
        destructive: "border-destructive/50 bg-destructive/20",
        success: "border-[#22c55e]/50 bg-[#22c55e]/20",
      },
      size: {
        default: "h-4",
        sm: "h-2",
        md: "h-3",
        lg: "h-5",
        xl: "h-6"
      },
      glow: {
        true: "",
        false: "",
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      glow: true
    },
  }
);

// Indicator variants for the filled portion
const indicatorVariants = cva(
  "h-full w-full flex-1 transition-all",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-r from-primary to-primary/80",
        secondary: "bg-gradient-to-r from-secondary to-secondary/80",
        accent: "bg-gradient-to-r from-accent to-accent/80",
        destructive: "bg-gradient-to-r from-destructive to-destructive/80",
        success: "bg-gradient-to-r from-[#22c55e] to-[#22c55e]/80",
      },
      glow: {
        true: "",
        false: "",
      }
    },
    defaultVariants: {
      variant: "default",
      glow: true
    },
  }
);

// Progress component props
export interface GameProgressProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof progressVariants> {
  value: number;
  max?: number;
  showValue?: boolean;
  valuePrefix?: string;
  valueSuffix?: string;
  animate?: boolean;
}

/**
 * GameProgress Component
 * A stylized game-like progress bar with various visual options
 */
const GameProgress = React.forwardRef<HTMLDivElement, GameProgressProps>(
  ({ 
    className, 
    variant, 
    size, 
    glow, 
    value, 
    max = 100, 
    showValue = false,
    valuePrefix = "",
    valueSuffix = "",
    animate = true,
    ...props 
  }, ref) => {
    // Calculate percentage
    const percentage = Math.min(Math.max(0, (value / max) * 100), 100);
    
    return (
      <div
        className={cn(progressVariants({ variant, size, glow, className }))}
        ref={ref}
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={value}
        {...props}
      >
        {/* Progress indicator with animation */}
        <motion.div
          className={cn(indicatorVariants({ variant, glow }))}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: animate ? 0.8 : 0, ease: "easeOut" }}
          style={{ width: `${percentage}%` }}
        >
          {/* Shine effect on the progress bar */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent"></div>
        </motion.div>
        
        {/* Glow effect behind the progress bar */}
        {glow && (
          <div className={cn(
            "absolute inset-0 -z-10 blur-md rounded-full opacity-40",
            indicatorVariants({ variant, glow: false }),
          )} style={{ width: `${percentage}%` }}></div>
        )}
        
        {/* Display value if showValue is true */}
        {showValue && (
          <div className="absolute inset-0 flex items-center justify-center text-xs font-medium">
            {valuePrefix}{value}{valueSuffix}
          </div>
        )}
      </div>
    );
  }
);

GameProgress.displayName = "GameProgress";

export { GameProgress };
