/**
 * Session Selection Hook
 * Single Responsibility: Manage session selection state and logic
 */

import { useState, useMemo } from "react";

const CAPACITY = 36;

/**
 * Get availability status for a session
 * @param {number} bookedCount - Number of booked sessions
 * @returns {string}
 */
const getAvailabilityStatus = (bookedCount) => {
  const count = Number(bookedCount) || 0;
  if (count >= CAPACITY) return "not-available";
  if (count >= CAPACITY * 0.8) return "filling-fast";
  return "available";
};

/**
 * Custom hook for session selection management
 * @param {Array} sessions - Array of sessions
 * @returns {{selected: Array, toggleSession: Function, toggleAllSessionsInSlot: Function, groupedSessions: Array, pricing: Object}}
 */
export const useSessionSelection = (sessions = []) => {
  const [selected, setSelected] = useState([]);

  const toggleSession = (id, bookedCount) => {
    const status = getAvailabilityStatus(bookedCount);
    if (status === "not-available") return;

    setSelected((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id]
    );
  };

  const toggleAllSessionsInSlot = (slotSessions) => {
    const allSelected = slotSessions.every(s => 
      selected.includes(s.id) && getAvailabilityStatus(s.bookedCount) !== "not-available"
    );
    
    if (allSelected) {
      setSelected(prev => prev.filter(id => !slotSessions.some(s => s.id === id)));
    } else {
      const availableIds = slotSessions
        .filter(s => getAvailabilityStatus(s.bookedCount) !== "not-available")
        .map(s => s.id);
      setSelected(prev => [...new Set([...prev, ...availableIds])]);
    }
  };

  // Group sessions by day and time slot
  const groupedSessions = useMemo(() => {
    const timeSlotGroups = {};
    
    sessions.forEach((session) => {
      const date = new Date(session.date || session.sessionDate);
      if (isNaN(date.getTime())) return;
      
      const dayName = date.toLocaleDateString("en-GB", { weekday: "long" });
      const startTime = session.startTime || "";
      const endTime = session.endTime || "";
      const timeSlot = `${startTime} - ${endTime}`;
      const slotKey = `${dayName} - ${timeSlot}`;
      
      if (!timeSlotGroups[slotKey]) {
        timeSlotGroups[slotKey] = {
          dayName,
          timeSlot,
          startTime,
          endTime,
          sessions: []
        };
      }
      
      timeSlotGroups[slotKey].sessions.push({
        ...session,
        date,
        dateStr: date.toLocaleDateString("en-GB", { day: "numeric", month: "long" })
      });
    });
    
    Object.values(timeSlotGroups).forEach(group => {
      group.sessions.sort((a, b) => a.date - b.date);
    });
    
    return Object.values(timeSlotGroups).sort((a, b) => {
      const dayOrder = { "Sunday": 0, "Monday": 1, "Tuesday": 2, "Wednesday": 3, "Thursday": 4, "Friday": 5, "Saturday": 6 };
      const dayDiff = (dayOrder[a.dayName] || 99) - (dayOrder[b.dayName] || 99);
      if (dayDiff !== 0) return dayDiff;
      return (a.startTime || "").localeCompare(b.startTime || "");
    });
  }, [sessions]);

  // Pricing logic: 10 sessions = £350, else £40 per session
  const selectedCount = selected.length;
  const isFullBlock = selectedCount === 10;
  const regularPrice = selectedCount * 40;
  const discountAmount = isFullBlock ? 50 : 0;
  const finalPrice = isFullBlock ? 350 : regularPrice;

  const pricing = {
    selectedCount,
    isFullBlock,
    regularPrice,
    discountAmount,
    finalPrice
  };

  return {
    selected,
    setSelected,
    toggleSession,
    toggleAllSessionsInSlot,
    groupedSessions,
    pricing,
    getAvailabilityStatus
  };
};

