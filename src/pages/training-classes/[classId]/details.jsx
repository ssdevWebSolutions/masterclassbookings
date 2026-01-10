/**
 * Training Class Details Page - Movie Style
 * Single Responsibility: Display event details for a training class
 */

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { Box, Typography, Button, Chip, IconButton } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ShareIcon from "@mui/icons-material/Share";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import DashboardLayout from "@/pages/admin/components/DashboardLayout";
import UserSidebar from "@/pages/dashboard/components/UserSidebar";
import UserHeader from "@/pages/dashboard/components/UserHeader";
import { getGreeting } from "@/utils/greetingUtils";
import { fetchTrainingClassById } from "@/pages/api/trainingclassesapi/trainingClassesApi";
import { formatDate, formatTermDateRange } from "../../../../utils/formatUtils";

// Get cricket images from Unsplash
const getCricketImage = (index) => {
  const images = [
    "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1576678927484-cc907957088c?w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800&auto=format&fit=crop",
  ];
  return images[index % images.length];
};

export default function TrainingClassDetailsPage() {
  const router = useRouter();
  const { classId } = router.query;
  const loginData = useSelector((state) => state.auth.loginData);
  const token = loginData?.token;
  const userName = loginData?.fullName || loginData?.name || "User";

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [trainingClass, setTrainingClass] = useState(null);
  const [loading, setLoading] = useState(true);
  const [greeting, setGreeting] = useState("");
  const [selectedFormat, setSelectedFormat] = useState("2D");

  useEffect(() => {
    setGreeting(getGreeting());
  }, []);

  useEffect(() => {
    if (!classId) return;
    const fetchData = async () => {
      try {
        const data = await fetchTrainingClassById(classId);
        setTrainingClass(data);
      } catch (error) {
        console.error("Error fetching training class:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [classId]);

  if (!token) {
    router.push("/");
    return null;
  }

  if (loading) {
    return (
      <DashboardLayout
        sidebar={<UserSidebar sidebarOpen={false} profileDropdownOpen={false} onCloseSidebar={() => { }} onProfileDropdownToggle={() => { }} loginData={loginData} />}
        header={<UserHeader activeNav="Event Details" onMenuToggle={() => { }} greeting={greeting} userName={userName} />}
        sidebarOpen={false}
        onOverlayClick={() => { }}
      >
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <Typography sx={{ color: "text.primary" }}>Loading...</Typography>
        </Box>
      </DashboardLayout>
    );
  }

  const classType = trainingClass?.classType?.className || trainingClass?.className || "Training Class";
  const description = trainingClass?.description || "Professional cricket training sessions designed to enhance your skills and technique. Join our expert coaches for an intensive learning experience.";
  const venue = trainingClass.venueName || "MasterClass Cricket Academy";
  const venueAddress = trainingClass?.venue?.address || trainingClass?.venue?.venueAddress || "";
  const term = trainingClass?.termName;
  const termDateRange = formatTermDateRange(term);
  const termStartDate = term?.startDate ? formatDate(term.startDate) : "";
  const termEndDate = term?.endDate ? formatDate(term.endDate) : "";
  const eventImage = trainingClass.imageUrl;


  // Format duration (mock data - you can get from API)
  const duration = "90 Minutes";
  const rating = "4.8/5";
  const reviews = "2.9k";

  return (
    <DashboardLayout
      sidebar={
        <UserSidebar
          sidebarOpen={sidebarOpen}
          profileDropdownOpen={profileDropdownOpen}
          onCloseSidebar={() => setSidebarOpen(false)}
          onProfileDropdownToggle={() => setProfileDropdownOpen(!profileDropdownOpen)}
          loginData={loginData}
        />
      }
      header={
        <UserHeader
          activeNav={classType}
          onMenuToggle={() => setSidebarOpen(true)}
          greeting={greeting}
          userName={userName}
        />
      }
      sidebarOpen={sidebarOpen}
      onOverlayClick={() => setSidebarOpen(false)}
    >
      <Box sx={{ position: "relative", minHeight: "100vh" }}>
        {/* Hero Image with Overlay */}
        <Box
          sx={{
            position: "relative",
            width: "100%",
            height: { xs: "50vh", md: "60vh" },
            backgroundImage: `url(${eventImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.7) 100%)",
            },
          }}
        >
          {/* Play Button */}


          {/* Title Overlay */}
          <Box
            sx={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              p: 3,
              background: "linear-gradient(to top, rgba(0,0,0,0.9) 0%, transparent 100%)",
            }}
          >
            <Typography
              variant="h3"
              fontWeight={700}
              sx={{
                color: "#fff",
                fontSize: { xs: "1.75rem", sm: "2.5rem" },
                mb: 1,
                textTransform: "uppercase",
                letterSpacing: 1,
              }}
            >
              {classType}
            </Typography>
          </Box>
        </Box>

        {/* White Content Section */}
        <Box
          sx={{
            backgroundColor: "#ffffff",
            borderRadius: "24px 24px 0 0",
            mt: -3,
            position: "relative",
            zIndex: 2,
            p: 3,
          }}
        >
          {/* Format/Language Options */}
          {/* <Box display="flex" gap={1} mb={3}>
            {["2D", "3D", "Beginner, Advanced"].map((format) => (
              <Chip
                key={format}
                label={format}
                onClick={() => setSelectedFormat(format)}
                sx={{
                  backgroundColor: selectedFormat === format ? "primary.main" : "transparent",
                  color: selectedFormat === format ? "#000" : "#666",
                  fontWeight: 600,
                  border: selectedFormat === format ? "none" : "1px solid #e0e0e0",
                  "&:hover": {
                    backgroundColor: selectedFormat === format ? "primary.main" : "rgba(255,193,8,0.1)",
                  },
                }}
              />
            ))}
          </Box> */}

          {/* Key Details */}
          <Box display="flex" alignItems="center" gap={3} mb={3}>
            <Typography variant="body2" sx={{ color: "#666", fontWeight: 500 }}>
              Durarion : {duration}
            </Typography>
            {/* <Box display="flex" alignItems="center" gap={0.5}>
              <Typography variant="body2" sx={{ color: "#ffc108", fontWeight: 700 }}>
                ⭐ {rating}
              </Typography>
              <Typography variant="caption" sx={{ color: "#999" }}>
                from {reviews} reviews
              </Typography>
            </Box> */}
          </Box>

          {/* Class Type, Term, and Venue Details */}
          <Box mb={3}>
            <Box display="flex" flexDirection="column" gap={2}>
              {/* Class Type */}
              {/* <Box>
                <Typography variant="caption" sx={{ color: "#999", fontSize: "0.75rem", textTransform: "uppercase", mb: 0.5, display: "block" }}>
                  Class Type
                </Typography>
                <Typography variant="body1" fontWeight={600} sx={{ color: "#000" }}>
                  {classType}
                </Typography>
              </Box> */}

              {/* Term Details */}
              {term && (
                <Box>
                  <Typography variant="caption" sx={{ color: "#999", fontSize: "0.75rem", textTransform: "uppercase", mb: 0.5, display: "block" }}>
                    Term
                  </Typography>
                  <Typography variant="body1" fontWeight={600} sx={{ color: "#000", mb: 0.5 }}>
                    {term || "Current Term"}
                  </Typography>
                  {termDateRange && (
                    <Typography variant="body2" sx={{ color: "#666" }}>
                      {termDateRange}
                    </Typography>
                  )}
                  {termStartDate && termEndDate && (
                    <Box display="flex" alignItems="center" gap={1} mt={0.5}>
                      <CalendarTodayIcon sx={{ color: "#ffc108", fontSize: 18 }} />
                      <Typography variant="body2" sx={{ color: "#666" }}>
                        {termStartDate} - {termEndDate}
                      </Typography>
                    </Box>
                  )}
                </Box>
              )}

              {/* Venue Details */}
              <Box>
                <Typography variant="caption" sx={{ color: "#999", fontSize: "0.75rem", textTransform: "uppercase", mb: 0.5, display: "block" }}>
                  Venue
                </Typography>
                <Box display="flex" alignItems="flex-start" gap={1}>
                  <LocationOnIcon sx={{ color: "#ffc108", fontSize: 20, mt: 0.5 }} />
                  <Box>
                    <Typography variant="body1" fontWeight={600} sx={{ color: "#000" }}>
                      {venue}
                    </Typography>
                    {venueAddress && (
                      <Typography variant="body2" sx={{ color: "#666" }}>
                        {venueAddress}
                      </Typography>
                    )}
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>

          {/* Synopsis */}
          <Box mb={3}>
            <Typography variant="h6" fontWeight={600} sx={{ color: "#000", mb: 1 }}>
              About
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: "#333",
                lineHeight: 1.8,
                fontSize: "0.938rem",
              }}
            >
              {description}
            </Typography>
          </Box>

          {/* Cast Section */}

          {/* ================= WEEKLY SCHEDULE ================= */}
          <Box mb={3}>
            <Typography
              variant="h6"
              fontWeight={600}
              sx={{ color: "#000", mb: 1.5 }}
            >
              Weekly Schedule
            </Typography>

            <Box
              sx={{
                border: "1px solid #eee",
                borderRadius: 2,
                overflow: "hidden",
              }}
            >
              {trainingClass?.weeklyPlans?.map((plan, index) => (
                <Box
                  key={plan.dayOfWeek}
                  sx={{
                    borderBottom:
                      index !== trainingClass.weeklyPlans.length - 1
                        ? "1px solid #eee"
                        : "none",
                    p: 2,
                    backgroundColor: "#fafafa",
                  }}
                >
                  {/* Day */}
                  <Typography
                    variant="subtitle2"
                    sx={{
                      fontWeight: 700,
                      color: "#000",
                      mb: 1,
                      textTransform: "uppercase",
                      letterSpacing: 0.5,
                    }}
                  >
                    {plan.dayOfWeek}
                  </Typography>

                  {/* Slots */}
                  <Box display="flex" flexWrap="wrap" gap={1}>
                    {plan.slots.map((slot, idx) => (
                      <Box
                        key={idx}
                        sx={{
                          px: 1.5,
                          py: 0.75,
                          borderRadius: 1.5,
                          backgroundColor: "rgba(255,193,8,0.15)",
                          border: "1px solid rgba(255,193,8,0.4)",
                        }}
                      >
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 600,
                            color: "#000",
                            fontSize: "0.813rem",
                          }}
                        >
                          {slot.startTime} – {slot.endTime}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>


          {/* Book Tickets Button */}
          <Button
            variant="contained"
            fullWidth
            size="large"
            onClick={() => router.push(`/training-classes/${classId}/sessions`)}
            sx={{
              backgroundColor: "#ffc108",
              color: "#000",
              py: 1.5,
              fontSize: "1.125rem",
              fontWeight: 700,
              borderRadius: 2,
              textTransform: "none",
              "&:hover": {
                backgroundColor: "#d4af37",
              },
            }}
          >
            Book tickets
          </Button>
        </Box>
      </Box>
    </DashboardLayout>
  );
}
