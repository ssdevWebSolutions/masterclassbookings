/**
 * User Header Component
 * Single Responsibility: Display user dashboard header
 */

"use client";

import { Box, IconButton, Typography } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";

export default function UserHeader({ activeNav, onMenuToggle, greeting, userName }) {
  const getNavTitle = () => {
    if (activeNav === "dashboard") return "Dashboard";
    if (activeNav === "events") return "Events";
    if (activeNav === "bookings") return "My Bookings";
    if (activeNav === "service-request") return "Service Request";
    if (activeNav === "notifications") return "Notifications";
    if (activeNav === "settings") return "Settings";
    return activeNav || "Dashboard";
  };

  return (
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
      {/* LEFT - Menu Icon */}
      <IconButton onClick={onMenuToggle} sx={{ color: "accent.main" }}>
        <MenuIcon fontSize="medium" />
      </IconButton>

      {/* CENTER - Active Nav Title */}
      <Box
        sx={{
          position: "absolute",
          left: "50%",
          transform: "translateX(-50%)",
          textAlign: "center",
          maxWidth: "60%",
        }}
      >
        <Typography
          variant="subtitle1"
          sx={{
            color: "accent.main",
            textTransform: "capitalize",
            fontSize: { xs: "0.875rem", sm: "1rem" },
            fontWeight: 600,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {getNavTitle()}
        </Typography>
        {greeting && userName && (
          <Typography
            variant="caption"
            sx={{
              color: "text.secondary",
              fontSize: { xs: "0.625rem", sm: "0.688rem" },
              display: "block",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: "100%",
            }}
          >
            {greeting}, {userName}
          </Typography>
        )}
      </Box>

      {/* RIGHT - Notifications */}
      <IconButton
        sx={{
          border: "1px solid",
          borderColor: "accent.main",
          color: "accent.main",
          width: 34,
          height: 34,
          borderRadius: "8px",
          "&:hover": {
            backgroundColor: "rgba(255,193,8,0.12)",
            borderColor: "accent.main",
          },
        }}
      >
        <NotificationsActiveIcon fontSize="small" />
      </IconButton>
    </Box>
  );
}
