import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

// Button variants using class-variance-authority
const buttonVariants = cva(
  "relative rounded-md px-4 py-2 font-medium transition-all duration-200 ease-out flex items-center justify-center",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-r from-primary to-primary/80 text-white shadow-[0_0_8px_2px_rgba(153,69,255,0.3)] hover:shadow-[0_0_12px_4px_rgba(153,69,255,0.4)] active:shadow-[0_0_4px_1px_rgba(153,69,255,0.3)]",
        secondary: "bg-gradient-to-r from-secondary to-secondary/80 text-black shadow-[0_0_8px_2px_rgba(20,241,149,0.3)] hover:shadow-[0_0_12px_4px_rgba(20,241,149,0.4)] active:shadow-[0_0_4px_1px_rgba(20,241,149,0.3)]",
        accent: "bg-gradient-to-r from-accent to-accent/80 text-black shadow-[0_0_8px_2px_rgba(255,187,56,0.3)] hover:shadow-[0_0_12px_4px_rgba(255,187,56,0.4)] active:shadow-[0_0_4px_1px_rgba(255,187,56,0.3)]",
        destructive: "bg-gradient-to-r from-destructive to-destructive/80 text-white shadow-[0_0_8px_2px_rgba(239,68,68,0.3)] hover:shadow-[0_0_12px_4px_rgba(239,68,68,0.4)] active:shadow-[0_0_4px_1px_rgba(239,68,68,0.3)]",
        ghost: "hover:bg-primary/10 text-white shadow-none hover:shadow-none",
      },
      size: {
        default: "h-11 px-4 py-2",
        sm: "h-9 px-3 text-sm",
        lg: "h-14 px-6 text-lg",
        icon: "h-11 w-11 p-0",
      },
      isSuccess: {
        true: "success-action", // Class used by SoundManager to play success sound
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      isSuccess: false,
    },
  }
);

// Button component props
export interface GameButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  children: React.ReactNode;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  glow?: boolean;
}

/**
 * GameButton Component
 * A stylized game-like button with various visual options
 */
const GameButton = React.forwardRef<HTMLButtonElement, GameButtonProps>(
  ({ className, variant, size, isSuccess, children, leftIcon, rightIcon, glow = true, ...props }, ref) => {
    return (
      <button
        className={cn(
          buttonVariants({ variant, size, isSuccess, className }),
          glow && "active:scale-95",
          props.disabled && "opacity-50 cursor-not-allowed"
        )}
        ref={ref}
        {...props}
      >
        {/* Optional left icon */}
        {leftIcon && <span className="mr-2">{leftIcon}</span>}
        
        {/* Button content */}
        <span>{children}</span>
        
        {/* Optional right icon */}
        {rightIcon && <span className="ml-2">{rightIcon}</span>}
        
        {/* Glow effect behind the button (only when glow prop is true) */}
        {glow && (
          <div className="absolute inset-0 -z-10 opacity-30 blur-md rounded-md bg-inherit"></div>
        )}
      </button>
    );
  }
);

GameButton.displayName = "GameButton";

export { GameButton, buttonVariants };
