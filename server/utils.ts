import crypto from "crypto";

/**
 * Generate a random string of specified length
 * @param length Length of the random string
 * @returns Random string
 */
export function generateRandomString(length: number): string {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  const randomBytes = crypto.randomBytes(length);

  for (let i = 0; i < length; i++) {
    const randomIndex = randomBytes[i] % chars.length;
    result += chars.charAt(randomIndex);
  }

  return result;
}

/**
 * Format a duration in minutes to a human-readable string
 * @param minutes Duration in minutes
 * @returns Formatted string (e.g., "2h 30m" or "45m")
 */
export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes}m`;
  }

  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
}

/**
 * Calculate level from XP using the standard formula
 * @param xp Current XP
 * @returns Level based on XP
 */
export function calculateLevelFromXP(xp: number): number {
  const baseXP = 100;
  let level = 1;
  let xpForNextLevel = baseXP;

  while (xp >= xpForNextLevel) {
    level++;
    xp -= xpForNextLevel;
    xpForNextLevel = Math.floor(baseXP * Math.pow(1.5, level - 1));
  }

  return level;
}

/**
 * Calculate XP needed for the next level
 * @param level Current level
 * @returns XP needed for the next level
 */
export function xpForNextLevel(level: number): number {
  return Math.floor(100 * Math.pow(1.5, level - 1));
}

/**
 * Calculate XP progress percentage for the current level
 * @param xp Total XP
 * @param level Current level
 * @returns Progress percentage (0-100)
 */
export function calculateXPProgress(xp: number, level: number): number {
  const baseXP = 100;
  let totalXPForCurrentLevel = 0;

  // Calculate total XP needed to reach the current level
  for (let i = 1; i < level; i++) {
    totalXPForCurrentLevel += Math.floor(baseXP * Math.pow(1.5, i - 1));
  }

  const currentLevelXP = xp - totalXPForCurrentLevel;
  const xpNeeded = xpForNextLevel(level);

  return Math.min(Math.round((currentLevelXP / xpNeeded) * 100), 100);
}

/**
 * Validate an email address format
 * @param email Email address to validate
 * @returns Boolean indicating if email is valid
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Truncate text to a specified length with ellipsis
 * @param text Text to truncate
 * @param maxLength Maximum length before truncation
 * @returns Truncated text with ellipsis if needed
 */
export function truncateText(text: string, maxLength: number): string {
  if (!text || text.length <= maxLength) {
    return text;
  }

  return text.substring(0, maxLength - 3) + "...";
}

/**
 * Get relative time string from date (e.g., "2 hours ago")
 * @param date Date to format
 * @returns Relative time string
 */
export function getRelativeTimeString(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return `${diffInSeconds} seconds ago`;
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} ${diffInMinutes === 1 ? "minute" : "minutes"} ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} ${diffInHours === 1 ? "hour" : "hours"} ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) {
    return `${diffInDays} ${diffInDays === 1 ? "day" : "days"} ago`;
  }

  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `${diffInMonths} ${diffInMonths === 1 ? "month" : "months"} ago`;
  }

  const diffInYears = Math.floor(diffInMonths / 12);
  return `${diffInYears} ${diffInYears === 1 ? "year" : "years"} ago`;
}
