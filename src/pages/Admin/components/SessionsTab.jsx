import { FaCalendarAlt, FaFilter, FaSearch, FaChartLine, FaCheck } from "react-icons/fa";
import StatCard from "./StatCard";
import Pagination from "./Pagination";

export default function SessionsTab({
  sessions,
  loading,
  filteredSessions,
  initiateButton,
  onInitSessions,
  // Filters
  year,
  setYear,
  monthFilter,
  setMonthFilter,
  dayFilter,
  setDayFilter,
  classFilter,
  setClassFilter,
  sessionSearch,
  setSessionSearch,
  // Pagination
  sessionsCurrentPage,
  setSessionsCurrentPage,
  sessionsPerPage,
  setSessionsPerPage
}) {
  const indexOfLastSession = sessionsCurrentPage * sessionsPerPage;
  const indexOfFirstSession = indexOfLastSession - sessionsPerPage;
  const currentSessions = filteredSessions.slice(indexOfFirstSession, indexOfLastSession);
  const totalSessionsPages = Math.ceil(filteredSessions.length / sessionsPerPage);

  return (
    <div>
      <div className="content-card mb-4">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3 mb-4">
          <h2 style={{ color: '#ffc107', fontSize: '24px', margin: 0 }}>
            Session Statistics
          </h2>
          <button className="btn btn-warning" disabled={initiateButton} onClick={onInitSessions}>
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
            subtitle={`${filteredSessions.filter(s => s.day === 'Friday').reduce((sum, s) => sum + (s.bookedCount || 0), 0)} slots booked`}
            icon={<FaChartLine />}
            color="#00c853"
          />
          <StatCard 
            title="Sunday Sessions" 
            value={filteredSessions.filter(s => s.day === 'Sunday').length}
            subtitle={`${filteredSessions.filter(s => s.day === 'Sunday').reduce((sum, s) => sum + (s.bookedCount || 0), 0)} slots booked`}
            icon={<FaChartLine />}
            color="#2196f3"
          />
          <StatCard 
            title="Total Bookings" 
            value={filteredSessions.reduce((sum, s) => sum + (s.bookedCount || 0), 0)}
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
                      <td><span className="badge badge-primary">{s.bookedCount || 0}</span></td>
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
  );
}
