import { useEffect } from 'react';
import { useAudio } from '@/lib/stores/useAudio';
import { useLocation } from 'react-router-dom';

/**
 * Sound Manager Component
 * Handles all audio playing logic and background music control
 */
const SoundManager = () => {
  const { 
    backgroundMusic, 
    isMuted, 
    toggleMute,
    playHit, 
    playSuccess 
  } = useAudio();
  const location = useLocation();

  // Keyboard shortcut for muting ('M' key)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'm' || e.key === 'M') {
        toggleMute();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleMute]);

  // Control background music playback based on mute state
  useEffect(() => {
    if (!backgroundMusic) return;

    if (isMuted) {
      backgroundMusic.pause();
    } else {
      backgroundMusic.play().catch(error => {
        console.log("Background music play prevented. User interaction needed first:", error);
      });
    }
  }, [backgroundMusic, isMuted]);

  // Add click sound to all buttons
  useEffect(() => {
    const handleButtonClick = (e: MouseEvent) => {
      const target = e.target as Element;
      const button = target.closest('button') || target.closest('[role="button"]');
      
      if (button) {
        if (button.classList.contains('success-action')) {
          playSuccess();
        } else {
          playHit();
        }
      }
    };

    document.addEventListener('click', handleButtonClick);
    return () => document.removeEventListener('click', handleButtonClick);
  }, [playHit, playSuccess]);

  // Play transition sound when route changes
  useEffect(() => {
    playHit();
  }, [location.pathname, playHit]);

  return null; // This component doesn't render anything visible
};

export default SoundManager;
