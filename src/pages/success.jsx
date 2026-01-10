"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import { getBookingStatus } from "./training-classes/api/bookingApi";
import { Box, Typography, CircularProgress } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

export default function PaymentSuccess() {
  const router = useRouter();
  const { bookingId } = router.query;
  const audioRef = useRef(null);
  const [hasPlayedSound, setHasPlayedSound] = useState(false);

  const [status, setStatus] = useState("PENDING_PAYMENT");
  const [loading, setLoading] = useState(true);

  const [showRecovery, setShowRecovery] = useState(false);

useEffect(() => {
  const timeout = setTimeout(() => {
    if (status !== "CONFIRMED") {
      setShowRecovery(true);
    }
  }, 25000); // 25 seconds

  return () => clearTimeout(timeout);
}, [status]);


  useEffect(() => {
    if (!bookingId) return;

    let interval;

    const pollStatus = async () => {
      try {
        const data = await getBookingStatus(bookingId);
        setStatus(data.status);

        if (data.status === "CONFIRMED") {
          clearInterval(interval);
          setLoading(false);
          
          // Play success sound
          if (!hasPlayedSound && audioRef.current) {
            audioRef.current.play().catch(err => console.log("Audio play failed:", err));
            setHasPlayedSound(true);
          }
        }
      } catch (e) {
        console.error(e);
      }
    };

    pollStatus(); // initial call
    interval = setInterval(pollStatus, 2000); // poll every 2s

    return () => clearInterval(interval);
  }, [bookingId, hasPlayedSound]);

  // Redirect to bookings tab when confirmed
  useEffect(() => {
    if (status === "CONFIRMED" && bookingId) {
      const timer = setTimeout(() => {
        router.push("/dashboard?tab=bookings");
      }, 2000); // Show success for 2 seconds before redirect
      return () => clearTimeout(timer);
    }
  }, [status, bookingId, router]);

  /* ================= UI ================= */

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "background.default",
          p: 3,
        }}
      >
        <CircularProgress sx={{ color: "accent.main", mb: 2 }} />
        <Typography variant="h6" sx={{ color: "text.primary", mb: 1 }}>
          Payment processing…
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          Please wait while we confirm your booking.
        </Typography>
      </Box>
    );
  }

  {showRecovery && status !== "CONFIRMED" && (
    <Box
      sx={{
        mt: 3,
        p: 2,
        borderRadius: 2,
        border: "1px dashed",
        borderColor: "warning.main",
        backgroundColor: "warning.lighter",
        maxWidth: 420,
        textAlign: "center",
      }}
    >
      <Typography variant="body2" sx={{ mb: 1 }}>
        We’ve received your payment, but confirmation is taking longer than usual.
      </Typography>
  
      <Typography variant="body2" sx={{ mb: 2 }}>
        This can happen due to network delays. Please don’t worry.
      </Typography>
  
      <Button
        variant="outlined"
        size="small"
        onClick={() => window.location.reload()}
      >
        Refresh Status
      </Button>
  
      <Typography variant="caption" sx={{ display: "block", mt: 1 }}>
        Or check your bookings later — it will update automatically.
      </Typography>
    </Box>
  )}
  
  return (
    <>
      {/* Success Sound */}
      <audio
        ref={audioRef}
        src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
        preload="auto"
      />
      
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "background.default",
          p: 3,
        }}
      >
        <CheckCircleIcon
          sx={{
            fontSize: { xs: 80, sm: 120 },
            color: "success.main",
            mb: 3,
            animation: "scaleIn 0.5s ease-out",
            "@keyframes scaleIn": {
              "0%": {
                transform: "scale(0)",
                opacity: 0,
              },
              "50%": {
                transform: "scale(1.2)",
              },
              "100%": {
                transform: "scale(1)",
                opacity: 1,
              },
            },
          }}
        />
        <Typography
          variant="h4"
          fontWeight={700}
          sx={{
            color: "success.main",
            mb: 2,
            fontSize: { xs: "1.5rem", sm: "2rem" },
            textAlign: "center",
          }}
        >
          Booking Confirmed!
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: "text.secondary",
            mb: 3,
            textAlign: "center",
            fontSize: { xs: "0.875rem", sm: "1rem" },
          }}
        >
          Your booking has been successfully confirmed.
        </Typography>
        <Box
          sx={{
            p: 2,
            borderRadius: 2,
            backgroundColor: "background.paper",
            border: "1px solid",
            borderColor: "divider",
            mb: 3,
          }}
        >
          <Typography variant="body2" sx={{ color: "text.secondary", mb: 0.5 }}>
            Booking ID
          </Typography>
          <Typography variant="h6" fontWeight={600} sx={{ color: "accent.main" }}>
            MCCA-{bookingId}
          </Typography>
        </Box>
        <Typography
          variant="body2"
          sx={{
            color: "text.secondary",
            fontSize: { xs: "0.813rem", sm: "0.875rem" },
          }}
        >
          Redirecting to your bookings...
        </Typography>
      </Box>
    </>
  );
}
