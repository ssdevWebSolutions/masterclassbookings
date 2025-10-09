import { FaChevronRight, FaEnvelope, FaPhone, FaChild, FaCalendarAlt, FaCheck, FaMedkit, FaUsers, FaBirthdayCake, FaExclamationTriangle } from "react-icons/fa";

// UPDATED: Format session details to hide null and show proper labels
const formatSessionDetail = (session) => {
  if (typeof session !== 'string') return session;
  
  const parts = session.split(" - ");
  const day = parts[0];
  const classInfo = parts[1];
  const timePart = parts[2];
  const datePart = parts[3];
  
  if (day === "Friday" && classInfo === "null") {
    return `Friday Session ${timePart ? `at ${timePart}` : ''} ${datePart || ''}`.trim();
  }
  
  return session.replace(" - null", "");
};

export default function BookingCard({ booking, isExpanded, onToggleExpand }) {
  console.log("Booking Object", booking);

  // Handle emergency call
  const handleEmergencyCall = (e, phoneNumber) => {
    e.stopPropagation(); // Prevent card expansion
    if (phoneNumber) {
      window.location.href = `tel:${phoneNumber}`;
    }
  };

  return (
    <div 
      className={`booking-card ${isExpanded ? 'expanded' : ''}`}
      onClick={onToggleExpand}
    >
      <div className="booking-header">
        <div className="booking-main-info">
          {/* Booking ID */}
          <div className="booking-id">
            Booking #{booking.bookingId}
          </div>

          {/* Information Grid Layout */}
          <div className="booking-info-grid">
            {/* Parent Information */}
            <div className="booking-section">
              <div className="section-label">Parent Information</div>
              <div className="section-content">
                <div className="info-row">
                  <FaEnvelope size={13} className="info-icon" />
                  <span className="info-label">Name:</span>
                  <span className="info-value">{booking.parentName || "N/A"}</span>
                </div>
                <div className="info-row">
                  <FaEnvelope size={13} className="info-icon" />
                  <span className="info-label">Email:</span>
                  <span className="info-value">{booking.parentEmail || "N/A"}</span>
                </div>
                {(booking.phoneNumber || booking.parentPhone) && (
                  <div className="info-row emergency-contact" onClick={(e) => handleEmergencyCall(e, booking.phoneNumber || booking.parentPhone)}>
                    <FaPhone size={13} className="info-icon emergency-icon" />
                    <span className="info-label emergency-label">Emergency:</span>
                    <span className="info-value phone-clickable">{booking.phoneNumber || booking.parentPhone}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Kid Information */}
            <div className="booking-section">
              <div className="section-label">Student Information</div>
              <div className="section-content">
                <div className="info-row">
                  <FaChild size={13} className="info-icon" />
                  <span className="info-label">Name:</span>
                  <span className="info-value">{booking.kidName || "N/A"}</span>
                  <span className="kid-level">{booking.kidLevel || "N/A"}</span>
                </div>
                {booking.age && (
                  <div className="info-row">
                    <FaBirthdayCake size={13} className="info-icon" />
                    <span className="info-label">Age:</span>
                    <span className="info-value">{booking.age} years</span>
                  </div>
                )}
                {booking.club && (
                  <div className="info-row">
                    <FaUsers size={13} className="info-icon" />
                    <span className="info-label">Club:</span>
                    <span className="info-value">{booking.club}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Medical Information - Separate highlighted section */}
          {booking.medicalInfo  && booking.medicalInfo !== "N/A" && (
            <div className="medical-alert">
              <div className="medical-header">
                <FaMedkit size={14} />
                <span className="medical-title">Medical Information</span>
                <FaExclamationTriangle size={12} />
              </div>
              <div className="medical-content">{booking.medicalInfo}</div>
            </div>
          )}

          {/* Meta Information */}
          <div className="booking-meta">
            <div className="meta-item">
              <FaCalendarAlt />
              {(booking.sessionDetails?.length || 0)} Session{(booking.sessionDetails?.length || 0) > 1 ? 's' : ''}
            </div>
            <div className="meta-item amount-highlight">
              €{booking.totalAmount || 0}
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

      {isExpanded && (
        <div className="booking-details">
          <div className="details-header">
            <h6>Session Details</h6>
            <span className="session-count-badge">
              {booking.sessionDetails?.length || 0} Sessions
            </span>
          </div>
          
          <div className="session-list">
            {(booking.sessionDetails || []).map((session, idx) => {
              const formattedSession = formatSessionDetail(session);
              const parts = formattedSession.split(" at ");
              const sessionType = parts[0] || "Session";
              const timeAndDate = parts[1] || "";
              
              return (
                <div key={idx} className="session-item">
                  <div className="session-info">
                    <h6>{sessionType}</h6>
                    <p>{timeAndDate}</p>
                  </div>
                  <div className="session-check">
                    <FaCheck />
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* UPDATED Booking Summary with better grid layout */}
          <div className="booking-summary">
            <h6 className="summary-title">Complete Information</h6>
            <div className="summary-grid">
              <div className="summary-item">
                <div className="summary-label">Parent Name</div>
                <div className="summary-value">{booking.parentName || "N/A"}</div>
              </div>
              <div className="summary-item">
                <div className="summary-label">Parent Email</div>
                <div className="summary-value">{booking.parentEmail || "N/A"}</div>
              </div>
              <div className="summary-item">
                <div className="summary-label">Emergency Contact</div>
                <div className="summary-value phone-clickable" onClick={(e) => handleEmergencyCall(e, booking.phoneNumber || booking.parentPhone)}>
                  {booking.phoneNumber || booking.parentPhone || "N/A"}
                </div>
              </div>
              <div className="summary-item">
                <div className="summary-label">Student Name</div>
                <div className="summary-value">{booking.kidName || "N/A"}</div>
              </div>
              <div className="summary-item">
                <div className="summary-label">Student Age</div>
                <div className="summary-value">{booking.age ? `${booking.age} years` : "N/A"}</div>
              </div>
              <div className="summary-item">
                <div className="summary-label">Level</div>
                <div className="summary-value">{booking.kidLevel || "N/A"}</div>
              </div>
              <div className="summary-item">
                <div className="summary-label">Club</div>
                <div className="summary-value">{booking.club || "N/A"}</div>
              </div>
              {booking.medicalInfo && booking.medicalInfo !== "n" && booking.medicalInfo !== "N/A" && (
                <div className="summary-item medical-summary-item">
                  <div className="summary-label">Medical Info</div>
                  <div className="summary-value medical-highlight">{booking.medicalInfo}</div>
                </div>
              )}
              <div className="summary-item total-item">
                <div className="summary-label">Total Amount</div>
                <div className="summary-value highlight">€{booking.totalAmount || 0}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
