"use client";

import { useState } from "react";
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
import { LucideCalendarCheck } from "lucide-react";

import NavItem from "@/sharedComponents/NavItem";
import Image from "next/image";

export default function Sidebar({
  sidebarOpen,
  activeNav,
  profileDropdownOpen,
  onNavSwitch,
  onCloseSidebar,
  onProfileDropdownToggle,
  onLogout,
}) {
  const [scheduleOpen, setScheduleOpen] = useState(false);

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
          active={activeNav === "Dashboard"}
          onClick={() => onNavSwitch("Dashboard")}
        />

        {/* ✅ DROPDOWN — SCHEDULE */}
        <NavItem
          label="Schedule"
          icon={<LucideCalendarCheck size={18} />}
          expandable
          open={scheduleOpen}
          unread={0}
          onClick={() => setScheduleOpen(!scheduleOpen)}
        />

        <Collapse in={scheduleOpen}>
          <NavItem
            label="Bookings"
            active={activeNav === "Bookings"}
            onClick={() => onNavSwitch("Bookings")}
          />
          {/* <NavItem
            label="Completed"
            active={activeNav === "Completed"}
            onClick={() => onNavSwitch("Completed")}
          /> */}
        </Collapse>

        <NavItem
          label="Finance"
          icon={<CurrencyPoundSharp fontSize="small" />}
          active={activeNav === "Finance"}
          onClick={() => onNavSwitch("Finance")}
        />

        <NavItem
          label="Camps"
          icon={<CampaignSharp fontSize="small" />}
          active={activeNav === "Camps"}
          onClick={() => onNavSwitch("Camps")}
        />

        <NavItem
          label="Service Request"
          icon={<PersonIcon fontSize="small" />}
          active={activeNav === "ServiceRequest"}
          onClick={() => onNavSwitch("ServiceRequest")}
        />

        <NavItem
          label="Contacts"
          icon={<Person2Outlined fontSize="small" />}
          active={activeNav === "Contacts"}
          onClick={() => onNavSwitch("Contacts")}
        />

        <NavItem
          label="Orders"
          icon={<InventoryRounded fontSize="small" />}
          unread={12}
          active={activeNav === "Orders"}
          onClick={() => onNavSwitch("Orders")}
        />

        <NavItem
          label="Communication Tracker"
          icon={<ChatBubble fontSize="small" />}
          unread={5}
          active={activeNav === "Communication"}
          onClick={() => onNavSwitch("Communication")}
        />

        <NavItem
          label="Team"
          icon={<GroupOutlined fontSize="small" />}
          active={activeNav === "Team"}
          onClick={() => onNavSwitch("Team")}
        />

        <NavItem
          label="Settings"
          icon={<Settings fontSize="small" />}
          active={activeNav === "Settings"}
          onClick={() => onNavSwitch("Settings")}
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
