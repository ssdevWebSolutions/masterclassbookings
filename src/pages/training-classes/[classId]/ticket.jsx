/**
 * Booking Ticket Page - Printing Animation Style
 * Single Responsibility: Display booking ticket with printing animation
 */

"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { useSelector } from "react-redux";
import { Box, Typography, IconButton } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DownloadIcon from "@mui/icons-material/Download";
import ShareIcon from "@mui/icons-material/Share";
import SportsCricketIcon from "@mui/icons-material/SportsCricket";
import DashboardLayout from "@/pages/admin/components/DashboardLayout";
import UserSidebar from "@/pages/dashboard/components/UserSidebar";
import UserHeader from "@/pages/dashboard/components/UserHeader";
import { getGreeting } from "@/utils/greetingUtils";
import { getUserBookings } from "@/pages/api/bookingapi/bookingApi";
import { fetchClassSessions } from "@/pages/api/bookingapi/bookingApi";
import Barcode from "react-barcode";
import html2canvas from "html2canvas";

export default function BookingTicketPage() {
  const router = useRouter();
  const { classId, bookingId } = router.query;
  const loginData = useSelector((state) => state.auth.loginData);
  const token = loginData?.token;
  const userId = loginData?.id;
  const userName = loginData?.fullName || loginData?.name || "User";

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [greeting, setGreeting] = useState("");
  const ticketRef = useRef(null);

  useEffect(() => {
    setGreeting(getGreeting());
  }, []);

  useEffect(() => {
    if (!bookingId || !userId) return;
    const fetchData = async () => {
      try {
        const bookings = await getUserBookings(userId);
        const foundBooking = bookings.find(b => b.bookingId === Number(bookingId));
        if (foundBooking) {
          const sessions = await fetchClassSessions(foundBooking.trainingClassId);
          const bookingSessions = (sessions || []).filter(session => 
            foundBooking.sessionIds && foundBooking.sessionIds.includes(session.id)
          );
          setBooking({
            ...foundBooking,
            sessions: bookingSessions
          });
        }
      } catch (error) {
        console.error("Error fetching booking:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [bookingId, userId]);

  const handleDownload = async () => {
    const ticketElement = ticketRef.current;
    if (!ticketElement) return;

    try {
      const canvas = await html2canvas(ticketElement, {
        backgroundColor: "#0f0f0f",
        scale: 2,
        useCORS: true,
      });
      const link = document.createElement("a");
      link.download = `MCCA-${bookingId}-ticket.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (error) {
      console.error("Error downloading ticket:", error);
      alert("Failed to download ticket");
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: `Booking Ticket MCCA-${bookingId}`,
      text: `Check out my booking ticket for ${booking?.trainingClassName || "Training Class"}`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert("Link copied to clipboard!");
      }
    } catch (error) {
      if (error.name !== "AbortError") {
        await navigator.clipboard.writeText(window.location.href);
        alert("Link copied to clipboard!");
      }
    }
  };

  const formatFullDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", 
                    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const formatDateTime = (dateString, timeString) => {
    if (!dateString) return "TBC";
    const date = formatFullDate(dateString);
    if (!timeString) return date;
    const [hours, minutes] = timeString.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;
    return `${date} ${displayHour}:${minutes} ${ampm}`;
  };

  const formatTime = (timeString) => {
    if (!timeString) return "TBC";
    const [hours, minutes] = timeString.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  if (!token) {
    router.push("/");
    return null;
  }

  if (loading) {
    return (
      <DashboardLayout
        sidebar={
          <UserSidebar
            sidebarOpen={false}
            profileDropdownOpen={false}
            onCloseSidebar={() => {}}
            onProfileDropdownToggle={() => {}}
            loginData={loginData}
          />
        }
        header={
          <UserHeader
            activeNav="Your Ticket"
            onMenuToggle={() => {}}
            greeting={greeting}
            userName={userName}
          />
        }
        sidebarOpen={false}
        onOverlayClick={() => {}}
      >
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <Typography sx={{ color: "text.primary" }}>Loading...</Typography>
        </Box>
      </DashboardLayout>
    );
  }

  if (!booking) {
    return (
      <DashboardLayout
        sidebar={
          <UserSidebar
            sidebarOpen={false}
            profileDropdownOpen={false}
            onCloseSidebar={() => {}}
            onProfileDropdownToggle={() => {}}
            loginData={loginData}
          />
        }
        header={
          <UserHeader
            activeNav="Your Ticket"
            onMenuToggle={() => {}}
            greeting={greeting}
            userName={userName}
          />
        }
        sidebarOpen={false}
        onOverlayClick={() => {}}
      >
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <Typography sx={{ color: "text.primary" }}>Booking not found</Typography>
        </Box>
      </DashboardLayout>
    );
  }

  const trainingClassName = booking.trainingClassName || `Class ${booking.trainingClassId}`;
  const formattedBookingId = booking.bookingId?.toString() || "";
  const sessionCount = booking.sessions?.length || booking.sessionIds?.length || 0;
  
  // Get first session date and time for display
  const firstSession = booking.sessions?.[0];
  const displayDate = firstSession?.date || firstSession?.sessionDate || booking.createdAt;
  const displayTime = firstSession?.startTime || "";

  // Get venue information if available
  const venueName = booking.venueName || "MasterClass Cricket Academy";
  const venueShort = venueName.split(" ")[0] || "MCCA";

  return (
    <>
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Ubuntu:wght@300;400;500;700&display=swap" rel="stylesheet" />
        <style dangerouslySetInnerHTML={{
          __html: `
            @keyframes ticketPrint {
              0% {
                transform: translateY(-510px);
              }
              35% {
                transform: translateY(-395px);
              }
              70% {
                transform: translateY(-140px);
              }
              100% {
                transform: translateY(0);
              }
            }
          `
        }} />
      </Head>
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
          <Box
            sx={{
              height: 60,
              px: 2,
              backgroundColor: "background.default",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              borderBottom: "1px solid rgba(255,193,8,0.12)",
            }}
          >
            <IconButton onClick={() => router.push("/dashboard?tab=bookings")} sx={{ color: "#fff" }}>
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="subtitle1" sx={{ color: "#fff", fontWeight: 600 }}>
              Your ticket
            </Typography>
            <Box display="flex" gap={0.5}>
              <IconButton onClick={handleDownload} sx={{ color: "#fff" }}>
                <DownloadIcon />
              </IconButton>
              <IconButton onClick={handleShare} sx={{ color: "#fff" }}>
                <ShareIcon />
              </IconButton>
            </Box>
          </Box>
        }
        sidebarOpen={sidebarOpen}
        onOverlayClick={() => setSidebarOpen(false)}
      >
      <Box
        ref={ticketRef}
        sx={{
          minHeight: "100vh",
          backgroundColor: "#0f0f0f",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          py: 4,
          px: 2,
          fontFamily: "'Ubuntu', sans-serif",
        }}
      >
        <Box
          sx={{
            maxWidth: { xs: "100%", sm: 385 },
            width: "100%",
          }}
        >
          {/* Top Section with Title and Printer */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              flexDirection: "column",
              mb: 2,
            }}
          >
            <Typography
              sx={{
                fontWeight: 400,
                fontSize: { xs: "1.2em", sm: "1.6em" },
                textAlign: "left",
                ml: { xs: 2, sm: 2.5 },
                mb: { xs: 4, sm: 6.25 },
                color: "#fff",
                width: "100%",
              }}
            >
              Wait a second, your ticket is being printed
            </Typography>
            <Box
              sx={{
                width: "90%",
                height: 20,
                border: "5px solid #fff",
                borderRadius: "10px",
                boxShadow: "1px 3px 3px 0px rgba(0, 0, 0, 0.2)",
              }}
            />
          </Box>

          {/* Receipts Wrapper */}
          <Box
            sx={{
              overflow: "hidden",
              mt: "-10px",
              pb: "10px",
            }}
          >
            <Box
              sx={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                flexDirection: "column",
                transform: "translateY(-510px)",
                animation: "ticketPrint 2.5s ease-in-out 0.5s forwards",
              }}
            >
              {/* Main Receipt */}
              <Box
                sx={{
                  p: { xs: "20px 25px", sm: "25px 30px" },
                  textAlign: "left",
                  minHeight: 200,
                  width: "88%",
                  backgroundColor: "#fff",
                  borderRadius: "10px 10px 20px 20px",
                  boxShadow: "1px 3px 8px 3px rgba(0, 0, 0, 0.2)",
                  mb: 2,
                }}
              >
                {/* Logo */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    mb: 2,
                  }}
                >
                  <SportsCricketIcon sx={{ color: "#ffc108", fontSize: 40 }} />
                  <Typography
                    sx={{
                      fontWeight: 700,
                      fontSize: "1.2rem",
                      color: "#000",
                    }}
                  >
                    MasterClass Cricket
                  </Typography>
                </Box>

                {/* Route/Class Info */}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    my: 3.75,
                  }}
                >
                  <Typography
                    sx={{
                      fontWeight: 300,
                      fontSize: { xs: "1.8em", sm: "2.2em" },
                      margin: 0,
                      color: "#000",
                    }}
                  >
                    {trainingClassName.length > 8 ? trainingClassName.substring(0, 8) : trainingClassName}
                  </Typography>
                  <SportsCricketIcon
                    sx={{
                      width: 30,
                      height: 30,
                      color: "#ffc108",
                      transform: "rotate(45deg)",
                    }}
                  />
                  <Typography
                    sx={{
                      fontWeight: 300,
                      fontSize: { xs: "1.8em", sm: "2.2em" },
                      margin: 0,
                      color: "#000",
                    }}
                  >
                    {venueShort}
                  </Typography>
                </Box>

                {/* Details Grid */}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      minWidth: { xs: "45%", sm: 70 },
                      mb: { xs: 2, sm: 0 },
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: "0.8em",
                        color: "rgba(28, 28, 28, .7)",
                        fontWeight: 500,
                      }}
                    >
                      Participant
                    </Typography>
                    <Typography
                      sx={{
                        mt: 1.25,
                        mb: 3.125,
                        fontWeight: 600,
                        color: "#000",
                        fontSize: "0.938rem",
                      }}
                    >
                      {userName}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      minWidth: { xs: "45%", sm: 70 },
                      mb: { xs: 2, sm: 0 },
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: "0.8em",
                        color: "rgba(28, 28, 28, .7)",
                        fontWeight: 500,
                      }}
                    >
                      Booking No.
                    </Typography>
                    <Typography
                      sx={{
                        mt: 1.25,
                        mb: 3.125,
                        fontWeight: 600,
                        color: "#000",
                        fontSize: "0.938rem",
                      }}
                    >
                      MCCA{formattedBookingId}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      minWidth: { xs: "45%", sm: 70 },
                      mb: { xs: 2, sm: 0 },
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: "0.8em",
                        color: "rgba(28, 28, 28, .7)",
                        fontWeight: 500,
                      }}
                    >
                      Session Start
                    </Typography>
                    <Typography
                      sx={{
                        mt: 1.25,
                        mb: 3.125,
                        fontWeight: 600,
                        color: "#000",
                        fontSize: "0.938rem",
                      }}
                    >
                      {formatDateTime(displayDate, displayTime)}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      minWidth: { xs: "45%", sm: 70 },
                      mb: { xs: 2, sm: 0 },
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: "0.8em",
                        color: "rgba(28, 28, 28, .7)",
                        fontWeight: 500,
                      }}
                    >
                      Session Time
                    </Typography>
                    <Typography
                      sx={{
                        mt: 1.25,
                        mb: 3.125,
                        fontWeight: 600,
                        color: "#000",
                        fontSize: "0.938rem",
                      }}
                    >
                      {formatTime(displayTime)}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      minWidth: { xs: "45%", sm: 70 },
                      mb: { xs: 2, sm: 0 },
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: "0.8em",
                        color: "rgba(28, 28, 28, .7)",
                        fontWeight: 500,
                      }}
                    >
                      Venue
                    </Typography>
                    <Typography
                      sx={{
                        mt: 1.25,
                        mb: 3.125,
                        fontWeight: 600,
                        color: "#000",
                        fontSize: "0.938rem",
                      }}
                    >
                      {venueName}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      minWidth: { xs: "45%", sm: 70 },
                      mb: { xs: 2, sm: 0 },
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: "0.8em",
                        color: "rgba(28, 28, 28, .7)",
                        fontWeight: 500,
                      }}
                    >
                      Sessions
                    </Typography>
                    <Typography
                      sx={{
                        mt: 1.25,
                        mb: 3.125,
                        fontWeight: 600,
                        color: "#000",
                        fontSize: "0.938rem",
                      }}
                    >
                      {sessionCount}
                    </Typography>
                  </Box>
                </Box>
              </Box>

              {/* QR Code Receipt */}
              <Box
                sx={{
                  height: 110,
                  minHeight: "unset",
                  position: "relative",
                  borderRadius: "20px 20px 10px 10px",
                  display: "flex",
                  alignItems: "center",
                  width: "88%",
                  backgroundColor: "#fff",
                  boxShadow: "1px 3px 8px 3px rgba(0, 0, 0, 0.2)",
                  p: "25px 30px",
                  "&::before": {
                    content: '""',
                    background: "linear-gradient(to right, #fff 50%, #0f0f0f 50%)",
                    backgroundSize: "22px 4px, 100% 4px",
                    height: "4px",
                    width: "90%",
                    display: "block",
                    left: 0,
                    right: 0,
                    top: "-1px",
                    position: "absolute",
                    margin: "auto",
                  },
                }}
              >
                {formattedBookingId && (
                  <Box
                    sx={{
                      width: 70,
                      height: 70,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "#fff",
                      borderRadius: 1,
                    }}
                  >
                    <Barcode
                      value={formattedBookingId}
                      format="CODE128"
                      width={1}
                      height={60}
                      displayValue={false}
                      background="#fff"
                      lineColor="#000"
                    />
                  </Box>
                )}
                <Box sx={{ ml: 2.5 }}>
                  <Typography
                    sx={{
                      margin: "0 0 5px 0",
                      fontWeight: 500,
                      color: "#000",
                      fontSize: "1rem",
                    }}
                  >
                    {userName}
                  </Typography>
                  <Typography
                    sx={{
                      margin: 0,
                      fontWeight: 400,
                      color: "rgba(28, 28, 28, .7)",
                      fontSize: "0.875rem",
                    }}
                  >
                    Show QR-code when requested
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
      </DashboardLayout>
    </>
  );
}
