import React, { useCallback, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  rotation: number;
  duration: number;
  delay: number;
}

interface ParticleEffectProps {
  type?: 'confetti' | 'sparkle' | 'coins';
  trigger?: boolean;
  count?: number;
  originX?: number; // 0-100 percentage
  originY?: number; // 0-100 percentage
  spread?: number; // 0-100 percentage
  duration?: number; // seconds
  colors?: string[];
}

/**
 * ParticleEffect Component
 * Renders animated particles for celebration effects
 */
const ParticleEffect: React.FC<ParticleEffectProps> = ({
  type = 'confetti',
  trigger = false,
  count = 30,
  originX = 50,
  originY = 50,
  spread = 60,
  duration = 3,
  colors = ['#9945FF', '#14F195', '#FFBB38', '#FF4D4D', '#3290FF'],
}) => {
  const particlesRef = useRef<Particle[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Generate particles based on type and parameters
  const generateParticles = useCallback(() => {
    if (!containerRef.current) return [];
    
    const containerWidth = containerRef.current.clientWidth;
    const containerHeight = containerRef.current.clientHeight;
    
    // Origin position in pixels
    const originXPx = (containerWidth * originX) / 100;
    const originYPx = (containerHeight * originY) / 100;
    
    // Spread radius
    const spreadX = (containerWidth * spread) / 100;
    const spreadY = (containerHeight * spread) / 100;
    
    const newParticles: Particle[] = [];
    
    for (let i = 0; i < count; i++) {
      const particle: Particle = {
        id: i,
        x: originXPx,
        y: originYPx,
        size: type === 'coins' ? 20 : Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        duration: Math.random() * duration + duration / 2,
        delay: Math.random() * 0.5,
      };
      
      newParticles.push(particle);
    }
    
    return newParticles;
  }, [count, colors, duration, originX, originY, spread, type]);
  
  // Reset and generate new particles when triggered
  useEffect(() => {
    if (trigger) {
      particlesRef.current = generateParticles();
    }
  }, [trigger, generateParticles]);
  
  // Early return if not triggered
  if (!trigger) return null;
  
  // Render different particle shapes based on type
  const renderParticleShape = (particle: Particle) => {
    switch (type) {
      case 'confetti':
        return (
          <rect 
            width={particle.size} 
            height={particle.size * 1.5} 
            fill={particle.color} 
            rx={1}
          />
        );
      case 'sparkle':
        return (
          <polygon 
            points="0,5 2,2 5,0 8,2 10,5 8,8 5,10 2,8" 
            fill={particle.color} 
            transform={`scale(${particle.size / 10})`}
          />
        );
      case 'coins':
        return (
          <g>
            <circle r={8} fill={particle.color} />
            <circle r={6} fill={`${particle.color}99`} />
            <text 
              textAnchor="middle" 
              dominantBaseline="middle" 
              fill="#000" 
              fontSize="10"
              fontWeight="bold"
            >
              +
            </text>
          </g>
        );
      default:
        return <circle r={particle.size / 2} fill={particle.color} />;
    }
  };
  
  return (
    <div 
      ref={containerRef} 
      className="absolute inset-0 pointer-events-none overflow-hidden z-50"
    >
      {particlesRef.current.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute top-0 left-0"
          initial={{ 
            x: particle.x, 
            y: particle.y,
            opacity: 1 
          }}
          animate={{ 
            x: particle.x + (Math.random() - 0.5) * 400, 
            y: particle.y - Math.random() * 500,
            opacity: 0 
          }}
          transition={{ 
            duration: particle.duration,
            delay: particle.delay,
            ease: [0.1, 0.4, 0.7, 1] 
          }}
          style={{ translateX: '-50%', translateY: '-50%' }}
        >
          <motion.svg
            width={particle.size * 2}
            height={particle.size * 2}
            viewBox="-10 -10 20 20"
            animate={{ rotate: particle.rotation + 360 }}
            transition={{ duration: particle.duration, ease: "linear" }}
          >
            {renderParticleShape(particle)}
          </motion.svg>
        </motion.div>
      ))}
    </div>
  );
};

export default ParticleEffect;
