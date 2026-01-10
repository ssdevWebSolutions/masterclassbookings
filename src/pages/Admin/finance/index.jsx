"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Card,
  CardContent,
  Button,
  Stack,
  Chip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";

import { fetchBookings } from "@/pages/api/attendaceapi/adminAttendanceApi";
import AdminLayout from "../../adminlayouts";

export default function FinanceDashboard() {
  const [loading, setLoading] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    const loadBookings = async () => {
      try {
        setLoading(true);
        const data = await fetchBookings();
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

  const getFilteredBookings = () => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());

    return bookings.filter((booking) => {
      const bookingDate = new Date(booking.createdAt);
      
      const dateMatch = 
        filter === "all" ||
        (filter === "day" && bookingDate >= today) ||
        (filter === "week" && bookingDate >= weekAgo) ||
        (filter === "month" && bookingDate >= monthAgo);

      const statusMatch = 
        statusFilter === "all" ||
        (statusFilter === "confirmed" && booking.status === "CONFIRMED") ||
        (statusFilter === "pending" && booking.status === "PENDING_PAYMENT");

      return dateMatch && statusMatch;
    });
  };

  const filteredBookings = getFilteredBookings();

  const stats = {
    totalPayouts: filteredBookings
      .filter((b) => b.status === "CONFIRMED")
      .reduce((sum, b) => sum + b.totalAmount, 0),
    pendingPayouts: filteredBookings
      .filter((b) => b.status === "PENDING_PAYMENT")
      .reduce((sum, b) => sum + b.totalAmount, 0),
    confirmedCount: filteredBookings.filter((b) => b.status === "CONFIRMED").length,
    pendingCount: filteredBookings.filter((b) => b.status === "PENDING_PAYMENT").length,
    totalBookings: filteredBookings.length,
  };

  return (
    <AdminLayout activeNav="Finance">
      <Box sx={{ p: { xs: 2, md: 3 } }}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ sm: "center" }}
          gap={2}
          mb={3}
        >
          <Box>
            <Typography variant="h5" fontWeight={700}>
              Finance Dashboard
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Track payouts and revenue across all bookings
            </Typography>
          </Box>

          <Stack direction="row" spacing={2}>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Period</InputLabel>
              <Select
                value={filter}
                label="Period"
                onChange={(e) => setFilter(e.target.value)}
              >
                <MenuItem value="all">All Time</MenuItem>
                <MenuItem value="day">Today</MenuItem>
                <MenuItem value="week">This Week</MenuItem>
                <MenuItem value="month">This Month</MenuItem>
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                label="Status"
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="confirmed">Confirmed</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </Stack>

        {loading && (
          <Box textAlign="center" py={5}>
            <CircularProgress sx={{ color: "accent.main" }} />
          </Box>
        )}

        {!loading && error && (
          <Typography color="error" mb={2}>
            Failed to load finance data
          </Typography>
        )}

        {!loading && !error && (
          <>
            {/* Stats Cards */}
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "repeat(2, 1fr)",
                  md: "repeat(4, 1fr)",
                },
                gap: 2,
                mb: 3,
              }}
            >
              <Card
                sx={{
                  background: "rgba(16, 185, 129, 0.1)",
                  border: "1px solid rgba(16, 185, 129, 0.2)",
                }}
              >
                <CardContent>
                  <Typography variant="body2" color="text.secondary" mb={1}>
                    Total Revenue
                  </Typography>
                  <Typography variant="h4" fontWeight={700} color="#10b981">
                    ${stats.totalPayouts.toFixed(2)}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {stats.confirmedCount} confirmed
                  </Typography>
                </CardContent>
              </Card>

              <Card
                sx={{
                  background: "rgba(245, 158, 11, 0.1)",
                  border: "1px solid rgba(245, 158, 11, 0.2)",
                }}
              >
                <CardContent>
                  <Typography variant="body2" color="text.secondary" mb={1}>
                    Pending Payments
                  </Typography>
                  <Typography variant="h4" fontWeight={700} color="#f59e0b">
                    ${stats.pendingPayouts.toFixed(2)}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {stats.pendingCount} pending
                  </Typography>
                </CardContent>
              </Card>

              <Card
                sx={{
                  background: "rgba(37, 99, 235, 0.1)",
                  border: "1px solid rgba(37, 99, 235, 0.2)",
                }}
              >
                <CardContent>
                  <Typography variant="body2" color="text.secondary" mb={1}>
                    Total Bookings
                  </Typography>
                  <Typography variant="h4" fontWeight={700} color="#2563eb">
                    {stats.totalBookings}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    All statuses
                  </Typography>
                </CardContent>
              </Card>

              <Card
                sx={{
                  background: "rgba(99, 102, 241, 0.1)",
                  border: "1px solid rgba(99, 102, 241, 0.2)",
                }}
              >
                <CardContent>
                  <Typography variant="body2" color="text.secondary" mb={1}>
                    Average Booking
                  </Typography>
                  <Typography variant="h4" fontWeight={700} color="#6366f1">
                    ${stats.totalBookings > 0 
                      ? ((stats.totalPayouts + stats.pendingPayouts) / stats.totalBookings).toFixed(2)
                      : "0.00"}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Per booking
                  </Typography>
                </CardContent>
              </Card>
            </Box>

            {/* Transactions Table */}
            <Card
              sx={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <CardContent>
                <Typography variant="h6" fontWeight={700} mb={2}>
                  Recent Transactions
                </Typography>

                <Box sx={{ overflowX: "auto" }}>
                  <Box component="table" sx={{ width: "100%", borderCollapse: "collapse" }}>
                    <Box component="thead">
                      <Box component="tr" sx={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                        <Box
                          component="th"
                          sx={{
                            px: 2,
                            py: 2,
                            textAlign: "left",
                            fontSize: "12px",
                            fontWeight: 600,
                            color: "text.secondary",
                            textTransform: "uppercase",
                          }}
                        >
                          ID
                        </Box>
                        <Box
                          component="th"
                          sx={{
                            px: 2,
                            py: 2,
                            textAlign: "left",
                            fontSize: "12px",
                            fontWeight: 600,
                            color: "text.secondary",
                            textTransform: "uppercase",
                            display: { xs: "none", sm: "table-cell" },
                          }}
                        >
                          Child Name
                        </Box>
                        <Box
                          component="th"
                          sx={{
                            px: 2,
                            py: 2,
                            textAlign: "left",
                            fontSize: "12px",
                            fontWeight: 600,
                            color: "text.secondary",
                            textTransform: "uppercase",
                            display: { xs: "none", md: "table-cell" },
                          }}
                        >
                          Date
                        </Box>
                        <Box
                          component="th"
                          sx={{
                            px: 2,
                            py: 2,
                            textAlign: "center",
                            fontSize: "12px",
                            fontWeight: 600,
                            color: "text.secondary",
                            textTransform: "uppercase",
                          }}
                        >
                          Status
                        </Box>
                        <Box
                          component="th"
                          sx={{
                            px: 2,
                            py: 2,
                            textAlign: "right",
                            fontSize: "12px",
                            fontWeight: 600,
                            color: "text.secondary",
                            textTransform: "uppercase",
                          }}
                        >
                          Amount
                        </Box>
                      </Box>
                    </Box>
                    <Box component="tbody">
                      {filteredBookings.length === 0 ? (
                        <Box component="tr">
                          <Box component="td" colSpan={5} sx={{ textAlign: "center", py: 4 }}>
                            <Typography color="text.secondary">
                              No transactions found for this period
                            </Typography>
                          </Box>
                        </Box>
                      ) : (
                        filteredBookings.slice(0, 50).map((booking) => (
                          <Box
                            component="tr"
                            key={booking.bookingId}
                            sx={{
                              borderBottom: "1px solid rgba(255,255,255,0.06)",
                              "&:hover": { 
                                background: "rgba(255,255,255,0.02)",
                              },
                              transition: "background 0.2s",
                            }}
                          >
                            <Box component="td" sx={{ px: 2, py: 2, fontSize: "14px", fontWeight: 600 }}>
                              #{booking.bookingId}
                            </Box>
                            <Box
                              component="td"
                              sx={{
                                px: 2,
                                py: 2,
                                fontSize: "14px",
                                display: { xs: "none", sm: "table-cell" },
                              }}
                            >
                              {booking.kidname}
                            </Box>
                            <Box
                              component="td"
                              sx={{
                                px: 2,
                                py: 2,
                                fontSize: "14px",
                                color: "text.secondary",
                                display: { xs: "none", md: "table-cell" },
                              }}
                            >
                              {new Date(booking.createdAt).toLocaleDateString()}
                            </Box>
                            <Box component="td" sx={{ px: 2, py: 2, textAlign: "center" }}>
                              <Chip
                                label={booking.status === "CONFIRMED" ? "Paid" : "Pending"}
                                size="small"
                                sx={{
                                  backgroundColor:
                                    booking.status === "CONFIRMED" 
                                      ? "rgba(16, 185, 129, 0.2)" 
                                      : "rgba(245, 158, 11, 0.2)",
                                  color: booking.status === "CONFIRMED" ? "#10b981" : "#f59e0b",
                                  fontWeight: 600,
                                  fontSize: "12px",
                                  border: booking.status === "CONFIRMED" 
                                    ? "1px solid rgba(16, 185, 129, 0.3)" 
                                    : "1px solid rgba(245, 158, 11, 0.3)",
                                }}
                              />
                            </Box>
                            <Box
                              component="td"
                              sx={{
                                px: 2,
                                py: 2,
                                fontSize: "14px",
                                fontWeight: 700,
                                textAlign: "right",
                                color: booking.status === "CONFIRMED" ? "#10b981" : "#f59e0b",
                              }}
                            >
                              ${booking.totalAmount.toFixed(2)}
                            </Box>
                          </Box>
                        ))
                      )}
                    </Box>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </>
        )}
      </Box>
    </AdminLayout>
  );
}