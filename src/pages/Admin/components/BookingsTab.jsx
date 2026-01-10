"use client";

import { useEffect, useState } from "react";

import { Box, Typography, CircularProgress, Alert } from "@mui/material";
import { fetchBookings } from "../schedule/attendance/api/adminAttendanceApi";

export default function BookingPage() {
  const [loading, setLoading] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadBookings = async () => {
      try {
        setLoading(true);

        const data = await fetchBookings();

        // 🔥 You asked to see response in console
        console.log("Bookings API response:", data);

        setBookings(data);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadBookings();
  }, []);

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        My Bookings
      </Typography>

      {loading && <CircularProgress size={24} />}

      {error && (
        <Alert severity="error">
          Failed to load bookings
        </Alert>
      )}

      {!loading && bookings.length > 0 && (
        <Alert severity="success">
          Bookings loaded successfully ✅  
          (Check console for full response)
        </Alert>
      )}

      {!loading && bookings.length === 0 && !error && (
        <Alert severity="info">
          No bookings found
        </Alert>
      )}
    </Box>
  );
}
