import { FaCheck, FaChartLine, FaClock, FaCalendarAlt, FaFilter, FaSearch, FaDownload, FaInfoCircle } from "react-icons/fa";
import StatCard from "./StatCard";
import Pagination from "./Pagination";
import BookingCard from "./BookingCard";

export default function BookingsTab({
  bookings,
  loading,
  filteredBookings,
  dayWiseData,
  availableBookingYears,
  selectedDayStats,
  // Filters
  bookingYearFilter,
  setBookingYearFilter,
  selectedDay,
  setSelectedDay,
  paymentStatusFilter,
  setPaymentStatusFilter,
  levelFilter,
  setLevelFilter,
  bookingSearch,
  setBookingSearch,
  // Pagination
  bookingsCurrentPage,
  setBookingsCurrentPage,
  bookingsPerPage,
  setBookingsPerPage,
  // Expanded booking
  expandedBooking,
  setExpandedBooking
}) {
  const indexOfLastBooking = bookingsCurrentPage * bookingsPerPage;
  const indexOfFirstBooking = indexOfLastBooking - bookingsPerPage;
  const currentBookings = filteredBookings.slice(indexOfFirstBooking, indexOfLastBooking);
  const totalBookingsPages = Math.ceil(filteredBookings.length / bookingsPerPage);

  return (
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
            value={`€${bookings.filter(b => b.paymentStatus).reduce((sum, b) => sum + (b.totalAmount || 0), 0)}`}
            subtitle="From paid bookings"
            icon={<FaChartLine />}
            color="#00c853"
          />
          <StatCard 
            title="Pending Payments" 
            value={bookings.filter(b => !b.paymentStatus).length}
            subtitle={`€${bookings.filter(b => !b.paymentStatus).reduce((sum, b) => sum + (b.totalAmount || 0), 0)} pending`}
            icon={<FaClock />}
            color="#ff5252"
          />
          <StatCard 
            title="Available Years" 
            value={availableBookingYears.length}
            subtitle="Years with bookings"
            icon={<FaCalendarAlt />}
            color="#2196f3"
          />
        </div>
      </div>

      {/* Selected Day Banner */}
      {selectedDayStats && (
        <div className="selected-day-banner">
          <div className="selected-day-info">
            <h4>{selectedDay}</h4>
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
            <div className="col-lg-2 col-md-6 mb-3">
              <label className="form-label">Year</label>
              <select 
                className="form-select" 
                value={bookingYearFilter} 
                onChange={(e) => {
                  setBookingYearFilter(e.target.value);
                  setBookingsCurrentPage(1);
                }}
              >
                <option value="All">All Years</option>
                {availableBookingYears.map(year => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-lg-3 col-md-6 mb-3">
              <label className="form-label">Session Type</label>
              <select 
                className="form-select" 
                value={selectedDay} 
                onChange={(e) => {
                  setSelectedDay(e.target.value);
                  setBookingsCurrentPage(1);
                }}
              >
                <option value="All">All Sessions ({bookings.length})</option>
                <option value="Friday">Friday ({dayWiseData["Friday"]?.count || 0} bookings)</option>
                <option value="Sunday Class 1">Sunday Class 1 ({dayWiseData["Sunday Class 1"]?.count || 0} bookings)</option>
                <option value="Sunday Class 2">Sunday Class 2 ({dayWiseData["Sunday Class 2"]?.count || 0} bookings)</option>
              </select>
            </div>

            <div className="col-lg-2 col-md-6 mb-3">
              <label className="form-label">Payment Status</label>
              <select className="form-select" value={paymentStatusFilter} onChange={(e) => setPaymentStatusFilter(e.target.value)}>
                <option value="All">All Status</option>
                <option value="Paid">Paid</option>
                <option value="Pending">Pending</option>
              </select>
            </div>

            <div className="col-lg-2 col-md-6 mb-3">
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
              <BookingCard
                key={booking.bookingId}
                booking={booking}
                isExpanded={expandedBooking === booking.bookingId}
                onToggleExpand={() => setExpandedBooking(expandedBooking === booking.bookingId ? null : booking.bookingId)}
              />
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
  );
}
