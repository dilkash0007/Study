import React from 'react';

// Map of avatar IDs to SVG representations
const avatars: Record<string, React.ReactNode> = {
  // Default avatar
  default: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-12 h-12 text-white">
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
      <circle cx="12" cy="7" r="4"></circle>
    </svg>
  ),
  
  // Wizard avatar
  wizard: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-12 h-12 text-purple-300">
      <path d="m12 2-5.5 9h11L12 2z"></path>
      <path d="m12 13 5 9H7l5-9z"></path>
      <path d="M12 21v-4"></path>
      <path d="M8 13h8"></path>
    </svg>
  ),
  
  // Knight avatar
  knight: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-12 h-12 text-blue-300">
      <path d="M14 6a2 2 0 0 1-2-2 2 2 0 0 1-2 2 2 2 0 0 1 2 2 2 2 0 0 1 2-2z"></path>
      <path d="M6 10a2 2 0 0 1-2-2 2 2 0 0 1-2 2 2 2 0 0 1 2 2 2 2 0 0 1 2-2z"></path>
      <path d="M7 3h.01"></path>
      <path d="M17 3h.01"></path>
      <path d="M22 6h.01"></path>
      <path d="M22 22h.01"></path>
      <path d="M2 6h.01"></path>
      <path d="M2 22h.01"></path>
      <path d="M7 22h.01"></path>
      <path d="M17 22h.01"></path>
      <path d="M14 20a2 2 0 0 1-2-2 2 2 0 0 1-2 2 2 2 0 0 1 2 2 2 2 0 0 1 2-2z"></path>
    </svg>
  ),
  
  // Archer avatar
  archer: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-12 h-12 text-green-300">
      <path d="M3 19c0-4.978 1.333-9 6-9"></path>
      <path d="M9 10V4l6 8-6 8v-7"></path>
      <path d="M21 19h-9"></path>
    </svg>
  ),
  
  // Mage avatar
  mage: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-12 h-12 text-pink-300">
      <path d="M10 21.8V16a2 2 0 0 1 2-2h0a2 2 0 0 1 2 2v5.8"></path>
      <path d="M5 22h14"></path>
      <path d="M16.8 15.5c-.7-1-1.2-2.2-1.3-3.5l-1.1.6c-1 .5-2.1.5-3.1 0l-1.1-.6c-.1 1.3-.6 2.5-1.3 3.5"></path>
      <path d="M7 4.3C7.2 3.4 7.9 2 10 2c2.1 0 2.8 1.4 3 2.3"></path>
      <path d="m6 7 3.1 1.9a4.8 4.8 0 0 0 5.8 0L18 7"></path>
      <path d="M18 3c.9 2.3.7 4.7 0 7.2"></path>
      <path d="M6 3c-.9 2.3-.7 4.7 0 7.2"></path>
    </svg>
  ),
  
  // Warrior avatar
  warrior: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-12 h-12 text-red-300">
      <path d="M12 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"></path>
      <path d="M6.5 14.5s.625-2.5 5.5-2.5 5.5 2.5 5.5 2.5"></path>
      <polygon points="9 18 12 15 15 18 15 21 9 21"></polygon>
      <path d="M6 14.125C3.875 14.75 2 15.5 2 16c0 .667.5 1 1 1a8 8 0 0 0 2.5-.347"></path>
      <path d="M18 14.125c2.125.625 4 1.375 4 1.875 0 .667-.5 1-1 1a8 8 0 0 1-2.5-.347"></path>
    </svg>
  ),
  
  // Healer avatar
  healer: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-12 h-12 text-yellow-300">
      <path d="M12.328 13.074c-.181-.19-.463-.22-.68-.08a.698.698 0 0 0-.369.603c.01.29.181.55.43.67.25.12.53.08.74-.12.19-.17.3-.45.25-.72a.699.699 0 0 0-.371-.353Z"></path>
      <path d="M15.4 9.6c-.331.17-.762.31-1.262.38-1.031.15-1.969-.12-2.298-.47 0 0-.8.29-.16.65-.63.37-.398.93-.049 1.39"></path>
      <path d="M10.2 7.6c-.12.791.14 1.581.73 2.04l.97.59"></path>
      <path d="M8.4 12c.15.58.643 1.17 1.522 1.53.881.36 2.071.39 3.248.07 1.11-.31 1.91-.76 2.33-1.15"></path>
      <path d="M5.2 11.2c-.2-.6-.2-1.6 0-2.4.4-1.5 1.48-3.2 2.6-3.2.732 0 .8.8.8.8"></path>
      <path d="M8.4 5.6c0-.64.25-1.3.65-1.8.33-.4.41-.4.55-.4.26 0 .5.15.7.37.14.17.2.37.1.58"></path>
      <path d="M11.6 4.2c.13-.5.25-1.3.48-1.7.23-.4.5-.5.8-.5.322 0 .63.13.83.37.237.29.397.7.351 1.13-.13 1.2-1.191 1.8-1.031 1.47"></path>
      <path d="M13.6 5.6c.551-.5 1.883-.5 2.8 0 .43.23.583.73.8 1.4"></path>
      <path d="M18.4 8.4c.522.73.713 1.6.5 2.5-.137.5-.338.8-.4.8 0 0 0-.2-.5-.4"></path>
      <path d="M15.8 18.2s-.1-1.6-1.4-2.1c-.8-.3-2.7-.6-3.2-.8-.7-.28-.9-.69-1-1"></path>
      <path d="M11.8 8.6c-.028-.387.043-1 .6-1.2.557-.2.833 0 1 .2.264.312-.45 1.25-.45 1.25"></path>
      <path d="m10.6 9.4.9-.8"></path>
    </svg>
  ),
  
  // Rogue avatar
  rogue: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-12 h-12 text-gray-300">
      <path d="M4 17v5h5l7-7"></path>
      <path d="m12 19 5 5"></path>
      <path d="M19 19c-.3-1.3-1-2-2-2"></path>
      <path d="M4 7v.85C4 10.2 5.8 12 8.15 12c1.5 0 2.85-.6 3.85-1.6"></path>
      <path d="M4 19c.3-1.3 1-2 2-2"></path>
      <path d="m10 13 10 10"></path>
      <path d="M16 7h4m-7 3V6c0-1.1-.9-2-2-2V3a3 3 0 0 0-3 3v3c0 1.1.9 2 2 2v1a2 2 0 0 0 2-2z"></path>
    </svg>
  ),
  
  // Bard avatar
  bard: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-12 h-12 text-cyan-300">
      <path d="M12 18v-3"></path>
      <path d="M10 15h4"></path>
      <path d="M18 4v16"></path>
      <path d="M6 4v16"></path>
      <path d="M4 7.598C4 4 6 4 6 4h12s2 0 2 3.598v8.804C20 20 18 20 18 20H6s-2 0-2-3.598V7.598Z"></path>
      <path d="M6 7.605c3.967 5.22 8.033 5.22 12 0"></path>
    </svg>
  )
};

/**
 * Get the avatar component by ID
 * @param id The avatar ID
 * @returns The corresponding SVG avatar component
 */
export const getAvatarById = (id: string): React.ReactNode => {
  return avatars[id] || avatars.default;
};

export default avatars;
