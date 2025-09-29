import Head from "next/head";
import 'bootstrap/dist/css/bootstrap.min.css';
import Footer from "../Components/Footer";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchBookings } from "../Redux/bookingSlice/bookingSlice";
import AdminDashboard from "../pages/AdminDashboard";
import Header from "@/Components/Header";
import { useRouter } from "next/router";
import jsPDF from 'jspdf';

export default function Home() {
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const dispatch = useDispatch();
  
  const token = useSelector((state) => state.auth.loginData?.token);
  const role = useSelector((state) => state.auth.loginData?.role);
  const parentId = useSelector((state) => state.auth.loginData?.id);
  const userName = useSelector((state) => state.auth.loginData?.name);
  const bookings = useSelector(state => state.bookings.bookings || []);

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

  const downloadReceipt = (booking) => {
    const doc = new jsPDF();
    
    // Set colors
    const goldColor = [255, 215, 0];
    const blackColor = [0, 0, 0];
    const grayColor = [153, 153, 153];
    
    // Header Background
    doc.setFillColor(0, 0, 0);
    doc.rect(0, 0, 210, 40, 'F');
    
    // Title
    doc.setTextColor(goldColor[0], goldColor[1], goldColor[2]);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('MASTERCLASS CRICKET ACADEMY', 105, 20, { align: 'center' });
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text('Booking Receipt', 105, 30, { align: 'center' });
    
    // Reset text color
    doc.setTextColor(blackColor[0], blackColor[1], blackColor[2]);
    
    // Booking ID and Status
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text(`Booking ID: #${booking.bookingId}`, 20, 55);
    
    // Payment Status Badge
    if (booking.paymentStatus) {
      doc.setFillColor(76, 175, 80);
      doc.roundedRect(150, 50, 40, 8, 2, 2, 'F');
      doc.setTextColor(255, 255, 255);
      doc.text('PAID', 170, 55, { align: 'center' });
    } else {
      doc.setFillColor(255, 193, 7);
      doc.roundedRect(150, 50, 40, 8, 2, 2, 'F');
      doc.setTextColor(0, 0, 0);
      doc.text('PENDING', 170, 55, { align: 'center' });
    }
    
    // Divider
    doc.setDrawColor(goldColor[0], goldColor[1], goldColor[2]);
    doc.setLineWidth(0.5);
    doc.line(20, 65, 190, 65);
    
    // Participant Information
    doc.setTextColor(blackColor[0], blackColor[1], blackColor[2]);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Participant Information', 20, 75);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Name: ${booking.kidName}`, 20, 85);
    doc.text(`Level: ${booking.kidLevel}`, 20, 92);
    doc.text(`Parent: ${booking.parentName}`, 20, 99);
    doc.text(`Email: ${booking.parentEmail}`, 20, 106);
    
    // Payment Information
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text('Payment Information', 20, 120);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Total Amount: £${booking.totalAmount}`, 20, 130);
    doc.text(`Payment Status: ${booking.paymentStatus ? 'Paid' : 'Pending'}`, 20, 137);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 144);
    
    // Session Details
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text('Session Details', 20, 158);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    
    if (booking.sessionDetails && booking.sessionDetails.length > 0) {
      let yPosition = 168;
      booking.sessionDetails.forEach((session, index) => {
        const cleanSession = session.replace(/null/g, '').trim();
        const sessionText = `${index + 1}. ${cleanSession}`;
        
        // Check if we need a new page
        if (yPosition > 270) {
          doc.addPage();
          yPosition = 20;
        }
        
        doc.text(sessionText, 25, yPosition);
        yPosition += 7;
      });
    } else {
      doc.text('No session details available', 25, 168);
    }
    
    // Footer
    const pageHeight = doc.internal.pageSize.height;
    doc.setFillColor(0, 0, 0);
    doc.rect(0, pageHeight - 20, 210, 20, 'F');
    
    doc.setTextColor(goldColor[0], goldColor[1], goldColor[2]);
    doc.setFontSize(8);
    doc.text('Thank you for choosing MasterClass Cricket Camps!', 105, pageHeight - 12, { align: 'center' });
    doc.text('For inquiries, contact us at admin@masterclasscricket.com', 105, pageHeight - 7, { align: 'center' });
    
    // Save PDF
    doc.save(`Receipt_${booking.bookingId}.pdf`);
  };

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

  if (!token) {
    return (
      <>
        <Head>
          <title>Cricket Camps - Login Required</title>
        </Head>
        <div className="min-vh-100 d-flex align-items-center justify-content-center" 
             style={{ background: "#000" }}>
          <div className="text-center">
            <i className="fas fa-baseball-ball fa-4x mb-4" style={{ color: "#ffc107" }}></i>
            <p className="lead mb-4" style={{ color: "#fff" }}>Please log in to access your dashboard</p>
            <button className="btn btn-lg px-5" onClick={handleLogin} style={{
              backgroundColor: "#ffc107",
              color: "#000",
              border: "none",
              fontWeight: "600",
              transition: "all 0.3s ease"
            }}>Login</button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <Head>
        <title>My Dashboard - Cricket Camps</title>
      </Head>

      <div className="min-vh-100" style={{ background: "#0a0a0a" }}>
        {/* Header */}
        <div className="container-fluid py-4" style={{ 
          background: "linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%)",
          borderBottom: "1px solid rgba(255, 193, 7, 0.1)"
        }}>
          <div className="row align-items-center">
            <div className="col">
              <div className="d-flex align-items-center">
                <div className="me-3">
                  <button onClick={handleLogin} className="btn px-4 py-2" style={{
                    backgroundColor: "transparent",
                    border: "1px solid #ffc107",
                    color: "#ffc107",
                    borderRadius: "25px",
                    fontWeight: "500",
                    transition: "all 0.3s ease"
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = "#ffc107";
                    e.target.style.color = "#000";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = "transparent";
                    e.target.style.color = "#ffc107";
                  }}>
                    Back
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="container-fluid px-4 mb-4" style={{ paddingTop: "2rem" }}>
          <div className="row g-3">
            <div className="col-6 col-md-3">
              <div className="card border-0 h-100 hover-card" style={{
                background: "linear-gradient(135deg, #1a1a1a 0%, #262626 100%)",
                transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)"
              }}>
                <div className="card-body text-center p-4">
                  <div className="mb-2" style={{ color: "#ffc107" }}>
                    <i className="fas fa-calendar-check fa-2x"></i>
                  </div>
                  <h3 className="mb-1" style={{ color: "#fff" }}>{bookings.length}</h3>
                  <small style={{ color: "#999" }}>Total Bookings</small>
                </div>
              </div>
            </div>
            
            <div className="col-6 col-md-3">
              <div className="card border-0 h-100 hover-card" style={{
                background: "linear-gradient(135deg, #1a1a1a 0%, #262626 100%)",
                transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)"
              }}>
                <div className="card-body text-center p-4">
                  <div className="mb-2" style={{ color: "#4caf50" }}>
                    <i className="fas fa-check-circle fa-2x"></i>
                  </div>
                  <h3 className="mb-1" style={{ color: "#fff" }}>{bookings.filter(b => b.paymentStatus).length}</h3>
                  <small style={{ color: "#999" }}>Confirmed</small>
                </div>
              </div>
            </div>
            
            <div className="col-6 col-md-3">
              <div className="card border-0 h-100 hover-card" style={{
                background: "linear-gradient(135deg, #1a1a1a 0%, #262626 100%)",
                transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)"
              }}>
                <div className="card-body text-center p-4">
                  <div className="mb-2" style={{ color: "#ff9800" }}>
                    <i className="fas fa-clock fa-2x"></i>
                  </div>
                  <h3 className="mb-1" style={{ color: "#fff" }}>{bookings.filter(b => !b.paymentStatus).length}</h3>
                  <small style={{ color: "#999" }}>Pending</small>
                </div>
              </div>
            </div>
            
            <div className="col-6 col-md-3">
              <div className="card border-0 h-100 hover-card" style={{
                background: "linear-gradient(135deg, #1a1a1a 0%, #262626 100%)",
                transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)"
              }}>
                <div className="card-body text-center p-4">
                  <div className="mb-2" style={{ color: "#ffc107" }}>
                    <i className="fas fa-euro-sign fa-2x"></i>
                  </div>
                  <h3 className="mb-1" style={{ color: "#fff" }}>£{bookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0)}</h3>
                  <small style={{ color: "#999" }}>Total Spent</small>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bookings List */}
        <div className="container-fluid px-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h5 className="mb-0" style={{ color: "#ffc107", fontWeight: "600" }}>My Bookings</h5>
            <div className="btn-group btn-group-sm">
              <button className="btn" style={{
                backgroundColor: "transparent",
                border: "1px solid #333",
                color: "#999",
                transition: "all 0.3s ease"
              }}>All</button>
              <button className="btn" style={{
                backgroundColor: "transparent",
                border: "1px solid #333",
                color: "#999",
                transition: "all 0.3s ease"
              }}>Paid</button>
              <button className="btn" style={{
                backgroundColor: "transparent",
                border: "1px solid #333",
                color: "#999",
                transition: "all 0.3s ease"
              }}>Pending</button>
            </div>
          </div>

          {bookings.length === 0 ? (
            <div className="text-center py-5">
              <i className="fas fa-calendar-plus fa-3x mb-3" style={{ color: "#333" }}></i>
              <h5 style={{ color: "#666" }}>No bookings yet</h5>
              <p style={{ color: "#666" }}>Book your first cricket session to get started!</p>
              <button className="btn" style={{
                backgroundColor: "#ffc107",
                color: "#000",
                border: "none",
                fontWeight: "600"
              }}>Book Now</button>
            </div>
          ) : (
            <div className="row g-3">
              {bookings.map((booking) => (
                <div key={booking.bookingId} className="col-12 col-md-6 col-lg-4">
                  <div className="card border-0 h-100 booking-card" style={{
                    background: "linear-gradient(135deg, #1a1a1a 0%, #262626 100%)",
                    transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                    border: "1px solid rgba(255, 193, 7, 0.1)"
                  }}>
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-start mb-3">
                        <div>
                          <h6 className="card-title mb-1" style={{ color: "#ffc107" }}>#{booking.bookingId}</h6>
                          <small style={{ color: "#999" }}>{booking.kidName}</small>
                        </div>
                        <span className={`badge rounded-pill`} style={{
                          backgroundColor: booking.paymentStatus ? "#4caf50" : "#ffc107",
                          color: booking.paymentStatus ? "#fff" : "#000"
                        }}>
                          {booking.paymentStatus ? 'Paid' : 'Pending'}
                        </span>
                      </div>

                      <div className="mb-3">
                        <div className="d-flex align-items-center mb-2">
                          <i className="fas fa-user-graduate me-2" style={{ color: "#666" }}></i>
                          <span className="small" style={{ color: "#ccc" }}>{booking.kidLevel}</span>
                        </div>
                        <div className="d-flex align-items-center">
                          <i className="fas fa-euro-sign me-2" style={{ color: "#666" }}></i>
                          <span className="small" style={{ color: "#ccc" }}>£{booking.totalAmount}</span>
                        </div>
                      </div>

                      {booking.sessionDetails && booking.sessionDetails.length === 1 ? (
                        <div className="rounded p-2 mb-3" style={{ backgroundColor: "#0a0a0a" }}>
                          <small className="d-block" style={{ color: "#666" }}>Session:</small>
                          <small style={{ color: "#fff" }}>
                            {booking.sessionDetails[0].replace(/null/g, '').trim()}
                          </small>
                        </div>
                      ) : booking.sessionDetails && booking.sessionDetails.length > 1 ? (
                        <div className="rounded p-2 mb-3" style={{ backgroundColor: "#0a0a0a" }}>
                          <small className="d-block" style={{ color: "#666" }}>Sessions:</small>
                          <small style={{ color: "#fff" }}>
                            {booking.sessionDetails.length} sessions booked
                          </small>
                        </div>
                      ) : null}

                      <button 
                        className="btn btn-sm w-100"
                        onClick={() => handleViewDetails(booking)}
                        style={{
                          backgroundColor: "transparent",
                          border: "1px solid #ffc107",
                          color: "#ffc107",
                          transition: "all 0.3s ease"
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.backgroundColor = "#ffc107";
                          e.target.style.color = "#000";
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.backgroundColor = "transparent";
                          e.target.style.color = "#ffc107";
                        }}
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

      {/* Modal */}
      {showModal && selectedBooking && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ 
          backgroundColor: 'rgba(0,0,0,0.9)',
          animation: "fadeIn 0.3s ease"
        }}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content border-0" style={{
              backgroundColor: "#1a1a1a",
              border: "1px solid rgba(255, 193, 7, 0.2)",
              animation: "slideUp 0.3s ease"
            }}>
              <div className="modal-header border-0 pb-0" style={{ borderBottom: "1px solid #333" }}>
                <div>
                  <h5 className="modal-title" style={{ color: "#ffc107" }}>Booking Details</h5>
                  <small style={{ color: "#666" }}>Booking ID: #{selectedBooking.bookingId}</small>
                </div>
                <button type="button" className="btn-close btn-close-white" onClick={closeModal}></button>
              </div>
              
              <div className="modal-body">
                <div className="row g-4">
                  <div className="col-md-6">
                    <div className="card border-0" style={{ backgroundColor: "#0a0a0a" }}>
                      <div className="card-body">
                        <h6 className="card-title" style={{ color: "#ffc107" }}>
                          <i className="fas fa-user me-2"></i>Participant Info
                        </h6>
                        <div className="mb-2" style={{ color: "#ccc" }}>
                          <strong style={{ color: "#fff" }}>Name:</strong> {selectedBooking.kidName}
                        </div>
                        <div className="mb-2" style={{ color: "#ccc" }}>
                          <strong style={{ color: "#fff" }}>Level:</strong> {selectedBooking.kidLevel}
                        </div>
                        <div className="mb-2" style={{ color: "#ccc" }}>
                          <strong style={{ color: "#fff" }}>Parent:</strong> {selectedBooking.parentName}
                        </div>
                        <div style={{ color: "#ccc" }}>
                          <strong style={{ color: "#fff" }}>Email:</strong> {selectedBooking.parentEmail}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="card border-0" style={{ backgroundColor: "#0a0a0a" }}>
                      <div className="card-body">
                        <h6 className="card-title" style={{ color: "#4caf50" }}>
                          <i className="fas fa-credit-card me-2"></i>Payment Info
                        </h6>
                        <div className="mb-2" style={{ color: "#ccc" }}>
                          <strong style={{ color: "#fff" }}>Total Amount:</strong> £{selectedBooking.totalAmount}
                        </div>
                        <div className="mb-2" style={{ color: "#ccc" }}>
                          <strong style={{ color: "#fff" }}>Status:</strong>{' '}
                          <span className="badge" style={{
                            backgroundColor: selectedBooking.paymentStatus ? "#4caf50" : "#ffc107",
                            color: selectedBooking.paymentStatus ? "#fff" : "#000"
                          }}>
                            {selectedBooking.paymentStatus ? 'Paid' : 'Pending'}
                          </span>
                        </div>
                        {!selectedBooking.paymentStatus && (
                          <button className="btn btn-sm mt-2" style={{
                            backgroundColor: "#ffc107",
                            color: "#000",
                            border: "none",
                            fontWeight: "600"
                          }}>
                            Complete Payment
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="col-12">
                    <div className="card border-0" style={{ backgroundColor: "#0a0a0a" }}>
                      <div className="card-body">
                        <h6 className="card-title" style={{ color: "#ffc107" }}>
                          <i className="fas fa-calendar-alt me-2"></i>Session Details
                        </h6>
                        {selectedBooking.sessionDetails && selectedBooking.sessionDetails.length > 0 ? (
                          <div className="row g-2">
                            {selectedBooking.sessionDetails.map((session, index) => {
                              const cleanSession = session.replace(/null/g, '').trim();
                              const [day, timeAndClass] = cleanSession.split(' - ');
                              return (
                                <div key={index} className="col-md-6">
                                  <div className="rounded p-3" style={{
                                    backgroundColor: "#1a1a1a",
                                    border: "1px solid #333"
                                  }}>
                                    <div className="d-flex align-items-center mb-2">
                                      <div className="rounded-circle me-2" style={{ 
                                        width: '8px', 
                                        height: '8px',
                                        backgroundColor: "#ffc107"
                                      }}></div>
                                      <strong style={{ color: "#ffc107" }}>{day}</strong>
                                    </div>
                                    <small style={{ color: "#999" }}>{timeAndClass}</small>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <p className="mb-0" style={{ color: "#666" }}>No session details available</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="modal-footer border-0" style={{ borderTop: "1px solid #333" }}>
                <button type="button" className="btn" onClick={closeModal} style={{
                  backgroundColor: "#333",
                  color: "#fff",
                  border: "none"
                }}>
                  Close
                </button>
                {!selectedBooking.paymentStatus && (
                  <button type="button" className="btn" style={{
                    backgroundColor: "#ffc107",
                    color: "#000",
                    border: "none",
                    fontWeight: "600"
                  }}>
                    Complete Payment
                  </button>
                )}
                <button 
                  type="button" 
                  className="btn" 
                  onClick={() => downloadReceipt(selectedBooking)}
                  style={{
                    backgroundColor: "transparent",
                    border: "1px solid #ffc107",
                    color: "#ffc107"
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = "#ffc107";
                    e.target.style.color = "#000";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = "transparent";
                    e.target.style.color = "#ffc107";
                  }}
                >
                  <i className="fas fa-download me-2"></i>Download Receipt
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideUp {
          from { 
            opacity: 0;
            transform: translateY(30px); 
          }
          to { 
            opacity: 1;
            transform: translateY(0); 
          }
        }

        .hover-card {
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: pointer;
        }
        
        .hover-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(255, 193, 7, 0.2) !important;
          border: 1px solid rgba(255, 193, 7, 0.3) !important;
        }
        
        .booking-card {
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: pointer;
        }
        
        .booking-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(255, 193, 7, 0.2) !important;
          border: 1px solid rgba(255, 193, 7, 0.4) !important;
        }
      `}</style>
    </>
  );
}