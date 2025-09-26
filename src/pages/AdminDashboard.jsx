import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSessionsByYear, updateBookedCount } from "../Redux/Sessions/sessionsSlice";
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaBars, FaUser, FaSignOutAlt, FaChevronDown } from "react-icons/fa";
import { logOutUserWithType } from "@/Redux/Authentication/AuthenticationAction";
import { useRouter } from "next/router";

export default function AdminDashboard() {
  const dispatch = useDispatch();
  const router = useRouter();
  
  // ✅ ALL HOOKS MUST BE AT THE TOP - BEFORE ANY CONDITIONAL LOGIC
  const { data: sessions, loading } = useSelector((state) => state.sessions);
  const loginData = useSelector((state) => state.auth.loginData);
  const bookings = useSelector(state => state.bookings.bookings);

  const [year, setYear] = useState("2025");
  const [dayFilter, setDayFilter] = useState("All");
  const [classFilter, setClassFilter] = useState("All");
  const [activeNav, setActiveNav] = useState("Sessions");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  
  // Pagination states for Sessions
  const [sessionsCurrentPage, setSessionsCurrentPage] = useState(1);
  const [sessionsPerPage, setSessionsPerPage] = useState(10);
  const [updatedSessions, setUpdatedSessions] = useState(new Set());
  
  // Pagination states for Bookings
  const [bookingsCurrentPage, setBookingsCurrentPage] = useState(1);
  const [bookingsPerPage, setBookingsPerPage] = useState(10);

  // ✅ ALL useEffect HOOKS AT THE TOP TOO
  useEffect(() => {
    import('bootstrap/dist/js/bootstrap.bundle.min.js');
  }, []);

  useEffect(() => {
    if (loginData?.token) {
      dispatch(fetchSessionsByYear(year));
    }
  }, [year, loginData, dispatch]);

  // ✅ HELPER FUNCTIONS
  const handleLoginRoute = () => {
    router.push("/");
  }

  const handleLogout = () => {
    console.log("Logout clicked");
    dispatch(logOutUserWithType());
  };

  // ✅ NOW CHECK CONDITIONS AFTER ALL HOOKS ARE CALLED
  // Authentication check - early return if not authenticated or not admin
  if (!loginData?.token) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center" style={{ backgroundColor: "#f8f9fa" }}>
        <div className="text-center">
          <div className="card shadow-sm" style={{ maxWidth: "400px" }}>
            <div className="card-body p-5">
              <FaUser className="text-muted mb-3" style={{ fontSize: "3rem" }} />
              <h4 className="text-dark mb-3">Authentication Required</h4>
              <p className="text-muted mb-4">Please login again to access the admin dashboard.</p>
              <button className="btn btn-primary" onClick={handleLoginRoute}>
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
      <div className="min-vh-100 d-flex align-items-center justify-content-center" style={{ backgroundColor: "#f8f9fa" }}>
        <div className="text-center">
          <div className="card shadow-sm" style={{ maxWidth: "400px" }}>
            <div className="card-body p-5">
              <FaSignOutAlt className="text-danger mb-3" style={{ fontSize: "3rem" }} />
              <h4 className="text-dark mb-3">Access Denied</h4>
              <p className="text-muted mb-4">You are unauthorized to access this admin dashboard.</p>
              <button className="btn btn-outline-secondary">
                Go Back
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ✅ COMPONENT LOGIC AFTER AUTHENTICATION CHECKS
  const filteredSessions = sessions.filter((s) => {
    if (dayFilter !== "All" && s.day !== dayFilter) return false;
    if (dayFilter === "Sunday" && classFilter !== "All" && s.sessionClass !== classFilter) return false;
    return true;
  });

  // Pagination logic for Sessions
  const indexOfLastSession = sessionsCurrentPage * sessionsPerPage;
  const indexOfFirstSession = indexOfLastSession - sessionsPerPage;
  const currentSessions = filteredSessions.slice(indexOfFirstSession, indexOfLastSession);
  const totalSessionsPages = Math.ceil(filteredSessions.length / sessionsPerPage);

  // Pagination logic for Bookings
  const indexOfLastBooking = bookingsCurrentPage * bookingsPerPage;
  const indexOfFirstBooking = indexOfLastBooking - bookingsPerPage;
  const currentBookings = bookings.slice(indexOfFirstBooking, indexOfLastBooking);
  const totalBookingsPages = Math.ceil(bookings.length / bookingsPerPage);

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

  const Pagination = ({ currentPage, totalPages, onPageChange, pageType, itemsPerPage, setItemsPerPage }) => {
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

    const totalItems = pageType === 'sessions' ? filteredSessions.length : bookings.length;

    return (
      <div className="d-flex flex-column flex-lg-row justify-content-between align-items-center mt-4">
        <div className="d-flex align-items-center mb-3 mb-lg-0">
          <label className="me-2 text-muted small">Show:</label>
          <select 
            className="form-select form-select-sm" 
            style={{ width: "auto" }}
            value={itemsPerPage}
            onChange={(e) => {
              const newPerPage = parseInt(e.target.value);
              setItemsPerPage(newPerPage);
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
          <span className="ms-2 text-muted small">entries</span>
        </div>
        
        <div className="text-muted small mb-3 mb-lg-0">
          Showing {((currentPage - 1) * itemsPerPage) + 1} to{' '}
          {Math.min(currentPage * itemsPerPage, totalItems)} of{' '}
          {totalItems} entries
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

  return (
    <div className="min-vh-100" style={{ backgroundColor: "#f8f9fa" }}>
      {/* Header */}
      <header className="bg-white shadow-sm border-bottom">
        <div className="container-fluid">
          <div className="row align-items-center py-3">
            <div className="col-md-3 col-6">
              <h4 className="mb-0 text-primary fw-bold">Admin Dashboard</h4>
            </div>
            
            {/* Desktop Navigation */}
            <div className="col-md-6 d-none d-md-block">
              <nav className="nav nav-pills justify-content-center">
                {["Sessions", "Bookings", "Finance"].map((item) => (
                  <button
                    key={item}
                    onClick={() => setActiveNav(item)}
                    className={`nav-link mx-1 ${activeNav === item ? 'active' : 'text-muted'}`}
                    style={{
                      backgroundColor: activeNav === item ? '#0d6efd' : 'transparent',
                      color: activeNav === item ? 'white' : '#6c757d',
                      border: 'none'
                    }}
                  >
                    {item}
                  </button>
                ))}
              </nav>
            </div>
            
            {/* Profile Dropdown */}
            <div className="col-md-3 col-6 text-end">
              <div className="dropdown position-relative">
                <button
                  className="btn btn-outline-secondary dropdown-toggle d-flex align-items-center ms-auto"
                  style={{ width: 'fit-content' }}
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  type="button"
                >
                  <FaUser className="me-2" />
                  <span className="d-none d-sm-inline">Admin</span>
                  <FaChevronDown className="ms-1" style={{ fontSize: '0.8em' }} />
                </button>
                {profileDropdownOpen && (
                  <div className="dropdown-menu dropdown-menu-end show position-absolute" style={{ top: '100%', right: 0, zIndex: 1050 }}>
                    <button className="dropdown-item" onClick={handleLogout}>
                      <FaSignOutAlt className="me-2" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
              
              {/* Mobile Menu Button */}
              <button
                className="btn btn-outline-secondary ms-2 d-md-none"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <FaBars />
              </button>
            </div>
          </div>
          
          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="row d-md-none">
              <div className="col-12">
                <nav className="nav nav-pills flex-column py-3">
                  {["Sessions", "Bookings", "Finance"].map((item) => (
                    <button
                      key={item}
                      onClick={() => {
                        setActiveNav(item);
                        setMobileMenuOpen(false);
                      }}
                      className={`nav-link mb-2 text-start ${activeNav === item ? 'active' : 'text-muted'}`}
                      style={{
                        backgroundColor: activeNav === item ? '#0d6efd' : 'transparent',
                        color: activeNav === item ? 'white' : '#6c757d',
                        border: 'none'
                      }}
                    >
                      {item}
                    </button>
                  ))}
                </nav>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="container-fluid py-4">
        <div className="row">
          <div className="col-12">
            <div className="bg-white rounded-3 shadow-sm p-4">
              <h2 className="mb-4 text-dark">{activeNav}</h2>

              {activeNav === "Sessions" && (
                <>
                  <div className="d-flex flex-column flex-lg-row justify-content-between align-items-start align-items-lg-center mb-4">
                    <button className="btn btn-primary mb-3 mb-lg-0" onClick={initSessions}>
                      Initialize All Sessions
                    </button>
                  </div>

                  <div className="row mb-4">
                    <div className="col-lg-2 col-md-4 col-sm-6 mb-3">
                      <label className="form-label small text-muted">Year</label>
                      <select className="form-select" value={year} onChange={(e) => setYear(e.target.value)}>
                        <option value="2025">2025</option>
                        <option value="2026">2026</option>
                      </select>
                    </div>

                    <div className="col-lg-2 col-md-4 col-sm-6 mb-3">
                      <label className="form-label small text-muted">Day</label>
                      <select className="form-select" value={dayFilter} onChange={(e) => setDayFilter(e.target.value)}>
                        <option value="All">All</option>
                        <option value="Friday">Friday</option>
                        <option value="Sunday">Sunday</option>
                      </select>
                    </div>

                    {dayFilter === "Sunday" && (
                      <div className="col-lg-2 col-md-4 col-sm-6 mb-3">
                        <label className="form-label small text-muted">Class</label>
                        <select className="form-select" value={classFilter} onChange={(e) => setClassFilter(e.target.value)}>
                          <option value="All">All</option>
                          <option value="Class 1">Class 1</option>
                          <option value="Class 2">Class 2</option>
                        </select>
                      </div>
                    )}
                  </div>

                  {loading ? (
                    <div className="text-center py-5">
                      <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                      <p className="mt-3 text-muted">Loading sessions...</p>
                    </div>
                  ) : (
                    <>
                      <div className="table-responsive">
                        <table className="table table-hover align-middle">
                          <thead className="table-light">
                            <tr>
                              <th className="fw-semibold">Date</th>
                              <th className="fw-semibold">Day</th>
                              <th className="fw-semibold">Time</th>
                              <th className="fw-semibold">Type</th>
                              <th className="fw-semibold">Class</th>
                              <th className="fw-semibold">Booked Slots</th>
                            </tr>
                          </thead>
                          <tbody>
                            {currentSessions.map((s) => (
                              <tr key={s.id}>
                                <td className="text-muted">{s.date}</td>
                                <td><span className="badge bg-light text-dark">{s.day}</span></td>
                                <td className="text-muted">{s.time}</td>
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
                        pageType="sessions"
                        itemsPerPage={sessionsPerPage}
                        setItemsPerPage={setSessionsPerPage}
                      />
                    </>
                  )}
                </>
              )}

              {activeNav === "Bookings" && (
                <>
                  {loading ? (
                    <div className="text-center py-5">
                      <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                      <p className="mt-3 text-muted">Loading bookings...</p>
                    </div>
                  ) : (
                    <>
                      <div className="table-responsive">
                        <table className="table table-hover align-middle">
                          <thead className="table-light">
                            <tr>
                              <th className="fw-semibold" style={{ width: "8%" }}>ID</th>
                              <th className="fw-semibold" style={{ width: "15%" }}>Parent</th>
                              <th className="fw-semibold" style={{ width: "18%" }}>Email</th>
                              <th className="fw-semibold" style={{ width: "12%" }}>Kid</th>
                              <th className="fw-semibold" style={{ width: "10%" }}>Level</th>
                              <th className="fw-semibold" style={{ width: "10%" }}>Amount</th>
                              <th className="fw-semibold" style={{ width: "12%" }}>Status</th>
                              <th className="fw-semibold" style={{ width: "15%" }}>Sessions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {currentBookings.map((b) => (
                              <tr key={b.bookingId}>
                                <td className="text-muted small">{b.bookingId}</td>
                                <td className="fw-medium">{b.parentName}</td>
                                <td className="text-muted small">{b.parentEmail}</td>
                                <td>{b.kidName}</td>
                                <td><span className="badge bg-light text-dark">{b.kidLevel}</span></td>
                                <td className="fw-semibold text-success">€{b.totalAmount}</td>
                                <td>
                                  <span className={`badge ${b.paymentStatus ? 'bg-success' : 'bg-warning text-dark'}`}>
                                    {b.paymentStatus ? "Paid" : "Pending"}
                                  </span>
                                </td>
                                <td>
                                  {b.sessionDetails.length === 1 ? (
                                    (() => {
                                      const s = b.sessionDetails[0];
                                      const parts = s.split(" - ");
                                      let dayPart = parts[0];
                                      let rest = parts[1] || "";
                                      rest = rest.replace("null", "").trim();
                                      return (
                                        <div className="small">
                                          <div className="fw-medium">{dayPart}</div>
                                          <div className="text-muted">{rest}</div>
                                        </div>
                                      );
                                    })()
                                  ) : (
                                    <div className="dropdown">
                                      <button
                                        className="btn btn-sm btn-outline-primary dropdown-toggle"
                                        type="button"
                                        data-bs-toggle="dropdown"
                                      >
                                        {b.sessionDetails.length} Sessions
                                      </button>
                                      <ul className="dropdown-menu">
                                        {b.sessionDetails.map((s, i) => {
                                          const parts = s.split(" - ");
                                          let dayPart = parts[0];
                                          let rest = parts[1] || "";
                                          rest = rest.replace("null", "").trim();
                                          return (
                                            <li key={i}>
                                              <div className="dropdown-item-text small">
                                                <div className="fw-medium">{dayPart}</div>
                                                <div className="text-muted">{rest}</div>
                                              </div>
                                              {i < b.sessionDetails.length - 1 && <hr className="dropdown-divider" />}
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
                        pageType="bookings"
                        itemsPerPage={bookingsPerPage}
                        setItemsPerPage={setBookingsPerPage}
                      />
                    </>
                  )}
                </>
              )}

              {activeNav === "Finance" && (
                <>
                  {/* Finance Stats Cards */}
                  <div className="row mb-4">
                    <div className="col-xl-3 col-md-6 mb-3">
                      <div className="card border-0 shadow-sm h-100">
                        <div className="card-body text-center">
                          <div className="text-success fs-3 mb-2">€{bookings.filter(b => b.paymentStatus).reduce((sum, b) => sum + b.totalAmount, 0)}</div>
                          <h6 className="card-title text-muted mb-1">Total Revenue</h6>
                          <small className="text-muted">Paid bookings</small>
                        </div>
                      </div>
                    </div>
                    
                    <div className="col-xl-3 col-md-6 mb-3">
                      <div className="card border-0 shadow-sm h-100">
                        <div className="card-body text-center">
                          <div className="text-warning fs-3 mb-2">€{bookings.filter(b => !b.paymentStatus).reduce((sum, b) => sum + b.totalAmount, 0)}</div>
                          <h6 className="card-title text-muted mb-1">Pending Revenue</h6>
                          <small className="text-muted">Unpaid bookings</small>
                        </div>
                      </div>
                    </div>
                    
                    <div className="col-xl-3 col-md-6 mb-3">
                      <div className="card border-0 shadow-sm h-100">
                        <div className="card-body text-center">
                          <div className="text-primary fs-3 mb-2">{bookings.length}</div>
                          <h6 className="card-title text-muted mb-1">Total Bookings</h6>
                          <small className="text-muted">All time</small>
                        </div>
                      </div>
                    </div>
                    
                    <div className="col-xl-3 col-md-6 mb-3">
                      <div className="card border-0 shadow-sm h-100">
                        <div className="card-body text-center">
                          <div className="text-success fs-3 mb-2">{bookings.filter(b => b.paymentStatus).length}</div>
                          <h6 className="card-title text-muted mb-1">Paid Bookings</h6>
                          <small className="text-muted">{bookings.length > 0 ? Math.round((bookings.filter(b => b.paymentStatus).length / bookings.length) * 100) : 0}% completion rate</small>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Payment Status Details */}
                  <div className="card border-0 shadow-sm">
                    <div className="card-header bg-light">
                      <h5 className="mb-0 text-dark">Payment Status Details</h5>
                    </div>
                    <div className="card-body">
                      <div className="table-responsive">
                        <table className="table table-hover align-middle">
                          <thead className="table-light">
                            <tr>
                              <th className="fw-semibold">ID</th>
                              <th className="fw-semibold">Parent</th>
                              <th className="fw-semibold">Kid</th>
                              <th className="fw-semibold">Amount</th>
                              <th className="fw-semibold">Status</th>
                              <th className="fw-semibold">Date</th>
                              <th className="fw-semibold">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {currentBookings.map((b) => (
                              <tr key={b.bookingId}>
                                <td className="text-muted small">{b.bookingId}</td>
                                <td className="fw-medium">{b.parentName}</td>
                                <td>{b.kidName}</td>
                                <td className="fw-semibold text-success">€{b.totalAmount}</td>
                                <td>
                                  <span className={`badge ${b.paymentStatus ? 'bg-success' : 'bg-danger'}`}>
                                    {b.paymentStatus ? "Paid" : "Pending"}
                                  </span>
                                </td>
                                <td className="text-muted small">{b.bookingDate || "N/A"}</td>
                                <td>
                                  {!b.paymentStatus ? (
                                    <button 
                                      className="btn btn-sm btn-success"
                                      onClick={() => alert(`Mark booking ${b.bookingId} as paid`)}
                                    >
                                      Mark Paid
                                    </button>
                                  ) : (
                                    <span className="text-success small">✓ Completed</span>
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
                        pageType="bookings"
                        itemsPerPage={bookingsPerPage}
                        setItemsPerPage={setBookingsPerPage}
                      />
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </main>
      
      {/* Backdrop for profile dropdown */}
      {profileDropdownOpen && (
        <div 
          className="position-fixed w-100 h-100" 
          style={{ top: 0, left: 0, zIndex: 1040 }}
          onClick={() => setProfileDropdownOpen(false)}
        />
      )}
    </div>
  );
}