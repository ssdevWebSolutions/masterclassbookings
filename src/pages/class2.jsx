import React, { useState, useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { useDispatch, useSelector } from "react-redux";
import { fetchSessionsByYear } from "@/Redux/Sessions/sessionsSlice";

const CricketAcademyBooking = () => {
  const [selectedChild, setSelectedChild] = useState("");
  const [selectedFridayDates, setSelectedFridayDates] = useState([]);
  const [selectedSundayClass1Dates, setSelectedSundayClass1Dates] = useState([]);
  const [selectedSundayClass2Dates, setSelectedSundayClass2Dates] = useState([]);
  const [showDescription, setShowDescription] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [acceptDataPolicy, setAcceptDataPolicy] = useState(false);
  const [showFridays, setShowFridays] = useState(false);
  const [showSundayClass1, setShowSundayClass1] = useState(false);
  const [showSundayClass2, setShowSundayClass2] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showBookingConfirmation, setShowBookingConfirmation] = useState(false);
  const [termsScrolledToEnd, setTermsScrolledToEnd] = useState(false);
  const [isPlatinumSelected, setIsPlatinumSelected] = useState(false);
  const [showFridayDiscount, setShowFridayDiscount] = useState(false);
  const [showSundayClass1Discount, setShowSundayClass1Discount] = useState(false);
  const [showSundayClass2Discount, setShowSundayClass2Discount] = useState(false);
  const [showPlatinumInfo, setShowPlatinumInfo] = useState(false);
  const [showBookingProcessModal, setShowBookingProcessModal] = useState(false);
  const loginData = useSelector(state => state.auth.loginData);
  
  const kidstate = useSelector(state => state.kids.list);
  const { data: sessions, loading } = useSelector((state) => state.sessions);

  // Dynamic data filtering from API
  const fridayDates = sessions ? sessions.filter(session => session.type === 'friday') : [];
  const sundayClass1Dates = sessions ? sessions.filter(session => session.type === 'sunday-class1') : [];
  const sundayClass2Dates = sessions ? sessions.filter(session => session.type === 'sunday-class2') : [];

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchSessionsByYear(2026));
   console.log("Kids:", kidstate, "Sessions:", sessions);
 }, [ ]);

  useEffect(() => {
    //  dispatch(fetchSessionsByYear(year));
    console.log("Kids:", kidstate, "Sessions:", sessions);
  }, [kidstate, sessions]);

  const getAvailabilityStatus = (bookedCount) => {
    // Convert to number and handle undefined/null cases
    const count = Number(bookedCount) || 0;
    
    if (count >= 36) return "not-available";
    if (count >= 30) return "filling-fast";
    return "available";
  };

  const getAvailabilityBadge = (bookedCount) => {
    const status = getAvailabilityStatus(bookedCount);
    switch (status) {
      case "available":
        return <span className="badge bg-success">Available</span>;
      case "filling-fast":
        return <span className="badge bg-warning text-dark">Filling Fast</span>;
      case "not-available":
        return <span className="badge bg-danger">Sold Out</span>;
      default:
        return null;
    }
  };

  const toggleFridaySelection = (sessionId, bookedCount) => {
    const status = getAvailabilityStatus(bookedCount);
    if (status === "not-available") return;
    
    const newSelection = selectedFridayDates.includes(sessionId) 
      ? selectedFridayDates.filter(d => d !== sessionId) 
      : [...selectedFridayDates, sessionId];
    
    setSelectedFridayDates(newSelection);
    
    const availableFridaysCount = fridayDates.filter(session => 
      getAvailabilityStatus(session.bookedCount) !== "not-available"
    ).length;
    
    if (newSelection.length === availableFridaysCount && availableFridaysCount === 10) {
      setShowFridayDiscount(true);
    }
  };

  const toggleSundayClass1Selection = (sessionId, bookedCount) => {
    const status = getAvailabilityStatus(bookedCount);
    if (status === "not-available") return;
    
    const newSelection = selectedSundayClass1Dates.includes(sessionId)
      ? selectedSundayClass1Dates.filter(d => d !== sessionId)
      : [...selectedSundayClass1Dates, sessionId];
    
    setSelectedSundayClass1Dates(newSelection);

    const availableClass1Count = sundayClass1Dates.filter(session => 
      getAvailabilityStatus(session.bookedCount) !== "not-available"
    ).length;
    
    if (newSelection.length === availableClass1Count && availableClass1Count === 10) {
      setShowSundayClass1Discount(true);
    }
  };

  const toggleSundayClass2Selection = (sessionId, bookedCount) => {
    const status = getAvailabilityStatus(bookedCount);
    if (status === "not-available") return;
    
    const newSelection = selectedSundayClass2Dates.includes(sessionId)
      ? selectedSundayClass2Dates.filter(d => d !== sessionId)
      : [...selectedSundayClass2Dates, sessionId];
    
    setSelectedSundayClass2Dates(newSelection);

    const availableClass2Count = sundayClass2Dates.filter(session => 
      getAvailabilityStatus(session.bookedCount) !== "not-available"
    ).length;
    
    if (newSelection.length === availableClass2Count && availableClass2Count === 10) {
      setShowSundayClass2Discount(true);
    }
  };

  const handleSelectAllFridays = (e) => {
    if (e.target.checked) {
      const availableFridays = fridayDates
        .filter(session => getAvailabilityStatus(session.bookedCount) !== "not-available")
        .map(session => session.id);
      setSelectedFridayDates(availableFridays);
      
      if (availableFridays.length === 10) {
        setShowFridayDiscount(true);
      }
    } else {
      setSelectedFridayDates([]);
    }
  };

  const handleSelectAllSundayClass1 = (e) => {
    if (e.target.checked) {
      const availableSundays = sundayClass1Dates
        .filter(session => getAvailabilityStatus(session.bookedCount) !== "not-available")
        .map(session => session.id);
      setSelectedSundayClass1Dates(availableSundays);
      
      if (availableSundays.length === 10) {
        setShowSundayClass1Discount(true);
      }
    } else {
      setSelectedSundayClass1Dates([]);
    }
  };

  const handleSelectAllSundayClass2 = (e) => {
    if (e.target.checked) {
      const availableSundays = sundayClass2Dates
        .filter(session => getAvailabilityStatus(session.bookedCount) !== "not-available")
        .map(session => session.id);
      setSelectedSundayClass2Dates(availableSundays);
      
      if (availableSundays.length === 10) {
        setShowSundayClass2Discount(true);
      }
    } else {
      setSelectedSundayClass2Dates([]);
    }
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" });
  };

  const totalSelectedSessions = isPlatinumSelected ? 0 : selectedFridayDates.length + selectedSundayClass1Dates.length + selectedSundayClass2Dates.length;
  const isFullFridayBlock = selectedFridayDates.length === 10;
  const isFullSundayClass1Block = selectedSundayClass1Dates.length === 10;
  const isFullSundayClass2Block = selectedSundayClass2Dates.length === 10;
  
  const regularPrice = isPlatinumSelected ? 900 : totalSelectedSessions * 40;
  let discountAmount = 0;
  
  if (!isPlatinumSelected) {
    if (isFullFridayBlock) discountAmount += 50;
    if (isFullSundayClass1Block) discountAmount += 50;
    if (isFullSundayClass2Block) discountAmount += 50;
  }
  
  const finalPrice = regularPrice - discountAmount;

  const getSelectedChildDetails = () => {
    return kidstate?.find(child => child.id.toString() === selectedChild);
  };

  const generateBookingJSON = () => {
    const selectedChildDetails = getSelectedChildDetails();
    
    return {
      childId: selectedChild,
      parentId : loginData.id,
      childDetails: selectedChildDetails || null,
      bookingType: isPlatinumSelected ? "platinum_pass" : "individual_sessions",
      sessionIds: isPlatinumSelected ? [] : [
        ...selectedFridayDates,
        ...selectedSundayClass1Dates,
        ...selectedSundayClass2Dates
      ],
      totalAmount: finalPrice,
      discountApplied: discountAmount,
      acceptTerms: acceptTerms,
      acceptDataPolicy: acceptDataPolicy,
      fullBlockSelections: {
        fridayBlock: isFullFridayBlock,
        sundayClass1Block: isFullSundayClass1Block,
        sundayClass2Block: isFullSundayClass2Block
      },
      paymentStatus:false,
      timestamp: new Date().toISOString()
    };
  };

  const handleConfirmBooking = () => {
    if (!isPlatinumSelected && totalSelectedSessions === 1) {
      setShowConfirmDialog(true);
    } else {
      setShowBookingConfirmation(true);
    }
  };

  const processBooking = () => {
    const bookingData = generateBookingJSON();
    console.log("Booking Data:", bookingData);
    
    // Option 1: Using React Router - pass data via state
    // navigate('/payment', { state: { bookingData } });
    
    // Option 2: Store in sessionStorage and navigate
    sessionStorage.setItem('cricketBookingData', JSON.stringify(bookingData));
    
    // Show professional modal instead of alert
    setShowBookingProcessModal(true);
    setShowConfirmDialog(false);
    setShowBookingConfirmation(false);
  };

  const handleProceedToPayment = () => {
    setShowBookingProcessModal(false);
    window.location.href = '/payment';
  };

  const handleTermsScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    const scrolledToBottom = scrollTop + clientHeight >= scrollHeight - 5;
    setTermsScrolledToEnd(scrolledToBottom);
  };

  const handlePlatinumClick = () => {
    if (!isPlatinumSelected) {
      setShowPlatinumInfo(true);
    }
    setIsPlatinumSelected(!isPlatinumSelected);
  };

  // Check if all sessions are selected for each category
  const availableFridaysCount = fridayDates.filter(session => getAvailabilityStatus(session.bookedCount) !== "not-available").length;
  const allFridaysSelected = selectedFridayDates.length === availableFridaysCount && availableFridaysCount > 0;

  const availableSundayClass1Count = sundayClass1Dates.filter(session => getAvailabilityStatus(session.bookedCount) !== "not-available").length;
  const allSundayClass1Selected = selectedSundayClass1Dates.length === availableSundayClass1Count && availableSundayClass1Count > 0;

  const availableSundayClass2Count = sundayClass2Dates.filter(session => getAvailabilityStatus(session.bookedCount) !== "not-available").length;
  const allSundayClass2Selected = selectedSundayClass2Dates.length === availableSundayClass2Count && availableSundayClass2Count > 0;

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
  <div className="min-vh-100" style={{ backgroundColor: "#f8f9fa" }}>
          {/* Hero Section */}
          <header className="py-5" style={{ backgroundColor: "#000" }}>
            <div className="container text-white text-center">

            <button
          onClick={() => window.history.back()}
          className="btn btn-outline-light position-absolute top-0 start-0 m-3"
        >
          <i className="bi bi-arrow-left me-1"></i> Back
        </button>



                  <div
            className="d-inline-flex align-items-center justify-content-center rounded-circle bg-warning mb-3"
            style={{
              width: "18vw", // Responsive width (adjust as needed)
              height: "18vw", // Keep it square for perfect circle
              maxWidth: "52px", // Limit max size
              maxHeight: "52px",
              minWidth: "48px", // Optional: don't get too small
              minHeight: "48px",
            }}
          >
            <img
              src="logo_.png" // ✅ Replace with your logo path
              alt="Logo"
              className="img-fluid"
              style={{
                width: "100%", // Relative to container
                height: "100%",
                objectFit: "contain",
              }}
            />
          </div>

          <h1 className="display-5 fw-bold">Masterclass Cricket Academy</h1>
          <p className="lead text-white-50 mb-3">Block 1: Technical Development Programme</p>

          <div className="alert alert-warning d-inline-flex align-items-center py-2 px-3 mb-3">
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
            <div>
              <strong>Sessions filling up quickly</strong>
              <div className="small">Select your sessions below</div>
            </div>
          </div>

          <div>
            <small className="text-white-50">
              Fridays: 5:45pm - 7:15pm (10 Oct - 12 Dec 2025) • Sundays: Class1 4:30pm-6pm & Class2 6pm-7:30pm (12 Oct - 14 Dec 2025)
            </small>
          </div>
        </div>
      </header>

      <main className="container py-5">
        {!showBookingConfirmation ? (
          <>
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
                  <p className="text-muted mb-0">10-Week Technical Masterclass Clinic (Ages 8–13)</p>
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
                    {kidstate?.map(child => (
                      <option key={child.id} value={child.id}>
                        {child.firstName} {child.lastName} (Age {child.age})
                      </option>
                    ))}
                  </select>
                  <button className="btn btn-outline-secondary">Add New Child</button>
                </div>
              </div>
            </div>

            {/* Pricing */}
            <div className="row g-3 mb-4">
              <div className="col-md-4">
                <div className="card text-center">
                  <div className="card-body">
                    <p className="text-muted mb-1">Per Session</p>
                    <h2 className="mb-0">£40</h2>
                  </div>
                </div>
              </div>

              <div className="col-md-4">
                <div className="card position-relative border-warning text-center">
                  <span className="badge bg-warning text-dark position-absolute top-0 start-50 translate-middle">Best Value</span>
                  <div className="card-body mt-3">
                    <p className="text-muted mb-1">Full Block (10 sessions)</p>
                    <h2 className="mb-0">£350</h2>
                    <p className="text-success mb-0 fw-bold">Save £50</p>
                  </div>
                </div>
              </div>

              <div className="col-md-4">
                <div className={`card position-relative border-primary text-center ${isPlatinumSelected ? 'border-3 bg-light' : ''}`}>
                  <span className="badge bg-primary position-absolute top-0 start-50 translate-middle">Platinum Pass</span>
                  <div className="card-body mt-3">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <div className="flex-grow-1">
                        <p className="text-muted mb-1">Premium Access</p>
                        <div className="text-decoration-line-through text-muted">£1210</div>
                        <h2 className="mb-0 text-primary">£900</h2>
                        <p className="text-success mb-0 fw-bold">Full Access</p>
                      </div>
                      <div 
                        className={`rounded-circle border d-flex align-items-center justify-content-center ${isPlatinumSelected ? "bg-primary border-primary" : "border-secondary"}`} 
                        style={{ width: 24, height: 24, cursor: 'pointer' }}
                        onClick={handlePlatinumClick}
                      >
                        {isPlatinumSelected && <i className="bi bi-check-lg text-white" />}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Session Selection */}
            {!isPlatinumSelected && (
              <div className="card mb-4">
                <div className="card-body">
                  <h5 className="mb-3"><i className="bi bi-calendar-check me-2"></i>Select Sessions</h5>

                  {/* Fridays Section */}
                  <div className="mb-3">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <button
                        className="btn btn-outline-secondary d-flex align-items-center flex-grow-1 me-3"
                        onClick={() => setShowFridays(!showFridays)}
                      >
                        <i className="bi bi-calendar me-2"></i>
                        Fridays ({fridayDates.length} sessions available)
                        <i className={`bi bi-chevron-${showFridays ? 'up' : 'down'} ms-auto`}></i>
                      </button>
                      <div 
                        className={`rounded-circle border d-flex align-items-center justify-content-center ${allFridaysSelected ? "bg-warning border-warning" : "border-secondary"}`} 
                        style={{ width: 28, height: 28, cursor: 'pointer' }}
                        onClick={(e) => handleSelectAllFridays({ target: { checked: !allFridaysSelected } })}
                      >
                        {allFridaysSelected && <i className="bi bi-check-lg text-dark" />}
                      </div>
                    </div>
                  
                    {showFridays && (
                      <div className="mt-2">
                        <div className="list-group">
                          {fridayDates.map((session, index) => {
                            const isSelected = selectedFridayDates.includes(session.id);
                            const status = getAvailabilityStatus(session.bookedCount);
                            const isDisabled = status === "not-available";

                            return (
                              <button
                                key={session.id}
                                type="button"
                                onClick={() => toggleFridaySelection(session.id, session.bookedCount)}
                                className={`list-group-item list-group-item-action d-flex justify-content-between align-items-center ${isDisabled ? "disabled" : ""}`}
                                aria-disabled={isDisabled}
                                style={{ cursor: isDisabled ? "not-allowed" : "pointer" }}
                              >
                                <div>
                                  <div className="fw-semibold">{formatDate(session.date)}</div>
                                  <div className="text-muted small">{session.time}</div>
                                </div>
                                <div className="d-flex align-items-center gap-3">
                                  {getAvailabilityBadge(session.bookedCount)}
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

                  {/* Sunday Class 1 Section */}
                  <div className="mb-3">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <button
                        className="btn btn-outline-secondary d-flex align-items-center flex-grow-1 me-3"
                        onClick={() => setShowSundayClass1(!showSundayClass1)}
                      >
                        <i className="bi bi-calendar me-2"></i>
                        Sunday Class 1 (4:30pm-6:00pm) - {sundayClass1Dates.length} sessions
                        <i className={`bi bi-chevron-${showSundayClass1 ? 'up' : 'down'} ms-auto`}></i>
                      </button>
                      <div 
                        className={`rounded-circle border d-flex align-items-center justify-content-center ${allSundayClass1Selected ? "bg-warning border-warning" : "border-secondary"}`} 
                        style={{ width: 28, height: 28, cursor: 'pointer' }}
                        onClick={(e) => handleSelectAllSundayClass1({ target: { checked: !allSundayClass1Selected } })}
                      >
                        {allSundayClass1Selected && <i className="bi bi-check-lg text-dark" />}
                      </div>
                    </div>
                    
                    {showSundayClass1 && (
                      <div className="mt-2">
                        <div className="list-group">
                          {sundayClass1Dates.map((session) => {
                            const isSelected = selectedSundayClass1Dates.includes(session.id);
                            const status = getAvailabilityStatus(session.bookedCount);
                            const isDisabled = status === "not-available";

                            return (
                              <button
                                key={session.id}
                                type="button"
                                onClick={() => toggleSundayClass1Selection(session.id, session.bookedCount)}
                                className={`list-group-item list-group-item-action d-flex justify-content-between align-items-center ${isDisabled ? "disabled" : ""}`}
                                aria-disabled={isDisabled}
                                style={{ cursor: isDisabled ? "not-allowed" : "pointer" }}
                              >
                                <div>
                                  <div className="fw-semibold">{formatDate(session.date)}</div>
                                  <div className="text-muted small">{session.time}</div>
                                </div>
                                <div className="d-flex align-items-center gap-3">
                                  {getAvailabilityBadge(session.bookedCount)}
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

                  {/* Sunday Class 2 Section */}
                  <div className="mb-3">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <button
                        className="btn btn-outline-secondary d-flex align-items-center flex-grow-1 me-3"
                        onClick={() => setShowSundayClass2(!showSundayClass2)}
                      >
                        <i className="bi bi-calendar me-2"></i>
                        Sunday Class 2 (6:00pm-7:30pm) - {sundayClass2Dates.length} sessions
                        <i className={`bi bi-chevron-${showSundayClass2 ? 'up' : 'down'} ms-auto`}></i>
                      </button>
                      <div 
                        className={`rounded-circle border d-flex align-items-center justify-content-center ${allSundayClass2Selected ? "bg-warning border-warning" : "border-secondary"}`} 
                        style={{ width: 28, height: 28, cursor: 'pointer' }}
                        onClick={(e) => handleSelectAllSundayClass2({ target: { checked: !allSundayClass2Selected } })}
                      >
                        {allSundayClass2Selected && <i className="bi bi-check-lg text-dark" />}
                      </div>
                    </div>
                    
                    {showSundayClass2 && (
                      <div className="mt-2">
                        <div className="list-group">
                          {sundayClass2Dates.map((session) => {
                            const isSelected = selectedSundayClass2Dates.includes(session.id);
                            const status = getAvailabilityStatus(session.bookedCount);
                            const isDisabled = status === "not-available";

                            return (
                              <button
                                key={session.id}
                                type="button"
                                onClick={() => toggleSundayClass2Selection(session.id, session.bookedCount)}
                                className={`list-group-item list-group-item-action d-flex justify-content-between align-items-center ${isDisabled ? "disabled" : ""}`}
                                aria-disabled={isDisabled}
                                style={{ cursor: isDisabled ? "not-allowed" : "pointer" }}
                              >
                                <div>
                                  <div className="fw-semibold">{formatDate(session.date)}</div>
                                  <div className="text-muted small">{session.time}</div>
                                </div>
                                <div className="d-flex align-items-center gap-3">
                                  {getAvailabilityBadge(session.bookedCount)}
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
              </div>
            )}

            {/* Data Permission */}
            <div className="card mb-4">
              <div className="card-body">
                <div className="d-flex gap-2 align-items-start">
                  <input type="checkbox" checked={acceptDataPolicy} onChange={(e) => setAcceptDataPolicy(e.target.checked)} />
                  <div className="small">
                    I give permission to analyze my data and post on social media for promotional purposes.
                  </div>
                </div>
              </div>
            </div>

            {/* Terms */}
            <div className="card mb-4">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h6 className="mb-0">Terms and Conditions</h6>
                  <button className="btn btn-outline-secondary btn-sm" onClick={() => setShowTerms(true)}>
                    Read Terms
                  </button>
                </div>
                <div className="d-flex gap-2 align-items-start">
                  <input 
                    type="checkbox" 
                    checked={acceptTerms} 
                    onChange={(e) => setAcceptTerms(e.target.checked)}
                    disabled={!termsScrolledToEnd}
                  />
                  <div className="small">
                    I accept the <button type="button" className="btn btn-link p-0 align-baseline" onClick={() => setShowTerms(true)}>Terms and Conditions</button> and confirm all information is accurate.
                    {!termsScrolledToEnd && <div className="text-warning small mt-1">Please read the full terms to continue</div>}
                  </div>
                </div>
              </div>
            </div>

            {/* Total & Confirm */}
            <div className="card">
              <div className="card-body d-flex justify-content-between align-items-center mb-3">
                <div>
                  <h5 className="mb-0">Total</h5>
                  <div className="text-muted small">
                    {isPlatinumSelected ? "Platinum Pass Selected" : `${totalSelectedSessions} session${totalSelectedSessions !== 1 ? "s" : ""} selected`}
                  </div>
                  {(isFullFridayBlock || isFullSundayClass1Block || isFullSundayClass2Block) && !isPlatinumSelected && (
                    <div className="text-success small">Block Discount Applied!</div>
                  )}
                </div>
                <div className="text-end">
                  {!isPlatinumSelected && discountAmount > 0 && <div className="text-muted text-decoration-line-through">£{regularPrice}</div>}
                  <div className="fs-3 fw-bold">£{finalPrice}</div>
                  {!isPlatinumSelected && discountAmount > 0 && <div className="text-success small">You save £{discountAmount}</div>}
                </div>
              </div>

              <div className="card-footer bg-white">
                <button
                  type="button"
                  className="btn btn-dark w-100"
                  disabled={(totalSelectedSessions === 0 && !isPlatinumSelected) || !selectedChild || !acceptTerms || !acceptDataPolicy}
                  onClick={handleConfirmBooking}
                >
                  {isPlatinumSelected ? `Confirm Platinum Pass - £${finalPrice}` : `Continue to Booking Confirmation - £${finalPrice}`}
                </button>
              </div>
            </div>
          </>
        ) : (
          /* Booking Confirmation Page */
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="card">
                <div className="card-header bg-primary text-white">
                  <h4 className="mb-0"><i className="bi bi-check-circle me-2"></i>Confirm Your Booking</h4>
                </div>
                <div className="card-body">
                  {/* Child Details */}
                  <div className="mb-4">
                    <h6 className="border-bottom pb-2 mb-3">Child Details</h6>
                    {getSelectedChildDetails() && (
                      <div className="row">
                        <div className="col-md-6">
                          <p><strong>Name:</strong> {getSelectedChildDetails().firstName} {getSelectedChildDetails().lastName}</p>
                          <p><strong>Age:</strong> {getSelectedChildDetails().age}</p>
                          <p><strong>Level:</strong> {getSelectedChildDetails().level}</p>
                        </div>
                        <div className="col-md-6">
                          <p><strong>Club:</strong> {getSelectedChildDetails().club}</p>
                          <p><strong>Medical Info:</strong> {getSelectedChildDetails().medicalInfo}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Venue & Programme */}
                  <div className="mb-4">
                    <h6 className="border-bottom pb-2 mb-3">Programme Details</h6>
                    <div className="row">
                      <div className="col-md-6">
                        <p><strong>Programme:</strong> Block 1 - Technical Development</p>
                        <p><strong>Venue:</strong> Tiffin Girls School, KT2 5PL</p>
                      </div>
                      <div className="col-md-6">
                        <p><strong>Age Group:</strong> 8-13 years</p>
                        <p><strong>Coach:</strong> Uzi Arif (Head Coach)</p>
                      </div>
                    </div>
                  </div>

                  {/* Selected Sessions */}
                  <div className="mb-4">
                    <h6 className="border-bottom pb-2 mb-3">
                      {isPlatinumSelected ? "Platinum Pass - Full Access" : `Selected Sessions (${totalSelectedSessions})`}
                    </h6>
                    
                    {isPlatinumSelected ? (
                      <div className="alert alert-primary">
                        <i className="bi bi-star-fill me-2"></i>
                        <strong>Platinum Pass Selected</strong>
                        <p className="mb-0 mt-2">You have full access to all sessions and can join any available class without restrictions.</p>
                      </div>
                    ) : (
                      <>
                        {selectedFridayDates.length > 0 && (
                          <div className="mb-3">
                            <strong>Friday Sessions:</strong>
                            <ul className="list-unstyled mt-2">
                              {selectedFridayDates.map(sessionId => {
                                const session = fridayDates.find(s => s.id === sessionId);
                                return (
                                  <li key={sessionId} className="mb-1">
                                    <i className="bi bi-calendar-event me-2"></i>
                                    {formatDate(session.date)} - {session.time}
                                  </li>
                                );
                              })}
                            </ul>
                          </div>
                        )}

                        {selectedSundayClass1Dates.length > 0 && (
                          <div className="mb-3">
                            <strong>Sunday Class 1 Sessions:</strong>
                            <ul className="list-unstyled mt-2">
                              {selectedSundayClass1Dates.map(sessionId => {
                                const session = sundayClass1Dates.find(s => s.id === sessionId);
                                return (
                                  <li key={sessionId} className="mb-1">
                                    <i className="bi bi-calendar-event me-2"></i>
                                    {formatDate(session.date)} - {session.time}
                                  </li>
                                );
                              })}
                            </ul>
                          </div>
                        )}

                        {selectedSundayClass2Dates.length > 0 && (
                          <div className="mb-3">
                            <strong>Sunday Class 2 Sessions:</strong>
                            <ul className="list-unstyled mt-2">
                              {selectedSundayClass2Dates.map(sessionId => {
                                const session = sundayClass2Dates.find(s => s.id === sessionId);
                                return (
                                  <li key={sessionId} className="mb-1">
                                    <i className="bi bi-calendar-event me-2"></i>
                                    {formatDate(session.date)} - {session.time}
                                  </li>
                                );
                              })}
                            </ul>
                          </div>
                        )}
                      </>
                    )}
                  </div>

                  {/* Billing Summary */}
                  <div className="mb-4">
                    <h6 className="border-bottom pb-2 mb-3">Billing Summary</h6>
                    <div className="row">
                      <div className="col-md-8">
                        {isPlatinumSelected ? (
                          <>
                            <div className="d-flex justify-content-between mb-2">
                              <span>Platinum Pass (Full Access)</span>
                              <span>£900</span>
                            </div>
                            <hr />
                            <div className="d-flex justify-content-between h5">
                              <strong>Total Amount</strong>
                              <strong>£900</strong>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="d-flex justify-content-between mb-2">
                              <span>Sessions ({totalSelectedSessions} × £40)</span>
                              <span>£{regularPrice}</span>
                            </div>
                            {discountAmount > 0 && (
                              <div className="d-flex justify-content-between mb-2 text-success">
                                <span>Block Discount{discountAmount > 50 ? "s" : ""}</span>
                                <span>-£{discountAmount}</span>
                              </div>
                            )}
                            <hr />
                            <div className="d-flex justify-content-between h5">
                              <strong>Total Amount</strong>
                              <strong>£{finalPrice}</strong>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* What to Bring */}
                  <div className="mb-4">
                    <h6 className="border-bottom pb-2 mb-3">What to Bring</h6>
                    <div className="alert alert-info">
                      <small>
                        <strong>Required Equipment:</strong> Full cricket kit (bat, pads, gloves, helmet, thigh guard, box, arm guard if used), 
                        appropriate footwear for indoor sports hall, water bottle. 
                        <br /><strong>Note:</strong> This is hard-ball practice - protective gear is mandatory.
                      </small>
                    </div>
                  </div>
                </div>

                <div className="card-footer bg-light">
                  <div className="d-flex gap-2">
                    <button 
                      type="button" 
                      className="btn btn-outline-secondary"
                      onClick={() => setShowBookingConfirmation(false)}
                    >
                      <i className="bi bi-arrow-left me-2"></i>Back to Selection
                    </button>
                    <button 
                      type="button" 
                      className="btn btn-success flex-fill"
                      onClick={processBooking}
                    >
                      <i className="bi bi-credit-card me-2"></i>Proceed to Payment - £{finalPrice}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Booking Process Success Modal - Replaces the alert */}
      {showBookingProcessModal && (
        <>
          <div className="modal-backdrop fade show"></div>
          <div className="modal fade show d-block" tabIndex="-1" role="dialog" style={{ zIndex: 1050 }}>
            <div className="modal-dialog modal-dialog-centered" role="document">
              <div className="modal-content border-success">
                <div className="modal-header bg-success text-white">
                  <h5 className="modal-title">
                    <i className="bi bi-check-circle-fill me-2"></i>
                    Booking Prepared Successfully!
                  </h5>
                </div>
                <div className="modal-body text-center">
                  <div className="mb-4">
                    <i className="bi bi-check-circle text-success" style={{ fontSize: '4rem' }}></i>
                  </div>
                  <h4 className="text-success mb-3">Ready for Payment!</h4>
                  <div className="alert alert-info">
                    <div className="row text-start">
                      <div className="col-6"><strong>Total Amount:</strong></div>
                      <div className="col-6">£{finalPrice}</div>
                      <div className="col-6"><strong>Booking Type:</strong></div>
                      <div className="col-6">{isPlatinumSelected ? "Platinum Pass" : "Individual Sessions"}</div>
                      <div className="col-6"><strong>Child:</strong></div>
                      <div className="col-6">{getSelectedChildDetails()?.firstName} {getSelectedChildDetails()?.lastName}</div>
                    </div>
                  </div>
                  <p className="mb-3">Your booking data has been prepared and saved. Click below to proceed to the secure payment page.</p>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-outline-secondary" onClick={() => setShowBookingProcessModal(false)}>
                    Go Back
                  </button>
                  <button type="button" className="btn btn-success" onClick={handleProceedToPayment}>
                    <i className="bi bi-credit-card me-2"></i>
                    Continue to Payment
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Platinum Info Popup */}
      {showPlatinumInfo && (
        <>
          <div className="modal-backdrop fade show"></div>
          <div className="modal fade show d-block" tabIndex="-1" role="dialog" style={{ zIndex: 1050 }}>
            <div className="modal-dialog modal-dialog-centered" role="document">
              <div className="modal-content border-primary">
                <div className="modal-header bg-primary text-white">
                  <h5 className="modal-title">
                    <i className="bi bi-star-fill me-2"></i>
                    Platinum Pass Benefits
                  </h5>
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    <i className="bi bi-trophy-fill text-primary" style={{ fontSize: '4rem' }}></i>
                  </div>
                  <h4 className="text-primary mb-3">Ultimate Cricket Experience!</h4>
                  <div className="alert alert-primary">
                    <h6 className="mb-2">What You Get:</h6>
                    <ul className="mb-0">
                      <li>Access to ALL Friday sessions (10 weeks)</li>
                      <li>Access to ALL Sunday Class 1 sessions (10 weeks)</li>
                      <li>Access to ALL Sunday Class 2 sessions (10 weeks)</li>
                      <li>Flexible attendance - join any available class</li>
                      <li>Priority booking for future programs</li>
                      <li>Exclusive coaching tips and feedback</li>
                    </ul>
                  </div>
                  <div className="text-center">
                    <h5 className="text-success">Total Value: £1,200</h5>
                    <h3 className="text-primary">Your Price: £900</h3>
                    <p className="text-success fw-bold">Save £300 + Maximum Flexibility!</p>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-outline-secondary" onClick={() => setShowPlatinumInfo(false)}>
                    Maybe Later
                  </button>
                  <button type="button" className="btn btn-primary" onClick={() => setShowPlatinumInfo(false)}>
                    <i className="bi bi-star-fill me-2"></i>
                    Continue with Platinum
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Friday Block Discount Popup */}
      {showFridayDiscount && (
        <>
          <div className="modal-backdrop fade show"></div>
          <div className="modal fade show d-block" tabIndex="-1" role="dialog" style={{ zIndex: 1050 }}>
            <div className="modal-dialog modal-dialog-centered" role="document">
              <div className="modal-content border-warning">
                <div className="modal-header bg-warning text-dark">
                  <h5 className="modal-title">
                    <i className="bi bi-trophy-fill me-2"></i>
                    Friday Block Discount Unlocked!
                  </h5>
                </div>
                <div className="modal-body text-center">
                  <div className="mb-3">
                    <i className="bi bi-check-circle-fill text-success" style={{ fontSize: '4rem' }}></i>
                  </div>
                  <h4 className="text-success mb-3">Congratulations!</h4>
                  <p className="mb-3">You've selected all Friday sessions and unlocked our special discount!</p>
                  <div className="alert alert-success">
                    <h5 className="mb-1">Friday Block Price: £350</h5>
                    <p className="mb-0">You save £50 compared to individual session pricing!</p>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-warning" onClick={() => setShowFridayDiscount(false)}>
                    <i className="bi bi-hand-thumbs-up me-2"></i>
                    Awesome! Continue
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Sunday Class 1 Block Discount Popup */}
      {showSundayClass1Discount && (
        <>
          <div className="modal-backdrop fade show"></div>
          <div className="modal fade show d-block" tabIndex="-1" role="dialog" style={{ zIndex: 1050 }}>
            <div className="modal-dialog modal-dialog-centered" role="document">
              <div className="modal-content border-warning">
                <div className="modal-header bg-warning text-dark">
                  <h5 className="modal-title">
                    <i className="bi bi-trophy-fill me-2"></i>
                    Sunday Class 1 Block Discount Unlocked!
                  </h5>
                </div>
                <div className="modal-body text-center">
                  <div className="mb-3">
                    <i className="bi bi-check-circle-fill text-success" style={{ fontSize: '4rem' }}></i>
                  </div>
                  <h4 className="text-success mb-3">Fantastic!</h4>
                  <p className="mb-3">You've selected all Sunday Class 1 sessions and earned our block discount!</p>
                  <div className="alert alert-success">
                    <h5 className="mb-1">Sunday Class 1 Block: £350</h5>
                    <p className="mb-0">You save £50 compared to individual sessions!</p>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-warning" onClick={() => setShowSundayClass1Discount(false)}>
                    <i className="bi bi-hand-thumbs-up me-2"></i>
                    Excellent! Continue
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Sunday Class 2 Block Discount Popup */}
      {showSundayClass2Discount && (
        <>
          <div className="modal-backdrop fade show"></div>
          <div className="modal fade show d-block" tabIndex="-1" role="dialog" style={{ zIndex: 1050 }}>
            <div className="modal-dialog modal-dialog-centered" role="document">
              <div className="modal-content border-warning">
                <div className="modal-header bg-warning text-dark">
                  <h5 className="modal-title">
                    <i className="bi bi-trophy-fill me-2"></i>
                    Sunday Class 2 Block Discount Unlocked!
                  </h5>
                </div>
                <div className="modal-body text-center">
                  <div className="mb-3">
                    <i className="bi bi-check-circle-fill text-success" style={{ fontSize: '4rem' }}></i>
                  </div>
                  <h4 className="text-success mb-3">Outstanding!</h4>
                  <p className="mb-3">You've selected all Sunday Class 2 sessions and earned our block discount!</p>
                  <div className="alert alert-success">
                    <h5 className="mb-1">Sunday Class 2 Block: £350</h5>
                    <p className="mb-0">You save £50 compared to individual sessions!</p>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-warning" onClick={() => setShowSundayClass2Discount(false)}>
                    <i className="bi bi-hand-thumbs-up me-2"></i>
                    Perfect! Continue
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Programme Description Modal */}
      {showDescription && (
        <>
          <div className="modal-backdrop fade show"></div>
          <div className="modal fade show d-block" tabIndex="-1" role="dialog" style={{ zIndex: 1050 }}>
            <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">10-Week Technical Masterclass Clinic</h5>
                  <button type="button" className="btn-close" onClick={() => setShowDescription(false)}></button>
                </div>
                <div className="modal-body">
                  <div className="alert alert-warning">
                    <h6><i className="bi bi-trophy me-2"></i>Ages 8–13 | Real, Measurable Improvement</h6>
                    <p className="mb-0">At Masterclass Cricket Academy, we help young cricketers achieve genuine improvement through structured development.</p>
                  </div>

                  <h6><i className="bi bi-calendar-range me-2"></i>Programme Schedule</h6>
                  <p><strong>Block 1 Dates:</strong></p>
                  <ul>
                    <li><strong>Fridays:</strong> 10th October - 12th December 2025 (5:45pm - 7:15pm)</li>
                    <li><strong>Sundays:</strong> 12th October - 14th December 2025
                      <ul>
                        <li>Class 1: 4:30pm - 6:00pm</li>
                        <li>Class 2: 6:00pm - 7:30pm</li>
                      </ul>
                    </li>
                  </ul>

                  <h6><i className="bi bi-bullseye me-2"></i>What the 10 Weeks Will Cover</h6>
                  
                  <p><strong>Batting Excellence</strong></p>
                  <ul>
                    <li>Playing the swinging ball with control</li>
                    <li>Developing skills against off-spin and leg-spin</li>
                    <li>Power hitting: how to generate and use power</li>
                    <li>Controlling the bat under pressure + mastering different shots</li>
                  </ul>

                  <p><strong>Bowling Development</strong></p>
                  <ul>
                    <li>Building a repeatable action for consistency</li>
                    <li>Increasing bowling speed</li>
                    <li>Helping spinners generate more revolutions</li>
                    <li>Improving line and length accuracy</li>
                  </ul>

                  <p><strong>Mental Skills</strong></p>
                  <ul>
                    <li>Handling pressure and overcoming fear</li>
                    <li>Developing a winning mindset</li>
                    <li>Building self-belief to perform confidently in the middle</li>
                  </ul>

                  <div className="alert alert-info">
                    <h6><i className="bi bi-person-badge me-2"></i>Expert Coaching</h6>
                    <p className="mb-0">Led by Head Coach <strong>Uzi Arif</strong> – ex-county player with international coaching experience. The Masterclass team has helped hundreds of students progress to county cricket.</p>
                  </div>

                  <h6><i className="bi bi-gear me-2"></i>What to Bring</h6>
                  <div className="alert alert-warning">
                    <p><strong>Hard-Ball Practice - Full Kit Required:</strong></p>
                    <ul className="mb-2">
                      <li>Full cricket kit (bat, pads, gloves, helmet, thigh guard, box, arm guard if used)</li>
                      <li>Appropriate footwear for indoor sports hall (non-marking soles)</li>
                      <li>Water bottle and optional light snack</li>
                    </ul>
                    <p className="mb-0"><strong>Note:</strong> Protective gear is mandatory - no player will be allowed to bat or bowl without it.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Terms and Conditions Modal */}
      {showTerms && (
        <>
          <div className="modal-backdrop fade show"></div>
          <div className="modal fade show d-block" tabIndex="-1" role="dialog" style={{ zIndex: 1050 }}>
            <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Terms and Conditions</h5>
                  <button type="button" className="btn-close" onClick={() => setShowTerms(false)}></button>
                </div>
                <div 
                  className="modal-body" 
                  style={{ maxHeight: '60vh', overflowY: 'scroll' }}
                  onScroll={handleTermsScroll}
                >
                  <h6>Programme Requirements</h6>
                  <ul>
                    <li>Players must arrive 10 minutes early to get padded up</li>
                    <li>All kit should be clearly labelled to avoid mix-ups</li>
                    <li>Protective gear (especially helmet and box) is mandatory</li>
                    <li>Parents may observe from designated areas</li>
                    <li>Please inform coaches of any injuries, medical needs, or allergies</li>
                  </ul>

                  <h6>Refund & Cancellation Policy</h6>
                  
                  <p><strong>1. Missed Sessions</strong></p>
                  <ul>
                    <li>Credits for missed sessions only with 48+ hours notice</li>
                    <li>No credits for late cancellations or no-shows</li>
                  </ul>

                  <p><strong>2. Credit Use</strong></p>
                  <ul>
                    <li>Credits provided as 1-to-1 coaching or other Masterclass activities</li>
                    <li>Credits are non-transferable and must be used before 01/09/2026</li>
                  </ul>

                  <p><strong>3. Block Bookings (10 Weeks)</strong></p>
                  <ul>
                    <li>Block booking fees are non-refundable</li>
                    <li>Exception: Medical exemption with valid medical note</li>
                  </ul>

                  <p><strong>4. General Conditions</strong></p>
                  <ul>
                    <li>Masterclass Cricket Academy reserves the right to make final decisions on all credit and refund matters</li>
                    <li>By enrolling, parents and players acknowledge and accept this policy</li>
                  </ul>

                  <h6>Safety & Liability</h6>
                  <p>Parents acknowledge that cricket involves inherent risks. Masterclass Cricket Academy maintains appropriate insurance and follows safety protocols, but participants engage at their own risk.</p>

                  <h6>Data Protection</h6>
                  <p>Personal information will be used for programme administration, communication, and safety purposes in accordance with GDPR regulations.</p>

                  <div className="alert alert-success mt-4">
                    <i className="bi bi-check-circle me-2"></i>
                    <strong>You have read the complete terms and conditions.</strong>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowTerms(false)}>
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Single Session Confirmation Dialog */}
      {showConfirmDialog && (
        <>
          <div className="modal-backdrop fade show"></div>
          <div className="modal fade show d-block" tabIndex="-1" role="dialog" style={{ zIndex: 1050 }}>
            <div className="modal-dialog modal-dialog-centered" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Confirm Your Selection</h5>
                  <button type="button" className="btn-close" onClick={() => setShowConfirmDialog(false)}></button>
                </div>
                <div className="modal-body text-center">
                  <div className="mb-3">
                    <i className="bi bi-exclamation-circle display-1 text-warning"></i>
                  </div>
                  <p>You've selected only 1 session. Would you like to check other available slots before proceeding?</p>
                  <p className="text-muted small">Consider our block discounts - save £50 when booking 10 sessions from any category!</p>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-outline-secondary" onClick={() => setShowConfirmDialog(false)}>
                    Check Other Slots
                  </button>
                  <button type="button" className="btn btn-primary" onClick={() => { setShowConfirmDialog(false); setShowBookingConfirmation(true); }}>
                    Continue with Single Session
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default CricketAcademyBooking;