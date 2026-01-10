/**
 * Bookings Tab Component - Professional Card Style
 * Single Responsibility: Display user bookings as compact cards with essential details
 */

"use client";

import { useRouter } from "next/router";
import { useState } from "react";
import { Box, Typography, CircularProgress, Button, Card, CardContent, Chip } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { formatDate, formatTime } from "../../../../../utils/formatUtils";
import { recheckPayment } from "@/pages/api/bookingapi/bookingApi";

export default function BookingsTab({ bookings, loading }) {
  const router = useRouter();
  const [recheckingId, setRecheckingId] = useState(null);
  
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="40vh">
        <CircularProgress sx={{ color: "accent.main" }} />
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" fontWeight={700} sx={{ color: "accent.main", fontSize: { xs: "1.25rem", sm: "1.5rem" } }}>
          My Bookings
        </Typography>
        <Box
          sx={{
            px: 2,
            py: 0.5,
            borderRadius: 2,
            backgroundColor: "rgba(255,193,8,0.15)",
            border: "1px solid rgba(255,193,8,0.3)",
          }}
        >
          <Typography variant="body2" sx={{ color: "accent.main", fontWeight: 600, fontSize: { xs: "0.75rem", sm: "0.875rem" } }}>
            {bookings.length} Total
          </Typography>
        </Box>
      </Box>
      
      {bookings.length === 0 ? (
        <Box
          p={4}
          textAlign="center"
          sx={{
            backgroundColor: "background.paper",
            border: "1px solid rgba(255,193,8,0.1)",
            borderRadius: 3,
          }}
        >
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            No bookings found
          </Typography>
        </Box>
      ) : (
        <Box 
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" },
            gap: 2,
          }}
        >
          {bookings.map((booking) => {
            const firstSession = booking.sessions?.[0];
            const sessionDate = firstSession?.date || firstSession?.sessionDate;
            const sessionTime = firstSession?.startTime || "Time TBC";
            const trainingClassName = booking.trainingClassName || `Class ${booking.trainingClassId}`;
            const venueName = booking.venueName || "MasterClass Cricket Academy";
            const isConfirmed = booking.status === "CONFIRMED" || booking.paymentStatus === true || booking.paymentStatus === "true";
            const isPending = !isConfirmed;
            
            return (
              <Card
                key={booking.bookingId}
                sx={{
                  backgroundColor: "#1a1a1a",
                  borderRadius: 3,
                  overflow: "hidden",
                  border: "1px solid rgba(255,193,8,0.2)",
                  transition: "all 0.3s ease",
                  cursor: "pointer",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: "0 8px 24px rgba(255,193,8,0.2)",
                    borderColor: "primary.main",
                  },
                }}
                onClick={() => router.push(`/training-classes/${booking.trainingClassId}/ticket?bookingId=${booking.bookingId}`)}
              >
                <CardContent sx={{ p: 2.5 }}>
                  {/* Header with Status */}
                  <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                    <Box flex={1}>
                      <Typography
                        variant="h6"
                        fontWeight={700}
                        sx={{
                          color: "#fff",
                          mb: 0.5,
                          fontSize: { xs: "1rem", sm: "1.125rem" },
                          lineHeight: 1.3,
                        }}
                      >
                        {trainingClassName}
                      </Typography>
                    </Box>
                    <Chip
                      icon={<CheckCircleIcon sx={{ fontSize: 16 }} />}
                      label={isConfirmed ? "Confirmed" : "Pending"}
                      size="small"
                      sx={{
                        backgroundColor: isConfirmed ? "rgba(0,200,83,0.2)" : "rgba(255,111,0,0.2)",
                        color: isConfirmed ? "#00c853" : "#ff6f00",
                        border: `1px solid ${isConfirmed ? "#00c853" : "#ff6f00"}`,
                        fontWeight: 600,
                        fontSize: "0.688rem",
                        height: 24,
                        "& .MuiChip-icon": {
                          color: isConfirmed ? "#00c853" : "#ff6f00",
                        },
                      }}
                    />
                  </Box>

                  {/* Essential Details */}
                  <Box display="flex" flexDirection="column" gap={1.5} mb={2.5}>
                    {/* Date */}
                    <Box display="flex" alignItems="center" gap={1}>
                      <CalendarTodayIcon sx={{ color: "#ffc108", fontSize: 18, flexShrink: 0 }} />
                      <Typography
                        variant="body2"
                        sx={{
                          color: "rgba(255,255,255,0.8)",
                          fontSize: "0.813rem",
                        }}
                      >
                        {sessionDate ? formatDate(sessionDate) : "Date TBC"}
                      </Typography>
                    </Box>

                    {/* Time */}
                    <Box display="flex" alignItems="center" gap={1}>
                      <AccessTimeIcon sx={{ color: "#ffc108", fontSize: 18, flexShrink: 0 }} />
                      <Typography
                        variant="body2"
                        sx={{
                          color: "rgba(255,255,255,0.8)",
                          fontSize: "0.813rem",
                        }}
                      >
                        {sessionTime ? formatTime(sessionTime) : "Time TBC"}
                      </Typography>
                    </Box>

                    {/* Venue */}
                    <Box display="flex" alignItems="flex-start" gap={1}>
                      <LocationOnIcon sx={{ color: "#ffc108", fontSize: 18, flexShrink: 0, mt: 0.25 }} />
                      <Typography
                        variant="body2"
                        sx={{
                          color: "rgba(255,255,255,0.8)",
                          fontSize: "0.813rem",
                          lineHeight: 1.4,
                        }}
                      >
                        {venueName}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Footer with Booking ID and View Ticket Button */}
                  <Box
                    sx={{
                      borderTop: "1px solid rgba(255,193,8,0.1)",
                      pt: 2,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{
                        color: "rgba(255,255,255,0.5)",
                        fontSize: "0.75rem",
                      }}
                    >
                      ID: #{booking.bookingId}
                    </Typography>
                    <Box display="flex" gap={1}>
                      {isPending && (
                        <Button
                          variant="outlined"
                          size="small"
                          disabled={recheckingId === booking.bookingId}
                          onClick={async (e) => {
                            e.stopPropagation();
                            try {
                              setRecheckingId(booking.bookingId);
                              const res = await recheckPayment(booking.bookingId);
                              if (res?.confirmed) {
                                await router.replace(router.asPath);
                              } else {
                                alert("Payment still pending. Please try again later.");
                              }
                            } catch (err) {
                              console.error(err);
                              alert("Failed to recheck payment");
                            } finally {
                              setRecheckingId(null);
                            }
                          }}
                          sx={{
                            borderColor: "#ffc108",
                            color: "#ffc108",
                            px: 1.5,
                            py: 0.5,
                            borderRadius: 2,
                            fontWeight: 600,
                            textTransform: "none",
                            fontSize: "0.75rem",
                            minWidth: "auto",
                            "&:hover": {
                              borderColor: "#ffc108",
                              backgroundColor: "rgba(255,193,8,0.1)",
                            },
                          }}
                        >
                          {recheckingId === booking.bookingId ? "Checking..." : "Recheck"}
                        </Button>
                      )}
                      <Button
                        variant="contained"
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/training-classes/${booking.trainingClassId}/ticket?bookingId=${booking.bookingId}`);
                        }}
                        sx={{
                          backgroundColor: "#ffc108",
                          color: "#000",
                          px: 2,
                          py: 0.5,
                          borderRadius: 2,
                          fontWeight: 700,
                          textTransform: "none",
                          fontSize: "0.75rem",
                          minWidth: "auto",
                          "&:hover": {
                            backgroundColor: "#d4af37",
                          },
                        }}
                      >
                        View Ticket
                      </Button>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            );
          })}
        </Box>
      )}
    </Box>
  );
}
