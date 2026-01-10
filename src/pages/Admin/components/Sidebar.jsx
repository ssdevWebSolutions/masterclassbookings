"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import {
  Drawer,
  Box,
  IconButton,
  List,
  Typography,
  Collapse,
  Button,
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonIcon from "@mui/icons-material/Person";
import InventoryRounded from "@mui/icons-material/InventoryRounded";
import ChatBubble from "@mui/icons-material/ChatBubble";
import GroupOutlined from "@mui/icons-material/GroupOutlined";
import Settings from "@mui/icons-material/Settings";
import CurrencyPoundSharp from "@mui/icons-material/CurrencyPoundSharp";
import CampaignSharp from "@mui/icons-material/CampaignSharp";
import Person2Outlined from "@mui/icons-material/Person2Outlined";
import { HomeFilled } from "@mui/icons-material";
import { BookImageIcon, LucideCalendarCheck } from "lucide-react";

import NavItem from "@/sharedComponents/NavItem";
import Image from "next/image";

export default function Sidebar({
  sidebarOpen,
  profileDropdownOpen,
  onCloseSidebar,
  onProfileDropdownToggle,
  onLogout,
}) {
  const router = useRouter();
  const path = router.pathname;

  // ✅ Auto-open schedule dropdown if on nested route
  const [scheduleOpen, setScheduleOpen] = useState(false);

  useEffect(() => {
    if (
      path.startsWith("/admin/bookings") ||
      path.startsWith("/admin/schedule/venue") ||
      path.startsWith("/admin/schedule/attendance")
    ) {
      setScheduleOpen(true);
    }
  }, [path]);

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
      {/* ✅ HEADER */}
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        px={1}
        py={1}
      >
        <Box display="flex" alignItems="center" gap={1}>
          <Image
            src="/logo_.png"
            alt="MasterClass Cricket Logo"
            width={35}
            height={60}
            priority
          />
          <Typography variant="h5">Masterclass Cricket</Typography>
        </Box>

        <IconButton onClick={onCloseSidebar} sx={{ p: 0.5, color: "accent.main" }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      {/* ✅ NAVIGATION */}
      <List sx={{ px: 1, pt: 1 }}>
        <NavItem
          label="Dashboard"
          icon={<HomeFilled fontSize="small" />}
          active={path === "/admin"}                // ✅ highlight
          onClick={() => router.push("/admin/dashboard")}
        />

        <NavItem
          label="Bookings"
          icon={<HomeFilled fontSize="small" />}
          active={path === "/admin/bookings"}                // ✅ highlight
          onClick={() => router.push("/admin/bookings")}
        />

        <NavItem
          label="Schedule"
          icon={<LucideCalendarCheck size={18} />}
          expandable
          open={scheduleOpen}
          onClick={() => setScheduleOpen(!scheduleOpen)}
        />

          {/* <NavItem
            label="Bookings"
            icon={<BookImageIcon size={18} />}
            active={path.startsWith("/admin/bookings")}
            onClick={() => router.push("/admin/bookings")}
          /> */}

        <Collapse in={scheduleOpen}>
          

          <NavItem
            label="Terms"
            active={path.startsWith("/admin/schedule/term")}
            onClick={() => router.push("/admin/schedule/term")}
          />

          <NavItem
            label="Class Types"
            active={path.startsWith("/admin/schedule/class-types")}
            onClick={() => router.push("/admin/schedule/class-types")}
          />

          <NavItem
            label="Venues"
            active={path.startsWith("/admin/schedule/venue")}
            onClick={() => router.push("/admin/schedule/venue")}
          />

          <NavItem
            label="Attendance"
            active={path.startsWith("/admin/schedule/attendance")}
            onClick={() => router.push("/admin/schedule/attendance")}
          />

          <NavItem
            label="Training Classes"
            active={
              path === "/admin/schedule" ||
              path.startsWith("/admin/schedule/training-classes")
            }
            onClick={() => router.push("/admin/schedule")}
          />
        </Collapse>

        <NavItem
          label="Finance"
          icon={<CurrencyPoundSharp fontSize="small" />}
          active={path.startsWith("/admin/finance")}
          onClick={() => router.push("/admin/finance")}
        />

        {/* <NavItem
          label="Camps"
          icon={<CampaignSharp fontSize="small" />}
          active={path.startsWith("/admin/camps")}
          onClick={() => router.push("/admin/camps")}
        /> */}

        {/* <NavItem
          label="Service Request"
          icon={<PersonIcon fontSize="small" />}
          active={path.startsWith("/admin/service-request")}
          onClick={() => router.push("/admin/service-request")}
        />

        <NavItem
          label="Contacts"
          icon={<Person2Outlined fontSize="small" />}
          active={path.startsWith("/admin/contacts")}
          onClick={() => router.push("/admin/contacts")}
        /> */}

        {/* <NavItem
          label="Orders"
          icon={<InventoryRounded fontSize="small" />}
          unread={12}
          active={path.startsWith("/admin/orders")}
          onClick={() => router.push("/admin/orders")}
        /> */}

        {/* <NavItem
          label="Communication Tracker"
          icon={<ChatBubble fontSize="small" />}
          unread={5}
          active={path.startsWith("/admin/communication")}
          onClick={() => router.push("/admin/communication")}
        /> */}

        {/* <NavItem
          label="Team"
          icon={<GroupOutlined fontSize="small" />}
          active={path.startsWith("/admin/team")}
          onClick={() => router.push("/admin/team")}
        /> */}

        <NavItem
          label="Settings"
          icon={<Settings fontSize="small" />}
          active={path.startsWith("/admin/settings")}
          onClick={() => router.push("/admin/settings")}
        />
      </List>

      {/* ✅ FOOTER */}
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
              <Typography variant="body2">Admin</Typography>
              <Typography variant="caption" color="text.secondary">
                Administrator
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
            sx={{ mt: 1, fontSize: "0.75rem", py: 0.4 }}
            onClick={onLogout}
            startIcon={<LogoutIcon fontSize="small" />}
          >
            Logout
          </Button>
        </Collapse>
      </Box>
    </Drawer>
  );
}
