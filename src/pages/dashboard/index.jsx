/**
 * Dashboard Main Page
 * Single Responsibility: Orchestrate dashboard layout and lazy-loaded tabs
 * Uses SOLID principles with separated concerns
 */

"use client";

import { useState, useEffect, Suspense, lazy } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { Box, CircularProgress } from "@mui/material";
import DashboardLayout from "@/pages/admin/components/DashboardLayout";
import UserSidebar from "./components/UserSidebar";
import UserHeader from "./components/UserHeader";
import { getGreeting } from "@/utils/greetingUtils";
import { useAuthGuard } from "@/hooks/dashboard/useAuthGuard";
import { useDashboardData } from "@/hooks/dashboard/useDashboardData";
import ProfileTab from "./components/tabs/ProfileTab";

// Lazy load tab components
const DashboardTab = lazy(() => import("./components/tabs/DashboardTab"));
const EventsTab = lazy(() => import("./components/tabs/EventsTab"));
const BookingsTab = lazy(() => import("./components/tabs/BookingsTab"));
const ServiceRequestTab = lazy(() => import("./components/tabs/ServiceRequestTab"));
const NotificationsTab = lazy(() => import("./components/tabs/NotificationsTab"));
const SettingsTab = lazy(() => import("./components/tabs/SettingsTab"));

// Loading fallback component
const TabLoadingFallback = () => (
  <Box display="flex" justifyContent="center" alignItems="center" minHeight="40vh">
    <CircularProgress />
  </Box>
);

export default function UserDashboard() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [greeting, setGreeting] = useState("");

  // Use custom hooks for separation of concerns
  const { isAuthenticated, token, userId, userName, loginData } = useAuthGuard();
  const { data, loading } = useDashboardData(userId);
  console.log(data,"bookings realted");

  // Get tab from query
  useEffect(() => {
    const tab = router.query.tab || "dashboard";
    setActiveTab(tab);
  }, [router.query]);

  // Set greeting
  useEffect(() => {
    setGreeting(getGreeting());
  }, []);

  if (!token || !isAuthenticated) {
    return null;
  }

  // Render active tab with lazy loading
  const renderActiveTab = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <Suspense fallback={<TabLoadingFallback />}>
            <DashboardTab 
              bookings={data.bookings} 
              loading={loading} 
              trainingClasses={data.trainingClasses} 
              router={router} 
            />
          </Suspense>
        );
        case "profile":
        return (
          <Suspense fallback={<TabLoadingFallback />}>
            <ProfileTab />
          </Suspense>
        );
      case "events":
        return (
          <Suspense fallback={<TabLoadingFallback />}>
            <EventsTab trainingClasses={data.trainingClasses} loading={loading} />
          </Suspense>
        );
      case "bookings":
        return (
          <Suspense fallback={<TabLoadingFallback />}>
            <BookingsTab bookings={data.bookings} loading={loading} />
          </Suspense>
        );
      case "service-request":
        return (
          <Suspense fallback={<TabLoadingFallback />}>
            <ServiceRequestTab />
          </Suspense>
        );
      case "notifications":
        return (
          <Suspense fallback={<TabLoadingFallback />}>
            <NotificationsTab />
          </Suspense>
        );
      case "settings":
        return (
          <Suspense fallback={<TabLoadingFallback />}>
            <SettingsTab />
          </Suspense>
        );
      default:
        return (
          <Suspense fallback={<TabLoadingFallback />}>
            <DashboardTab 
              bookings={data.bookings} 
              loading={loading} 
              trainingClasses={data.trainingClasses} 
              router={router} 
            />
          </Suspense>
        );
    }
  };

  return (
    <>
      <Head>
        <title>Dashboard - MasterClass Cricket</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
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
          <UserHeader
            activeNav={activeTab}
            onMenuToggle={() => setSidebarOpen(true)}
            greeting={greeting}
            userName={userName}
          />
        }
        sidebarOpen={sidebarOpen}
        onOverlayClick={() => setSidebarOpen(false)}
      >
        <Box>
          {renderActiveTab()}
        </Box>
      </DashboardLayout>
    </>
  );
}

