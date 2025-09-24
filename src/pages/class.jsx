// CricketAcademyBooking.jsx
import React, { useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS

const CricketAcademyBooking = () => {
  const [selectedChild, setSelectedChild] = useState("");
  const [selectedFridayDates, setSelectedFridayDates] = useState([]);
  const [selectedSundayDates, setSelectedSundayDates] = useState({});
  const [showCalendar, setShowCalendar] = useState(false);
  const [showDescription, setShowDescription] = useState(false);
  const [showFullSchedule, setShowFullSchedule] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);

  // Full exact Block 1 dates
  const block1Dates = [
    // Fridays
    { date: "2024-10-11", day: "Friday", time: "5:45pm-7:15pm", type: "friday", availability: "filling-fast", spots: 3 },
    { date: "2024-10-18", day: "Friday", time: "5:45pm-7:15pm", type: "friday", availability: "available", spots: 8 },
    { date: "2024-10-25", day: "Friday", time: "5:45pm-7:15pm", type: "friday", availability: "filling-fast", spots: 2 },
    { date: "2024-11-01", day: "Friday", time: "5:45pm-7:15pm", type: "friday", availability: "available", spots: 6 },
    { date: "2024-11-08", day: "Friday", time: "5:45pm-7:15pm", type: "friday", availability: "not-available", spots: 0 },
    { date: "2024-11-15", day: "Friday", time: "5:45pm-7:15pm", type: "friday", availability: "available", spots: 7 },
    { date: "2024-11-22", day: "Friday", time: "5:45pm-7:15pm", type: "friday", availability: "filling-fast", spots: 1 },
    { date: "2024-11-29", day: "Friday", time: "5:45pm-7:15pm", type: "friday", availability: "available", spots: 5 },
    { date: "2024-12-06", day: "Friday", time: "5:45pm-7:15pm", type: "friday", availability: "filling-fast", spots: 2 },
    { date: "2024-12-13", day: "Friday", time: "5:45pm-7:15pm", type: "friday", availability: "available", spots: 4 },

    // Sundays - Class 1: 4:30-6pm, Class 2: 6-7:30pm
    { date: "2024-10-13", day: "Sunday", time: "4:30pm-6:00pm", type: "sunday-class1", class: "Class 1", availability: "available", spots: 6 },
    { date: "2024-10-13", day: "Sunday", time: "6:00pm-7:30pm", type: "sunday-class2", class: "Class 2", availability: "filling-fast", spots: 2 },
    { date: "2024-10-20", day: "Sunday", time: "4:30pm-6:00pm", type: "sunday-class1", class: "Class 1", availability: "filling-fast", spots: 3 },
    { date: "2024-10-20", day: "Sunday", time: "6:00pm-7:30pm", type: "sunday-class2", class: "Class 2", availability: "not-available", spots: 0 },
    { date: "2024-10-27", day: "Sunday", time: "4:30pm-6:00pm", type: "sunday-class1", class: "Class 1", availability: "available", spots: 8 },
    { date: "2024-10-27", day: "Sunday", time: "6:00pm-7:30pm", type: "sunday-class2", class: "Class 2", availability: "available", spots: 7 },
    { date: "2024-11-03", day: "Sunday", time: "4:30pm-6:00pm", type: "sunday-class1", class: "Class 1", availability: "filling-fast", spots: 1 },
    { date: "2024-11-03", day: "Sunday", time: "6:00pm-7:30pm", type: "sunday-class2", class: "Class 2", availability: "available", spots: 5 },
    { date: "2024-11-10", day: "Sunday", time: "4:30pm-6:00pm", type: "sunday-class1", class: "Class 1", availability: "available", spots: 9 },
    { date: "2024-11-10", day: "Sunday", time: "6:00pm-7:30pm", type: "sunday-class2", class: "Class 2", availability: "filling-fast", spots: 2 },
    { date: "2024-11-17", day: "Sunday", time: "4:30pm-6:00pm", type: "sunday-class1", class: "Class 1", availability: "not-available", spots: 0 },
    { date: "2024-11-17", day: "Sunday", time: "6:00pm-7:30pm", type: "sunday-class2", class: "Class 2", availability: "available", spots: 6 },
    { date: "2024-11-24", day: "Sunday", time: "4:30pm-6:00pm", type: "sunday-class1", class: "Class 1", availability: "available", spots: 7 },
    { date: "2024-11-24", day: "Sunday", time: "6:00pm-7:30pm", type: "sunday-class2", class: "Class 2", availability: "filling-fast", spots: 3 },
    { date: "2024-12-01", day: "Sunday", time: "4:30pm-6:00pm", type: "sunday-class1", class: "Class 1", availability: "available", spots: 8 },
    { date: "2024-12-01", day: "Sunday", time: "6:00pm-7:30pm", type: "sunday-class2", class: "Class 2", availability: "available", spots: 4 },
    { date: "2024-12-08", day: "Sunday", time: "4:30pm-6:00pm", type: "sunday-class1", class: "Class 1", availability: "filling-fast", spots: 1 },
    { date: "2024-12-08", day: "Sunday", time: "6:00pm-7:30pm", type: "sunday-class2", class: "Class 2", availability: "available", spots: 5 },
    { date: "2024-12-15", day: "Sunday", time: "4:30pm-6:00pm", type: "sunday-class1", class: "Class 1", availability: "available", spots: 6 },
    { date: "2024-12-15", day: "Sunday", time: "6:00pm-7:30pm", type: "sunday-class2", class: "Class 2", availability: "filling-fast", spots: 2 },
  ];

  const toggleFridaySelection = (dateKey, availability) => {
    if (availability === "not-available") return;
    setSelectedFridayDates(prev =>
      prev.includes(dateKey) ? prev.filter(d => d !== dateKey) : [...prev, dateKey]
    );
  };

  const toggleSundaySelection = (date, sessionType, availability) => {
    if (availability === "not-available") return;
    setSelectedSundayDates(prev => ({
      ...prev,
      [date]: prev[date] === sessionType ? null : sessionType
    }));
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" });
  };

  const getAvailabilityBadge = (availability, spots) => {
    switch (availability) {
      case "available":
        return <span className="badge bg-success">Available ({spots})</span>;
      case "filling-fast":
        return <span className="badge bg-warning text-dark">Filling Fast ({spots} left)</span>;
      case "not-available":
        return <span className="badge bg-danger">Sold Out</span>;
      default:
        return null;
    }
  };

  const selectedDates = [
    ...selectedFridayDates,
    ...Object.entries(selectedSundayDates).filter(([_, session]) => session).map(([date, session]) => `${date}-${session}`)
  ];

  const totalCost = selectedDates.length * 40;
  const discountAmount = selectedDates.length === 10 ? 50 : 0;
  const finalCost = totalCost - discountAmount;

  // Separate Friday and Sunday sessions
  const fridaySessions = block1Dates.filter(s => s.day === "Friday");
  const sundaySessions = block1Dates.filter(s => s.day === "Sunday");

  return (
    <div className="min-vh-100" style={{ backgroundColor: "#f8f9fa" }}>
      {/* Hero Section */}
      <header className="py-5" style={{ backgroundColor: "#000" }}>
        <div className="container text-white text-center">
          <div className="d-inline-flex align-items-center justify-content-center rounded-circle bg-warning mb-3" style={{ width: 72, height: 72 }}>
            <i className="bi bi-trophy fs-2 text-dark"></i>
          </div>
          <h1 className="display-5 fw-bold">Masterclass Cricket Academy</h1>
          <p className="lead text-white-50 mb-3">Block 1: Technical Development Programme</p>

          <div className="d-flex justify-content-center gap-2 mb-3">
            <div className="alert alert-warning d-inline-flex align-items-center py-2 px-3 mb-0">
              <i className="bi bi-exclamation-triangle-fill me-2"></i>
              <div>
                <strong>Sessions filling up quickly</strong>
                <div className="small">Select your sessions below — full schedule available</div>
              </div>
            </div>
            <button className="btn btn-outline-light" onClick={() => setShowFullSchedule(true)}>
              <i className="bi bi-card-list me-2"></i> View Full Schedule
            </button>
          </div>

          <div>
            <small className="text-white-50">Fridays: 5:45pm - 7:15pm (11 Oct - 13 Dec) • Sundays: Class1 4:30pm-6pm & Class2 6pm-7:30pm (13 Oct - 15 Dec)</small>
          </div>
        </div>
      </header>

      <main className="container py-5">
        {/* Venue */}
        <div className="card mb-4">
          <div className="card-body">
            <h5 className="card-title mb-1"><i className="bi bi-geo-alt me-2"></i>Venue</h5>
            <p className="text-muted mb-0">Tiffin Girls School, KT2 5PL</p>
          </div>
        </div>

        {/* Programme Details */}
        <div className="card mb-4">
          <div className="card-body d-flex justify-content-between align-items-center">
            <div>
              <h5 className="card-title mb-1">Programme Details</h5>
              <p className="text-muted mb-0">Technical analysis, skills development & conditioning</p>
            </div>
            <button className="btn btn-light" onClick={() => setShowDescription(true)}>
              <i className="bi bi-info-circle me-2"></i> Read More
            </button>
          </div>
        </div>

        {/* Child Selection */}
        <div className="card mb-4">
          <div className="card-body">
            <h5 className="card-title">Select Child</h5>
            <div className="d-flex gap-2 flex-wrap">
              <select className="form-select" value={selectedChild} onChange={(e) => setSelectedChild(e.target.value)}>
                <option value="">Choose child</option>
                <option value="child1">Child 1</option>
                <option value="child2">Child 2</option>
              </select>
              <button className="btn btn-outline-secondary">Add New Child</button>
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div className="row g-3 mb-4">
          <div className="col-md-6">
            <div className="card text-center">
              <div className="card-body">
                <p className="text-muted mb-1">Per Session</p>
                <h2 className="mb-0">£40</h2>
              </div>
            </div>
          </div>

          <div className="col-md-6">
            <div className="card position-relative border-warning text-center">
              <span className="badge bg-warning text-dark position-absolute top-0 start-50 translate-middle">Best Value</span>
              <div className="card-body mt-3">
                <p className="text-muted mb-1">Full Block (10 sessions)</p>
                <h2 className="mb-0">£350</h2>
                <p className="text-success mb-0 fw-bold">Save £50</p>
              </div>
            </div>
          </div>
        </div>

        {/* Calendar Selection */}
        <div className="card mb-4">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="mb-0"><i className="bi bi-calendar-check me-2"></i>Select Sessions</h5>
              <div>
                <button className="btn btn-outline-secondary btn-sm me-2" onClick={() => setShowCalendar(!showCalendar)}>
                  {showCalendar ? "Hide Sessions" : "View Sessions"}
                </button>
                <button className="btn btn-outline-secondary btn-sm" onClick={() => setShowFullSchedule(true)}>
                  View Full Schedule
                </button>
              </div>
            </div>

            {showCalendar && (
              <div>
                <h6>Fridays</h6>
                <div className="list-group mb-3">
                  {fridaySessions.map((session, index) => {
                    const dateKey = `${session.date}-${session.time}`;
                    const isSelected = selectedFridayDates.includes(dateKey);
                    const isDisabled = session.availability === "not-available";

                    return (
                      <button
                        key={index}
                        type="button"
                        onClick={() => toggleFridaySelection(dateKey, session.availability)}
                        className={`list-group-item list-group-item-action d-flex justify-content-between align-items-center ${isDisabled ? "disabled" : ""}`}
                        aria-disabled={isDisabled}
                        style={{ cursor: isDisabled ? "not-allowed" : "pointer" }}
                      >
                        <div>
                          <div className="fw-semibold">{formatDate(session.date)}</div>
                          <div className="text-muted small">{session.time}</div>
                        </div>
                        <div className="d-flex align-items-center gap-3">
                          {getAvailabilityBadge(session.availability, session.spots)}
                          <div className={`rounded-circle border d-flex align-items-center justify-content-center ${isSelected ? "bg-warning" : ""}`} style={{ width: 22, height: 22 }}>
                            {isSelected && <i className="bi bi-check-lg text-dark" />}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>

                <h6>Sundays</h6>
                <div className="list-group">
                  {sundaySessions.map((session, index) => {
                    const date = session.date;
                    const sessionType = session.class;
                    const isSelected = selectedSundayDates[date] === sessionType;
                    const isDisabled = session.availability === "not-available";

                    return (
                      <button
                        key={index}
                        type="button"
                        onClick={() => toggleSundaySelection(date, sessionType, session.availability)}
                        className={`list-group-item list-group-item-action d-flex justify-content-between align-items-center ${isDisabled ? "disabled" : ""}`}
                        aria-disabled={isDisabled}
                        style={{ cursor: isDisabled ? "not-allowed" : "pointer" }}
                      >
                        <div>
                          <div className="fw-semibold">{formatDate(session.date)} — {sessionType}</div>
                          <div className="text-muted small">{session.time}</div>
                        </div>
                        <div className="d-flex align-items-center gap-3">
                          {getAvailabilityBadge(session.availability, session.spots)}
                          <div className={`rounded-circle border d-flex align-items-center justify-content-center ${isSelected ? "bg-warning" : ""}`} style={{ width: 22, height: 22 }}>
                            {isSelected && <i className="bi bi-check-lg text-dark" />}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Terms */}
        <div className="card mb-4">
          <div className="card-body d-flex gap-2 align-items-start">
            <input type="checkbox" checked={acceptTerms} onChange={(e) => setAcceptTerms(e.target.checked)} />
            <div className="small">
              I accept the <a href="#">Terms and Conditions</a> and confirm all information is accurate.
            </div>
          </div>
        </div>

        {/* Total & Confirm */}
        <div className="card">
          <div className="card-body d-flex justify-content-between align-items-center mb-3">
            <div>
              <h5 className="mb-0">Total</h5>
              <div className="text-muted small">{selectedDates.length} session{selectedDates.length !== 1 ? "s" : ""} selected</div>
            </div>
            <div className="text-end">
              {discountAmount > 0 && <div className="text-muted text-decoration-line-through">£{totalCost}</div>}
              <div className="fs-3 fw-bold">£{finalCost}</div>
              {discountAmount > 0 && <div className="text-success small">You save £{discountAmount}</div>}
            </div>
          </div>

          <div className="card-footer bg-white">
            <button
              type="button"
              className="btn btn-dark w-100"
              disabled={selectedDates.length === 0 || !selectedChild || !acceptTerms}
              onClick={() => {
                alert(`Booking confirmed for ${selectedChild} — ${selectedDates.length} session(s). Total £${finalCost}`);
              }}
            >
              Confirm Booking - £{finalCost}
            </button>
          </div>
        </div>
      </main>

      {/* Programme Description Modal */}
      {showDescription && (
        <>
          <div className="modal-backdrop fade show"></div>
          <div className="modal fade show d-block" tabIndex="-1" role="dialog" style={{ zIndex: 1050 }}>
            <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Block 1: Technical Development</h5>
                  <button type="button" className="btn-close" onClick={() => setShowDescription(false)}></button>
                </div>
                <div className="modal-body">
                  <h6><i className="bi bi-bullseye me-2"></i>Batting Excellence</h6>
                  <p>Technical analysis using video feedback, stance correction, shot selection, and timing drills.</p>

                  <h6><i className="bi bi-graph-up-arrow me-2"></i>Bowling Development</h6>
                  <p>Comprehensive technique analysis, run-up optimization, accuracy training, and variation development.</p>

                  <h6><i className="bi bi-award me-2"></i>Fielding & Conditioning</h6>
                  <p>Dynamic fielding drills, catching techniques, and cricket-specific fitness training.</p>

                  <hr />
                  <h6>Programme Includes:</h6>
                  <ul>
                    <li>Individual technical assessment</li>
                    <li>Video analysis and feedback</li>
                    <li>Professional qualified coaching</li>
                    <li>Small group sessions (max 12 players)</li>
                    <li>Progress tracking reports</li>
                    <li>Premium equipment access</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Full Schedule Modal */}
      {showFullSchedule && (
        <>
          <div className="modal-backdrop fade show"></div>
          <div className="modal fade show d-block" tabIndex="-1" role="dialog" style={{ zIndex: 1050 }}>
            <div className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Full Schedule — Block 1 (All sessions)</h5>
                  <button type="button" className="btn-close" onClick={() => setShowFullSchedule(false)}></button>
                </div>
                <div className="modal-body">
                  <div className="table-responsive">
                    <table className="table table-sm align-middle">
                      <thead>
                        <tr>
                          <th>Date</th>
                          <th>Day</th>
                          <th>Time</th>
                          <th>Class</th>
                          <th>Availability</th>
                          <th>Spots</th>
                        </tr>
                      </thead>
                      <tbody>
                        {block1Dates.map((s, i) => (
                          <tr key={i}>
                            <td>{s.date}</td>
                            <td>{s.day}</td>
                            <td>{s.time}</td>
                            <td>{s.class || "-"}</td>
                            <td>
                              {s.availability === "available" && <span className="badge bg-success">Available</span>}
                              {s.availability === "filling-fast" && <span className="badge bg-warning text-dark">Filling Fast</span>}
                              {s.availability === "not-available" && <span className="badge bg-danger">Sold Out</span>}
                            </td>
                            <td>{s.spots}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="mt-3 small text-muted">
                    Note: click <strong>View Sessions</strong> in the main UI to pick individual sessions.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CricketAcademyBooking;
