import { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useAudio } from "@/lib/stores/useAudio";

// Navigation items configuration
const navItems = [
  { path: "/", icon: "home", label: "Dashboard" },
  { path: "/study-arena", icon: "arena", label: "Arena" },
  { path: "/quests", icon: "quests", label: "Quests" },
  { path: "/calendar", icon: "calendar", label: "Calendar" },
  { path: "/social", icon: "social", label: "Social" },
  { path: "/leaderboard", icon: "leaderboard", label: "Ranks" },
  { path: "/achievements", icon: "achievements", label: "Vault" },
  { path: "/profile", icon: "profile", label: "Character" },
  { path: "/subject-settings", icon: "settings", label: "Settings" },
];

// Icon components for the navigation buttons
const NavIcons: Record<string, React.ReactNode> = {
  home: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
      <polyline points="9 22 9 12 15 12 15 22"></polyline>
    </svg>
  ),
  arena: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10"></circle>
      <polyline points="12 6 12 12 16 14"></polyline>
    </svg>
  ),
  quests: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
      <polyline points="14 2 14 8 20 8"></polyline>
      <line x1="9" y1="12" x2="15" y2="12"></line>
      <line x1="9" y1="16" x2="15" y2="16"></line>
    </svg>
  ),
  social: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
      <circle cx="9" cy="7" r="4"></circle>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
    </svg>
  ),
  leaderboard: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 20V10"></path>
      <path d="M12 20V4"></path>
      <path d="M6 20V14"></path>
    </svg>
  ),
  achievements: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="8" r="6"></circle>
      <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"></path>
    </svg>
  ),
  profile: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
      <circle cx="12" cy="7" r="4"></circle>
    </svg>
  ),
  settings: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path>
      <circle cx="12" cy="12" r="3"></circle>
    </svg>
  ),
  calendar: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
      <line x1="16" y1="2" x2="16" y2="6"></line>
      <line x1="8" y1="2" x2="8" y2="6"></line>
      <line x1="3" y1="10" x2="21" y2="10"></line>
    </svg>
  ),
  menu: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="4" y1="12" x2="20" y2="12"></line>
      <line x1="4" y1="6" x2="20" y2="6"></line>
      <line x1="4" y1="18" x2="20" y2="18"></line>
    </svg>
  ),
  close: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="18" y1="6" x2="6" y2="18"></line>
      <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
  ),
};

/**
 * Game Navigation Bar
 * A mobile game-like bottom navigation with animated icons and highlights
 * Now with responsive design for mobile devices
 */
const GameNavBar = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(location.pathname);
  const { playHit } = useAudio();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  // Primary navigation items (shown on bottom bar)
  const primaryNavItems = navItems.slice(0, 5);
  // Secondary navigation items (shown in mobile menu)
  const secondaryNavItems = navItems.slice(5);

  // Check screen size on mount and when window resizes
  useEffect(() => {
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth < 640);
    };

    // Initial check
    checkScreenSize();

    // Add event listener
    window.addEventListener("resize", checkScreenSize);

    // Clean up
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // Update active tab when location changes
  useEffect(() => {
    setActiveTab(location.pathname);
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const handleNavLinkClick = () => {
    playHit();
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-30"
            onClick={() => setMobileMenuOpen(false)}
          >
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute bottom-24 left-4 right-4 bg-gray-900/90 rounded-2xl border border-primary/30 p-4 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-white">Menu</h3>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-white/70 hover:text-white"
                >
                  {NavIcons.close}
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {secondaryNavItems.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={handleNavLinkClick}
                    className={({ isActive }) =>
                      cn(
                        "flex items-center p-3 rounded-xl transition-colors",
                        isActive
                          ? "bg-primary/20 text-white"
                          : "text-white/70 hover:bg-gray-800/50 hover:text-white"
                      )
                    }
                  >
                    <span className="mr-3">{NavIcons[item.icon]}</span>
                    <span className="font-medium">{item.label}</span>
                  </NavLink>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Navigation Bar */}
      <nav className="fixed bottom-0 left-0 w-full z-40">
        {/* Decorative top highlight */}
        <div className="h-1 w-full bg-gradient-to-r from-primary via-secondary to-accent opacity-70"></div>

        {/* Main navigation background */}
        <div className="bg-black/70 backdrop-blur-lg px-2 py-2 border-t border-primary/30">
          <div className="max-w-screen-sm mx-auto">
            <div className="flex justify-around items-center">
              {/* Mobile optimized navigation - show only primary items plus menu button */}
              {primaryNavItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => playHit()}
                  className={({ isActive }) =>
                    cn(
                      "relative flex flex-col items-center",
                      isActive ? "text-white" : "text-white/60"
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      {/* Animated highlight for active tab */}
                      {isActive && (
                        <motion.div
                          className="absolute -top-1 left-0 right-0 mx-auto w-8 h-1 bg-primary rounded-full"
                          layoutId="activeTab"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.3 }}
                        />
                      )}

                      {/* Icon */}
                      <div className={cn("nav-icon", isActive && "active")}>
                        {NavIcons[item.icon]}

                        {/* Glow effect for active tab */}
                        {isActive && (
                          <div className="absolute inset-0 rounded-full bg-primary animate-pulse-glow opacity-30" />
                        )}
                      </div>

                      {/* Label */}
                      <span className="text-[10px] mt-1 font-medium">
                        {item.label}
                      </span>
                    </>
                  )}
                </NavLink>
              ))}

              {/* Menu Button for mobile */}
              <button
                onClick={() => {
                  playHit();
                  setMobileMenuOpen(true);
                }}
                className="relative flex flex-col items-center text-white/60"
              >
                <div className="nav-icon">{NavIcons.menu}</div>
                <span className="text-[10px] mt-1 font-medium">More</span>
              </button>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default GameNavBar;
