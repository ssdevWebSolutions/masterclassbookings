import Head from "next/head";
import 'bootstrap/dist/css/bootstrap.min.css';
import Footer from "../Components/Footer";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchBookings } from "../Redux/bookingSlice/bookingSlice";
import AdminDashboard from "../pages/AdminDashboard";
import Header from "@/Components/Header";
import { useRouter } from "next/router";

export default function Home() {
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const dispatch = useDispatch();
  
  const token = useSelector((state) => state.auth.loginData?.token);
  const role = useSelector((state) => state.auth.loginData?.role);
  const parentId = useSelector((state) => state.auth.loginData?.id);
  const userName = useSelector((state) => state.auth.loginData?.name);
  const bookings = useSelector(state => state.bookings.bookings || []);

  // Bootstrap JS for modal
  useEffect(() => {
    import('bootstrap/dist/js/bootstrap.bundle.min.js');
  }, []);

  useEffect(() => {
    if (token && role) {
      console.log(token,role,"ro");
      dispatch(fetchBookings({ token, role, parentId }));
    }
  }, [token, role, parentId, dispatch]);

  const handleViewDetails = (booking) => {
    setSelectedBooking(booking);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedBooking(null);
  };

  // Admin gets full dashboard
  if (role === 'ADMIN') {
    return (
      <>
      
        <Head>
          <title>Admin Dashboard - Cricket Camps</title>
        </Head>
        <AdminDashboard />
      </>
    );
  }

  const route = useRouter();
  
  const handleLogin=()=>{
    route.push("/");
  }

  // Not logged in
  if (!token) {
    return (
      <>
        <Head>
          <title>Cricket Camps - Login Required</title>
        </Head>
        <div className="min-vh-100 d-flex align-items-center justify-content-center" 
             style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}>
          <div className="text-center text-white">
            <i className="fas fa-baseball-ball fa-4x mb-4 text-warning"></i>
            {/* <h1 className="display-5 mb-3">Cricket Camps</h1> */}
            <p className="lead mb-4">Please log in to access your dashboard</p>
            <button className="btn btn-warning btn-lg px-5" onClick={handleLogin} >Login</button>
          </div>
        </div>
      </>
    );
  }

  // User Dashboard - Minimal & Interactive
  return (
    <>
    <Header />
      <Head>
        <title>My Dashboard - Cricket Camps</title>
      </Head>

      <div className="min-vh-100" style={{ background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)" }}>
        {/* Minimal Header */}
        <div className="container-fluid py-4">
          <div className="row align-items-center">
            <div className="col">
              <div className="d-flex align-items-center">
                <div className="bg-warning rounded-circle p-3 me-3">
                  <i className="fas fa-cricket-bat text-dark fa-lg"></i>
                </div>
                <div>
                  <h4 className="mb-0 text-dark">Hey {userName?.split(' ')[0] || 'Champion'}! 👋</h4>
                  <small className="text-muted">Ready for some cricket?</small>
                </div>
              </div>
            </div>
            <div className="col-auto">
              <button className="btn btn-warning rounded-pill px-4">
                <i className="fas fa-plus me-2"></i>Book Session
              </button>
            </div>
          </div>
        </div>

        {/* Quick Stats - Minimal Cards */}
        <div className="container-fluid px-4 mb-4">
          <div className="row g-3">
            <div className="col-6 col-md-3">
              <div className="card border-0 shadow-sm h-100 hover-card">
                <div className="card-body text-center p-4">
                  <div className="text-primary mb-2">
                    <i className="fas fa-calendar-check fa-2x"></i>
                  </div>
                  <h3 className="mb-1">{bookings.length}</h3>
                  <small className="text-muted">Total Bookings</small>
                </div>
              </div>
            </div>
            
            <div className="col-6 col-md-3">
              <div className="card border-0 shadow-sm h-100 hover-card">
                <div className="card-body text-center p-4">
                  <div className="text-success mb-2">
                    <i className="fas fa-check-circle fa-2x"></i>
                  </div>
                  <h3 className="mb-1">{bookings.filter(b => b.paymentStatus).length}</h3>
                  <small className="text-muted">Confirmed</small>
                </div>
              </div>
            </div>
            
            <div className="col-6 col-md-3">
              <div className="card border-0 shadow-sm h-100 hover-card">
                <div className="card-body text-center p-4">
                  <div className="text-warning mb-2">
                    <i className="fas fa-clock fa-2x"></i>
                  </div>
                  <h3 className="mb-1">{bookings.filter(b => !b.paymentStatus).length}</h3>
                  <small className="text-muted">Pending</small>
                </div>
              </div>
            </div>
            
            <div className="col-6 col-md-3">
              <div className="card border-0 shadow-sm h-100 hover-card">
                <div className="card-body text-center p-4">
                  <div className="text-info mb-2">
                    <i className="fas fa-rupee-sign fa-2x"></i>
                  </div>
                  <h3 className="mb-1">₹{bookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0)}</h3>
                  <small className="text-muted">Total Spent</small>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bookings List - Interactive Cards */}
        <div className="container-fluid px-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h5 className="mb-0 text-dark">My Bookings</h5>
            <div className="btn-group btn-group-sm">
              <button className="btn btn-outline-secondary">All</button>
              <button className="btn btn-outline-secondary">Paid</button>
              <button className="btn btn-outline-secondary">Pending</button>
            </div>
          </div>

          {bookings.length === 0 ? (
            <div className="text-center py-5">
              <i className="fas fa-calendar-plus fa-3x text-muted mb-3"></i>
              <h5 className="text-muted">No bookings yet</h5>
              <p className="text-muted">Book your first cricket session to get started!</p>
              <button className="btn btn-warning">Book Now</button>
            </div>
          ) : (
            <div className="row g-3">
              {bookings.map((booking) => (
                <div key={booking.bookingId} className="col-12 col-md-6 col-lg-4">
                  <div className="card border-0 shadow-sm h-100 booking-card">
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-start mb-3">
                        <div>
                          <h6 className="card-title mb-1">#{booking.bookingId}</h6>
                          <small className="text-muted">{booking.kidName}</small>
                        </div>
                        <span className={`badge rounded-pill ${booking.paymentStatus ? 'bg-success' : 'bg-warning text-dark'}`}>
                          {booking.paymentStatus ? 'Paid' : 'Pending'}
                        </span>
                      </div>

                      <div className="mb-3">
                        <div className="d-flex align-items-center mb-2">
                          <i className="fas fa-user-graduate text-muted me-2"></i>
                          <span className="small">{booking.kidLevel}</span>
                        </div>
                        <div className="d-flex align-items-center">
                          <i className="fas fa-rupee-sign text-muted me-2"></i>
                          <span className="small">₹{booking.totalAmount}</span>
                        </div>
                      </div>

                      {/* Session Preview */}
                      <div className="mb-3">
                        {booking.sessionDetails && booking.sessionDetails.length === 1 ? (
                          <div className="bg-light rounded p-2">
                            <small className="text-muted d-block">Session:</small>
                            <small className="fw-medium">
                              {booking.sessionDetails[0].replace(/null/g, '').trim()}
                            </small>
                          </div>
                        ) : booking.sessionDetails && booking.sessionDetails.length > 1 ? (
                          <div className="bg-light rounded p-2">
                            <small className="text-muted d-block">Sessions:</small>
                            <small className="fw-medium">
                              {booking.sessionDetails.length} sessions booked
                            </small>
                          </div>
                        ) : null}
                      </div>

                      <button 
                        className="btn btn-outline-primary btn-sm w-100"
                        onClick={() => handleViewDetails(booking)}
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ height: '100px' }}></div>
      </div>

      {/* Interactive Modal */}
      {showModal && selectedBooking && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content border-0 shadow">
              <div className="modal-header border-0 pb-0">
                <div>
                  <h5 className="modal-title">Booking Details</h5>
                  <small className="text-muted">Booking ID: #{selectedBooking.bookingId}</small>
                </div>
                <button type="button" className="btn-close" onClick={closeModal}></button>
              </div>
              
              <div className="modal-body">
                <div className="row g-4">
                  {/* Left Column */}
                  <div className="col-md-6">
                    <div className="card bg-light border-0">
                      <div className="card-body">
                        <h6 className="card-title text-primary">
                          <i className="fas fa-user me-2"></i>Participant Info
                        </h6>
                        <div className="mb-2">
                          <strong>Name:</strong> {selectedBooking.kidName}
                        </div>
                        <div className="mb-2">
                          <strong>Level:</strong> {selectedBooking.kidLevel}
                        </div>
                        <div className="mb-2">
                          <strong>Parent:</strong> {selectedBooking.parentName}
                        </div>
                        <div>
                          <strong>Email:</strong> {selectedBooking.parentEmail}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="col-md-6">
                    <div className="card bg-light border-0">
                      <div className="card-body">
                        <h6 className="card-title text-success">
                          <i className="fas fa-credit-card me-2"></i>Payment Info
                        </h6>
                        <div className="mb-2">
                          <strong>Total Amount:</strong> ₹{selectedBooking.totalAmount}
                        </div>
                        <div className="mb-2">
                          <strong>Status:</strong>{' '}
                          <span className={`badge ${selectedBooking.paymentStatus ? 'bg-success' : 'bg-warning text-dark'}`}>
                            {selectedBooking.paymentStatus ? 'Paid' : 'Pending'}
                          </span>
                        </div>
                        {!selectedBooking.paymentStatus && (
                          <button className="btn btn-warning btn-sm mt-2">
                            Complete Payment
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Session Details */}
                  <div className="col-12">
                    <div className="card border-0" style={{ background: 'linear-gradient(45deg, #f8f9fa, #e9ecef)' }}>
                      <div className="card-body">
                        <h6 className="card-title text-warning">
                          <i className="fas fa-calendar-alt me-2"></i>Session Details
                        </h6>
                        {selectedBooking.sessionDetails && selectedBooking.sessionDetails.length > 0 ? (
                          <div className="row g-2">
                            {selectedBooking.sessionDetails.map((session, index) => {
                              const cleanSession = session.replace(/null/g, '').trim();
                              const [day, timeAndClass] = cleanSession.split(' - ');
                              return (
                                <div key={index} className="col-md-6">
                                  <div className="bg-white rounded p-3 border">
                                    <div className="d-flex align-items-center mb-2">
                                      <div className="bg-primary rounded-circle p-1 me-2" style={{ width: '8px', height: '8px' }}></div>
                                      <strong className="text-primary">{day}</strong>
                                    </div>
                                    <small className="text-muted">{timeAndClass}</small>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <p className="text-muted mb-0">No session details available</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="modal-footer border-0">
                <button type="button" className="btn btn-secondary" onClick={closeModal}>
                  Close
                </button>
                {!selectedBooking.paymentStatus && (
                  <button type="button" className="btn btn-warning">
                    Complete Payment
                  </button>
                )}
                <button type="button" className="btn btn-outline-primary">
                  Download Receipt
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />

      <style jsx>{`
        .hover-card {
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .hover-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0,0,0,0.15) !important;
        }
        .booking-card {
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          cursor: pointer;
        }
        .booking-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 30px rgba(0,0,0,0.1) !important;
        }
      `}</style>
    </>
  );
}