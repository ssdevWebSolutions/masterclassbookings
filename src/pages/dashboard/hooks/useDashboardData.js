/**
 * Dashboard Data Hook
 * Single Responsibility: Manage dashboard data state and fetching
 */

import { useState, useEffect } from "react";
import { fetchDashboardData } from "../services/dashboardService";

/**
 * Custom hook for dashboard data management
 * @param {number} userId - User ID
 * @returns {{data: Object, loading: boolean, error: Error|null, refetch: Function}}
 */
 const useDashboardData = (userId) => {
  const [data, setData] = useState({
    trainingClasses: [],
    bookings: [],
    classTypes: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await fetchDashboardData(userId);
      setData(result);
    } catch (err) {
      setError(err);
      console.error("Error in useDashboardData:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchData();
    }
  }, [userId]);

  return {
    data,
    loading,
    error,
    refetch: fetchData
  };
};

export default useDashboardData;

