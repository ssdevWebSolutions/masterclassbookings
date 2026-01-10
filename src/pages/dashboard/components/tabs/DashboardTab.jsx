"use client";

import { useState } from "react";
import { Box, Typography, CircularProgress, Card, CardContent, Button, TextField, InputAdornment } from "@mui/material";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import SearchIcon from "@mui/icons-material/Search";
import { formatDate, formatTime } from "../../../../../utils/formatUtils";


export default function DashboardTab({ bookings, loading, trainingClasses, router }) {
  const [searchQuery, setSearchQuery] = useState("");
  
  const upcomingBookings = bookings
    ?.filter(b => b.status === "CONFIRMED" || b.paymentStatus === true || b.paymentStatus === "true")
    .slice(0, 5) || [];
  const totalBookings = bookings?.length || 0;

  // Filter training classes based on search
  const filteredTrainingClasses = trainingClasses?.filter(tc => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    const className = (tc.classType?.className || tc.className || "").toLowerCase();
    const venue = (tc.venue?.venueName || "").toLowerCase();
    const description = (tc.classType?.description || "").toLowerCase();
    return className.includes(query) || venue.includes(query) || description.includes(query);
  }) || [];

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="40vh">
        <CircularProgress sx={{ color: "accent.main" }} />
      </Box>
    );
  }

  return (
    <Box sx={{ pb: 4 }}>
      {/* Search Bar */}
      <Box
        sx={{
          mb: 4,
        }}
      >
        <TextField
          fullWidth
          placeholder="Search training classes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: "text.secondary" }} />
              </InputAdornment>
            ),
          }}
          sx={{
            backgroundColor: "background.paper",
            borderRadius: 3,
            "& .MuiOutlinedInput-root": {
              border: "1px solid rgba(255,193,8,0.1)",
              "&:hover": {
                borderColor: "rgba(255,193,8,0.2)",
              },
              "&.Mui-focused": {
                borderColor: "primary.main",
              },
              "& fieldset": {
                border: "none",
              },
            },
            "& input": {
              color: "text.primary",
              py: 1.5,
            },
            "& input::placeholder": {
              color: "text.secondary",
            },
          }}
        />
      </Box>

      {/* Training Classes Section - Movie Style */}
      {filteredTrainingClasses && filteredTrainingClasses.length > 0 && (
        <Box>
          <Typography 
            variant="h5" 
            fontWeight={700} 
            sx={{ 
              color: "accent.main", 
              mb: 3,
              fontSize: { xs: "1.125rem", sm: "1.375rem" },
            }}
          >
            Recommended Training Classes
          </Typography>
          
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)", lg: "repeat(4, 1fr)" },
              gap: 2,
            }}
          >
            {filteredTrainingClasses.map((tc, index) => {
              const classType = tc.classType?.className || tc.className || `Class ${tc.id}`;
              const venue = tc.venue?.venueName || "Venue TBC";
              const termStart = tc.term?.startDate;
              const classImage = tc.imageUrl;
              console.log(classImage,"image");
              
              return (
                <Card
                  key={tc.id}
                  sx={{
                    borderRadius: 3,
                    overflow: "hidden",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    backgroundColor: "background.paper",
                    border: "1px solid rgba(255,193,8,0.1)",
                    "&:hover": {
                      transform: "translateY(-8px)",
                      boxShadow: "0 12px 32px rgba(255,193,8,0.25)",
                      borderColor: "primary.main",
                    },
                  }}
                  onClick={() => router.push(`/training-classes/${tc.id}/details`)}
                >
                  <Box
                    sx={{
                      position: "relative",
                      width: "100%",
                      height: 280,
                      backgroundImage: `url(${classImage})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      "&::before": {
                        content: '""',
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.8) 100%)",
                      },
                    }}
                  >
                    {/* Play Button Overlay */}
                    <Box
                      sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: 60,
                        height: 60,
                        borderRadius: "50%",
                        backgroundColor: "rgba(255,193,8,0.9)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        transition: "all 0.3s ease",
                        zIndex: 1,
                        "&:hover": {
                          backgroundColor: "primary.main",
                          transform: "translate(-50%, -50%) scale(1.1)",
                        },
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/training-classes/${tc.id}/details`);
                      }}
                    >
                      <PlayArrowIcon sx={{ color: "#000", fontSize: 32, ml: 0.5 }} />
                    </Box>

                    {/* Class Name Overlay */}
                    <Box
                      sx={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        right: 0,
                        p: 2,
                        background: "linear-gradient(to top, rgba(0,0,0,0.9) 0%, transparent 100%)",
                      }}
                    >
                      <Typography
                        variant="h6"
                        fontWeight={700}
                        sx={{
                          color: "#fff",
                          fontSize: "1rem",
                          lineHeight: 1.3,
                        }}
                      >
                        {classType}
                      </Typography>
                    </Box>
                  </Box>

                  <CardContent sx={{ p: 2 }}>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "text.secondary",
                        mb: 1.5,
                        fontSize: "0.813rem",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                      }}
                    >
                      {venue} • {termStart ? formatDate(termStart) : "Date TBC"}
                    </Typography>
                    <Button
                      variant="contained"
                      fullWidth
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/training-classes/${tc.id}/sessions`);
                      }}
                      sx={{
                        backgroundColor: "primary.main",
                        color: "#000",
                        py: 1,
                        fontWeight: 700,
                        borderRadius: 2,
                        "&:hover": {
                          backgroundColor: "accent.main",
                        },
                      }}
                    >
                      Book tickets
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </Box>
        </Box>
      )}

      {/* Upcoming Bookings Section */}
      <Box mb={5}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography 
            variant="h5" 
            fontWeight={700} 
            sx={{ 
              color: "accent.main", 
              fontSize: { xs: "1.125rem", sm: "1.375rem" },
            }}
          >
            Upcoming Bookings
          </Typography>
          {totalBookings > 0 && (
            <Box
              sx={{
                px: 2,
                py: 0.5,
                borderRadius: 2,
                backgroundColor: "primary.main",
                color: "#000",
                fontWeight: 700,
              }}
            >
              {totalBookings}
            </Box>
          )}
        </Box>
        {upcomingBookings.length === 0 ? (
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
              No upcoming bookings
            </Typography>
          </Box>
        ) : (
          <Box 
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)" },
              gap: 2,
            }}
          >
            {upcomingBookings.map((booking, index) => {
              const firstSession = booking.sessions?.[0];
              const sessionDate = firstSession?.date || firstSession?.sessionDate;
              const sessionTime = firstSession?.startTime || "Time TBC";
              const trainingClassName = booking.trainingClassName || `Class ${booking.trainingClassId}`;
              const venueName = booking.venueName || "Venue TBC";
              const bookingImage = booking.imageUrl;
              
              return (
                <Card
                  key={booking.bookingId}
                  sx={{
                    borderRadius: 3,
                    overflow: "hidden",
                    transition: "all 0.3s ease",
                    cursor: "pointer",
                    backgroundColor: "background.paper",
                    border: "1px solid rgba(255,193,8,0.1)",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: "0 8px 24px rgba(255,193,8,0.2)",
                      borderColor: "primary.main",
                    },
                  }}
                  onClick={() => router.push(`/training-classes/${booking.trainingClassId}/ticket?bookingId=${booking.bookingId}`)}
                >
                  <Box
                    sx={{
                      position: "relative",
                      height: 200,
                      backgroundImage: `url(${bookingImage})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      "&::before": {
                        content: '""',
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.7) 100%)",
                      },
                    }}
                  >
                    <Box
                      sx={{
                        position: "absolute",
                        top: 12,
                        right: 12,
                        px: 1.5,
                        py: 0.5,
                        borderRadius: 2,
                        backgroundColor: booking.status === "CONFIRMED" || booking.paymentStatus ? "primary.main" : "warning.main",
                        color: booking.status === "CONFIRMED" || booking.paymentStatus ? "#000" : "#fff",
                        fontWeight: 700,
                        fontSize: "0.75rem",
                      }}
                    >
                      {booking.status === "CONFIRMED" || booking.paymentStatus ? "CONFIRMED" : "PENDING"}
                    </Box>
                    <Box
                      sx={{
                        position: "absolute",
                        bottom: 12,
                        left: 12,
                        right: 12,
                      }}
                    >
                      <Typography
                        variant="h6"
                        fontWeight={700}
                        sx={{
                          color: "#fff",
                          mb: 0.5,
                          fontSize: "1rem",
                        }}
                      >
                        {trainingClassName}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          color: "rgba(255,255,255,0.8)",
                          fontSize: "0.75rem",
                        }}
                      >
                        {venueName}
                      </Typography>
                    </Box>
                  </Box>
                  
                  <CardContent sx={{ p: 2 }}>
                    <Box display="flex" flexDirection="column" gap={1}>
                      <Box display="flex" alignItems="center" gap={1}>
                        <CalendarTodayIcon sx={{ color: "accent.main", fontSize: 18 }} />
                        <Typography variant="body2" sx={{ color: "text.primary", fontSize: "0.813rem" }}>
                          {formatDate(sessionDate)}
                        </Typography>
                      </Box>
                      <Box display="flex" alignItems="center" gap={1}>
                        <AccessTimeIcon sx={{ color: "accent.main", fontSize: 18 }} />
                        <Typography variant="body2" sx={{ color: "text.primary", fontSize: "0.813rem" }}>
                          {formatTime(sessionTime)}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              );
            })}
          </Box>
        )}
      </Box>

      

      {filteredTrainingClasses.length === 0 && searchQuery && (
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
            No training classes found matching "{searchQuery}"
          </Typography>
        </Box>
      )}
    </Box>
  );
}
