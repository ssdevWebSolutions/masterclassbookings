"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Card,
  CardContent,
  Chip,
  TextField,
  InputAdornment,
  Stack,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Avatar,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AdminLayout from "@/pages/admin/AdminLayout";
import { fetchBookings } from "@/pages/api/attendaceapi/adminAttendanceApi";

export default function BookingsDetailsPage() {
  const [loading, setLoading] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

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

  const getFilteredAndSortedBookings = () => {
    let filtered = bookings.filter((booking) => {
      const search = searchQuery.toLowerCase();
      const searchMatch =
        booking.kidname?.toLowerCase().includes(search) ||
        booking.username?.toLowerCase().includes(search) ||
        booking.email?.toLowerCase().includes(search) ||
        booking.bookingId.toString().includes(search);

      const statusMatch =
        statusFilter === "all" ||
        (statusFilter === "confirmed" && booking.status === "CONFIRMED") ||
        (statusFilter === "pending" && booking.status === "PENDING_PAYMENT");

      return searchMatch && statusMatch;
    });

    // Sort
    if (sortBy === "newest") {
      filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortBy === "oldest") {
      filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    } else if (sortBy === "amount-high") {
      filtered.sort((a, b) => b.totalAmount - a.totalAmount);
    } else if (sortBy === "amount-low") {
      filtered.sort((a, b) => a.totalAmount - b.totalAmount);
    }

    return filtered;
  };

  const filteredBookings = getFilteredAndSortedBookings();

  const stats = {
    total: filteredBookings.length,
    confirmed: filteredBookings.filter((b) => b.status === "CONFIRMED").length,
    pending: filteredBookings.filter((b) => b.status === "PENDING_PAYMENT").length,
  };

  return (
    <AdminLayout activeNav="Bookings">
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
              All Bookings
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Complete booking details with all information
            </Typography>
          </Box>
        </Stack>

        {/* Filters */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          mb={3}
        >
          <TextField
            placeholder="Search by name, email, or booking ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            size="small"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ flex: 1, maxWidth: { sm: "400px" } }}
          />

          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={statusFilter}
              label="Status"
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <MenuItem value="all">All Status</MenuItem>
              <MenuItem value="confirmed">Confirmed</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Sort By</InputLabel>
            <Select
              value={sortBy}
              label="Sort By"
              onChange={(e) => setSortBy(e.target.value)}
            >
              <MenuItem value="newest">Newest First</MenuItem>
              <MenuItem value="oldest">Oldest First</MenuItem>
              <MenuItem value="amount-high">Amount: High to Low</MenuItem>
              <MenuItem value="amount-low">Amount: Low to High</MenuItem>
            </Select>
          </FormControl>
        </Stack>

        {loading && (
          <Box textAlign="center" py={5}>
            <CircularProgress sx={{ color: "accent.main" }} />
          </Box>
        )}

        {!loading && error && (
          <Typography color="error" mb={2}>
            Failed to load bookings
          </Typography>
        )}

        {!loading && !error && (
          <>
            {/* Stats Summary */}
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" },
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
                  <Typography variant="body2" color="text.secondary">
                    Total Bookings
                  </Typography>
                  <Typography variant="h4" fontWeight={700}>
                    {stats.total}
                  </Typography>
                </CardContent>
              </Card>

              <Card
                sx={{
                  background: "rgba(16, 185, 129, 0.1)",
                  border: "1px solid rgba(16, 185, 129, 0.2)",
                }}
              >
                <CardContent>
                  <Typography variant="body2" color="text.secondary">
                    Confirmed
                  </Typography>
                  <Typography variant="h4" fontWeight={700} color="#10b981">
                    {stats.confirmed}
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
                  <Typography variant="body2" color="text.secondary">
                    Pending Payment
                  </Typography>
                  <Typography variant="h4" fontWeight={700} color="#f59e0b">
                    {stats.pending}
                  </Typography>
                </CardContent>
              </Card>
            </Box>

            {/* Complete Bookings Table */}
            <Card
              sx={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <CardContent sx={{ p: 0 }}>
                {filteredBookings.length === 0 ? (
                  <Box sx={{ textAlign: "center", py: 5 }}>
                    <Typography color="text.secondary">
                      No bookings found
                    </Typography>
                  </Box>
                ) : (
                  <Box sx={{ overflowX: "auto" }}>
                    <Box component="table" sx={{ width: "100%", borderCollapse: "collapse", minWidth: "1400px" }}>
                      <Box component="thead">
                        <Box component="tr" sx={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                          <Box component="th" sx={headerCellStyle}>Booking ID</Box>
                          <Box component="th" sx={headerCellStyle}>Image</Box>
                          <Box component="th" sx={headerCellStyle}>Child Name</Box>
                          <Box component="th" sx={headerCellStyle}>Parent Name</Box>
                          <Box component="th" sx={headerCellStyle}>Email</Box>
                          <Box component="th" sx={headerCellStyle}>Phone</Box>
                          <Box component="th" sx={headerCellStyle}>Class ID</Box>
                          <Box component="th" sx={headerCellStyle}>User ID</Box>
                          <Box component="th" sx={headerCellStyle}>Session IDs</Box>
                          <Box component="th" sx={headerCellStyle}>Status</Box>
                          <Box component="th" sx={headerCellStyle}>Amount</Box>
                          <Box component="th" sx={headerCellStyle}>Created Date</Box>
                          <Box component="th" sx={headerCellStyle}>Description</Box>
                        </Box>
                      </Box>
                      <Box component="tbody">
                        {filteredBookings.map((booking) => (
                          <Box
                            component="tr"
                            key={booking.bookingId}
                            sx={{
                              borderBottom: "1px solid rgba(255,255,255,0.06)",
                              "&:hover": { background: "rgba(255,255,255,0.02)" },
                              transition: "background 0.2s",
                            }}
                          >
                            {/* Booking ID */}
                            <Box component="td" sx={bodyCellStyle}>
                              <Typography fontWeight={700} fontSize={14}>
                                #{booking.bookingId}
                              </Typography>
                            </Box>

                            {/* Image */}
                            <Box component="td" sx={bodyCellStyle}>
                              <Avatar
                                src={booking.imageUrl}
                                variant="rounded"
                                sx={{ width: 50, height: 50 }}
                              />
                            </Box>

                            {/* Child Name */}
                            <Box component="td" sx={bodyCellStyle}>
                              <Typography fontSize={14} fontWeight={600}>
                                {booking.kidname}
                              </Typography>
                            </Box>

                            {/* Parent Name */}
                            <Box component="td" sx={bodyCellStyle}>
                              <Typography fontSize={14}>
                                {booking.username || "—"}
                              </Typography>
                            </Box>

                            {/* Email */}
                            <Box component="td" sx={bodyCellStyle}>
                              <Typography fontSize={13} sx={{ wordBreak: "break-word", maxWidth: "200px" }}>
                                {booking.email || "—"}
                              </Typography>
                            </Box>

                            {/* Phone */}
                            <Box component="td" sx={bodyCellStyle}>
                              <Typography fontSize={14}>
                                {booking.phonenumber || "—"}
                              </Typography>
                            </Box>

                            {/* Training Class ID */}
                            <Box component="td" sx={bodyCellStyle}>
                              <Typography fontSize={14} fontWeight={600}>
                                {booking.trainingClassId}
                              </Typography>
                            </Box>

                            {/* User ID */}
                            <Box component="td" sx={bodyCellStyle}>
                              <Typography fontSize={14}>
                                {booking.userId}
                              </Typography>
                            </Box>

                            {/* Session IDs */}
                            <Box component="td" sx={bodyCellStyle}>
                              <Typography fontSize={13}>
                                {booking.sessionIds.join(", ")}
                              </Typography>
                            </Box>

                            {/* Status */}
                            <Box component="td" sx={{ ...bodyCellStyle, textAlign: "center" }}>
                              <Chip
                                label={booking.status === "CONFIRMED" ? "Confirmed" : "Pending"}
                                size="small"
                                sx={{
                                  backgroundColor:
                                    booking.status === "CONFIRMED"
                                      ? "rgba(16, 185, 129, 0.2)"
                                      : "rgba(245, 158, 11, 0.2)",
                                  color: booking.status === "CONFIRMED" ? "#10b981" : "#f59e0b",
                                  fontWeight: 600,
                                  fontSize: "12px",
                                  border:
                                    booking.status === "CONFIRMED"
                                      ? "1px solid rgba(16, 185, 129, 0.3)"
                                      : "1px solid rgba(245, 158, 11, 0.3)",
                                }}
                              />
                            </Box>

                            {/* Amount */}
                            <Box component="td" sx={{ ...bodyCellStyle, textAlign: "right" }}>
                              <Typography
                                fontSize={14}
                                fontWeight={700}
                                color={booking.status === "CONFIRMED" ? "#10b981" : "#f59e0b"}
                              >
                                ${booking.totalAmount.toFixed(2)}
                              </Typography>
                            </Box>

                            {/* Created Date */}
                            <Box component="td" sx={bodyCellStyle}>
                              <Typography fontSize={13} color="text.secondary">
                                {new Date(booking.createdAt).toLocaleDateString()}
                              </Typography>
                              <Typography fontSize={12} color="text.secondary">
                                {new Date(booking.createdAt).toLocaleTimeString()}
                              </Typography>
                            </Box>

                            {/* Description */}
                            <Box component="td" sx={bodyCellStyle}>
                              <Typography fontSize={13} sx={{ maxWidth: "250px" }}>
                                {booking.description}
                              </Typography>
                            </Box>
                          </Box>
                        ))}
                      </Box>
                    </Box>
                  </Box>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </Box>
    </AdminLayout>
  );
}

const headerCellStyle = {
  px: 2,
  py: 2,
  textAlign: "left",
  fontSize: "12px",
  fontWeight: 600,
  color: "text.secondary",
  textTransform: "uppercase",
  whiteSpace: "nowrap",
};

const bodyCellStyle = {
  px: 2,
  py: 2,
  fontSize: "14px",
  verticalAlign: "top",
};