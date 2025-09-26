import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSessionsByYear, updateBookedCount } from "../Redux/Sessions/sessionsSlice";
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaBars } from "react-icons/fa"; // For hamburger menu

export default function AdminDashboard() {
  const dispatch = useDispatch();
  const { data: sessions, loading } = useSelector((state) => state.sessions);
  const loginData = useSelector((state) => state.auth.loginData);
  const bookings = useSelector(state => state.bookings.bookings);
//   const loading = useSelector(state => state.bookings.loading);

  const [year, setYear] = useState("2025");
  const [dayFilter, setDayFilter] = useState("All");
  const [classFilter, setClassFilter] = useState("All");
  const [activeNav, setActiveNav] = useState("Sessions");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  // Pagination states for Sessions
  const [sessionsCurrentPage, setSessionsCurrentPage] = useState(1);
  const [sessionsPerPage, setSessionsPerPage] = useState(6);
  const [updatedSessions, setUpdatedSessions] = useState(new Set());
  
  // Pagination states for Bookings
  const [bookingsCurrentPage, setBookingsCurrentPage] = useState(1);
  const [bookingsPerPage, setBookingsPerPage] = useState(6);

  // Add Bootstrap JS for dropdown functionality
  useEffect(() => {
    // Import Bootstrap JS dynamically
    import('bootstrap/dist/js/bootstrap.bundle.min.js');
  }, []);

  useEffect(() => {
    if (loginData?.token) {
      dispatch(fetchSessionsByYear(year));
    }
  }, [year, loginData]);

  const filteredSessions = sessions.filter((s) => {
    // Hide updated sessions
    if (updatedSessions.has(s.id)) return false;
    
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

  const handleSlotUpdate = async (id, newCount) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/sessions/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${loginData.token}`,
        },
        body: JSON.stringify({ bookedCount: Number(newCount) }),
      });
      if (!res.ok) throw new Error("Failed to update");
      dispatch(updateBookedCount({ id, bookedCount: Number(newCount) }));
      
      // Hide the updated session
      setUpdatedSessions(prev => new Set([...prev, id]));
    } catch (err) {
      console.error(err);
      alert("Error updating booked count");
    }
  };

  const initSessions = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/sessions/init`, {
        method: "POST",
        headers: { Authorization: `Bearer ${loginData.token}` },
      });
      if (!res.ok) throw new Error("Failed to init sessions");
      alert("Sessions initialized!");
      dispatch(fetchSessionsByYear(year));
      // Clear updated sessions set when reinitializing
      setUpdatedSessions(new Set());
    } catch (err) {
      console.error(err);
      alert("Error initializing sessions");
    }
  };

  // Pagination component
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
      <div>
        {/* Records per page selector */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div className="d-flex align-items-center">
            <label className="me-2">Show:</label>
            <select 
              className="form-select" 
              style={{ width: "auto" }}
              value={itemsPerPage}
              onChange={(e) => {
                const newPerPage = parseInt(e.target.value);
                setItemsPerPage(newPerPage);
                // Reset to page 1 when changing items per page
                onPageChange(1);
              }}
            >
              <option value={6}>6</option>
              <option value={10}>10</option>
              <option value={15}>15</option>
              <option value={20}>20</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
            <span className="ms-2">entries</span>
          </div>
          
          <div className="text-muted">
            Showing {((currentPage - 1) * itemsPerPage) + 1} to{' '}
            {Math.min(currentPage * itemsPerPage, totalItems)} of{' '}
            {totalItems} entries
          </div>
        </div>

        {totalPages > 1 && (
          <nav>
            <ul className="pagination justify-content-center">
              <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                <button
                  className="page-link"
                  onClick={() => onPageChange(1)}
                  disabled={currentPage === 1}
                >
                  First
                </button>
              </li>
              <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                <button
                  className="page-link"
                  onClick={() => onPageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
              </li>
              
              {pages.map(page => (
                <li key={page} className={`page-item ${currentPage === page ? 'active' : ''}`}>
                  <button
                    className="page-link"
                    onClick={() => onPageChange(page)}
                  >
                    {page}
                  </button>
                </li>
              ))}
              
              <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                <button
                  className="page-link"
                  onClick={() => onPageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </li>
              <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                <button
                  className="page-link"
                  onClick={() => onPageChange(totalPages)}
                  disabled={currentPage === totalPages}
                >
                  Last
                </button>
              </li>
            </ul>
          </nav>
        )}
      </div>
    );
  };

  return (
    <div className="d-flex" style={{ minHeight: "100vh", backgroundColor: "#222", color: "#FFD700" }}>
      {/* Sidebar */}
      <div
        className={`d-flex flex-column p-3 bg-dark text-warning position-relative`}
        style={{
          width: sidebarOpen ? "220px" : "60px",
          transition: "width 0.3s",
        }}
      >
        {/* Toggle Button */}
        <button
          className="btn btn-dark text-warning mb-3"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          style={{ width: "100%" }}
        >
          <FaBars />
          {sidebarOpen && <span className="ms-2">Admin Panel</span>}
        </button>

        {/* Nav Items */}
        {["Sessions", "Bookings", "Finance"].map((item) => (
          <button
            key={item}
            onClick={() => setActiveNav(item)}
            className={`btn w-100 mb-2 text-start text-${activeNav === item ? "dark" : "warning"} btn-${activeNav === item ? "warning" : "dark"}`}
          >
            {sidebarOpen ? item : item.charAt(0)}
          </button>
        ))}
      </div>

      {/* Main Content */}
      <div className="flex-grow-1 p-4">
        <h1>{activeNav}</h1>

        {activeNav === "Sessions" && (
          <>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <button className="btn btn-warning" onClick={initSessions}>Initialize All Sessions</button>
              <div className="text-muted">
                {updatedSessions.size > 0 && (
                  <small>{updatedSessions.size} session(s) updated and hidden</small>
                )}
              </div>
            </div>

            <div className="mb-3 d-flex gap-3 align-items-center flex-wrap">
              <div>
                Year:{" "}
                <select className="form-select" value={year} onChange={(e) => setYear(e.target.value)}>
                  <option value="2025">2025</option>
                  <option value="2026">2026</option>
                </select>
              </div>

              <div>
                Day:{" "}
                <select className="form-select" value={dayFilter} onChange={(e) => setDayFilter(e.target.value)}>
                  <option value="All">All</option>
                  <option value="Friday">Friday</option>
                  <option value="Sunday">Sunday</option>
                </select>
              </div>

              {dayFilter === "Sunday" && (
                <div>
                  Class:{" "}
                  <select className="form-select" value={classFilter} onChange={(e) => setClassFilter(e.target.value)}>
                    <option value="All">All</option>
                    <option value="Class 1">Class 1</option>
                    <option value="Class 2">Class 2</option>
                  </select>
                </div>
              )}
            </div>

            {loading ? (
              <p>Loading sessions...</p>
            ) : (
              <>
                <div className="table-responsive">
                  <table className="table table-dark table-hover">
                    <thead className="table-warning text-dark">
                      <tr>
                        <th>Date</th>
                        <th>Day</th>
                        <th>Time</th>
                        <th>Type</th>
                        <th>Class</th>
                        <th>Booked Slots</th>
                        <th>Update Slots</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentSessions.map((s) => (
                        <tr key={s.id}>
                          <td>{s.date}</td>
                          <td>{s.day}</td>
                          <td>{s.time}</td>
                          <td>{s.type}</td>
                          <td>{s.sessionClass || "-"}</td>
                          <td>{s.bookedCount}</td>
                          <td>
                            <input
                              type="number"
                              defaultValue={s.bookedCount}
                              min="0"
                              max="36"
                              onBlur={(e) => handleSlotUpdate(s.id, e.target.value)}
                              className="form-control"
                              style={{ width: "80px" }}
                            />
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
            <h3>All Bookings</h3>
            {loading ? (
              <p>Loading bookings...</p>
            ) : (
              <>
                <div className="table-responsive">
                  <table className="table table-dark table-hover">
                    <thead className="table-warning text-dark">
                      <tr>
                        <th style={{ width: "8%" }}>Booking ID</th>
                        <th style={{ width: "15%" }}>Parent Name</th>
                        <th style={{ width: "18%" }}>Parent Email</th>
                        <th style={{ width: "12%" }}>Kid Name</th>
                        <th style={{ width: "10%" }}>Kid Level</th>
                        <th style={{ width: "10%" }}>Total Amount</th>
                        <th style={{ width: "12%" }}>Payment Status</th>
                        <th style={{ width: "15%" }}>Session Details</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentBookings.map((b) => (
                        <tr key={b.bookingId}>
                          <td>{b.bookingId}</td>
                          <td>{b.parentName}</td>
                          <td>{b.parentEmail}</td>
                          <td>{b.kidName}</td>
                          <td>{b.kidLevel}</td>
                          <td>₹{b.totalAmount}</td>
                          <td>
                            <span className={`badge ${b.paymentStatus ? 'bg-success' : 'bg-warning text-dark'}`}>
                              {b.paymentStatus ? "Paid" : "Pending"}
                            </span>
                          </td>
                          <td style={{ fontSize: "0.85em", lineHeight: "1.2" }}>
                            {b.sessionDetails.length === 1 ? (
                              // Single session - show directly
                              (() => {
                                const s = b.sessionDetails[0];
                                const parts = s.split(" - ");
                                let dayPart = parts[0];
                                let rest = parts[1] || "";
                                rest = rest.replace("null", "").trim();
                                return (
                                  <div>
                                    <strong>{dayPart}</strong><br />
                                    <small className="text-muted">{rest}</small>
                                  </div>
                                );
                              })()
                            ) : (
                              // Multiple sessions - show dropdown
                              <div className="dropdown">
                                <button
                                  className="btn btn-sm btn-outline-warning dropdown-toggle"
                                  type="button"
                                  data-bs-toggle="dropdown"
                                  aria-expanded="false"
                                  style={{ fontSize: "0.8em" }}
                                >
                                  {b.sessionDetails.length} Sessions
                                </button>
                                <ul className="dropdown-menu dropdown-menu-dark">
                                  {b.sessionDetails.map((s, i) => {
                                    const parts = s.split(" - ");
                                    let dayPart = parts[0];
                                    let rest = parts[1] || "";
                                    rest = rest.replace("null", "").trim();
                                    return (
                                      <li key={i}>
                                        <div className="dropdown-item-text" style={{ fontSize: "0.85em" }}>
                                          <strong>{dayPart}</strong><br />
                                          <small className="text-muted">{rest}</small>
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
            <h3>Finance Overview</h3>
            
            {/* Finance Stats Cards */}
            <div className="row mb-4">
              <div className="col-md-3">
                <div className="card bg-dark border-warning">
                  <div className="card-body text-center">
                    <h5 className="card-title text-warning">Total Revenue</h5>
                    <h3 className="text-success">₹{bookings.filter(b => b.paymentStatus).reduce((sum, b) => sum + b.totalAmount, 0)}</h3>
                    <small className="text-muted">Paid bookings</small>
                  </div>
                </div>
              </div>
              
              <div className="col-md-3">
                <div className="card bg-dark border-warning">
                  <div className="card-body text-center">
                    <h5 className="card-title text-warning">Pending Revenue</h5>
                    <h3 className="text-warning">₹{bookings.filter(b => !b.paymentStatus).reduce((sum, b) => sum + b.totalAmount, 0)}</h3>
                    <small className="text-muted">Unpaid bookings</small>
                  </div>
                </div>
              </div>
              
              <div className="col-md-3">
                <div className="card bg-dark border-warning">
                  <div className="card-body text-center">
                    <h5 className="card-title text-warning">Total Bookings</h5>
                    <h3 className="text-info">{bookings.length}</h3>
                    <small className="text-muted">All time</small>
                  </div>
                </div>
              </div>
              
              <div className="col-md-3">
                <div className="card bg-dark border-warning">
                  <div className="card-body text-center">
                    <h5 className="card-title text-warning">Paid Bookings</h5>
                    <h3 className="text-success">{bookings.filter(b => b.paymentStatus).length}</h3>
                    <small className="text-muted">{bookings.length > 0 ? Math.round((bookings.filter(b => b.paymentStatus).length / bookings.length) * 100) : 0}% completion rate</small>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Status Breakdown */}
            <div className="row">
              <div className="col-12">
                <div className="card bg-dark border-warning">
                  <div className="card-header bg-warning text-dark">
                    <h5 className="mb-0">Payment Status Details</h5>
                  </div>
                  <div className="card-body">
                    <div className="table-responsive">
                      <table className="table table-dark table-hover">
                        <thead className="table-warning text-dark">
                          <tr>
                            <th>Booking ID</th>
                            <th>Parent Name</th>
                            <th>Kid Name</th>
                            <th>Total Amount</th>
                            <th>Payment Status</th>
                            <th>Booking Date</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {currentBookings.map((b) => (
                            <tr key={b.bookingId}>
                              <td>{b.bookingId}</td>
                              <td>{b.parentName}</td>
                              <td>{b.kidName}</td>
                              <td>₹{b.totalAmount}</td>
                              <td>
                                <span className={`badge ${b.paymentStatus ? 'bg-success' : 'bg-danger'}`}>
                                  {b.paymentStatus ? "Paid" : "Pending"}
                                </span>
                              </td>
                              <td>{b.bookingDate || "N/A"}</td>
                              <td>
                                {!b.paymentStatus && (
                                  <button 
                                    className="btn btn-sm btn-success"
                                    onClick={() => {
                                      // This would need to be implemented with your payment update logic
                                      alert(`Mark booking ${b.bookingId} as paid`);
                                    }}
                                  >
                                    Mark Paid
                                  </button>
                                )}
                                {b.paymentStatus && (
                                  <span className="text-success">✓ Completed</span>
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
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}