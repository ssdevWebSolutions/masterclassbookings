/**
 * Greeting Utilities
 * Single Responsibility: Generate greeting messages based on time and UK festivals
 */

/**
 * Get greeting message based on time of day and UK festivals
 * @returns {string}
 */
export const getGreeting = () => {
  const now = new Date();
  const hour = now.getHours();
  const month = now.getMonth() + 1; // 1-12
  const day = now.getDate();

  // UK Festivals/Holidays
  const isNewYear = month === 1 && day === 1;
  const isEaster = isEasterDate(now);
  const isChristmas = month === 12 && day === 25;
  const isBoxingDay = month === 12 && day === 26;
  const isValentines = month === 2 && day === 14;
  const isStPatricks = month === 3 && day === 17;
  const isMayDay = month === 5 && day === 1;
  const isHalloween = month === 10 && day === 31;
  const isGuyFawkes = month === 11 && day === 5;
  const isRemembranceDay = month === 11 && day === 11;

  // Time-based greetings
  if (isNewYear) return "Happy New Year! 🎉";
  if (isEaster) return "Happy Easter! 🐰";
  if (isChristmas) return "Merry Christmas! 🎄";
  if (isBoxingDay) return "Happy Boxing Day! 📦";
  if (isValentines) return "Happy Valentine's Day! 💝";
  if (isStPatricks) return "Happy St. Patrick's Day! ☘️";
  if (isMayDay) return "Happy May Day! 🌸";
  if (isHalloween) return "Happy Halloween! 🎃";
  if (isGuyFawkes) return "Remember, remember the 5th of November! 🔥";
  if (isRemembranceDay) return "Lest we forget. 🇬🇧";

  // Time of day greetings
  if (hour >= 5 && hour < 12) return "Good Morning! ☀️";
  if (hour >= 12 && hour < 17) return "Good Afternoon! 🌤️";
  if (hour >= 17 && hour < 21) return "Good Evening! 🌆";
  return "Good Night! 🌙";
};

/**
 * Calculate Easter date (simplified approximation)
 * @param {Date} date
 * @returns {boolean}
 */
const isEasterDate = (date) => {
  // Simplified Easter calculation (Western Christian)
  const year = date.getFullYear();
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;

  return date.getMonth() + 1 === month && date.getDate() === day;
};

