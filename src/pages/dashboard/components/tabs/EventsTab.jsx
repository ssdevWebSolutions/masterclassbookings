/**
 * Events Tab Component
 * Single Responsibility: Display events/training classes tab
 */

"use client";

import { useState } from "react";
import { useRouter } from "next/router";
import { Box, Typography, CircularProgress, IconButton } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import BoltIcon from "@mui/icons-material/Bolt";


export default function EventsTab({ trainingClasses, loading }) {
  const router = useRouter();
  const [favorites, setFavorites] = useState(new Set());

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="40vh">
        <CircularProgress />
      </Box>
    );
  }

  const toggleFavorite = (id, e) => {
    e.stopPropagation();
    setFavorites(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return null;
    const date = new Date(dateStr);
    const day = date.getDate().toString().padStart(2, "0");
    const month = date.toLocaleDateString("en-GB", { month: "short" }).toUpperCase();
    return { day, month };
  };

  const formatFullDate = (dateStr) => {
    if (!dateStr) return "Date TBC";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  };

  return (
    <Box>
      <Typography variant="h5" fontWeight={700} sx={{ color: "accent.main", mb: 3, fontSize: { xs: "1.25rem", sm: "1.5rem" } }}>
        Training Classes
      </Typography>
      {trainingClasses.length === 0 ? (
        <Box
          p={4}
          textAlign="center"
          sx={{
            backgroundColor: "background.paper",
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 2,
          }}
        >
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            No training classes available
          </Typography>
        </Box>
      ) : (
        <Box display="grid" gap={3} sx={{ gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" } }}>
          {trainingClasses.map((tc, index) => {
            const classType = tc.classType?.className || tc.className || `Class ${tc.id}`;
            const venue = tc.venue?.venueName || "Venue TBC";
            const termStart = tc.term?.startDate;
            const dateInfo = formatDate(termStart);
            const fullDate = termStart ? formatFullDate(termStart) : "Date TBC";
            const price = "From £40";
            const organizer = "MasterClass Cricket";
            const category = tc.classType?.description ? "Cricket Training" : "Training";
            const eventImage = tc.imageUrl;
            const isFavorite = favorites.has(tc.id);
            
            return (
              <Box
                key={tc.id}
                sx={{
                  backgroundColor: "background.paper",
                  borderRadius: 3,
                  overflow: "hidden",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  border: "1px solid",
                  borderColor: "divider",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
                  },
                }}
                onClick={() => router.push(`/training-classes/${tc.id}/details`)}
              >
                <Box
                  sx={{
                    position: "relative",
                    width: "100%",
                    height: { xs: 180, sm: 220 },
                    backgroundImage: `url(${eventImage})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  {dateInfo && (
                    <Box
                      sx={{
                        position: "absolute",
                        top: 12,
                        left: 12,
                        backgroundColor: "white",
                        borderRadius: 1.5,
                        p: 1,
                        textAlign: "center",
                        minWidth: 50,
                      }}
                    >
                      <Typography
                        variant="h6"
                        fontWeight={700}
                        sx={{ color: "text.primary", fontSize: { xs: "1rem", sm: "1.25rem" }, lineHeight: 1 }}
                      >
                        {dateInfo.day}
                      </Typography>
                      <Box
                        sx={{
                          backgroundColor: "error.main",
                          borderRadius: 0.5,
                          px: 0.5,
                          py: 0.25,
                          mt: 0.5,
                        }}
                      >
                        <Typography
                          variant="caption"
                          sx={{
                            color: "white",
                            fontSize: { xs: "0.625rem", sm: "0.688rem" },
                            fontWeight: 600,
                          }}
                        >
                          {dateInfo.month}
                        </Typography>
                      </Box>
                    </Box>
                  )}

                  <IconButton
                    onClick={(e) => toggleFavorite(tc.id, e)}
                    sx={{
                      position: "absolute",
                      top: 12,
                      right: 12,
                      backgroundColor: "rgba(0,0,0,0.3)",
                      color: isFavorite ? "error.main" : "white",
                      p: 0.75,
                      "&:hover": {
                        backgroundColor: "rgba(0,0,0,0.5)",
                      },
                    }}
                  >
                    <FavoriteIcon sx={{ fontSize: { xs: 18, sm: 20 } }} />
                  </IconButton>

                  <Box
                    sx={{
                      position: "absolute",
                      bottom: 12,
                      right: 12,
                      backgroundColor: "info.main",
                      borderRadius: 2,
                      px: 1.5,
                      py: 0.5,
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{
                        color: "white",
                        fontSize: { xs: "0.688rem", sm: "0.75rem" },
                        fontWeight: 600,
                      }}
                    >
                      {category}
                    </Typography>
                  </Box>
                </Box>

                <Box p={2}>
                  <Typography
                    variant="h6"
                    fontWeight={700}
                    sx={{
                      color: "text.primary",
                      mb: 1.5,
                      fontSize: { xs: "1rem", sm: "1.125rem" },
                      lineHeight: 1.3,
                    }}
                  >
                    {classType}
                  </Typography>

                  <Box display="flex" flexDirection="column" gap={1} mb={2}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <LocationOnIcon sx={{ color: "text.secondary", fontSize: { xs: 16, sm: 18 } }} />
                      <Typography
                        variant="body2"
                        sx={{
                          color: "text.secondary",
                          fontSize: { xs: "0.813rem", sm: "0.875rem" },
                        }}
                      >
                        {venue}
                      </Typography>
                    </Box>
                    <Box display="flex" alignItems="center" gap={1}>
                      <CalendarTodayIcon sx={{ color: "text.secondary", fontSize: { xs: 16, sm: 18 } }} />
                      <Typography
                        variant="body2"
                        sx={{
                          color: "text.secondary",
                          fontSize: { xs: "0.813rem", sm: "0.875rem" },
                        }}
                      >
                        {fullDate}
                      </Typography>
                    </Box>
                    <Box display="flex" alignItems="center" gap={1}>
                      <AttachMoneyIcon sx={{ color: "text.secondary", fontSize: { xs: 16, sm: 18 } }} />
                      <Typography
                        variant="body2"
                        sx={{
                          color: "text.secondary",
                          fontSize: { xs: "0.813rem", sm: "0.875rem" },
                        }}
                      >
                        {price}
                      </Typography>
                    </Box>
                    <Box display="flex" alignItems="center" gap={1}>
                      <BoltIcon sx={{ color: "text.secondary", fontSize: { xs: 16, sm: 18 } }} />
                      <Typography
                        variant="body2"
                        sx={{
                          color: "text.secondary",
                          fontSize: { xs: "0.813rem", sm: "0.875rem" },
                        }}
                      >
                        By {organizer}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>
            );
          })}
        </Box>
      )}
    </Box>
  );
}

