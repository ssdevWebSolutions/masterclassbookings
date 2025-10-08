import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSessionsByYear } from "../Redux/Sessions/sessionsSlice";
import { FaBars, FaUser, FaSignOutAlt, FaChevronDown, FaCalendarAlt, FaFilter, FaSearch, FaTimes, FaChartLine, FaDownload, FaCheck, FaList, FaClock, FaMapMarkerAlt, FaInfoCircle, FaChevronRight, FaPhone, FaEnvelope, FaChild } from "react-icons/fa";
import { logOutUserWithType } from "@/Redux/Authentication/AuthenticationAction";
import { useRouter } from "next/router";
import { fetchBookings } from "@/Redux/bookingSlice/bookingSlice";

import 'bootstrap/dist/css/bootstrap.min.css';

export default function AdminDashboard() {
  // MOVED ALL HOOKS TO THE TOP - BEFORE ANY CONDITIONAL RETURNS
  const dispatch = useDispatch();
  const router = useRouter();
  
  const { data: sessions, loading } = useSelector((state) => state.sessions);
  const loginData = useSelector((state) => state.auth.loginData);
  const bookings = useSelector(state => state.bookings.bookings);

  const [activeNav, setActiveNav] = useState("Sessions");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [pageLoaded, setPageLoaded] = useState(false);

  // Session filters
  const [year, setYear] = useState("2025");
  const [monthFilter, setMonthFilter] = useState("All");
  const [dayFilter, setDayFilter] = useState("All");
  const [classFilter, setClassFilter] = useState("All");
  const [sessionSearch, setSessionSearch] = useState("");
  
  // Booking filters
  const [bookingSearch, setBookingSearch] = useState("");
  const [paymentStatusFilter, setPaymentStatusFilter] = useState("All");
  const [levelFilter, setLevelFilter] = useState("All");
  const [selectedDay, setSelectedDay] = useState("All");
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
    if(sessions.length === 0) setInitiateButton(false);
    setTimeout(() => setPageLoaded(true), 100);
  }, [sessions]);

  useEffect(() => {
    if (loginData?.token) {
      dispatch(fetchSessionsByYear(year));
    }
  }, [year, loginData, dispatch]);

  // Get day-wise booking counts - MOVED BEFORE EARLY RETURNS
  const getDayWiseBookings = () => {
    if (!bookings || bookings.length === 0) return {};
    const dayMap = {};
    bookings.forEach(booking => {
      // For each booking, check which days it includes
      const daysInBooking = new Set();
      booking.sessionDetails.forEach(session => {
        const day = session.split(" - ")[0];
        daysInBooking.add(day);
      });
      
      // Count this booking for each unique day it includes
      daysInBooking.forEach(day => {
        if (!dayMap[day]) {
          dayMap[day] = { count: 0, revenue: 0 };
        }
        dayMap[day].count += 1; // Count the individual booking
        dayMap[day].revenue += booking.totalAmount; // Add full booking amount
      });
    });
    return dayMap;
  };

  const dayWiseData = getDayWiseBookings();
  const uniqueDays = Object.keys(dayWiseData).sort();

  // Update selected day stats when day changes
  useEffect(() => {
    if (selectedDay !== "All" && dayWiseData[selectedDay]) {
      setSelectedDayStats(dayWiseData[selectedDay]);
    } else {
      setSelectedDayStats(null);
    }
  }, [selectedDay, dayWiseData]);

  // Handler functions
  const handleLoginRoute = () => router.push("/");
  const handleLogout = () => dispatch(logOutUserWithType());

  // NOW THE CONDITIONAL RETURNS - AFTER ALL HOOKS
  if (!loginData?.token) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center" style={{ background: "linear-gradient(135deg, #000000 0%, #1a1a1a 100%)" }}>
        <div className="text-center animate-fade-in">
          <div className="card shadow-lg border-0" style={{ maxWidth: "400px", background: "#1a1a1a" }}>
            <div className="card-body p-5">
              <FaUser className="mb-3" style={{ fontSize: "3rem", color: "#ffc107" }} />
              <h4 className="text-white mb-3">Authentication Required</h4>
              <p className="text-muted mb-4">Please login to access the admin dashboard.</p>
              <button className="btn btn-warning px-4 py-2" onClick={handleLoginRoute}>
                Go to Login
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loginData.role !== "ADMIN") {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center" style={{ background: "linear-gradient(135deg, #000000 0%, #1a1a1a 100%)" }}>
        <div className="text-center animate-fade-in">
          <div className="card shadow-lg border-0" style={{ maxWidth: "400px", background: "#1a1a1a" }}>
            <div className="card-body p-5">
              <FaSignOutAlt className="mb-3" style={{ fontSize: "3rem", color: "#ff4444" }} />
              <h4 className="text-white mb-3">Access Denied</h4>
              <p className="text-muted mb-4">You are unauthorized to access this dashboard.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Filter bookings by selected day
  const filteredBookings = bookings.filter((b) => {
    if (paymentStatusFilter !== "All") {
      if (paymentStatusFilter === "Paid" && !b.paymentStatus) return false;
      if (paymentStatusFilter === "Pending" && b.paymentStatus) return false;
    }
    if (levelFilter !== "All" && b.kidLevel !== levelFilter) return false;
    if (selectedDay !== "All") {
      const hasDay = b.sessionDetails.some(s => s.startsWith(selectedDay));
      if (!hasDay) return false;
    }
    if (bookingSearch) {
      const search = bookingSearch.toLowerCase();
      if (!b.parentName.toLowerCase().includes(search) &&
          !b.parentEmail.toLowerCase().includes(search) &&
          !b.kidName.toLowerCase().includes(search)) return false;
    }
    return true;
  });

  const filteredSessions = sessions.filter((s) => {
    if (monthFilter !== "All") {
      const sessionDate = new Date(s.date);
      const sessionMonth = sessionDate.toLocaleString('default', { month: 'long' });
      if (sessionMonth !== monthFilter) return false;
    }
    if (dayFilter !== "All" && s.day !== dayFilter) return false;
    if (dayFilter === "Sunday" && classFilter !== "All" && s.sessionClass !== classFilter) return false;
    if (sessionSearch && !s.date.toLowerCase().includes(sessionSearch.toLowerCase()) && 
        !s.day.toLowerCase().includes(sessionSearch.toLowerCase())) return false;
    return true;
  });

  const indexOfLastSession = sessionsCurrentPage * sessionsPerPage;
  const indexOfFirstSession = indexOfLastSession - sessionsPerPage;
  const currentSessions = filteredSessions.slice(indexOfFirstSession, indexOfLastSession);
  const totalSessionsPages = Math.ceil(filteredSessions.length / sessionsPerPage);

  const indexOfLastBooking = bookingsCurrentPage * bookingsPerPage;
  const indexOfFirstBooking = indexOfLastBooking - bookingsPerPage;
  const currentBookings = filteredBookings.slice(indexOfFirstBooking, indexOfLastBooking);
  const totalBookingsPages = Math.ceil(filteredBookings.length / bookingsPerPage);

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

  const Pagination = ({ currentPage, totalPages, onPageChange, itemsPerPage, setItemsPerPage, totalItems }) => {
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return (
      <div className="d-flex flex-column flex-lg-row justify-content-between align-items-center mt-4 gap-3">
        <div className="d-flex align-items-center">
          <label className="me-2 text-muted small">Show:</label>
          <select 
            className="form-select form-select-sm" 
            style={{ width: '80px' }}
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(parseInt(e.target.value));
              onPageChange(1);
            }}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={15}>15</option>
            <option value={20}>20</option>
            <option value={25}>25</option>
          </select>
        </div>
        
        <div className="text-muted small">
          Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems}
        </div>

        {totalPages > 1 && (
          <nav>
            <ul className="pagination pagination-sm mb-0">
              <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                <button className="page-link" onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}>
                  Previous
                </button>
              </li>
              
              {pages.map(page => (
                <li key={page} className={`page-item ${currentPage === page ? 'active' : ''}`}>
                  <button className="page-link" onClick={() => onPageChange(page)}>
                    {page}
                  </button>
                </li>
              ))}
              
              <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                <button className="page-link" onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages}>
                  Next
                </button>
              </li>
            </ul>
          </nav>
        )}
      </div>
    );
  };

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

  const StatCard = ({ title, value, subtitle, icon, color, delay = 0 }) => (
    <div className={`col-lg-3 col-md-6 col-sm-6 mb-3`}>
      <div className="stat-card h-100">
        <div className="stat-card-body">
          <div className="d-flex justify-content-between align-items-start mb-2">
            <div className="stat-icon" style={{ background: `${color}20`, color }}>
              {icon}
            </div>
          </div>
          <div className="stat-value" style={{ color }}>{value}</div>
          <div className="stat-title">{title}</div>
          <div className="stat-subtitle">{subtitle}</div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideUp {
          from { 
            opacity: 0;
            transform: translateY(20px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }

        * {
          box-sizing: border-box;
        }

        html, body {
          background: #0a0a0a;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          margin: 0;
          padding: 0;
          overflow-x: hidden;
          width: 100%;
        }

        .dashboard-layout {
          display: flex;
          min-height: 100vh;
          background: #0a0a0a;
          position: relative;
          width: 100%;
        }

        /* Sidebar Overlay */
        .sidebar-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.5);
          opacity: 0;
          visibility: hidden;
          transition: all 0.3s ease;
          z-index: 950;
        }
        
        .sidebar-overlay.show {
          opacity: 1;
          visibility: visible;
        }

        /* Sidebar Styles */
        .sidebar {
          width: 280px;
          background: linear-gradient(180deg, #1a1a1a 0%, #0f0f0f 100%);
          border-right: 2px solid #ffc107;
          position: fixed;
          height: 100vh;
          left: 0;
          top: 0;
          z-index: 1000;
          transition: transform 0.3s ease;
          overflow-y: auto;
          transform: translateX(0);
        }

        .sidebar-header {
          padding: 24px;
          border-bottom: 1px solid #2a2a2a;
          background: #000;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .sidebar-close-btn {
          display: none;
          background: transparent;
          border: 2px solid #ffc107;
          color: #ffc107;
          width: 36px;
          height: 36px;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
          align-items: center;
          justify-content: center;
        }

        .sidebar-close-btn:hover {
          background: #ffc107;
          color: #000;
          transform: rotate(90deg);
        }

        .sidebar-logo {
          font-size: 24px;
          font-weight: 700;
          color: #ffc107;
          margin: 0;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .sidebar-nav {
          padding: 20px 0;
        }

        .nav-item {
          margin: 4px 12px;
        }

        .nav-link {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px 20px;
          color: #999;
          text-decoration: none;
          border-radius: 12px;
          transition: all 0.3s ease;
          font-weight: 500;
          border: 2px solid transparent;
        }

        .nav-link:hover {
          background: rgba(255, 193, 7, 0.1);
          color: #ffc107;
          border-color: #ffc107;
          transform: translateX(4px);
        }

        .nav-link.active {
          background: linear-gradient(135deg, #ffc107 0%, #ffb300 100%);
          color: #000;
          box-shadow: 0 4px 12px rgba(255, 193, 7, 0.3);
        }

        .nav-link svg {
          font-size: 20px;
        }

        .sidebar-footer {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 20px;
          border-top: 1px solid #2a2a2a;
          background: #000;
        }

        .user-profile {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          background: #1a1a1a;
          border-radius: 12px;
          border: 1px solid #2a2a2a;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .user-profile:hover {
          background: rgba(255, 193, 7, 0.1);
          border-color: #ffc107;
        }

        .user-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: linear-gradient(135deg, #ffc107, #ffb300);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #000;
          font-weight: 700;
        }

        .user-info {
          flex: 1;
        }

        .user-name {
          color: #fff;
          font-weight: 600;
          font-size: 14px;
          margin: 0;
        }

        .user-role {
          color: #999;
          font-size: 12px;
          margin: 0;
        }

        /* Mobile menu button */
        .mobile-menu-btn {
          display: none;
          background: transparent;
          border: 2px solid #ffc107;
          color: #ffc107;
          width: 44px;
          height: 44px;
          border-radius: 8px;
          cursor: pointer;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
          flex-shrink: 0;
        }

        .mobile-menu-btn:hover {
          background: rgba(255, 193, 7, 0.1);
          transform: scale(1.05);
        }

        /* Main Content */
        .main-wrapper {
          flex: 1;
          margin-left: 280px;
          transition: margin-left 0.3s ease;
          width: calc(100% - 280px);
          min-height: 100vh;
        }

        .main-header {
          background: #1a1a1a;
          border-bottom: 1px solid #2a2a2a;
          padding: 20px 32px;
          position: sticky;
          top: 0;
          z-index: 900;
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
        }

        .header-title {
          font-size: 28px;
          font-weight: 700;
          color: #fff;
          margin: 0;
          flex: 1;
          text-align: center;
        }

        .main-content {
          padding: 32px;
          min-height: calc(100vh - 80px);
          width: 100%;
          overflow-x: auto;
        }

        .content-card {
          background: #1a1a1a;
          border-radius: 16px;
          padding: 32px;
          border: 1px solid #2a2a2a;
          width: 100%;
          overflow-x: auto;
        }

        /* Stats Cards */
        .stat-card {
          background: linear-gradient(135deg, #1a1a1a 0%, #242424 100%);
          border-radius: 16px;
          border: 1px solid #2a2a2a;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .stat-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: linear-gradient(90deg, #ffc107, #ffb300);
          transform: scaleX(0);
          transition: transform 0.3s ease;
        }

        .stat-card:hover::before {
          transform: scaleX(1);
        }

        .stat-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 24px rgba(255, 193, 7, 0.2);
          border-color: #ffc107;
        }

        .stat-card-body {
          padding: 24px;
        }

        .stat-icon {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
        }

        .stat-value {
          font-size: 32px;
          font-weight: 700;
          margin-top: 12px;
          margin-bottom: 4px;
        }

        .stat-title {
          font-size: 14px;
          color: #999;
          font-weight: 500;
        }

        .stat-subtitle {
          font-size: 12px;
          color: #666;
          margin-top: 4px;
        }

        /* Selected Day Stats Banner */
        .selected-day-banner {
          background: linear-gradient(135deg, #ffc107 0%, #ffb300 100%);
          border-radius: 12px;
          padding: 20px 24px;
          margin-bottom: 24px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          box-shadow: 0 4px 16px rgba(255, 193, 7, 0.3);
        }

        .selected-day-info h4 {
          color: #000;
          font-size: 20px;
          font-weight: 700;
          margin: 0 0 4px 0;
        }

        .selected-day-info p {
          color: rgba(0, 0, 0, 0.7);
          font-size: 14px;
          margin: 0;
        }

        .selected-day-stats {
          display: flex;
          gap: 24px;
        }

        .day-stat-item {
          text-align: center;
        }

        .day-stat-value {
          font-size: 28px;
          font-weight: 700;
          color: #000;
          margin: 0;
        }

        .day-stat-label {
          font-size: 12px;
          color: rgba(0, 0, 0, 0.7);
          text-transform: uppercase;
          font-weight: 600;
          margin: 0;
        }

        /* Booking Cards */
        .booking-card {
          background: #242424;
          border: 2px solid #2a2a2a;
          border-radius: 16px;
          padding: 24px;
          margin-bottom: 16px;
          cursor: pointer;
          transition: all 0.3s ease;
          width: 100%;
        }

        .booking-card:hover {
          border-color: #ffc107;
          box-shadow: 0 8px 24px rgba(255, 193, 7, 0.2);
          transform: translateY(-2px);
        }

        .booking-card.expanded {
          border-color: #ffc107;
          background: #1f1f1f;
          box-shadow: 0 8px 24px rgba(255, 193, 7, 0.3);
        }

        .booking-header {
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 20px;
          align-items: start;
        }

        .booking-main-info {
          display: grid;
          gap: 16px;
        }

        .booking-section {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .section-label {
          font-size: 11px;
          color: #666;
          text-transform: uppercase;
          font-weight: 600;
          letter-spacing: 0.5px;
        }

        .section-content {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .booking-id {
          font-size: 13px;
          color: #ffc107;
          font-weight: 600;
        }

        .booking-name {
          font-size: 20px;
          font-weight: 700;
          color: #fff;
          margin: 0;
        }

        .booking-contact {
          font-size: 14px;
          color: #999;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .booking-contact svg {
          color: #666;
          flex-shrink: 0;
        }

        .kid-info {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }

        .kid-name {
          font-size: 16px;
          font-weight: 600;
          color: #fff;
        }

        .kid-level {
          background: rgba(255, 193, 7, 0.2);
          color: #ffc107;
          padding: 4px 10px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 600;
        }

        .booking-meta {
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
          padding-top: 12px;
          border-top: 1px solid #2a2a2a;
        }

        .meta-item {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          color: #999;
        }

        .meta-item svg {
          color: #666;
        }

        .amount-highlight {
          color: #00c853;
          font-weight: 700;
          font-size: 15px;
        }

        .booking-actions {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 12px;
        }

        .expand-icon {
          color: #ffc107;
          transition: transform 0.3s ease;
          font-size: 20px;
        }

        .booking-card.expanded .expand-icon {
          transform: rotate(90deg);
        }

        .booking-details {
          margin-top: 24px;
          padding-top: 24px;
          border-top: 2px solid #2a2a2a;
        }

        .details-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .details-header h6 {
          color: #ffc107;
          font-size: 14px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin: 0;
        }

        .session-count-badge {
          background: rgba(255, 193, 7, 0.2);
          color: #ffc107;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
        }

        .session-list {
          display: grid;
          gap: 12px;
        }

        .session-item {
          background: #1a1a1a;
          border: 1px solid #2a2a2a;
          border-radius: 12px;
          padding: 16px 20px;
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 16px;
          align-items: center;
          transition: all 0.2s ease;
        }

        .session-item:hover {
          border-color: #ffc107;
          background: #242424;
        }

        .session-info h6 {
          color: #ffc107;
          font-size: 15px;
          font-weight: 700;
          margin: 0 0 6px 0;
        }

        .session-info p {
          color: #999;
          font-size: 13px;
          margin: 0;
          line-height: 1.5;
        }

        .session-check {
          width: 32px;
          height: 32px;
          background: rgba(0, 200, 83, 0.2);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #00c853;
          font-size: 16px;
        }

        .booking-summary {
          margin-top: 24px;
          padding: 20px;
          background: #242424;
          border-radius: 12px;
          border: 1px solid #2a2a2a;
        }

        .summary-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
        }

        .summary-item {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .summary-label {
          font-size: 12px;
          color: #666;
          text-transform: uppercase;
          font-weight: 600;
        }

        .summary-value {
          font-size: 16px;
          color: #fff;
          font-weight: 600;
        }

        .summary-value.highlight {
          color: #00c853;
          font-size: 24px;
          font-weight: 700;
        }

        .badge {
          padding: 8px 14px;
          border-radius: 8px;
          font-weight: 700;
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .badge-success {
          background: linear-gradient(135deg, #00c853, #00e676);
          color: #fff;
          box-shadow: 0 4px 12px rgba(0, 200, 83, 0.3);
        }

        .badge-danger {
          background: linear-gradient(135deg, #ff5252, #ff1744);
          color: #fff;
          box-shadow: 0 4px 12px rgba(255, 82, 82, 0.3);
        }

        .badge-warning {
          background: linear-gradient(135deg, #ffc107, #ffb300);
          color: #000;
        }

        .badge-primary {
          background: linear-gradient(135deg, #2196f3, #1976d2);
          color: #fff;
        }

        /* Forms */
        .form-select, .form-control {
          background: #242424;
          border: 1px solid #333;
          color: #fff;
          border-radius: 8px;
          padding: 10px 14px;
        }

        .form-select:focus, .form-control:focus {
          background: #242424;
          border-color: #ffc107;
          color: #fff;
          box-shadow: 0 0 0 3px rgba(255, 193, 7, 0.1);
        }

        .form-label {
          color: #999;
          font-size: 13px;
          font-weight: 500;
          margin-bottom: 6px;
        }

        .btn-warning {
          background: linear-gradient(135deg, #ffc107, #ffb300);
          border: none;
          color: #000;
          font-weight: 600;
          padding: 10px 24px;
          border-radius: 8px;
        }

        .btn-warning:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(255, 193, 7, 0.4);
        }

        .btn-outline-warning {
          border: 2px solid #ffc107;
          color: #ffc107;
          background: transparent;
          font-weight: 600;
          padding: 8px 20px;
          border-radius: 8px;
        }

        .btn-outline-warning:hover {
          background: #ffc107;
          color: #000;
        }

        /* Table Styles */
        .table {
          color: #fff;
          margin-bottom: 0;
          width: 100%;
        }

        .table-responsive {
          overflow-x: auto;
          width: 100%;
        }

        .table thead th {
          background: #242424;
          border-color: #333;
          color: #ffc107;
          font-weight: 600;
          text-transform: uppercase;
          font-size: 12px;
          padding: 16px 12px;
          white-space: nowrap;
        }

        .table tbody tr {
          border-color: #2a2a2a;
          transition: all 0.2s ease;
        }

        .table tbody tr:hover {
          background: rgba(255, 193, 7, 0.05);
        }

        .table tbody td {
          padding: 14px 12px;
          border-color: #2a2a2a;
          vertical-align: middle;
          white-space: nowrap;
        }

        /* Pagination */
        .page-link {
          background: #1a1a1a;
          border: 1px solid #333;
          color: #ffc107;
        }

        .page-link:hover {
          background: rgba(255, 193, 7, 0.1);
          border-color: #ffc107;
          color: #ffc107;
        }

        .page-item.active .page-link {
          background: #ffc107;
          border-color: #ffc107;
          color: #000;
        }

        .page-item.disabled .page-link {
          background: #1a1a1a;
          border-color: #2a2a2a;
          color: #666;
        }

        /* Mobile Responsive Styles */
        @media (max-width: 992px) {
          .mobile-menu-btn {
            display: flex;
          }

          .main-wrapper {
            margin-left: 0;
            width: 100%;
          }

          .sidebar {
            transform: translateX(-100%);
          }

          .sidebar.open {
            transform: translateX(0);
          }

          .sidebar-close-btn {
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .main-header {
            padding: 16px 20px;
          }

          .header-title {
            font-size: 22px;
          }

          .main-content {
            padding: 20px 16px;
            overflow-x: hidden;
          }

          .content-card {
            padding: 20px;
            overflow-x: auto;
          }

          .stat-value {
            font-size: 24px;
          }

          .booking-card {
            padding: 20px;
            width: 100%;
          }

          .booking-header {
            grid-template-columns: 1fr;
          }

          .booking-actions {
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
            width: 100%;
          }

          .selected-day-banner {
            flex-direction: column;
            gap: 16px;
            align-items: flex-start;
          }

          .selected-day-stats {
            width: 100%;
            justify-content: space-around;
          }

          .table-responsive {
            margin: 0 -20px;
            padding: 0 20px;
          }

          .row {
            margin: 0 -8px;
          }

          .row > * {
            padding: 0 8px;
          }
        }

        @media (max-width: 576px) {
          .main-header {
            padding: 12px 16px;
          }

          .header-title {
            font-size: 18px;
          }

          .main-content {
            padding: 16px 8px;
          }

          .content-card {
            padding: 16px 12px;
          }

          .stat-card-body {
            padding: 16px;
          }

          .booking-card {
            padding: 16px;
          }

          .booking-name {
            font-size: 18px;
          }

          .session-item {
            grid-template-columns: 1fr;
            gap: 12px;
          }

          .session-check {
            justify-self: end;
          }

          .summary-grid {
            grid-template-columns: 1fr;
          }

          .table thead th {
            padding: 12px 8px;
            font-size: 11px;
          }

          .table tbody td {
            padding: 12px 8px;
          }

          .row {
            margin: 0 -4px;
          }

          .row > * {
            padding: 0 4px;
          }
        }

        .spinner-border {
          border-color: #ffc107;
          border-right-color: transparent;
        }

        .search-box {
          position: relative;
        }

        .search-box input {
          padding-left: 40px;
        }

        .search-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: #666;
        }

        .filter-section {
          background: #242424;
          border-radius: 12px;
          padding: 20px;
          margin-bottom: 24px;
          border: 1px solid #2a2a2a;
          overflow-x: auto;
        }

        .dropdown-menu {
          background: #1a1a1a;
          border: 1px solid #333;
          border-radius: 8px;
        }

        .dropdown-item {
          color: #fff;
          padding: 10px 16px;
        }

        .dropdown-item:hover {
          background: rgba(255, 193, 7, 0.1);
          color: #ffc107;
        }

        .empty-state {
          text-align: center;
          padding: 60px 20px;
        }

        .empty-state-icon {
          font-size: 64px;
          color: #666;
          margin-bottom: 20px;
        }

        .empty-state-text {
          color: #999;
          font-size: 16px;
        }
      `}</style>

      <div className="dashboard-layout">
        {/* Sidebar Overlay */}
        <div 
          className={`sidebar-overlay ${sidebarOpen ? 'show' : ''}`}
          onClick={() => setSidebarOpen(false)}
        />

        {/* Sidebar */}
        <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
          <div className="sidebar-header">
            <h1 className="sidebar-logo">
              <FaChartLine />
              Admin Panel
            </h1>
            <button 
              className="sidebar-close-btn"
              onClick={() => setSidebarOpen(false)}
              aria-label="Close sidebar"
            >
              <FaTimes />
            </button>
          </div>

          <nav className="sidebar-nav">
            <div className="nav-item">
              <a
                href="#"
                className={`nav-link ${activeNav === "Sessions" ? 'active' : ''}`}
                onClick={(e) => { e.preventDefault(); handleNavSwitch("Sessions"); }}
              >
                <FaCalendarAlt />
                Sessions Management
              </a>
            </div>
            <div className="nav-item">
              <a
                href="#"
                className={`nav-link ${activeNav === "Bookings" ? 'active' : ''}`}
                onClick={(e) => { e.preventDefault(); handleNavSwitch("Bookings"); }}
              >
                <FaList />
                Bookings Overview
              </a>
            </div>
          </nav>

          <div className="sidebar-footer">
            <div className="user-profile" onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}>
              <div className="user-avatar">
                <FaUser />
              </div>
              <div className="user-info">
                <p className="user-name">Admin</p>
                <p className="user-role">Administrator</p>
              </div>
              <FaChevronDown style={{ color: '#999', fontSize: '14px' }} />
            </div>
            {profileDropdownOpen && (
              <div className="mt-2">
                <button 
                  className="btn btn-outline-warning w-100"
                  onClick={handleLogout}
                >
                  <FaSignOutAlt className="me-2" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </aside>

        {/* Main Content */}
        <div className="main-wrapper">
          <header className="main-header">
            <button 
              className="mobile-menu-btn"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open sidebar"
            >
              <FaBars size={20} />
            </button>
            <h1 className="header-title">
              {activeNav === "Sessions" ? "Sessions Management" : "Bookings Overview"}
            </h1>
            <div style={{ width: '44px', flexShrink: 0 }}></div>
          </header>

          <main className="main-content">
            {/* Sessions Tab */}
            {activeNav === "Sessions" && (
              <div>
                <div className="content-card mb-4">
                  <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3 mb-4">
                    <h2 style={{ color: '#ffc107', fontSize: '24px', margin: 0 }}>
                      Session Statistics
                    </h2>
                    <button className="btn btn-warning" disabled={initiateButton} onClick={initSessions}>
                      Initialize Sessions
                    </button>
                  </div>

                  <div className="row">
                    <StatCard 
                      title="Total Sessions" 
                      value={filteredSessions.length} 
                      subtitle="All time"
                      icon={<FaCalendarAlt />}
                      color="#ffc107"
                    />
                    <StatCard 
                      title="Friday Sessions" 
                      value={filteredSessions.filter(s => s.day === 'Friday').length}
                      subtitle={`${filteredSessions.filter(s => s.day === 'Friday').reduce((sum, s) => sum + s.bookedCount, 0)} slots booked`}
                      icon={<FaChartLine />}
                      color="#00c853"
                    />
                    <StatCard 
                      title="Sunday Sessions" 
                      value={filteredSessions.filter(s => s.day === 'Sunday').length}
                      subtitle={`${filteredSessions.filter(s => s.day === 'Sunday').reduce((sum, s) => sum + s.bookedCount, 0)} slots booked`}
                      icon={<FaChartLine />}
                      color="#2196f3"
                    />
                    <StatCard 
                      title="Total Bookings" 
                      value={filteredSessions.reduce((sum, s) => sum + s.bookedCount, 0)}
                      subtitle="Across all sessions"
                      icon={<FaCheck />}
                      color="#ff5252"
                    />
                  </div>
                </div>

                <div className="content-card">
                  <h3 style={{ color: '#ffc107', fontSize: '20px', marginBottom: '20px' }}>
                    <FaFilter className="me-2" />
                    Filters & Sessions
                  </h3>

                  <div className="filter-section">
                    <div className="row">
                      <div className="col-lg-2 col-md-4 col-6 mb-3">
                        <label className="form-label">Year</label>
                        <select className="form-select" value={year} onChange={(e) => setYear(e.target.value)}>
                          <option value="2025">2025</option>
                          <option value="2026">2026</option>
                        </select>
                      </div>

                      <div className="col-lg-2 col-md-4 col-6 mb-3">
                        <label className="form-label">Month</label>
                        <select className="form-select" value={monthFilter} onChange={(e) => setMonthFilter(e.target.value)}>
                          <option value="All">All Months</option>
                          <option value="January">January</option>
                          <option value="February">February</option>
                          <option value="March">March</option>
                          <option value="April">April</option>
                          <option value="May">May</option>
                          <option value="June">June</option>
                          <option value="July">July</option>
                          <option value="August">August</option>
                          <option value="September">September</option>
                          <option value="October">October</option>
                          <option value="November">November</option>
                          <option value="December">December</option>
                        </select>
                      </div>

                      <div className="col-lg-2 col-md-4 col-6 mb-3">
                        <label className="form-label">Day</label>
                        <select className="form-select" value={dayFilter} onChange={(e) => setDayFilter(e.target.value)}>
                          <option value="All">All Days</option>
                          <option value="Friday">Friday</option>
                          <option value="Sunday">Sunday</option>
                        </select>
                      </div>

                      {dayFilter === "Sunday" && (
                        <div className="col-lg-2 col-md-4 col-6 mb-3">
                          <label className="form-label">Class</label>
                          <select className="form-select" value={classFilter} onChange={(e) => setClassFilter(e.target.value)}>
                            <option value="All">All Classes</option>
                            <option value="Class 1">Class 1</option>
                            <option value="Class 2">Class 2</option>
                          </select>
                        </div>
                      )}

                      <div className="col-lg-4 col-md-8 col-12 mb-3">
                        <label className="form-label">Search</label>
                        <div className="search-box">
                          <FaSearch className="search-icon" />
                          <input 
                            type="text" 
                            className="form-control" 
                            placeholder="Search by date or day..." 
                            value={sessionSearch}
                            onChange={(e) => setSessionSearch(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {loading ? (
                    <div className="text-center py-5">
                      <div className="spinner-border" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                      <p className="mt-3 text-muted">Loading sessions...</p>
                    </div>
                  ) : (
                    <>
                      <div className="table-responsive">
                        <table className="table table-dark table-hover">
                          <thead>
                            <tr>
                              <th>Date</th>
                              <th>Day</th>
                              <th>Time</th>
                              <th>Type</th>
                              <th>Class</th>
                              <th>Booked</th>
                            </tr>
                          </thead>
                          <tbody>
                            {currentSessions.map((s) => (
                              <tr key={s.id}>
                                <td style={{ color: '#ffc107' }}>{s.date}</td>
                                <td><span className="badge badge-warning">{s.day}</span></td>
                                <td style={{ color: '#999' }}>{s.time}</td>
                                <td>{s.type}</td>
                                <td>{s.sessionClass || "-"}</td>
                                <td><span className="badge badge-primary">{s.bookedCount}</span></td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      
                      <Pagination
                        currentPage={sessionsCurrentPage}
                        totalPages={totalSessionsPages}
                        onPageChange={setSessionsCurrentPage}
                        itemsPerPage={sessionsPerPage}
                        setItemsPerPage={setSessionsPerPage}
                        totalItems={filteredSessions.length}
                      />
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Bookings Tab */}
            {activeNav === "Bookings" && (
              <div>
                {/* Stats */}
                <div className="content-card mb-4">
                  <h2 style={{ color: '#ffc107', fontSize: '24px', marginBottom: '24px' }}>
                    Booking Statistics
                  </h2>
                  <div className="row">
                    <StatCard 
                      title="Total Bookings" 
                      value={bookings.length}
                      subtitle={`${bookings.filter(b => b.paymentStatus).length} paid bookings`}
                      icon={<FaCheck />}
                      color="#ffc107"
                    />
                    <StatCard 
                      title="Total Revenue" 
                      value={`€${bookings.filter(b => b.paymentStatus).reduce((sum, b) => sum + b.totalAmount, 0)}`}
                      subtitle="From paid bookings"
                      icon={<FaChartLine />}
                      color="#00c853"
                    />
                    <StatCard 
                      title="Pending Payments" 
                      value={bookings.filter(b => !b.paymentStatus).length}
                      subtitle={`€${bookings.filter(b => !b.paymentStatus).reduce((sum, b) => sum + b.totalAmount, 0)} pending`}
                      icon={<FaClock />}
                      color="#ff5252"
                    />
                    <StatCard 
                      title="Unique Days" 
                      value={uniqueDays.length}
                      subtitle="Sessions scheduled"
                      icon={<FaCalendarAlt />}
                      color="#2196f3"
                    />
                  </div>
                </div>

                {/* Selected Day Banner */}
                {selectedDayStats && (
                  <div className="selected-day-banner">
                    <div className="selected-day-info">
                      <h4>{selectedDay} Sessions</h4>
                      <p>Viewing bookings for {selectedDay} only</p>
                    </div>
                    <div className="selected-day-stats">
                      <div className="day-stat-item">
                        <p className="day-stat-value">{selectedDayStats.count}</p>
                        <p className="day-stat-label">Bookings</p>
                      </div>
                      <div className="day-stat-item">
                        <p className="day-stat-value">€{selectedDayStats.revenue.toFixed(0)}</p>
                        <p className="day-stat-label">Revenue</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Filters */}
                <div className="content-card mb-4">
                  <h3 style={{ color: '#ffc107', fontSize: '20px', marginBottom: '16px' }}>
                    <FaFilter className="me-2" />
                    Filter Bookings
                  </h3>
                  <div className="filter-section">
                    <div className="row">
                      <div className="col-lg-3 col-md-6 mb-3">
                        <label className="form-label">Filter by Day</label>
                        <select 
                          className="form-select" 
                          value={selectedDay} 
                          onChange={(e) => {
                            setSelectedDay(e.target.value);
                            setBookingsCurrentPage(1);
                          }}
                        >
                          <option value="All">All Days ({bookings.length})</option>
                          {uniqueDays.map(day => (
                            <option key={day} value={day}>
                              {day} ({dayWiseData[day].count} bookings)
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="col-lg-3 col-md-6 mb-3">
                        <label className="form-label">Payment Status</label>
                        <select className="form-select" value={paymentStatusFilter} onChange={(e) => setPaymentStatusFilter(e.target.value)}>
                          <option value="All">All Status</option>
                          <option value="Paid">Paid</option>
                          <option value="Pending">Pending</option>
                        </select>
                      </div>

                      <div className="col-lg-3 col-md-6 mb-3">
                        <label className="form-label">Kid Level</label>
                        <select className="form-select" value={levelFilter} onChange={(e) => setLevelFilter(e.target.value)}>
                          <option value="All">All Levels</option>
                          <option value="Beginner">Beginner</option>
                          <option value="Intermediate">Intermediate</option>
                          <option value="Advanced">Advanced</option>
                          <option value="Club">Club</option>
                          <option value="School">School</option>
                          <option value="Borough/District">Borough/District</option>
                          <option value="County">County</option>
                          <option value="Regional">Regional</option>
                        </select>
                      </div>

                      <div className="col-lg-3 col-md-6 mb-3">
                        <label className="form-label">Search</label>
                        <div className="search-box">
                          <FaSearch className="search-icon" />
                          <input 
                            type="text" 
                            className="form-control" 
                            placeholder="Search..." 
                            value={bookingSearch}
                            onChange={(e) => setBookingSearch(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bookings List */}
                <div className="content-card">
                  <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3 mb-4">
                    <h3 style={{ color: '#ffc107', fontSize: '20px', margin: 0 }}>
                      Bookings List
                      <span style={{ color: '#999', fontSize: '14px', fontWeight: '400', marginLeft: '12px' }}>
                        ({filteredBookings.length} results)
                      </span>
                    </h3>
                    <button className="btn btn-outline-warning">
                      <FaDownload className="me-2" />
                      Export
                    </button>
                  </div>

                  {loading ? (
                    <div className="text-center py-5">
                      <div className="spinner-border" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                      <p className="mt-3 text-muted">Loading bookings...</p>
                    </div>
                  ) : currentBookings.length === 0 ? (
                    <div className="empty-state">
                      <FaInfoCircle className="empty-state-icon" />
                      <p className="empty-state-text">No bookings found matching your filters</p>
                    </div>
                  ) : (
                    <>
                      {currentBookings.map((booking) => (
                        <div 
                          key={booking.bookingId}
                          className={`booking-card ${expandedBooking === booking.bookingId ? 'expanded' : ''}`}
                          onClick={() => setExpandedBooking(expandedBooking === booking.bookingId ? null : booking.bookingId)}
                        >
                          <div className="booking-header">
                            <div className="booking-main-info">
                              {/* Booking ID */}
                              <div className="booking-id">
                                Booking #{booking.bookingId}
                              </div>

                              {/* Parent Information */}
                              <div className="booking-section">
                                <div className="section-label">Parent Information</div>
                                <div className="section-content">
                                  <div className="booking-name">{booking.parentName}</div>
                                  <div className="booking-contact">
                                    <FaEnvelope size={13} />
                                    {booking.parentEmail}
                                  </div>
                                  {booking.parentPhone && (
                                    <div className="booking-contact">
                                      <FaPhone size={13} />
                                      {booking.parentPhone}
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* Kid Information */}
                              <div className="booking-section">
                                <div className="section-label">Student Information</div>
                                <div className="kid-info">
                                  <FaChild size={16} style={{ color: '#666' }} />
                                  <span className="kid-name">{booking.kidName}</span>
                                  <span className="kid-level">{booking.kidLevel}</span>
                                </div>
                              </div>

                              {/* Meta Information */}
                              <div className="booking-meta">
                                <div className="meta-item">
                                  <FaCalendarAlt />
                                  {booking.sessionDetails.length} Session{booking.sessionDetails.length > 1 ? 's' : ''}
                                </div>
                                <div className="meta-item amount-highlight">
                                  €{booking.totalAmount}
                                </div>
                              </div>
                            </div>
                            
                            <div className="booking-actions">
                              <span className={`badge ${booking.paymentStatus ? 'badge-success' : 'badge-danger'}`}>
                                {booking.paymentStatus ? "PAID" : "PENDING"}
                              </span>
                              <FaChevronRight className="expand-icon" />
                            </div>
                          </div>

                          {expandedBooking === booking.bookingId && (
                            <div className="booking-details">
                              <div className="details-header">
                                <h6>Session Details</h6>
                                <span className="session-count-badge">
                                  {booking.sessionDetails.length} Sessions
                                </span>
                              </div>
                              
                              <div className="session-list">
                                {booking.sessionDetails.map((session, idx) => {
                                  const parts = session.split(" - ");
                                  const day = parts[0];
                                  const classInfo = parts[1] || "";
                                  const timeInfo = parts[2] || "";
                                  const dateInfo = parts[3] || "";
                                  
                                  return (
                                    <div key={idx} className="session-item">
                                      <div className="session-info">
                                        <h6>{day} Session</h6>
                                        <p>
                                          {classInfo && <span>{classInfo}</span>}
                                          {timeInfo && <span> • {timeInfo}</span>}
                                          {dateInfo && <span> • {dateInfo}</span>}
                                        </p>
                                      </div>
                                      <div className="session-check">
                                        <FaCheck />
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                              
                              <div className="booking-summary">
                                <div className="summary-grid">
                                  <div className="summary-item">
                                    <div className="summary-label">Parent Name</div>
                                    <div className="summary-value">{booking.parentName}</div>
                                  </div>
                                  <div className="summary-item">
                                    <div className="summary-label">Parent Email</div>
                                    <div className="summary-value">{booking.parentEmail}</div>
                                  </div>
                                  <div className="summary-item">
                                    <div className="summary-label">Student Name</div>
                                    <div className="summary-value">{booking.kidName}</div>
                                  </div>
                                  <div className="summary-item">
                                    <div className="summary-label">Total Amount</div>
                                    <div className="summary-value highlight">€{booking.totalAmount}</div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                      
                      <Pagination
                        currentPage={bookingsCurrentPage}
                        totalPages={totalBookingsPages}
                        onPageChange={setBookingsCurrentPage}
                        itemsPerPage={bookingsPerPage}
                        setItemsPerPage={setBookingsPerPage}
                        totalItems={filteredBookings.length}
                      />
                    </>
                  )}
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </>
  );
}
