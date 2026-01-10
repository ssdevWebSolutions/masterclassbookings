/**
 * Session Utilities
 * Single Responsibility: Format and process session data
 */

/**
 * Format time string (remove seconds if present)
 * @param {string} timeStr - Time string
 * @returns {string}
 */
export const formatTime = (timeStr) => {
  if (!timeStr) return "";
  const parts = timeStr.split(":");
  if (parts.length >= 2) {
    const hour = parseInt(parts[0]);
    const min = parts[1];
    return `${hour}:${min}`;
  }
  return timeStr;
};

/**
 * Format slot label
 * @param {Object} slotGroup - Slot group object
 * @returns {string}
 */
export const formatSlotLabel = (slotGroup) => {
  const timeDisplay = `${formatTime(slotGroup.startTime)}-${formatTime(slotGroup.endTime)}`;
  return `${slotGroup.dayName} slots ${slotGroup.sessions.length} - ${timeDisplay}`;
};

