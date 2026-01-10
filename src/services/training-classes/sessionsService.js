/**
 * Sessions Service
 * Single Responsibility: Handle all data fetching for training class sessions
 */

import { fetchTrainingClassById } from "@/pages/api/trainingclassesapi/trainingClassesApi";
import { fetchClassSessions } from "@/pages/api/bookingapi/bookingApi";

/**
 * Fetch training class and sessions data
 * @param {string|number} classId - Training class ID
 * @returns {Promise<{trainingClass: Object, sessions: Array}>}
 */
const fetchSessionsData = async (classId) => {
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

export { fetchSessionsData };

