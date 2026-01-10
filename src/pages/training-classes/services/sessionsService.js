/**
 * Sessions Service
 * Single Responsibility: Handle all data fetching for training class sessions
 */

import { fetchTrainingClassById } from "@/pages/admin/schedule/training-classes/api/trainingClassesApi";
import { fetchClassSessions } from "../api/bookingApi";

/**
 * Fetch training class and sessions data
 * @param {string|number} classId - Training class ID
 * @returns {Promise<{trainingClass: Object, sessions: Array}>}
 */
export const fetchSessionsData = async (classId) => {
  try {
    const [classData, sessionsData] = await Promise.all([
      fetchTrainingClassById(classId),
      fetchClassSessions(classId)
    ]);
    
    return {
      trainingClass: classData,
      sessions: sessionsData || []
    };
  } catch (error) {
    console.error("Error fetching sessions data:", error);
    throw error;
  }
};

