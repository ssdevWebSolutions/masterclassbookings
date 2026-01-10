/**
 * Dashboard Service
 * Single Responsibility: Handle all data fetching for dashboard
 */

import { fetchTrainingClassesApi } from "@/pages/api/trainingclassesapi/trainingClassesApi";
import { getUserBookings } from "@/pages/api/bookingapi/bookingApi";
import { fetchClassSessions } from "@/pages/api/bookingapi/bookingApi";
import { fetchClassesApi } from "@/pages/api/classtypesapi/classes-api";

/**
 * Fetch all dashboard data
 * @param {number} userId - User ID
 * @returns {Promise<{trainingClasses: Array, bookings: Array, classTypes: Array}>}
 */
 const fetchDashboardData = async (userId) => {
  try {
    const [classes, userBookings, classTypesData] = await Promise.all([
      fetchTrainingClassesApi(),
      userId ? getUserBookings(userId) : Promise.resolve([]),
      fetchClassesApi().catch(() => [])
    ]);

    // Fetch session details for each booking
    const bookingsWithSessions = await Promise.all(
      (userBookings || []).map(async (booking) => {
        try {
          const allSessions = await fetchClassSessions(booking.trainingClassId);
          const bookingSessions = (allSessions || []).filter(session => 
            booking.sessionIds && booking.sessionIds.includes(session.id)
          );
          
          return {
            ...booking,
            sessions: bookingSessions
          };
        } catch (error) {
          console.error(`Error fetching sessions for booking ${booking.bookingId}:`, error);
          return { ...booking, sessions: [] };
        }
      })
    );

    return {
      trainingClasses: classes || [],
      bookings: bookingsWithSessions,
      classTypes: classTypesData || []
    };
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    throw error;
  }
};

export { fetchDashboardData };
