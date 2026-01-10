"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Stack,
  Button,
  LinearProgress,
  Avatar,
  Chip,
} from "@mui/material";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import PeopleIcon from "@mui/icons-material/People";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import EventIcon from "@mui/icons-material/Event";
import PendingIcon from "@mui/icons-material/Pending";

import { fetchBookings, getTerms } from "@/pages/api/attendaceapi/adminAttendanceApi";
import AdminLayout from "../../../adminlayouts";

export default function AdminDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState([]);
  const [terms, setTerms] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [bookingsData, termsData] = await Promise.all([
          fetchBookings(),
          getTerms(),
        ]);
        setBookings(bookingsData);
        setTerms(termsData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Calculate statistics
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
  const monthAgo = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());

  const stats = {
    totalRevenue: bookings
      .filter((b) => b.status === "CONFIRMED")
      .reduce((sum, b) => sum + b.totalAmount, 0),
    pendingRevenue: bookings
      .filter((b) => b.status === "PENDING_PAYMENT")
      .reduce((sum, b) => sum + b.totalAmount, 0),
    totalBookings: bookings.length,
    confirmedBookings: bookings.filter((b) => b.status === "CONFIRMED").length,
    pendingBookings: bookings.filter((b) => b.status === "PENDING_PAYMENT").length,
    todayBookings: bookings.filter((b) => new Date(b.createdAt) >= today).length,
    weekBookings: bookings.filter((b) => new Date(b.createdAt) >= weekAgo).length,
    monthBookings: bookings.filter((b) => new Date(b.createdAt) >= monthAgo).length,
  };

  // Get unique students count
  const uniqueStudents = new Set(bookings.map((b) => b.kidname)).size;

  // Recent bookings (last 5)
  const recentBookings = [...bookings]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  // Attendance rate calculation (mock - you'd get this from actual attendance data)
  const attendanceRate = 87; // Mock percentage

  if (loading) {
    return (
      <AdminLayout activeNav="Dashboard">
        <Box sx={{ display: "flex", justifyContent: "center", p: 5 }}>
          <CircularProgress sx={{ color: "accent.main" }} />
        </Box>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout activeNav="Dashboard">
      <Box sx={{ p: { xs: 2, md: 3 } }}>
        {/* Header */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ sm: "center" }}
          gap={2}
          mb={3}
        >
          <Box>
            <Typography variant="h4" fontWeight={700}>
              Dashboard Overview
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Welcome back! Here's what's happening today.
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </Typography>
        </Stack>

        {/* Key Metrics - Row 1 */}
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
              background: "linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(16, 185, 129, 0.05) 100%)",
              border: "1px solid rgba(16, 185, 129, 0.3)",
            }}
          >
            <CardContent>
              <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={1}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: "12px",
                    background: "rgba(16, 185, 129, 0.2)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <AttachMoneyIcon sx={{ color: "#10b981", fontSize: 28 }} />
                </Box>
                <Chip
                  icon={<TrendingUpIcon sx={{ fontSize: 16 }} />}
                  label="+12%"
                  size="small"
                  sx={{
                    background: "rgba(16, 185, 129, 0.2)",
                    color: "#10b981",
                    fontWeight: 700,
                    fontSize: "11px",
                  }}
                />
              </Stack>
              <Typography variant="body2" color="text.secondary" mb={0.5}>
                Total Revenue
              </Typography>
              <Typography variant="h4" fontWeight={700} color="#10b981">
                ${stats.totalRevenue.toFixed(2)}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {stats.confirmedBookings} confirmed bookings
              </Typography>
            </CardContent>
          </Card>

          <Card
            sx={{
              background: "linear-gradient(135deg, rgba(245, 158, 11, 0.2) 0%, rgba(245, 158, 11, 0.05) 100%)",
              border: "1px solid rgba(245, 158, 11, 0.3)",
            }}
          >
            <CardContent>
              <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={1}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: "12px",
                    background: "rgba(245, 158, 11, 0.2)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <PendingIcon sx={{ color: "#f59e0b", fontSize: 28 }} />
                </Box>
              </Stack>
              <Typography variant="body2" color="text.secondary" mb={0.5}>
                Pending Payments
              </Typography>
              <Typography variant="h4" fontWeight={700} color="#f59e0b">
                ${stats.pendingRevenue.toFixed(2)}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {stats.pendingBookings} pending bookings
              </Typography>
            </CardContent>
          </Card>

          <Card
            sx={{
              background: "linear-gradient(135deg, rgba(37, 99, 235, 0.2) 0%, rgba(37, 99, 235, 0.05) 100%)",
              border: "1px solid rgba(37, 99, 235, 0.3)",
            }}
          >
            <CardContent>
              <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={1}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: "12px",
                    background: "rgba(37, 99, 235, 0.2)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <EventIcon sx={{ color: "#2563eb", fontSize: 28 }} />
                </Box>
                <Chip
                  icon={<TrendingUpIcon sx={{ fontSize: 16 }} />}
                  label="+5"
                  size="small"
                  sx={{
                    background: "rgba(37, 99, 235, 0.2)",
                    color: "#2563eb",
                    fontWeight: 700,
                    fontSize: "11px",
                  }}
                />
              </Stack>
              <Typography variant="body2" color="text.secondary" mb={0.5}>
                Total Bookings
              </Typography>
              <Typography variant="h4" fontWeight={700} color="#2563eb">
                {stats.totalBookings}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {stats.weekBookings} this week
              </Typography>
            </CardContent>
          </Card>

          <Card
            sx={{
              background: "linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, rgba(139, 92, 246, 0.05) 100%)",
              border: "1px solid rgba(139, 92, 246, 0.3)",
            }}
          >
            <CardContent>
              <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={1}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: "12px",
                    background: "rgba(139, 92, 246, 0.2)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <PeopleIcon sx={{ color: "#8b5cf6", fontSize: 28 }} />
                </Box>
              </Stack>
              <Typography variant="body2" color="text.secondary" mb={0.5}>
                Active Students
              </Typography>
              <Typography variant="h4" fontWeight={700} color="#8b5cf6">
                {uniqueStudents}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Unique enrollments
              </Typography>
            </CardContent>
          </Card>
        </Box>

        {/* Quick Stats - Row 2 */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
            gap: 2,
            mb: 3,
          }}
        >
          <Card
            sx={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <CardContent>
              <Typography variant="body2" color="text.secondary" mb={2}>
                Bookings Trend
              </Typography>
              <Stack spacing={1}>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2">Today</Typography>
                  <Typography variant="body2" fontWeight={700}>
                    {stats.todayBookings}
                  </Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2">This Week</Typography>
                  <Typography variant="body2" fontWeight={700}>
                    {stats.weekBookings}
                  </Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2">This Month</Typography>
                  <Typography variant="body2" fontWeight={700}>
                    {stats.monthBookings}
                  </Typography>
                </Stack>
              </Stack>
            </CardContent>
          </Card>

          <Card
            sx={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <CardContent>
              <Typography variant="body2" color="text.secondary" mb={2}>
                Attendance Rate
              </Typography>
              <Typography variant="h3" fontWeight={700} mb={1}>
                {attendanceRate}%
              </Typography>
              <LinearProgress
                variant="determinate"
                value={attendanceRate}
                sx={{
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: "rgba(255,255,255,0.1)",
                  "& .MuiLinearProgress-bar": {
                    backgroundColor: "#10b981",
                    borderRadius: 4,
                  },
                }}
              />
              <Typography variant="caption" color="text.secondary" mt={1}>
                Overall class attendance
              </Typography>
            </CardContent>
          </Card>

          <Card
            sx={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <CardContent>
              <Typography variant="body2" color="text.secondary" mb={2}>
                Active Terms
              </Typography>
              <Typography variant="h3" fontWeight={700} mb={1}>
                {terms.length}
              </Typography>
              <Button
                variant="outlined"
                size="small"
                onClick={() => router.push("/admin/schedule/attendance")}
                sx={{ mt: 1 }}
              >
                View All Terms
              </Button>
            </CardContent>
          </Card>
        </Box>

        {/* Recent Activity */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", lg: "2fr 1fr" },
            gap: 2,
          }}
        >
          {/* Recent Bookings */}
          <Card
            sx={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <CardContent>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                mb={2}
              >
                <Typography variant="h6" fontWeight={700}>
                  Recent Bookings
                </Typography>
                <Button
                  size="small"
                  onClick={() => router.push("/admin/bookings")}
                >
                  View All
                </Button>
              </Stack>

              <Stack spacing={2}>
                {recentBookings.map((booking) => (
                  <Box
                    key={booking.bookingId}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      p: 2,
                      borderRadius: "8px",
                      background: "rgba(255,255,255,0.02)",
                      border: "1px solid rgba(255,255,255,0.06)",
                      "&:hover": {
                        background: "rgba(255,255,255,0.04)",
                      },
                      transition: "background 0.2s",
                    }}
                  >
                    <Avatar
                      src={booking.imageUrl}
                      sx={{ width: 48, height: 48 }}
                    />
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body2" fontWeight={600}>
                        {booking.kidname}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {new Date(booking.createdAt).toLocaleDateString()} •{" "}
                        {booking.username || "No parent"}
                      </Typography>
                    </Box>
                    <Stack alignItems="flex-end" spacing={0.5}>
                      <Typography
                        variant="body2"
                        fontWeight={700}
                        color={
                          booking.status === "CONFIRMED" ? "#10b981" : "#f59e0b"
                        }
                      >
                        ${booking.totalAmount.toFixed(2)}
                      </Typography>
                      <Chip
                        label={booking.status === "CONFIRMED" ? "Paid" : "Pending"}
                        size="small"
                        sx={{
                          height: 20,
                          fontSize: "10px",
                          fontWeight: 600,
                          backgroundColor:
                            booking.status === "CONFIRMED"
                              ? "rgba(16, 185, 129, 0.2)"
                              : "rgba(245, 158, 11, 0.2)",
                          color:
                            booking.status === "CONFIRMED" ? "#10b981" : "#f59e0b",
                        }}
                      />
                    </Stack>
                  </Box>
                ))}
              </Stack>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card
            sx={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <CardContent>
              <Typography variant="h6" fontWeight={700} mb={2}>
                Quick Actions
              </Typography>
              <Stack spacing={1.5}>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={() => router.push("/admin/schedule/attendance")}
                  sx={{ justifyContent: "flex-start" }}
                >
                  Mark Attendance
                </Button>
                <Button
                  variant="outlined"
                  fullWidth
                  onClick={() => router.push("/admin/bookings")}
                  sx={{ justifyContent: "flex-start" }}
                >
                  View All Bookings
                </Button>
                <Button
                  variant="outlined"
                  fullWidth
                  onClick={() => router.push("/admin/finance")}
                  sx={{ justifyContent: "flex-start" }}
                >
                  Financial Reports
                </Button>
                <Button
                  variant="outlined"
                  fullWidth
                  sx={{ justifyContent: "flex-start" }}
                >
                  Manage Classes
                </Button>
              </Stack>

              <Box sx={{ mt: 3, pt: 3, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                <Typography variant="body2" color="text.secondary" mb={2}>
                  Payment Status
                </Typography>
                <Stack spacing={1}>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="caption" color="text.secondary">
                      Confirmed
                    </Typography>
                    <Typography variant="caption" fontWeight={700} color="#10b981">
                      {((stats.confirmedBookings / stats.totalBookings) * 100).toFixed(0)}%
                    </Typography>
                  </Stack>
                  <LinearProgress
                    variant="determinate"
                    value={(stats.confirmedBookings / stats.totalBookings) * 100}
                    sx={{
                      height: 6,
                      borderRadius: 3,
                      backgroundColor: "rgba(255,255,255,0.1)",
                      "& .MuiLinearProgress-bar": {
                        backgroundColor: "#10b981",
                        borderRadius: 3,
                      },
                    }}
                  />
                  <Stack direction="row" justifyContent="space-between" mt={1}>
                    <Typography variant="caption" color="text.secondary">
                      Pending
                    </Typography>
                    <Typography variant="caption" fontWeight={700} color="#f59e0b">
                      {((stats.pendingBookings / stats.totalBookings) * 100).toFixed(0)}%
                    </Typography>
                  </Stack>
                  <LinearProgress
                    variant="determinate"
                    value={(stats.pendingBookings / stats.totalBookings) * 100}
                    sx={{
                      height: 6,
                      borderRadius: 3,
                      backgroundColor: "rgba(255,255,255,0.1)",
                      "& .MuiLinearProgress-bar": {
                        backgroundColor: "#f59e0b",
                        borderRadius: 3,
                      },
                    }}
                  />
                </Stack>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </AdminLayout>
  );
}