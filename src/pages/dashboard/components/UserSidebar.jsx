/**
 * User Sidebar Component
 * Single Responsibility: Display user navigation sidebar
 */

"use client";

import { useRouter } from "next/router";
import { Drawer, Box, IconButton, List, Typography, Collapse, Button } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonIcon from "@mui/icons-material/Person";
import HomeIcon from "@mui/icons-material/Home";
import EventIcon from "@mui/icons-material/Event";
import BookOnlineIcon from "@mui/icons-material/BookOnline";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import NotificationsIcon from "@mui/icons-material/Notifications";
import SettingsIcon from "@mui/icons-material/Settings";
import NavItem from "@/sharedComponents/NavItem";
import Image from "next/image";
import { useDispatch } from "react-redux";
import { logOutUserWithType } from "@/Redux/Authentication/AuthenticationAction";
import { persistor } from "@/store";
import { PersonFillExclamation } from "react-bootstrap-icons";

export default function UserSidebar({
  sidebarOpen,
  profileDropdownOpen,
  onCloseSidebar,
  onProfileDropdownToggle,
  loginData,
}) {
  const router = useRouter();
  const dispatch = useDispatch();
  const path = router.pathname;
  const tab = router.query.tab || "dashboard";

  const handleLogout = async () => {
    dispatch(logOutUserWithType());
    await persistor.purge();
    router.push("/");
  };

  const navItems = [
    { label: "Dashboard", icon: HomeIcon, path: "/dashboard", tab: "dashboard" },
    { label: "Profile", icon: PersonFillExclamation, path: "/dashboard?tab=profile", tab: "profile" },
    { label: "Events", icon: EventIcon, path: "/dashboard?tab=events", tab: "events" },
    { label: "My Bookings", icon: BookOnlineIcon, path: "/dashboard?tab=bookings", tab: "bookings" },
    { label: "Service Request", icon: SupportAgentIcon, path: "/dashboard?tab=service-request", tab: "service-request", disabled: true },
    { label: "Notifications", icon: NotificationsIcon, path: "/dashboard?tab=notifications", tab: "notifications", disabled: true },
    { label: "Settings", icon: SettingsIcon, path: "/dashboard?tab=settings", tab: "settings" },
  ];

  const isActive = (itemTab) => {
    return tab === itemTab || (tab === "dashboard" && itemTab === "dashboard" && !router.query.tab);
  };

  return (
    <Drawer
      variant="temporary"
      open={sidebarOpen}
      onClose={onCloseSidebar}
      PaperProps={{
        sx: (theme) => ({
          width: 250,
          backgroundColor: theme.palette.background.default,
          color: theme.palette.text.primary,
          border: "none",
          pt: 1,
        }),
      }}
    >
      {/* Header */}
      <Box display="flex" alignItems="center" justifyContent="space-between" px={1} py={1}>
        <Box display="flex" alignItems="center" gap={1}>
          <Image src="/logo_.png" alt="MasterClass Cricket Logo" width={35} height={60} priority />
          <Typography variant="h6" sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}>
            Masterclass Cricket
          </Typography>
        </Box>
        <IconButton onClick={onCloseSidebar} sx={{ p: 0.5, color: "accent.main" }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      {/* Navigation */}
      <List sx={{ px: 1, pt: 1 }}>
        {navItems.map((item) => (
          <NavItem
            key={item.tab}
            label={item.label}
            icon={item.icon}
            active={isActive(item.tab)}
            disabled={item.disabled}
            onClick={() => {
              if (!item.disabled) {
                router.push(item.path);
                onCloseSidebar();
              }
            }}
          />
        ))}
      </List>

      {/* Footer */}
      <Box mt="auto" p={1}>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          onClick={onProfileDropdownToggle}
          sx={{ cursor: "pointer", py: 0.6 }}
        >
          <Box display="flex" alignItems="center" gap={1}>
            <PersonIcon fontSize="small" />
            <Box>
              <Typography variant="body2" sx={{ fontSize: { xs: "0.813rem", sm: "0.875rem" } }}>
                {loginData?.fullName || loginData?.name || "User"}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ fontSize: { xs: "0.688rem", sm: "0.75rem" } }}>
                Member
              </Typography>
            </Box>
          </Box>
          <ExpandMoreIcon
            fontSize="small"
            sx={{
              transform: profileDropdownOpen ? "rotate(180deg)" : "rotate(0deg)",
              transition: "0.2s",
            }}
          />
        </Box>

        <Collapse in={profileDropdownOpen}>
          <Button
            variant="outlined"
            fullWidth
            color="primary"
            sx={{ mt: 1, fontSize: { xs: "0.75rem", sm: "0.813rem" }, py: 0.4 }}
            onClick={handleLogout}
            startIcon={<LogoutIcon fontSize="small" />}
          >
            Logout
          </Button>
        </Collapse>
      </Box>
    </Drawer>
  );
}

