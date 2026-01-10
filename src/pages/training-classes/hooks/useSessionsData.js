/**
 * Sessions Data Hook
 * Single Responsibility: Manage sessions data state and fetching
 */

import { useState, useEffect } from "react";
import { fetchSessionsData } from "../services/sessionsService";

/**
 * Custom hook for sessions data management
 * @param {string|number} classId - Training class ID
 * @returns {{trainingClass: Object|null, sessions: Array, loading: boolean, error: Error|null, refetch: Function}}
 */
 const useSessionsData = (classId) => {
  const [trainingClass, setTrainingClass] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    if (!classId) return;
    
    try {
      setLoading(true);
      setError(null);
      const result = await fetchSessionsData(classId);
      setTrainingClass(result.trainingClass);
      setSessions(result.sessions);
    } catch (err) {
      setError(err);
      console.error("Error in useSessionsData:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [classId]);

  return {
    trainingClass,
    sessions,
    loading,
    error,
    refetch: fetchData
  };
};

export default useSessionsData;

