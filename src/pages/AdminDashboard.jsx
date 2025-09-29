import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSessionsByYear } from "../Redux/Sessions/sessionsSlice";
import { FaBars, FaUser, FaSignOutAlt, FaChevronDown, FaCalendarAlt, FaFilter, FaSearch, FaTimes, FaChartLine, FaDownload, FaCheck } from "react-icons/fa";
import { logOutUserWithType } from "@/Redux/Authentication/AuthenticationAction";
import { useRouter } from "next/router";
import { fetchBookings } from "@/Redux/bookingSlice/bookingSlice";

// At the top of your file or in _app.js
import 'bootstrap/dist/css/bootstrap.min.css';

export default function AdminDashboard() {
  const dispatch = useDispatch();
  const router = useRouter();
  
  const { data: sessions, loading } = useSelector((state) => state.sessions);
  const loginData = useSelector((state) => state.auth.loginData);
  const bookings = useSelector(state => state.bookings.bookings);

  // Main states
  const [activeNav, setActiveNav] = useState("Sessions");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
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
  const [dateRangeFilter, setDateRangeFilter] = useState("All");
  
  // Pagination
  const [sessionsCurrentPage, setSessionsCurrentPage] = useState(1);
  const [sessionsPerPage, setSessionsPerPage] = useState(10);
  const [bookingsCurrentPage, setBookingsCurrentPage] = useState(1);
  const [bookingsPerPage, setBookingsPerPage] = useState(10);
  const [initiateButton, setInitiateButton] = useState(true);

  useEffect(() => {
    // Only import Bootstrap JS on the client side
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

  const handleLoginRoute = () => router.push("/");
  const handleLogout = () => dispatch(logOutUserWithType());

  if (!loginData?.token) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center" style={{ background: "linear-gradient(135deg, #000000 0%, #1a1a1a 100%)" }}>
        <div className="text-center animate-fade-in">
          <div className="card shadow-lg border-0" style={{ maxWidth: "400px", background: "#1a1a1a" }}>
            <div className="card-body p-5">
              <FaUser className="mb-3" style={{ fontSize: "3rem", color: "#ffc107" }} />
              <h4 className="text-white mb-3">Authentication Required</h4>
              <p className="text-muted mb-4">Please login to access the admin dashboard.</p>
              <button className="btn btn-warning px-4 py-2" onClick={handleLoginRoute} style={{ background: "#ffc107", border: "none", color: "#000" }}>
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

  // Analytics calculations
  const getAnalytics = () => {
    const today = new Date();
    const todayBookings = bookings.filter(b => {
      const bookingDate = new Date(b.bookingDate);
      return bookingDate.toDateString() === today.toDateString();
    });

    const thisWeekStart = new Date(today);
    thisWeekStart.setDate(today.getDate() - today.getDay());
    const weekBookings = bookings.filter(b => {
      const bookingDate = new Date(b.bookingDate);
      return bookingDate >= thisWeekStart;
    });

    const thisMonthBookings = bookings.filter(b => {
      const bookingDate = new Date(b.bookingDate);
      return bookingDate.getMonth() === today.getMonth() && bookingDate.getFullYear() === today.getFullYear();
    });

    const fridayBookings = bookings.filter(b => 
      b.sessionDetails.some(s => s.toLowerCase().includes('friday'))
    );

    const sundayBookings = bookings.filter(b => 
      b.sessionDetails.some(s => s.toLowerCase().includes('sunday'))
    );

    return {
      today: todayBookings.length,
      todayRevenue: todayBookings.reduce((sum, b) => sum + b.totalAmount, 0),
      thisWeek: weekBookings.length,
      weekRevenue: weekBookings.reduce((sum, b) => sum + b.totalAmount, 0),
      thisMonth: thisMonthBookings.length,
      monthRevenue: thisMonthBookings.reduce((sum, b) => sum + b.totalAmount, 0),
      friday: fridayBookings.length,
      fridayRevenue: fridayBookings.reduce((sum, b) => sum + b.totalAmount, 0),
      sunday: sundayBookings.length,
      sundayRevenue: sundayBookings.reduce((sum, b) => sum + b.totalAmount, 0),
    };
  };

  const analytics = getAnalytics();

  // Filtering logic
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

  const filteredBookings = bookings.filter((b) => {
    if (paymentStatusFilter !== "All") {
      if (paymentStatusFilter === "Paid" && !b.paymentStatus) return false;
      if (paymentStatusFilter === "Pending" && b.paymentStatus) return false;
    }
    if (levelFilter !== "All" && b.kidLevel !== levelFilter) return false;
    if (bookingSearch) {
      const search = bookingSearch.toLowerCase();
      if (!b.parentName.toLowerCase().includes(search) &&
          !b.parentEmail.toLowerCase().includes(search) &&
          !b.kidName.toLowerCase().includes(search)) return false;
    }
    return true;
  });

  // Pagination
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
            className="form-select form-select-sm pagination-select" 
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
            <option value={50}>50</option>
          </select>
        </div>
        
        <div className="text-muted small">
          Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems}
        </div>

        {totalPages > 1 && (
          <nav>
            <ul className="pagination pagination-sm mb-0">
              <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                <button className="page-link custom-pagination" onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}>
                  Previous
                </button>
              </li>
              
              {pages.map(page => (
                <li key={page} className={`page-item ${currentPage === page ? 'active' : ''}`}>
                  <button className="page-link custom-pagination" onClick={() => onPageChange(page)}>
                    {page}
                  </button>
                </li>
              ))}
              
              <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                <button className="page-link custom-pagination" onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages}>
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
    if (item === "Bookings" && loginData.token && loginData.role) {
      const token = loginData.token;
      const role = loginData.role;
      const parentId = 0;
      dispatch(fetchBookings({ token, role, parentId }));
    }
  };

  const StatCard = ({ title, value, subtitle, icon, color, delay = 0 }) => (
    <div className={`col-xl-3 col-md-6 col-sm-6 mb-3 animate-slide-up`} style={{ animationDelay: `${delay}ms` }}>
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

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .animate-fade-in {
          animation: fadeIn 0.5s ease-out;
        }

        .animate-slide-up {
          animation: slideUp 0.6s ease-out forwards;
          opacity: 0;
        }

        .animate-slide-right {
          animation: slideInRight 0.4s ease-out;
        }

        body {
          background: #000000;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
        }

        .dashboard-header {
          background: linear-gradient(135deg, #000000 0%, #1a1a1a 100%);
          border-bottom: 2px solid #ffc107;
          box-shadow: 0 4px 20px rgba(255, 193, 7, 0.1);
        }

        .nav-pills .nav-link {
          border-radius: 25px;
          padding: 10px 24px;
          font-weight: 500;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          border: 2px solid transparent;
        }

        .nav-pills .nav-link:not(.active) {
          color: #999 !important;
          background: transparent !important;
        }

        .nav-pills .nav-link:not(.active):hover {
          background: rgba(255, 193, 7, 0.1) !important;
          border-color: #ffc107;
          color: #ffc107 !important;
          transform: translateY(-2px);
        }

        .nav-pills .nav-link.active {
          background: linear-gradient(135deg, #ffc107 0%, #ffb300 100%) !important;
          color: #000 !important;
          box-shadow: 0 4px 15px rgba(255, 193, 7, 0.4);
          transform: translateY(-2px);
        }

        .profile-dropdown {
          background: #1a1a1a;
          border: 1px solid #ffc107;
          border-radius: 12px;
          padding: 8px 16px;
          color: #ffc107;
          transition: all 0.3s ease;
        }

        .profile-dropdown:hover {
          background: rgba(255, 193, 7, 0.1);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(255, 193, 7, 0.2);
        }

        .main-content {
          background: #000000;
          min-height: 100vh;
          padding: 24px 16px;
        }

        .content-card {
          background: #1a1a1a;
          border-radius: 16px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
          padding: 32px;
          border: 1px solid #2a2a2a;
          transition: all 0.3s ease;
        }

        .content-card:hover {
          box-shadow: 0 12px 40px rgba(255, 193, 7, 0.1);
        }

        .stat-card {
          background: linear-gradient(135deg, #1a1a1a 0%, #242424 100%);
          border-radius: 16px;
          border: 1px solid #2a2a2a;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          overflow: hidden;
          position: relative;
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
          transform: translateY(-8px);
          box-shadow: 0 12px 32px rgba(255, 193, 7, 0.2);
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
          margin-bottom: 12px;
        }

        .stat-value {
          font-size: 32px;
          font-weight: 700;
          margin-bottom: 4px;
          letter-spacing: -1px;
        }

        .stat-title {
          font-size: 14px;
          color: #999;
          font-weight: 500;
          margin-bottom: 4px;
        }

        .stat-subtitle {
          font-size: 12px;
          color: #666;
        }

        .filter-section {
          background: #242424;
          border-radius: 12px;
          padding: 20px;
          margin-bottom: 24px;
          border: 1px solid #2a2a2a;
        }

        .form-select, .form-control {
          background: #1a1a1a;
          border: 1px solid #333;
          color: #fff;
          border-radius: 8px;
          padding: 10px 14px;
          transition: all 0.3s ease;
        }

        .form-select:focus, .form-control:focus {
          background: #1a1a1a;
          border-color: #ffc107;
          color: #fff;
          box-shadow: 0 0 0 3px rgba(255, 193, 7, 0.1);
        }

        .form-select option {
          background: #1a1a1a;
          color: #fff;
        }

        .btn-warning {
          background: linear-gradient(135deg, #ffc107 0%, #ffb300 100%);
          border: none;
          color: #000;
          font-weight: 600;
          padding: 10px 24px;
          border-radius: 8px;
          transition: all 0.3s ease;
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
          transition: all 0.3s ease;
        }

        .btn-outline-warning:hover {
          background: #ffc107;
          color: #000;
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(255, 193, 7, 0.3);
        }

        .table {
          color: #fff;
        }

        .table-dark {
          background: #1a1a1a;
        }

        .table thead th {
          background: #242424;
          border-color: #333;
          color: #ffc107;
          font-weight: 600;
          text-transform: uppercase;
          font-size: 12px;
          letter-spacing: 0.5px;
          padding: 16px 12px;
          position: sticky;
          top: 0;
          z-index: 10;
        }

        .table tbody tr {
          border-color: #2a2a2a;
          transition: all 0.2s ease;
        }

        .table tbody tr:hover {
          background: rgba(255, 193, 7, 0.05);
          transform: scale(1.01);
        }

        .table tbody td {
          padding: 14px 12px;
          border-color: #2a2a2a;
          vertical-align: middle;
        }

        .badge {
          padding: 6px 12px;
          border-radius: 6px;
          font-weight: 600;
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .badge.bg-success {
          background: linear-gradient(135deg, #00c853 0%, #00e676 100%) !important;
        }

        .badge.bg-warning {
          background: linear-gradient(135deg, #ffc107 0%, #ffb300 100%) !important;
          color: #000 !important;
        }

        .badge.bg-danger {
          background: linear-gradient(135deg, #ff5252 0%, #ff1744 100%) !important;
        }

        .badge.bg-primary {
          background: linear-gradient(135deg, #2196f3 0%, #1976d2 100%) !important;
        }

        .dropdown-menu {
          background: #1a1a1a;
          border: 1px solid #333;
          border-radius: 8px;
          padding: 8px;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
        }

        .dropdown-item {
          color: #fff;
          border-radius: 6px;
          padding: 10px 16px;
          transition: all 0.2s ease;
        }

        .dropdown-item:hover {
          background: rgba(255, 193, 7, 0.1);
          color: #ffc107;
        }

        .pagination-select {
          width: 80px;
          background: #1a1a1a;
          border: 1px solid #333;
          color: #fff;
        }

        .custom-pagination {
          background: #1a1a1a;
          border: 1px solid #333;
          color: #ffc107;
          transition: all 0.2s ease;
        }

        .custom-pagination:hover {
          background: rgba(255, 193, 7, 0.1);
          border-color: #ffc107;
          color: #ffc107;
        }

        .page-item.active .custom-pagination {
          background: #ffc107;
          border-color: #ffc107;
          color: #000;
        }

        .page-item.disabled .custom-pagination {
          background: #1a1a1a;
          border-color: #2a2a2a;
          color: #666;
        }

        .search-box {
          position: relative;
        }

        .search-box input {
          padding-left: 40px;
        }

        .search-box .search-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: #666;
          z-index: 10;
        }

        .filter-badge {
          background: rgba(255, 193, 7, 0.1);
          color: #ffc107;
          border: 1px solid #ffc107;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 12px;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          margin-right: 8px;
          margin-bottom: 8px;
        }

        .mobile-nav-bottom {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          background: #1a1a1a;
          border-top: 2px solid #ffc107;
          padding: 12px 0;
          z-index: 1000;
          display: none;
          box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.3);
        }

        @media (max-width: 768px) {
          .mobile-nav-bottom {
            display: block;
          }

          .main-content {
            padding-bottom: 80px;
          }

          .content-card {
            padding: 20px;
          }

          .stat-card-body {
            padding: 16px;
          }

          .stat-value {
            font-size: 24px;
          }

          .table-responsive {
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
          }
        }

        .table-responsive {
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
        }

        .spinner-border {
          border-color: #ffc107;
          border-right-color: transparent;
        }

        @media (max-width: 576px) {
          .stat-value {
            font-size: 20px;
          }

          .stat-title {
            font-size: 12px;
          }

          .content-card {
            padding: 16px;
          }

          .filter-section {
            padding: 16px;
          }
        }
      `}</style>

      <div className={`min-vh-100 ${pageLoaded ? 'animate-fade-in' : ''}`}>
        {/* Header */}
        <header className="dashboard-header">
          <div className="container-fluid">
            <div className="row align-items-center py-3">
              <div className="col-6">
                <h4 className="mb-0 fw-bold" style={{ color: '#ffc107' }}>Admin Dashboard</h4>
              </div>
              
              <div className="col-6 text-end">
                <div className="dropdown d-inline-block position-relative">
                  <button
                    className="profile-dropdown d-inline-flex align-items-center"
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    type="button"
                  >
                    <FaUser className="me-2" />
                    <span className="d-none d-sm-inline">Admin</span>
                    <FaChevronDown className="ms-2" style={{ fontSize: '0.8em' }} />
                  </button>
                  {profileDropdownOpen && (
                    <div className="dropdown-menu dropdown-menu-end show position-absolute animate-slide-right" style={{ top: '100%', right: 0, zIndex: 1050 }}>
                      <button className="dropdown-item" onClick={handleLogout}>
                        <FaSignOutAlt className="me-2" />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Desktop Navigation */}
            <div className="row d-none d-md-block pb-3">
              <div className="col-12">
                <nav className="nav nav-pills justify-content-center">
                  {["Sessions", "Bookings", "Finance"].map((item) => (
                    <button
                      key={item}
                      onClick={() => handleNavSwitch(item)}
                      className={`nav-link mx-1 ${activeNav === item ? 'active' : ''}`}
                    >
                      {item}
                    </button>
                  ))}
                </nav>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="main-content">
          <div className="container-fluid">
            <div className="content-card">
              
              {/* Sessions Tab */}
              {activeNav === "Sessions" && (
                <div className="animate-slide-up">
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2 className="mb-0" style={{ color: '#ffc107' }}>
                      <FaCalendarAlt className="me-2" />
                      Sessions Management
                    </h2>
                    <button className="btn btn-warning" disabled={initiateButton} onClick={initSessions}>
                      Initialize Sessions
                    </button>
                  </div>

                  {/* Quick Stats */}
                  <div className="row mb-4">
                    <StatCard 
                      title="Total Sessions" 
                      value={filteredSessions.length} 
                      subtitle="All time"
                      icon={<FaCalendarAlt />}
                      color="#ffc107"
                      delay={0}
                    />
                    <StatCard 
                      title="Friday Sessions" 
                      value={filteredSessions.filter(s => s.day === 'Friday').length}
                      subtitle={`${filteredSessions.filter(s => s.day === 'Friday').reduce((sum, s) => sum + s.bookedCount, 0)} slots booked`}
                      icon={<FaChartLine />}
                      color="#00c853"
                      delay={100}
                    />
                    <StatCard 
                      title="Sunday Sessions" 
                      value={filteredSessions.filter(s => s.day === 'Sunday').length}
                      subtitle={`${filteredSessions.filter(s => s.day === 'Sunday').reduce((sum, s) => sum + s.bookedCount, 0)} slots booked`}
                      icon={<FaChartLine />}
                      color="#2196f3"
                      delay={200}
                    />
                    <StatCard 
                      title="Total Bookings" 
                      value={filteredSessions.reduce((sum, s) => sum + s.bookedCount, 0)}
                      subtitle="Across all sessions"
                      icon={<FaCheck />}
                      color="#ff5252"
                      delay={300}
                    />
                  </div>

                  {/* Filters */}
                  <div className="filter-section">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h6 className="mb-0" style={{ color: '#ffc107' }}>
                        <FaFilter className="me-2" />
                        Filters
                      </h6>
                      <button 
                        className="btn btn-sm btn-outline-warning d-md-none"
                        onClick={() => setShowFilters(!showFilters)}
                      >
                        {showFilters ? <FaTimes /> : <FaFilter />}
                      </button>
                    </div>

                    <div className={`row ${showFilters || window.innerWidth > 768 ? '' : 'd-none'}`}>
                      <div className="col-lg-2 col-md-4 col-sm-6 mb-3">
                        <label className="form-label small" style={{ color: '#999' }}>Year</label>
                        <select className="form-select" value={year} onChange={(e) => setYear(e.target.value)}>
                          <option value="2025">2025</option>
                          <option value="2026">2026</option>
                        </select>
                      </div>

                      <div className="col-lg-2 col-md-4 col-sm-6 mb-3">
                        <label className="form-label small" style={{ color: '#999' }}>Month</label>
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

                      <div className="col-lg-2 col-md-4 col-sm-6 mb-3">
                        <label className="form-label small" style={{ color: '#999' }}>Day</label>
                        <select className="form-select" value={dayFilter} onChange={(e) => setDayFilter(e.target.value)}>
                          <option value="All">All Days</option>
                          <option value="Friday">Friday</option>
                          <option value="Sunday">Sunday</option>
                        </select>
                      </div>

                      {dayFilter === "Sunday" && (
                        <div className="col-lg-2 col-md-4 col-sm-6 mb-3">
                          <label className="form-label small" style={{ color: '#999' }}>Class</label>
                          <select className="form-select" value={classFilter} onChange={(e) => setClassFilter(e.target.value)}>
                            <option value="All">All Classes</option>
                            <option value="Class 1">Class 1</option>
                            <option value="Class 2">Class 2</option>
                          </select>
                        </div>
                      )}

                      <div className="col-lg-4 col-md-8 col-sm-12 mb-3">
                        <label className="form-label small" style={{ color: '#999' }}>Search</label>
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

                    {/* Active Filters */}
                    <div className="mt-2">
                      {(monthFilter !== "All" || dayFilter !== "All" || classFilter !== "All" || sessionSearch) && (
                        <div className="d-flex flex-wrap align-items-center">
                          <span className="text-muted small me-2">Active filters:</span>
                          {monthFilter !== "All" && (
                            <span className="filter-badge">
                              Month: {monthFilter}
                              <FaTimes style={{ cursor: 'pointer' }} onClick={() => setMonthFilter("All")} />
                            </span>
                          )}
                          {dayFilter !== "All" && (
                            <span className="filter-badge">
                              Day: {dayFilter}
                              <FaTimes style={{ cursor: 'pointer' }} onClick={() => setDayFilter("All")} />
                            </span>
                          )}
                          {classFilter !== "All" && (
                            <span className="filter-badge">
                              Class: {classFilter}
                              <FaTimes style={{ cursor: 'pointer' }} onClick={() => setClassFilter("All")} />
                            </span>
                          )}
                          {sessionSearch && (
                            <span className="filter-badge">
                              Search: {sessionSearch}
                              <FaTimes style={{ cursor: 'pointer' }} onClick={() => setSessionSearch("")} />
                            </span>
                          )}
                        </div>
                      )}
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
                              <th>Booked Slots</th>
                            </tr>
                          </thead>
                          <tbody>
                            {currentSessions.map((s, index) => (
                              <tr key={s.id} className="animate-slide-up" style={{ animationDelay: `${index * 50}ms` }}>
                                <td style={{ color: '#ffc107' }}>{s.date}</td>
                                <td><span className="badge bg-warning">{s.day}</span></td>
                                <td style={{ color: '#999' }}>{s.time}</td>
                                <td>{s.type}</td>
                                <td>{s.sessionClass || "-"}</td>
                                <td>
                                  <span className="badge bg-primary">{s.bookedCount}</span>
                                </td>
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
              )}

              {/* Bookings Tab */}
              {activeNav === "Bookings" && (
                <div className="animate-slide-up">
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2 className="mb-0" style={{ color: '#ffc107' }}>
                      <FaChartLine className="me-2" />
                      Bookings Overview
                    </h2>
                    <button className="btn btn-outline-warning">
                      <FaDownload className="me-2" />
                      Export
                    </button>
                  </div>

                  {/* Analytics Cards */}
                  <div className="row mb-4">
                    <StatCard 
                      title="Today" 
                      value={analytics.today}
                      subtitle={`€${analytics.todayRevenue} revenue`}
                      icon={<FaCalendarAlt />}
                      color="#ffc107"
                      delay={0}
                    />
                    <StatCard 
                      title="This Week" 
                      value={analytics.thisWeek}
                      subtitle={`€${analytics.weekRevenue} revenue`}
                      icon={<FaChartLine />}
                      color="#00c853"
                      delay={100}
                    />
                    <StatCard 
                      title="This Month" 
                      value={analytics.thisMonth}
                      subtitle={`€${analytics.monthRevenue} revenue`}
                      icon={<FaChartLine />}
                      color="#2196f3"
                      delay={200}
                    />
                    <StatCard 
                      title="Total Bookings" 
                      value={bookings.length}
                      subtitle={`${bookings.filter(b => b.paymentStatus).length} paid`}
                      icon={<FaCheck />}
                      color="#ff5252"
                      delay={300}
                    />
                  </div>

                  {/* Day-wise Breakdown */}
                  <div className="row mb-4">
                    <div className="col-md-6 mb-3">
                      <div className="stat-card">
                        <div className="stat-card-body">
                          <h6 style={{ color: '#ffc107' }}>Friday Bookings</h6>
                          <div className="d-flex justify-content-between align-items-center mt-3">
                            <div>
                              <div className="stat-value" style={{ color: '#00c853' }}>{analytics.friday}</div>
                              <div className="stat-subtitle">Total bookings</div>
                            </div>
                            <div className="text-end">
                              <div className="stat-value" style={{ color: '#ffc107', fontSize: '24px' }}>€{analytics.fridayRevenue}</div>
                              <div className="stat-subtitle">Revenue</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6 mb-3">
                      <div className="stat-card">
                        <div className="stat-card-body">
                          <h6 style={{ color: '#ffc107' }}>Sunday Bookings</h6>
                          <div className="d-flex justify-content-between align-items-center mt-3">
                            <div>
                              <div className="stat-value" style={{ color: '#2196f3' }}>{analytics.sunday}</div>
                              <div className="stat-subtitle">Total bookings</div>
                            </div>
                            <div className="text-end">
                              <div className="stat-value" style={{ color: '#ffc107', fontSize: '24px' }}>€{analytics.sundayRevenue}</div>
                              <div className="stat-subtitle">Revenue</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Filters */}
                  <div className="filter-section">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h6 className="mb-0" style={{ color: '#ffc107' }}>
                        <FaFilter className="me-2" />
                        Filters
                      </h6>
                      <button 
                        className="btn btn-sm btn-outline-warning d-md-none"
                        onClick={() => setShowFilters(!showFilters)}
                      >
                        {showFilters ? <FaTimes /> : <FaFilter />}
                      </button>
                    </div>

                    <div className={`row ${showFilters || window.innerWidth > 768 ? '' : 'd-none'}`}>
                      <div className="col-lg-3 col-md-6 col-sm-6 mb-3">
                        <label className="form-label small" style={{ color: '#999' }}>Payment Status</label>
                        <select className="form-select" value={paymentStatusFilter} onChange={(e) => setPaymentStatusFilter(e.target.value)}>
                          <option value="All">All Status</option>
                          <option value="Paid">Paid</option>
                          <option value="Pending">Pending</option>
                        </select>
                      </div>

                      <div className="col-lg-3 col-md-6 col-sm-6 mb-3">
                        <label className="form-label small" style={{ color: '#999' }}>Kid Level</label>
                        <select className="form-select" value={levelFilter} onChange={(e) => setLevelFilter(e.target.value)}>
                          <option value="All">All Levels</option>
                          <option value="Beginner">Beginner</option>
                          <option value="Intermediate">Intermediate</option>
                          <option value="Advanced">Advanced</option>
                        </select>
                      </div>

                      <div className="col-lg-6 col-md-12 mb-3">
                        <label className="form-label small" style={{ color: '#999' }}>Search</label>
                        <div className="search-box">
                          <FaSearch className="search-icon" />
                          <input 
                            type="text" 
                            className="form-control" 
                            placeholder="Search by parent, email, or kid name..." 
                            value={bookingSearch}
                            onChange={(e) => setBookingSearch(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Active Filters */}
                    <div className="mt-2">
                      {(paymentStatusFilter !== "All" || levelFilter !== "All" || bookingSearch) && (
                        <div className="d-flex flex-wrap align-items-center">
                          <span className="text-muted small me-2">Active filters:</span>
                          {paymentStatusFilter !== "All" && (
                            <span className="filter-badge">
                              Status: {paymentStatusFilter}
                              <FaTimes style={{ cursor: 'pointer' }} onClick={() => setPaymentStatusFilter("All")} />
                            </span>
                          )}
                          {levelFilter !== "All" && (
                            <span className="filter-badge">
                              Level: {levelFilter}
                              <FaTimes style={{ cursor: 'pointer' }} onClick={() => setLevelFilter("All")} />
                            </span>
                          )}
                          {bookingSearch && (
                            <span className="filter-badge">
                              Search: {bookingSearch}
                              <FaTimes style={{ cursor: 'pointer' }} onClick={() => setBookingSearch("")} />
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {loading ? (
                    <div className="text-center py-5">
                      <div className="spinner-border" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                      <p className="mt-3 text-muted">Loading bookings...</p>
                    </div>
                  ) : (
                    <>
                      <div className="table-responsive">
                        <table className="table table-dark table-hover">
                          <thead>
                            <tr>
                              <th style={{ minWidth: '80px' }}>ID</th>
                              <th style={{ minWidth: '150px' }}>Parent</th>
                              <th style={{ minWidth: '180px' }}>Email</th>
                              <th style={{ minWidth: '120px' }}>Kid</th>
                              <th style={{ minWidth: '100px' }}>Level</th>
                              <th style={{ minWidth: '100px' }}>Amount</th>
                              <th style={{ minWidth: '100px' }}>Status</th>
                              <th style={{ minWidth: '150px' }}>Sessions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {currentBookings.map((b, index) => (
                              <tr key={b.bookingId} className="animate-slide-up" style={{ animationDelay: `${index * 50}ms` }}>
                                <td className="small" style={{ color: '#999' }}>{b.bookingId}</td>
                                <td className="fw-medium">{b.parentName}</td>
                                <td className="small" style={{ color: '#999' }}>{b.parentEmail}</td>
                                <td>{b.kidName}</td>
                                <td><span className="badge bg-warning">{b.kidLevel}</span></td>
                                <td className="fw-semibold" style={{ color: '#00c853' }}>€{b.totalAmount}</td>
                                <td>
                                  <span className={`badge ${b.paymentStatus ? 'bg-success' : 'bg-danger'}`}>
                                    {b.paymentStatus ? "Paid" : "Pending"}
                                  </span>
                                </td>
                                <td style={{ position: 'relative', overflow: 'visible' }}>
  {b.sessionDetails.length === 1 ? (
    (() => {
      const s = b.sessionDetails[0];
      const parts = s.split(" - ");
      let dayPart = parts[0];
      let rest = parts[1] || "";
      rest = rest.replace("null", "").trim();
      return (
        <div className="small">
          <div className="fw-medium" style={{ color: '#ffc107' }}>{dayPart}</div>
          <div style={{ color: '#999' }}>{rest}</div>
        </div>
      );
    })()
  ) : (
    <div className="dropdown">
      <button
        className="btn btn-sm btn-outline-warning dropdown-toggle"
        type="button"
        data-bs-toggle="dropdown"
      >
        {b.sessionDetails.length} Sessions
      </button>
      <ul className="dropdown-menu" style={{ zIndex: 9999 }}>
        {b.sessionDetails.map((s, i) => {
          const parts = s.split(" - ");
          let dayPart = parts[0];
          let rest = parts[1] || "";
          rest = rest.replace("null", "").trim();
          return (
            <li key={i}>
              <div className="dropdown-item-text small">
                <div className="fw-medium" style={{ color: '#ffc107' }}>{dayPart}</div>
                <div style={{ color: '#999' }}>{rest}</div>
              </div>
              {i < b.sessionDetails.length - 1 && <hr className="dropdown-divider" style={{ borderColor: '#333' }} />}
            </li>
          );
        })}
      </ul>
    </div>
  )}
</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      
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
              )}

              {/* Finance Tab */}
              {activeNav === "Finance" && (
                <div className="animate-slide-up">
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2 className="mb-0" style={{ color: '#ffc107' }}>
                      <FaChartLine className="me-2" />
                      Financial Overview
                    </h2>
                    <button className="btn btn-outline-warning">
                      <FaDownload className="me-2" />
                      Export Report
                    </button>
                  </div>

                  {/* Financial Stats */}
                  <div className="row mb-4">
                    <StatCard 
                      title="Total Revenue" 
                      value={`€${bookings.filter(b => b.paymentStatus).reduce((sum, b) => sum + b.totalAmount, 0)}`}
                      subtitle="Paid bookings"
                      icon={<FaCheck />}
                      color="#00c853"
                      delay={0}
                    />
                    <StatCard 
                      title="Pending Revenue" 
                      value={`€${bookings.filter(b => !b.paymentStatus).reduce((sum, b) => sum + b.totalAmount, 0)}`}
                      subtitle="Awaiting payment"
                      icon={<FaCalendarAlt />}
                      color="#ff5252"
                      delay={100}
                    />
                    <StatCard 
                      title="Total Bookings" 
                      value={bookings.length}
                      subtitle="All time"
                      icon={<FaChartLine />}
                      color="#2196f3"
                      delay={200}
                    />
                    <StatCard 
                      title="Completion Rate" 
                      value={`${bookings.length > 0 ? Math.round((bookings.filter(b => b.paymentStatus).length / bookings.length) * 100) : 0}%`}
                      subtitle={`${bookings.filter(b => b.paymentStatus).length} paid`}
                      icon={<FaCheck />}
                      color="#ffc107"
                      delay={300}
                    />
                  </div>

                  {/* Payment Status Table */}
                  <div className="stat-card mb-4">
                    <div className="stat-card-body">
                      <h5 className="mb-4" style={{ color: '#ffc107' }}>Payment Status Details</h5>
                      <div className="table-responsive">
                        <table className="table table-dark table-hover">
                          <thead>
                            <tr>
                              <th>ID</th>
                              <th>Parent</th>
                              <th>Kid</th>
                              <th>Amount</th>
                              <th>Status</th>
                              <th>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {currentBookings.map((b, index) => (
                              <tr key={b.bookingId} className="animate-slide-up" style={{ animationDelay: `${index * 50}ms` }}>
                                <td className="small" style={{ color: '#999' }}>{b.bookingId}</td>
                                <td className="fw-medium">{b.parentName}</td>
                                <td>{b.kidName}</td>
                                <td className="fw-semibold" style={{ color: '#00c853' }}>€{b.totalAmount}</td>
                                <td>
                                  <span className={`badge ${b.paymentStatus ? 'bg-success' : 'bg-danger'}`}>
                                    {b.paymentStatus ? "Paid" : "Pending"}
                                  </span>
                                </td>
                                <td>
                                  {!b.paymentStatus ? (
                                    <button 
                                      className="btn btn-sm btn-warning"
                                      onClick={() => alert(`Mark booking ${b.bookingId} as paid`)}
                                    >
                                      Mark Paid
                                    </button>
                                  ) : (
                                    <span style={{ color: '#00c853' }}>✓ Completed</span>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      
                      <Pagination
                        currentPage={bookingsCurrentPage}
                        totalPages={totalBookingsPages}
                        onPageChange={setBookingsCurrentPage}
                        itemsPerPage={bookingsPerPage}
                        setItemsPerPage={setBookingsPerPage}
                        totalItems={filteredBookings.length}
                      />
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>
        </main>

        {/* Mobile Bottom Navigation */}
        <div className="mobile-nav-bottom">
          <div className="container-fluid">
            <div className="row">
              {["Sessions", "Bookings", "Finance"].map((item) => (
                <div key={item} className="col-4">
                  <button
                    onClick={() => handleNavSwitch(item)}
                    className={`btn w-100 ${activeNav === item ? 'btn-warning' : 'btn-outline-warning'}`}
                    style={{ 
                      fontSize: '14px',
                      padding: '10px 5px',
                      borderRadius: '8px'
                    }}
                  >
                    {item}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Backdrop for dropdown */}
        {profileDropdownOpen && (
          <div 
            className="position-fixed w-100 h-100" 
            style={{ top: 0, left: 0, zIndex: 1040 }}
            onClick={() => setProfileDropdownOpen(false)}
          />
        )}
      </div>
    </>
  );
}