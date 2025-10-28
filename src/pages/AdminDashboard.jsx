import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSessionsByYear } from "../Redux/Sessions/sessionsSlice";
import { logOutUserWithType } from "@/Redux/Authentication/AuthenticationAction";
import { useRouter } from "next/router";
import { fetchBookings } from "@/Redux/bookingSlice/bookingSlice";
import 'bootstrap/dist/css/bootstrap.min.css';

// Import sub-components
import AuthGuard from "./Admin/components/AuthGuard";
import DashboardLayout from "./Admin/components/DashboardLayout";
import Sidebar from "./Admin/components/Sidebar";
import MainHeader from "./Admin/components/MainHeader";
import SessionsTab from "./Admin/components/SessionsTab";
import BookingsTab from "./Admin/components/BookingsTab";
import GlobalStyles from "./Admin/components/GlobalStyles";
import ServiceRequest from "./Admin/components/ServiceRequest";

export default function AdminDashboard() {
  // MOVED ALL HOOKS TO THE TOP - BEFORE ANY CONDITIONAL RETURNS
  const dispatch = useDispatch();
  const router = useRouter();
  
  const { data: sessions, loading } = useSelector((state) => state.sessions);
  const loginData = useSelector((state) => state.auth.loginData);
  const bookings = useSelector(state => state.bookings.bookings || []);

  const [activeNav, setActiveNav] = useState("Bookings");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [pageLoaded, setPageLoaded] = useState(false);

  // Session filters
  const [year, setYear] = useState("2025");
  const [monthFilter, setMonthFilter] = useState("All");
  const [dayFilter, setDayFilter] = useState("All");
  const [classFilter, setClassFilter] = useState("All");
  const [sessionSearch, setSessionSearch] = useState("");
  
  // Booking filters - ADDED YEAR FILTER
  const [bookingSearch, setBookingSearch] = useState("");
  const [paymentStatusFilter, setPaymentStatusFilter] = useState("All");
  const [levelFilter, setLevelFilter] = useState("All");
  const [selectedDay, setSelectedDay] = useState("All");
  const [bookingYearFilter, setBookingYearFilter] = useState("All");
  const [expandedBooking, setExpandedBooking] = useState(null);
  const [selectedDayStats, setSelectedDayStats] = useState(null);
  
  const [sessionsCurrentPage, setSessionsCurrentPage] = useState(1);
  const [sessionsPerPage, setSessionsPerPage] = useState(10);
  const [bookingsCurrentPage, setBookingsCurrentPage] = useState(1);
  const [bookingsPerPage, setBookingsPerPage] = useState(10);
  const [initiateButton, setInitiateButton] = useState(true);

  // ALL USE_EFFECT HOOKS MOVED HERE - BEFORE CONDITIONAL RETURNS
  useEffect(() => {
    import('bootstrap/dist/js/bootstrap.bundle.min.js');
  }, []);

  useEffect(() => {
    if(sessions && sessions.length === 0) setInitiateButton(false);
    setTimeout(() => setPageLoaded(true), 100);
  }, [sessions]);

  useEffect(() => {
    if (loginData?.token) {
      dispatch(fetchSessionsByYear(year));
    }
  }, [year, loginData, dispatch]);

  // FIXED: Get counts for the 3 specific day types with proper null checks
  const getDayWiseBookings = () => {
    const dayMap = {
      "Friday": { count: 0, revenue: 0 },
      "Sunday Class 1": { count: 0, revenue: 0 },
      "Sunday Class 2": { count: 0, revenue: 0 }
    };
    
    if (!bookings || !Array.isArray(bookings) || bookings.length === 0) {
      return dayMap;
    }
    
    bookings.forEach(booking => {
      if (!booking.sessionDetails || !Array.isArray(booking.sessionDetails)) {
        return;
      }
      
      let hasFriday = false;
      let hasSundayClass1 = false;
      let hasSundayClass2 = false;
      
      booking.sessionDetails.forEach(session => {
        if (typeof session === 'string') {
          if (session.includes("Friday")) {
            hasFriday = true;
          }
          if (session.includes("Sunday - Class 1")) {
            hasSundayClass1 = true;
          }
          if (session.includes("Sunday - Class 2")) {
            hasSundayClass2 = true;
          }
        }
      });
      
      const totalAmount = booking.totalAmount || 0;
      
      if (hasFriday) {
        dayMap["Friday"].count += 1;
        dayMap["Friday"].revenue += totalAmount;
      }
      if (hasSundayClass1) {
        dayMap["Sunday Class 1"].count += 1;
        dayMap["Sunday Class 1"].revenue += totalAmount;
      }
      if (hasSundayClass2) {
        dayMap["Sunday Class 2"].count += 1;
        dayMap["Sunday Class 2"].revenue += totalAmount;
      }
    });
    
    return dayMap;
  };

  const dayWiseData = getDayWiseBookings();

  // FIXED: Get unique years from booking session details with proper null checks
  const getBookingYears = () => {
    if (!bookings || !Array.isArray(bookings) || bookings.length === 0) return [];
    
    const years = new Set();
    
    bookings.forEach(booking => {
      if (!booking.sessionDetails || !Array.isArray(booking.sessionDetails)) return;
      
      booking.sessionDetails.forEach(session => {
        if (typeof session === 'string') {
          const datePart = session.split(' ').pop();
          if (datePart && datePart.includes('-')) {
            const year = datePart.split('-')[0];
            if (year && year.length === 4 && !isNaN(year)) {
              years.add(year);
            }
          }
        }
      });
    });
    
    return Array.from(years).sort();
  };

  const availableBookingYears = getBookingYears();

  // Update selected day stats when day changes
  useEffect(() => {
    if (selectedDay !== "All" && dayWiseData && dayWiseData[selectedDay]) {
      setSelectedDayStats(dayWiseData[selectedDay]);
    } else {
      setSelectedDayStats(null);
    }
  }, [selectedDay, dayWiseData]);

  // Handler functions
  const handleLoginRoute = () => router.push("/");
  const handleLogout = () => dispatch(logOutUserWithType());

  const handleNavSwitch = (item) => {
    setActiveNav(item);
    setSidebarOpen(false);
    if (item === "Bookings" && loginData.token && loginData.role) {
      const token = loginData.token;
      const role = loginData.role;
      const parentId = 0;
      dispatch(fetchBookings({ token, role, parentId }));
    }
  };

  // UPDATED: Filter bookings by year and specific day types with proper null checks
  const filteredBookings = (bookings || []).filter((b) => {
    if (paymentStatusFilter !== "All") {
      if (paymentStatusFilter === "Paid" && !b.paymentStatus) return false;
      if (paymentStatusFilter === "Pending" && b.paymentStatus) return false;
    }
    
    if (levelFilter !== "All" && b.kidLevel !== levelFilter) return false;
    
    if (bookingYearFilter !== "All") {
      if (!b.sessionDetails || !Array.isArray(b.sessionDetails)) return false;
      
      const hasYear = b.sessionDetails.some(session => {
        if (typeof session !== 'string') return false;
        const datePart = session.split(' ').pop();
        return datePart && datePart.startsWith(bookingYearFilter);
      });
      if (!hasYear) return false;
    }
    
    if (selectedDay !== "All") {
      if (!b.sessionDetails || !Array.isArray(b.sessionDetails)) return false;
      
      let hasMatchingDay = false;
      
      if (selectedDay === "Friday") {
        hasMatchingDay = b.sessionDetails.some(s => typeof s === 'string' && s.includes("Friday"));
      } else if (selectedDay === "Sunday Class 1") {
        hasMatchingDay = b.sessionDetails.some(s => typeof s === 'string' && s.includes("Sunday - Class 1"));
      } else if (selectedDay === "Sunday Class 2") {
        hasMatchingDay = b.sessionDetails.some(s => typeof s === 'string' && s.includes("Sunday - Class 2"));
      }
      
      if (!hasMatchingDay) return false;
    }
    
    if (bookingSearch) {
      const search = bookingSearch.toLowerCase();
      const parentName = (b.parentName || "").toLowerCase();
      const parentEmail = (b.parentEmail || "").toLowerCase();
      const kidName = (b.kidName || "").toLowerCase();
      
      if (!parentName.includes(search) &&
          !parentEmail.includes(search) &&
          !kidName.includes(search)) return false;
    }
    
    return true;
  });

  const filteredSessions = (sessions || []).filter((s) => {
    if (monthFilter !== "All") {
      const sessionDate = new Date(s.date);
      const sessionMonth = sessionDate.toLocaleString('default', { month: 'long' });
      if (sessionMonth !== monthFilter) return false;
    }
    if (dayFilter !== "All" && s.day !== dayFilter) return false;
    if (dayFilter === "Sunday" && classFilter !== "All" && s.sessionClass !== classFilter) return false;
    if (sessionSearch && !s.date?.toLowerCase().includes(sessionSearch.toLowerCase()) && 
        !s.day?.toLowerCase().includes(sessionSearch.toLowerCase())) return false;
    return true;
  });

  const initSessions = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/sessions/init`, {
        method: "POST",
        headers: { Authorization: `Bearer ${loginData.token}` },
      });
      if (!res.ok) throw new Error("Failed to init sessions");
      alert("Sessions initialized!");
      dispatch(fetchSessionsByYear(year));
    } catch (err) {
      console.error(err);
      alert("Error initializing sessions");
    }
  };

  return (
    <>
      <GlobalStyles />
      <AuthGuard loginData={loginData} onLoginRoute={handleLoginRoute}>
        <DashboardLayout
          sidebar={
            <Sidebar
              activeNav={activeNav}
              sidebarOpen={sidebarOpen}
              profileDropdownOpen={profileDropdownOpen}
              onNavSwitch={handleNavSwitch}
              onCloseSidebar={() => setSidebarOpen(false)}
              onProfileDropdownToggle={() => setProfileDropdownOpen(!profileDropdownOpen)}
              onLogout={handleLogout}
            />
          }
          header={
            <MainHeader
              activeNav={activeNav}
              onMenuToggle={() => setSidebarOpen(true)}
            />
          }
          sidebarOpen={sidebarOpen}
          onOverlayClick={() => setSidebarOpen(false)}
        >
          {activeNav === "Sessions" && (
            <SessionsTab
              sessions={sessions}
              loading={loading}
              filteredSessions={filteredSessions}
              initiateButton={initiateButton}
              onInitSessions={initSessions}
              // Filters
              year={year}
              setYear={setYear}
              monthFilter={monthFilter}
              setMonthFilter={setMonthFilter}
              dayFilter={dayFilter}
              setDayFilter={setDayFilter}
              classFilter={classFilter}
              setClassFilter={setClassFilter}
              sessionSearch={sessionSearch}
              setSessionSearch={setSessionSearch}
              // Pagination
              sessionsCurrentPage={sessionsCurrentPage}
              setSessionsCurrentPage={setSessionsCurrentPage}
              sessionsPerPage={sessionsPerPage}
              setSessionsPerPage={setSessionsPerPage}
            />
          )}
          
          {activeNav === "Bookings" && (
            <BookingsTab
              bookings={bookings}
              loading={loading}
              filteredBookings={filteredBookings}
              dayWiseData={dayWiseData}
              availableBookingYears={availableBookingYears}
              selectedDayStats={selectedDayStats}
              // Filters
              bookingYearFilter={bookingYearFilter}
              setBookingYearFilter={setBookingYearFilter}
              selectedDay={selectedDay}
              setSelectedDay={setSelectedDay}
              paymentStatusFilter={paymentStatusFilter}
              setPaymentStatusFilter={setPaymentStatusFilter}
              levelFilter={levelFilter}
              setLevelFilter={setLevelFilter}
              bookingSearch={bookingSearch}
              setBookingSearch={setBookingSearch}
              // Pagination
              bookingsCurrentPage={bookingsCurrentPage}
              setBookingsCurrentPage={setBookingsCurrentPage}
              bookingsPerPage={bookingsPerPage}
              setBookingsPerPage={setBookingsPerPage}
              // Expanded booking
              expandedBooking={expandedBooking}
              setExpandedBooking={setExpandedBooking}
            />
          )}

          {activeNav === "ServiceRequest" && (
            <ServiceRequest />
          )}
        </DashboardLayout>
      </AuthGuard>
    </>
  );
}
