/**
 * Dashboard Service
 * Single Responsibility: Handle all data fetching for dashboard
 */

import { fetchTrainingClassesApi } from "@/features/admin/schedule/training-classes/api/trainingClassesApi";
import { getUserBookings } from "@/features/training-classes/api/bookingApi";
import { fetchClassSessions } from "@/features/training-classes/api/bookingApi";
import { fetchClassesApi } from "@/features/admin/schedule/class-types/api/classes-api";

/**
 * Fetch all dashboard data
 * @param {number} userId - User ID
 * @returns {Promise<{trainingClasses: Array, bookings: Array, classTypes: Array}>}
 */
export const fetchDashboardData = async (userId) => {
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

