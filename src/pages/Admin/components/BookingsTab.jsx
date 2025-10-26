import React, { useState } from 'react';
import { FaChevronDown, FaChevronRight, FaCalendarAlt, FaUsers, FaEuroSign, FaChild, FaEnvelope, FaPhone, FaMedkit, FaExclamationTriangle, FaClock, FaCheck, FaBirthdayCake, FaInfoCircle } from 'react-icons/fa';

// Generate weeks from start to end date (Friday + Sunday only)
const generateWeeks = (startDate, endDate) => {
  const weeks = [];
  const start = new Date(startDate);
  const end = new Date(endDate);
  let weekNum = 1;

  let currentFriday = new Date(start);
  while (currentFriday.getDay() !== 5) {
    currentFriday.setDate(currentFriday.getDate() + 1);
  }

  while (currentFriday <= end) {
    const weekStart = new Date(currentFriday);
    const weekEnd = new Date(currentFriday);
    weekEnd.setDate(weekEnd.getDate() + 6);

    const sunday = new Date(weekStart);
    sunday.setDate(weekStart.getDate() + 2);

    weeks.push({
      weekNumber: weekNum++,
      weekStart,
      weekEnd: weekEnd > end ? end : weekEnd,
      friday: weekStart <= end ? weekStart : null,
      sunday: sunday <= end ? sunday : null,
    });

    currentFriday.setDate(currentFriday.getDate() + 7);
  }

  return weeks;
};

const formatDate = (date) => {
  if (!date) return '';
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
};

const formatFullDate = (date) => {
  if (!date) return '';
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
};

const formatDateKey = (date) => {
  if (!date) return '';
  return date.toISOString().split('T')[0];
};

// Enhanced Booking Card with 3 sections
const EnhancedBookingCard = ({ booking }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleEmergencyCall = (e, phoneNumber) => {
    e.stopPropagation();
    if (phoneNumber) {
      window.location.href = `tel:${phoneNumber}`;
    }
  };

  return (
    <div className={`enhanced-booking-card ${isExpanded ? 'expanded' : ''}`}>
      <div className="enhanced-booking-header" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="enhanced-booking-main">
          <span className="enhanced-booking-id">#{booking.bookingId}</span>
          <span className="enhanced-booking-name">{booking.kidName || 'N/A'}</span>
          <span className={`enhanced-badge ${booking.paymentStatus ? 'paid' : 'pending'}`}>
            {booking.paymentStatus ? 'PAID' : 'PENDING'}
          </span>
        </div>
        <div className="enhanced-booking-actions">
          <span className="enhanced-amount">€{booking.totalAmount || 0}</span>
          {isExpanded ? <FaChevronDown size={10} /> : <FaChevronRight size={10} />}
        </div>
      </div>

      {isExpanded && (
        <div className="enhanced-booking-body">
          {/* Section 1: Personal Information */}
          <div className="info-section personal-section">
            <div className="section-header">
              <FaUsers size={11} />
              <h6>Personal Info</h6>
            </div>
            <div className="section-content">
              <div className="info-grid">
                <div className="info-item">
                  <span className="info-label">Parent</span>
                  <span className="info-value">{booking.parentName || 'N/A'}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Email</span>
                  <span className="info-value">{booking.parentEmail || 'N/A'}</span>
                </div>
                <div className="info-item emergency-item" onClick={(e) => handleEmergencyCall(e, booking.phoneNumber || booking.parentPhone)}>
                  <span className="info-label">
                    <FaPhone size={9} className="me-1" />
                    Emergency
                  </span>
                  <span className="info-value phone-link">{booking.phoneNumber || booking.parentPhone || 'N/A'}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Student</span>
                  <span className="info-value">{booking.kidName || 'N/A'}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Age</span>
                  <span className="info-value">{booking.age ? `${booking.age}y` : 'N/A'}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Level</span>
                  <span className="info-value">{booking.kidLevel || 'N/A'}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Club</span>
                  <span className="info-value">{booking.club || 'N/A'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Medical Information */}
          {booking.medicalInfo && booking.medicalInfo !== 'N/A' && booking.medicalInfo.toLowerCase() !== 'n' && booking.medicalInfo.toLowerCase() !== 'none' && (
            <div className="info-section medical-section">
              <div className="section-header medical-header">
                <FaMedkit size={11} />
                <h6>Medical Info</h6>
                <FaExclamationTriangle size={10} className="warning-icon" />
              </div>
              <div className="section-content">
                <div className="medical-alert-box">
                  {booking.medicalInfo}
                </div>
              </div>
            </div>
          )}

          {/* Section 3: Booking Information */}
          <div className="info-section booking-section">
            <div className="section-header">
              <FaCalendarAlt size={11} />
              <h6>Booking Info</h6>
            </div>
            <div className="section-content">
              <div className="sessions-list">
                {(booking.sessionDetails || []).map((session, idx) => (
                  <div key={idx} className="session-item-compact">
                    <FaCheck size={9} className="session-check" />
                    <span>{session}</span>
                  </div>
                ))}
              </div>
              <div className="booking-total">
                <span className="total-label">Total:</span>
                <span className="total-value">€{booking.totalAmount || 0}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Day Card Component
const DayCard = ({ day, date, bookings, dayName }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const dayBookings = bookings.filter(booking => {
    if (!booking.sessionDetails || booking.sessionDetails.length === 0) return false;
  
    return booking.sessionDetails.some(session => {
      const sessionStr = session.toLowerCase();
      const sessionDateMatch = session.match(/(\d{4}-\d{2}-\d{2})/);
      if (!sessionDateMatch) return false;

      const sessionDate = new Date(sessionDateMatch[0]);
      sessionDate.setHours(0, 0, 0, 0);

      const matchesDay = sessionStr.includes(dayName.toLowerCase());

      const weekStart = new Date(date);
      weekStart.setHours(0, 0, 0, 0);

      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);

      const matchesWeek = sessionDate >= weekStart && sessionDate <= weekEnd;

      return matchesDay && matchesWeek;
    });
  });

  const totalRevenue = dayBookings
    .filter(b => b.paymentStatus)
    .reduce((sum, b) => sum + (b.totalAmount || 0), 0);

  return (
    <div className="day-card">
      <div className="day-card-header" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="day-info">
          <h5>{day}</h5>
          <p className="day-date">{formatFullDate(date)}</p>
        </div>
        <div className="day-stats">
          <div className="day-stat">
            <FaUsers size={10} />
            <span>{dayBookings.length}</span>
          </div>
          <div className="day-stat revenue">
            <FaEuroSign size={10} />
            <span>€{totalRevenue}</span>
          </div>
          {isExpanded ? <FaChevronDown size={11} /> : <FaChevronRight size={11} />}
        </div>
      </div>

      {isExpanded && (
        <div className="day-bookings">
          {dayBookings.length === 0 ? (
            <div className="no-bookings">
              <FaInfoCircle />
              <p>No bookings</p>
            </div>
          ) : (
            dayBookings.map(booking => (
              <EnhancedBookingCard key={booking.bookingId} booking={booking} />
            ))
          )}
        </div>
      )}
    </div>
  );
};

// Week Card Component
const WeekCard = ({ week, bookings }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const normalizeDate = (date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
  };

  const weekBookings = bookings.filter(booking => {
    if (!booking.sessionDetails || booking.sessionDetails.length === 0) return false;

    return booking.sessionDetails.some(session => {
      const sessionDateMatch = session.match(/(\d{4}-\d{2}-\d{2})/);
      if (!sessionDateMatch) return false;

      const sessionDate = normalizeDate(sessionDateMatch[0]);
      const weekStart = normalizeDate(week.weekStart);
      const weekEnd = normalizeDate(week.weekEnd);

      return sessionDate >= weekStart && sessionDate <= weekEnd;
    });
  });

  const totalRevenue = weekBookings
    .filter(b => b.paymentStatus)
    .reduce((sum, b) => sum + (b.totalAmount || 0), 0);

  const paidBookings = weekBookings.filter(b => b.paymentStatus).length;

  return (
    <div className="week-card">
      <div className="week-header" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="week-title">
          <FaCalendarAlt size={13} />
          <div>
            <h4>Week {week.weekNumber}</h4>
            <p>{formatDate(week.weekStart)} - {formatDate(week.weekEnd)}</p>
          </div>
        </div>
        <div className="week-stats-summary">
          <div className="week-stat-item">
            <FaUsers size={11} />
            <span>{weekBookings.length}</span>
          </div>
          <div className="week-stat-item revenue">
            <FaEuroSign size={11} />
            <span>€{totalRevenue}</span>
          </div>
          <div className="week-stat-item paid">
            <FaCheck size={11} />
            <span>{paidBookings}</span>
          </div>
          {isExpanded ? <FaChevronDown size={13} /> : <FaChevronRight size={13} />}
        </div>
      </div>

      {isExpanded && (
        <div className="week-content">
          <div className="week-days">
            {week.friday && (
              <DayCard 
                day="Friday" 
                date={week.friday} 
                bookings={bookings}
                dayName="Friday"
              />
            )}
            {week.sunday && (
              <DayCard 
                day="Sunday" 
                date={week.sunday} 
                bookings={bookings}
                dayName="Sunday"
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// Main Component
export default function WeeklyBookingsView({ bookings, loading }) {
  const [isBlockExpanded, setIsBlockExpanded] = useState(false);
  
  const campStartDate = new Date('2025-10-10');
  const campEndDate = new Date('2025-12-12');
  
  const weeks = generateWeeks(campStartDate, campEndDate);

  const totalBookings = bookings?.length || 0;
  const totalRevenue = (bookings || [])
    .filter(b => b.paymentStatus)
    .reduce((sum, b) => sum + (b.totalAmount || 0), 0);
  const paidBookings = (bookings || []).filter(b => b.paymentStatus).length;

  return (
    <div className="weekly-view-container">
      <style>{`
        .weekly-view-container {
          padding: 10px;
          max-width: 100%;
          margin: 0 auto;
        }

        .camp-header {
          background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
          border-radius: 8px;
          padding: 12px;
          margin-bottom: 12px;
          border: 1px solid #ffc107;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .camp-header:hover {
          border-color: #ffdb4d;
        }

        .camp-title {
          color: #ffc107;
          font-size: 14px;
          margin-bottom: 5px;
          display: flex;
          align-items: center;
          gap: 8px;
          line-height: 1.3;
        }

        .camp-dates {
          color: #999;
          font-size: 10px;
          margin-bottom: 10px;
        }

        .camp-stats {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 8px;
          margin-top: 10px;
        }

        .camp-stat-card {
          background: rgba(255, 193, 7, 0.1);
          border: 1px solid rgba(255, 193, 7, 0.3);
          border-radius: 5px;
          padding: 8px;
          text-align: center;
        }

        .camp-stat-value {
          font-size: 16px;
          font-weight: bold;
          color: #ffc107;
          margin-bottom: 3px;
        }

        .camp-stat-label {
          color: #ccc;
          font-size: 9px;
        }

        .week-card {
          background: #1a1a1a;
          border: 1px solid #333;
          border-radius: 8px;
          margin-bottom: 10px;
          overflow: hidden;
        }

        .week-header {
          padding: 12px;
          cursor: pointer;
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: linear-gradient(135deg, #1a1a1a 0%, #252525 100%);
        }

        .week-title {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #ffc107;
        }

        .week-title h4 {
          margin: 0;
          font-size: 13px;
          font-weight: 600;
        }

        .week-title p {
          margin: 0;
          color: #999;
          font-size: 10px;
        }

        .week-stats-summary {
          display: flex;
          gap: 10px;
          align-items: center;
        }

        .week-stat-item {
          display: flex;
          align-items: center;
          gap: 4px;
          color: #ccc;
          font-size: 10px;
        }

        .week-stat-item.revenue {
          color: #00c853;
        }

        .week-stat-item.paid {
          color: #2196f3;
        }

        .week-content {
          padding: 10px;
          background: #0f0f0f;
        }

        .week-days {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .day-card {
          background: #1a1a1a;
          border: 1px solid #2d2d2d;
          border-radius: 6px;
          overflow: hidden;
        }

        .day-card-header {
          padding: 10px;
          cursor: pointer;
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: #1f1f1f;
        }

        .day-info h5 {
          margin: 0;
          color: #ffc107;
          font-size: 12px;
        }

        .day-date {
          margin: 2px 0 0 0;
          color: #999;
          font-size: 9px;
        }

        .day-stats {
          display: flex;
          gap: 10px;
          align-items: center;
        }

        .day-stat {
          display: flex;
          align-items: center;
          gap: 4px;
          color: #ccc;
          font-size: 10px;
        }

        .day-stat.revenue {
          color: #00c853;
        }

        .day-bookings {
          padding: 8px;
          background: #0f0f0f;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .enhanced-booking-card {
          background: #1a1a1a;
          border: 1px solid #2d2d2d;
          border-radius: 5px;
          overflow: hidden;
        }

        .enhanced-booking-card.expanded {
          border-color: #ffc107;
        }

        .enhanced-booking-header {
          padding: 8px 10px;
          cursor: pointer;
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: #1f1f1f;
        }

        .enhanced-booking-main {
          display: flex;
          align-items: center;
          gap: 6px;
          flex-wrap: wrap;
        }

        .enhanced-booking-id {
          color: #999;
          font-size: 9px;
          font-weight: 600;
        }

        .enhanced-booking-name {
          color: #fff;
          font-size: 11px;
          font-weight: 500;
        }

        .enhanced-badge {
          padding: 2px 6px;
          border-radius: 8px;
          font-size: 8px;
          font-weight: 600;
        }

        .enhanced-badge.paid {
          background: rgba(0, 200, 83, 0.2);
          color: #00c853;
        }

        .enhanced-badge.pending {
          background: rgba(255, 82, 82, 0.2);
          color: #ff5252;
        }

        .enhanced-booking-actions {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .enhanced-amount {
          color: #ffc107;
          font-size: 11px;
          font-weight: 600;
        }

        .enhanced-booking-body {
          padding: 8px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .info-section {
          background: #0f0f0f;
          border-radius: 4px;
          overflow: hidden;
        }

        .section-header {
          padding: 7px 10px;
          background: #1a1a1a;
          border-bottom: 1px solid #2d2d2d;
          display: flex;
          align-items: center;
          gap: 6px;
          color: #ffc107;
        }

        .section-header h6 {
          margin: 0;
          font-size: 10px;
          font-weight: 600;
        }

        .medical-section .section-header {
          background: rgba(255, 82, 82, 0.1);
          border-bottom-color: rgba(255, 82, 82, 0.3);
        }

        .medical-header {
          color: #ff5252 !important;
        }

        .warning-icon {
          margin-left: auto;
          color: #ff9800;
        }

        .section-content {
          padding: 8px;
        }

        .info-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 8px;
        }

        .info-item {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .info-label {
          color: #999;
          font-size: 9px;
          font-weight: 500;
        }

        .info-value {
          color: #fff;
          font-size: 10px;
        }

        .emergency-item {
          cursor: pointer;
        }

        .emergency-item:hover .phone-link {
          color: #ffc107;
          text-decoration: underline;
        }

        .phone-link {
          color: #2196f3;
          transition: color 0.2s ease;
        }

        .medical-alert-box {
          background: rgba(255, 82, 82, 0.1);
          border: 1px solid rgba(255, 82, 82, 0.3);
          border-radius: 4px;
          padding: 8px;
          color: #ff8a80;
          font-size: 10px;
          line-height: 1.4;
        }

        .sessions-list {
          display: flex;
          flex-direction: column;
          gap: 5px;
          margin-bottom: 8px;
        }

        .session-item-compact {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 5px 8px;
          background: #1a1a1a;
          border-radius: 3px;
          font-size: 9px;
          color: #ccc;
        }

        .session-check {
          color: #00c853;
          flex-shrink: 0;
        }

        .booking-total {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 7px 10px;
          background: rgba(255, 193, 7, 0.1);
          border-radius: 4px;
          margin-top: 8px;
        }

        .total-label {
          color: #999;
          font-size: 10px;
          font-weight: 500;
        }

        .total-value {
          color: #ffc107;
          font-size: 12px;
          font-weight: 700;
        }

        .no-bookings {
          text-align: center;
          padding: 20px;
          color: #666;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
        }

        .no-bookings svg {
          font-size: 28px;
          opacity: 0.3;
        }

        .no-bookings p {
          font-size: 10px;
        }

        .loading-state {
          text-align: center;
          padding: 40px;
          color: #999;
        }

        .loading-state p {
          font-size: 11px;
        }

        .spinner {
          border: 2px solid #333;
          border-top-color: #ffc107;
          border-radius: 50%;
          width: 30px;
          height: 30px;
          animation: spin 1s linear infinite;
          margin: 0 auto 12px;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        @media (max-width: 380px) {
          .camp-title {
            font-size: 12px;
          }
          
          .week-stats-summary {
            gap: 8px;
          }

          .day-stats {
            gap: 8px;
          }
        }
      `}</style>

      {/* Camp Header with Summary */}
      <div className="camp-header" onClick={() => setIsBlockExpanded(!isBlockExpanded)}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <h2 className="camp-title">
            <FaCalendarAlt size={14} />
            <span>Block 1: Technical Development</span>
          </h2>
          {isBlockExpanded ? <FaChevronDown size={16} color="#ffc107" /> : <FaChevronRight size={16} color="#ffc107" />}
        </div>
        <p className="camp-dates">
          {formatFullDate(campStartDate)} - {formatFullDate(campEndDate)}
        </p>
        <div className="camp-stats">
          <div className="camp-stat-card">
            <div className="camp-stat-value">{totalBookings}</div>
            <div className="camp-stat-label">Bookings</div>
          </div>
          <div className="camp-stat-card">
            <div className="camp-stat-value">€{totalRevenue}</div>
            <div className="camp-stat-label">Revenue</div>
          </div>
          <div className="camp-stat-card">
            <div className="camp-stat-value">{paidBookings}</div>
            <div className="camp-stat-label">Paid</div>
          </div>
          <div className="camp-stat-card">
            <div className="camp-stat-value">{weeks.length}</div>
            <div className="camp-stat-label">Weeks</div>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading bookings...</p>
        </div>
      ) : isBlockExpanded ? (
        /* Weeks List */
        <div className="weeks-container">
          {weeks.map((week) => (
            <WeekCard key={week.weekNumber} week={week} bookings={bookings || []} />
          ))}
        </div>
      ) : null}
    </div>
  );
}