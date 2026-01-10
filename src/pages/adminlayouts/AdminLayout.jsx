"use client";

import { useState } from "react";
import { useSelector } from "react-redux";
import Sidebar from "../admin/components/Sidebar";
import MainHeader from "../admin/components/MainHeader";
import DashboardLayout from "../admin/components/DashboardLayout";
import AuthGuard from "../admin/components/AuthGuard";
import { Box } from "@mui/material";


export default function AdminLayout({ children, activeNav }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  // ✅ get login info again
  const loginData = useSelector((state) => state.auth.loginData);

  return (
    <AuthGuard loginData={loginData}>
      <DashboardLayout
        sidebar={
          <Sidebar
            activeNav={activeNav}
            sidebarOpen={sidebarOpen}
            profileDropdownOpen={profileDropdownOpen}
            loginData={loginData}          // ✅ restore status
            onCloseSidebar={() => setSidebarOpen(false)}
            onProfileDropdownToggle={() =>
              setProfileDropdownOpen(!profileDropdownOpen)
            }
          />
        }
        header={
          <MainHeader
            activeNav={activeNav}
            loginData={loginData}          // ✅ restore header info
            onMenuToggle={() => setSidebarOpen(true)}
          />
        }
        sidebarOpen={sidebarOpen}
        onOverlayClick={() => setSidebarOpen(false)}
      >
        {/* <DynamicBreadcrumbs /> */}
        <Box >
        
        {children}
        </Box>
      </DashboardLayout>
    </AuthGuard>
  );
}
