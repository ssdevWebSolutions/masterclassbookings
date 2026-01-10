import React, { useState, useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { useDispatch, useSelector } from "react-redux";
import { fetchSessionsByYear } from "@/Redux/Sessions/sessionsSlice";
import { useRouter } from "next/navigation";
import Header from "../components/Header";
import Footer from "@/components/Footer";


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
  
  // Custom blocked dates object - Add date strings in YYYY-MM-DD format to block specific dates
  const customBlockedDates = {
    "2025-10-24": true 
     // This would block October 17, 2025
    // Example: "2025-11-01": true,  // This would block November 1, 2025
    // Add more dates as needed
  };

  // Function to check if a date is in the past (completed)
  const isDateCompleted = (dateStr) => {
    const sessionDate = new Date(dateStr);
    const today = new Date();
    // Set both dates to start of day for accurate comparison
    sessionDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    return sessionDate < today;
  };

  // Function to check if a date is custom blocked
  const isDateCustomBlocked = (dateStr) => {
    return customBlockedDates[dateStr] === true;
  };

  // Enhanced function to check if a session should be disabled
  const isSessionDisabled = (session) => {
    const isFullyBooked = getAvailabilityStatus(session.bookedCount) === "not-available";
    const isCompleted = isDateCompleted(session.date);
    const isCustomBlocked = isDateCustomBlocked(session.date);
    
    return isFullyBooked || isCompleted || isCustomBlocked;
  };

  // Function to get the reason for disabled state
  const getDisabledReason = (session) => {
    if (isDateCompleted(session.date)) return "Session Completed";
    if (isDateCustomBlocked(session.date)) return "Currently Unavailable";
    if (getAvailabilityStatus(session.bookedCount) === "not-available") return "Fully Booked";
    return "";
  };

  // Dynamic data filtering from API
  const fridayDates = sessions ? sessions.filter(session => session.type === 'friday') : [];
  const sundayClass1Dates = sessions ? sessions.filter(session => session.type === 'sunday-class1') : [];
  const sundayClass2Dates = sessions ? sessions.filter(session => session.type === 'sunday-class2') : [];

  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(()=>{
    if(loginData.token === null) router.push("/");
  },[])

  useEffect(() => {
    dispatch(fetchSessionsByYear(2025));
    // console.log("Kids:", kidstate, "Sessions:", sessions);
  }, []);

  useEffect(() => {
    // console.log("Kids:", kidstate, "Sessions:", sessions);
  }, [kidstate, sessions]);

  const getAvailabilityStatus = (bookedCount) => {
    const count = Number(bookedCount) || 0;
    if (count >= 36) return "not-available";
    if (count >= 30) return "filling-fast";
    return "available";
  };

  const getAvailabilityBadge = (bookedCount, session) => {
    // Check if date is completed first
    if (isDateCompleted(session.date)) {
      return <span className="badge bg-secondary">Completed</span>;
    }
    
    // Check if date is custom blocked
    if (isDateCustomBlocked(session.date)) {
      return <span className="badge bg-dark">Blocked</span>;
    }
    
    // Otherwise show availability status
    const status = getAvailabilityStatus(bookedCount);
    switch (status) {
      case "available":
        return <span className="badge bg-success">Available</span>;
      case "filling-fast":
        return <span className="badge bg-warning text-dark">Filling Fast</span>;
      case "not-available":
        return <span className="badge bg-danger">Fully Booked</span>;
      default:
        return null;
    }
  };

  const toggleFridaySelection = (sessionId, session) => {
    // Prevent selection if session is disabled
    if (isSessionDisabled(session)) return;
    
    const newSelection = selectedFridayDates.includes(sessionId) 
      ? selectedFridayDates.filter(d => d !== sessionId) 
      : [...selectedFridayDates, sessionId];
    
    setSelectedFridayDates(newSelection);
    
    const availableFridaysCount = fridayDates.filter(s => !isSessionDisabled(s)).length;
    
    if (newSelection.length === availableFridaysCount && availableFridaysCount === 10) {
      setShowFridayDiscount(true);
    }
  };

  const toggleSundayClass1Selection = (sessionId, session) => {
    if (isSessionDisabled(session)) return;
    
    const newSelection = selectedSundayClass1Dates.includes(sessionId)
      ? selectedSundayClass1Dates.filter(d => d !== sessionId)
      : [...selectedSundayClass1Dates, sessionId];
    
    setSelectedSundayClass1Dates(newSelection);

    const availableClass1Count = sundayClass1Dates.filter(s => !isSessionDisabled(s)).length;
    
    if (newSelection.length === availableClass1Count && availableClass1Count === 10) {
      setShowSundayClass1Discount(true);
    }
  };

  const toggleSundayClass2Selection = (sessionId, session) => {
    if (isSessionDisabled(session)) return;
    
    const newSelection = selectedSundayClass2Dates.includes(sessionId)
      ? selectedSundayClass2Dates.filter(d => d !== sessionId)
      : [...selectedSundayClass2Dates, sessionId];
    
    setSelectedSundayClass2Dates(newSelection);

    const availableClass2Count = sundayClass2Dates.filter(s => !isSessionDisabled(s)).length;
    
    if (newSelection.length === availableClass2Count && availableClass2Count === 10) {
      setShowSundayClass2Discount(true);
    }
  };

  const handleSelectAllFridays = (e) => {
    if (e.target.checked) {
      const availableFridays = fridayDates
        .filter(session => !isSessionDisabled(session))
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
        .filter(session => !isSessionDisabled(session))
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
        .filter(session => !isSessionDisabled(session))
        .map(session => session.id);
      setSelectedSundayClass2Dates(availableSundays);
      
      if (availableSundays.length === 10) {
        setShowSundayClass2Discount(true);
      }
    } else {
      setSelectedSundayClass2Dates([]);
    }
  };

  // Clear all functions
  const clearAllFridays = () => {
    setSelectedFridayDates([]);
  };

  const clearAllSundayClass1 = () => {
    setSelectedSundayClass1Dates([]);
  };

  const clearAllSundayClass2 = () => {
    setSelectedSundayClass2Dates([]);
  };

  const clearAllSelections = () => {
    setSelectedFridayDates([]);
    setSelectedSundayClass1Dates([]);
    setSelectedSundayClass2Dates([]);
    setIsPlatinumSelected(false);
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" });
  };

  const totalSelectedSessions = isPlatinumSelected ? 0 : selectedFridayDates.length + selectedSundayClass1Dates.length + selectedSundayClass2Dates.length;
  const isFullFridayBlock = selectedFridayDates.length === 10;
  const isFullSundayClass1Block = selectedSundayClass1Dates.length === 10;
  const isFullSundayClass2Block = selectedSundayClass2Dates.length === 10;
  
  const regularPrice = isPlatinumSelected ? 899 : totalSelectedSessions * 40;
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
    //  console.log("Booking Data:", bookingData);
    
    sessionStorage.setItem('cricketBookingData', JSON.stringify(bookingData));
    
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

  const handlePlatinumMaybeLater = () => {
    setIsPlatinumSelected(false);
    setShowPlatinumInfo(false);
  };

  const handleAddChild=()=>{
    router.push("/profile");
  }

  // Check if all sessions are selected for each category
  const availableFridaysCount = fridayDates.filter(session => !isSessionDisabled(session)).length;
  const allFridaysSelected = selectedFridayDates.length === availableFridaysCount && availableFridaysCount > 0;

  const availableSundayClass1Count = sundayClass1Dates.filter(session => !isSessionDisabled(session)).length;
  const allSundayClass1Selected = selectedSundayClass1Dates.length === availableSundayClass1Count && availableSundayClass1Count > 0;

  const availableSundayClass2Count = sundayClass2Dates.filter(session => !isSessionDisabled(session)).length;
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

  return <>
  <Header />
    <div className="min-vh-100" style={{ backgroundColor: "#0a0a0a" }}>
      {/* Hero Section */}
      <header className="py-4" style={{ 
        backgroundColor: "#000", 
        borderBottom: "2px solid #FFD700",
        transition: "all 0.3s ease"
      }}>
        <div className="container text-white text-center">
          {/* Back Button */}
          <button
            onClick={() => window.history.back()}
            className="btn position-absolute top-1 start-0 m-3 btn-sm"
            style={{
              backgroundColor: "transparent",
              border: "1px solid #FFD700",
              color: "#FFD700",
              transition: "all 0.3s ease"
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = "#FFD700";
              e.target.style.color = "#000";
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = "transparent";
              e.target.style.color = "#FFD700";
            }}
          >
            <i className="bi bi-arrow-left me-1"></i> Back
          </button>
  
          <div
  className="d-inline-flex align-items-center justify-content-center mb-3"
  style={{
    width: "120px",
    height: "120px",
    transition: "transform 0.3s ease"
  }}
>
  <img
    src="logo_.png"
    alt="Logo"
    className="img-fluid"
    style={{
      width: "100%",
      height: "100%",
      objectFit: "contain",
    }}
  />
</div>
  
          <h1 className="h3 fw-bold mb-2" style={{ color: "#FFD700" }}>Masterclass Cricket Academy</h1>
          <p className="mb-3" style={{ color: "#d4d4d4" }}>
            Block 1: Technical Development Programme
          </p>
  
          <div className="alert d-inline-flex align-items-center py-2 px-3 mb-3" style={{
            backgroundColor: "rgba(255, 215, 0, 0.1)",
            border: "1px solid #FFD700",
            color: "#FFD700"
          }}>
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
            <div>
              <strong>Sessions filling up quickly</strong>
              <div className="small">Select your sessions below</div>
            </div>
          </div>
  
          <div>
            <small style={{ color: "#999" }}>
              Fridays: 5:45pm - 7:15pm (10 Oct - 12 Dec 2025) • Sundays: Class1 4:30pm-6pm & Class2 6pm-7:30pm (12 Oct - 14 Dec 2025)
            </small>
          </div>
        </div>
      </header>
  
      <main className="container py-4">
        {!showBookingConfirmation ? (
          <>
            {/* Venue */}
            <div className="card mb-3 border-0 shadow-sm" style={{
              backgroundColor: "#1a1a1a",
              transition: "transform 0.3s ease, box-shadow 0.3s ease"
            }}>
              <div className="card-body py-3">
                <h6 className="card-title mb-1" style={{ color: "#FFD700" }}>
                  <i className="bi bi-geo-alt me-2"></i>Venue
                </h6>
                <p className="mb-0" style={{ color: "#d4d4d4" }}>Tiffin Girls School, KT2 5PL</p>
              </div>
            </div>
  
            {/* Programme Details */}
            <div className="card mb-3 border-0 shadow-sm" style={{
              backgroundColor: "#1a1a1a",
              transition: "transform 0.3s ease, box-shadow 0.3s ease"
            }}>
              <div className="card-body d-flex justify-content-between align-items-center py-3">
                <div>
                  <h6 className="card-title mb-1" style={{ color: "#FFD700" }}>Programme Details</h6>
                  <p className="mb-0 small" style={{ color: "#999" }}>
                    10-Week Technical Masterclass Clinic (Ages 8–13, Girls & Boys)
                  </p>
                </div>
                <button 
                  className="btn btn-sm" 
                  onClick={() => setShowDescription(true)}
                  style={{
                    backgroundColor: "transparent",
                    border: "1px solid #FFD700",
                    color: "#FFD700",
                    transition: "all 0.3s ease"
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = "#FFD700";
                    e.target.style.color = "#000";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = "transparent";
                    e.target.style.color = "#FFD700";
                  }}
                >
                  <i className="bi bi-info-circle me-1"></i> Read More
                </button>
              </div>
            </div>
  
            {/* Child Selection */}
            <div className="card mb-3 border-0 shadow-sm" style={{
              backgroundColor: "#1a1a1a",
              transition: "transform 0.3s ease, box-shadow 0.3s ease"
            }}>
              <div className="card-body py-3">
                <h6 className="card-title mb-2" style={{ color: "#FFD700" }}>Select Child</h6>
                <div className="d-flex gap-2 flex-wrap">
                  <select 
                    className="form-select" 
                    value={selectedChild} 
                    onChange={(e) => setSelectedChild(e.target.value)}
                    style={{
                      backgroundColor: "#0a0a0a",
                      border: "1px solid #FFD700",
                      color: "#FFD700",
                      transition: "all 0.3s ease"
                    }}
                  >
                    <option value="">Choose child</option>
                    {kidstate?.map(child => (
                      <option key={child.id} value={child.id}>
                        {child.firstName} {child.lastName} (Age {child.age})
                      </option>
                    ))}
                  </select>
                  <button 
                    className="btn" 
                    onClick={handleAddChild}
                    style={{
                      backgroundColor: "transparent",
                      border: "1px solid #FFD700",
                      color: "#FFD700",
                      transition: "all 0.3s ease"
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = "#FFD700";
                      e.target.style.color = "#000";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = "transparent";
                      e.target.style.color = "#FFD700";
                    }}
                  >
                    Add New Child
                  </button>
                </div>
              </div>
            </div>
  
            {/* Pricing - Equal Width Cards */}
            <div className="row g-3 mb-4">
              <div className="col-md-4">
                <div className="card text-center h-100 border-0 shadow-sm" style={{
                  backgroundColor: "#1a1a1a",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease"
                }}>
                  <div className="card-body d-flex flex-column justify-content-center">
                    <p className="mb-1 small" style={{ color: "#999" }}>Per Session</p>
                    <h3 className="mb-0" style={{ color: "#FFD700" }}>£40</h3>
                  </div>
                </div>
              </div>
  
              <div className="col-md-4">
                <div className="card position-relative text-center h-100 shadow-sm" style={{
                  backgroundColor: "#1a1a1a",
                  border: "2px solid #FFD700",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease"
                }}>
                  <span className="badge position-absolute top-0 start-50 translate-middle" style={{
                    backgroundColor: "#FFD700",
                    color: "#000"
                  }}>Best Value</span>
                  <div className="card-body d-flex flex-column justify-content-center mt-2">
                    <p className="mb-1 small" style={{ color: "#999" }}>Full Block (10 sessions)</p>
                    <h3 className="mb-0" style={{ color: "#FFD700" }}>£350</h3>
                    <p className="mb-0 fw-bold small" style={{ color: "#4ade80" }}>Save £50</p>
                  </div>
                </div>
              </div>
  
              <div className="col-md-4">
                <div 
                  className={`card position-relative text-center h-100 shadow-sm`}
                  style={{
                    backgroundColor: isPlatinumSelected ? "#2a2a2a" : "#1a1a1a",
                    border: `2px solid ${isPlatinumSelected ? "#FFD700" : "#666"}`,
                    transition: "all 0.3s ease",
                    cursor: "pointer"
                  }}
                  onClick={handlePlatinumClick}
                >
                  <span className="badge position-absolute top-0 start-50 translate-middle" style={{
                    backgroundColor: "#FFD700",
                    color: "#000"
                  }}>Platinum Pass</span>
                  <div className="card-body d-flex flex-column justify-content-center mt-2">
                    <div className="d-flex justify-content-between align-items-center">
                      <div className="flex-grow-1">
                        <p className="mb-1 small" style={{ color: "#999" }}>Premium Access</p>
                        <div className="text-decoration-line-through small" style={{ color: "#666" }}>£1380</div>
                        <h3 className="mb-0" style={{ color: "#FFD700" }}>£899</h3>
                        <p className="mb-0 fw-bold small" style={{ color: "#4ade80" }}>Full Access</p>
                        <button 
                          className="btn btn-sm mt-2"
                          style={{
                            backgroundColor: "transparent",
                            border: "1px solid #FFD700",
                            color: "#FFD700",
                            fontSize: "0.75rem",
                            transition: "all 0.3s ease"
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowPlatinumInfo(true);
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.backgroundColor = "#FFD700";
                            e.target.style.color = "#000";
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.backgroundColor = "transparent";
                            e.target.style.color = "#FFD700";
                          }}
                        >
                          <i className="bi bi-info-circle me-1"></i> What's Included?
                        </button>
                      </div>
                      <div 
                        className={`rounded-circle border d-flex align-items-center justify-content-center`}
                        style={{ 
                          width: 24, 
                          height: 24, 
                          cursor: 'pointer',
                          backgroundColor: isPlatinumSelected ? "#FFD700" : "transparent",
                          borderColor: isPlatinumSelected ? "#FFD700" : "#666",
                          transition: "all 0.3s ease"
                        }}
                      >
                        {isPlatinumSelected && <i className="bi bi-check-lg" style={{ fontSize: '0.75rem', color: "#000" }} />}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
  
            {/* Session Selection */}
            {!isPlatinumSelected && (
              <div className="card mb-4 border-0 shadow-sm" style={{
                backgroundColor: "#1a1a1a",
                transition: "all 0.3s ease"
              }}>
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h6 className="mb-0" style={{ color: "#FFD700" }}>
                      <i className="bi bi-calendar-check me-2"></i>Select Sessions
                    </h6>
                    {(selectedFridayDates.length > 0 || selectedSundayClass1Dates.length > 0 || selectedSundayClass2Dates.length > 0) && (
                      <button 
                        className="btn btn-sm" 
                        onClick={clearAllSelections}
                        style={{
                          backgroundColor: "transparent",
                          border: "1px solid #dc3545",
                          color: "#dc3545",
                          transition: "all 0.3s ease"
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.backgroundColor = "#dc3545";
                          e.target.style.color = "#fff";
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.backgroundColor = "transparent";
                          e.target.style.color = "#dc3545";
                        }}
                      >
                        <i className="bi bi-x-circle me-1"></i> Clear All
                      </button>
                    )}
                  </div>
  
                {/* Fridays Section */}
                  <div className="mb-3">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <button
                        className="btn d-flex align-items-center flex-grow-1 me-3"
                        onClick={() => setShowFridays(!showFridays)}
                        style={{
                          backgroundColor: "transparent",
                          border: "1px solid #FFD700",
                          color: "#FFD700",
                          transition: "all 0.3s ease",
                          position: "relative"
                        }}
                      >
                        <div className="d-flex align-items-center gap-2 flex-grow-1">
                          <i className="bi bi-calendar"></i>
                          <div className="d-flex flex-column align-items-start flex-grow-1">
                            <span>Fridays ({fridayDates.length} sessions available)</span>
                            <small style={{ fontSize: "0.75rem", color: "#999", fontWeight: "normal" }}>
                              Click to select individual sessions
                            </small>
                          </div>
                          <div 
                            className="d-flex align-items-center justify-content-center"
                            style={{
                              width: "32px",
                              height: "32px",
                              backgroundColor: showFridays ? "#FFD700" : "rgba(255, 215, 0, 0.1)",
                              borderRadius: "4px",
                              transition: "all 0.3s ease"
                            }}
                          >
                            <svg 
                              width="16" 
                              height="16" 
                              viewBox="0 0 16 16" 
                              fill="none" 
                              xmlns="http://www.w3.org/2000/svg"
                              style={{ 
                                transition: "transform 0.3s ease",
                                transform: showFridays ? "rotate(180deg)" : "rotate(0deg)"
                              }}
                            >
                              <path 
                                d="M2 5L8 11L14 5" 
                                stroke={showFridays ? "#000" : "#FFD700"}
                                strokeWidth="2.5" 
                                strokeLinecap="round" 
                                strokeLinejoin="round"
                              />
                            </svg>
                          </div>
                        </div>
                      </button>
                      <div className="d-flex gap-2 align-items-center">
                        {selectedFridayDates.length > 0 && (
                          <button 
                            className="btn btn-sm" 
                            onClick={clearAllFridays}
                            style={{
                              backgroundColor: "transparent",
                              border: "1px solid #dc3545",
                              color: "#dc3545",
                              transition: "all 0.3s ease"
                            }}
                            title="Clear all selections"
                          >
                            <i className="bi bi-x"></i>
                          </button>
                        )}
                        <div className="d-flex flex-column align-items-center">
                          <div 
                            className={`rounded-circle border d-flex align-items-center justify-content-center`}
                            style={{ 
                              width: 28, 
                              height: 28, 
                              cursor: 'pointer',
                              backgroundColor: allFridaysSelected ? "#FFD700" : "transparent",
                              borderColor: allFridaysSelected ? "#FFD700" : "#666",
                              transition: "all 0.3s ease"
                            }}
                            onClick={(e) => handleSelectAllFridays({ target: { checked: !allFridaysSelected } })}
                            title="Select all sessions"
                          >
                            {allFridaysSelected && <i className="bi bi-check-lg" style={{ color: "#000" }} />}
                          </div>
                          <small style={{ fontSize: "0.65rem", color: "#999", marginTop: "2px", whiteSpace: "nowrap" }}>
                            Book All
                          </small>
                        </div>
                      </div>
                    </div>

                    {showFridays && (
                      <div className="mt-2" style={{
                        animation: "fadeIn 0.3s ease-in"
                      }}>
                        <div className="mb-2 px-2" style={{ 
                          backgroundColor: "#1a1a1a", 
                          padding: "8px 12px", 
                          borderRadius: "4px",
                          border: "1px solid #333"
                        }}>
                          <small style={{ color: "#999", fontSize: "0.85rem" }}>
                            <i className="bi bi-info-circle me-1" style={{ color: "#FFD700" }}></i>
                            Select individual sessions below or use "Book All" above
                          </small>
                        </div>
                        <div className="list-group">
                          {fridayDates.map((session, index) => {
                            const isSelected = selectedFridayDates.includes(session.id);
                            const isDisabled = isSessionDisabled(session);
                            const disabledReason = getDisabledReason(session);

                            return (
                              <button
                                key={session.id}
                                type="button"
                                onClick={() => toggleFridaySelection(session.id, session)}
                                className={`list-group-item list-group-item-action d-flex justify-content-between align-items-center ${isDisabled ? "disabled" : ""}`}
                                aria-disabled={isDisabled}
                                title={isDisabled ? disabledReason : ""}
                                style={{ 
                                  cursor: isDisabled ? "not-allowed" : "pointer",
                                  backgroundColor: isSelected ? "#2a2a2a" : "#1a1a1a",
                                  border: `1px solid ${isSelected ? "#FFD700" : "#333"}`,
                                  color: "#d4d4d4",
                                  opacity: isDisabled ? 0.5 : 1,
                                  transition: "all 0.3s ease"
                                }}
                              >
                                <div>
                                  <div className="fw-semibold" style={{ color: isDisabled ? "#666" : "#FFD700" }}>
                                    {formatDate(session.date)}
                                    {isDisabled && disabledReason && (
                                      <span className="ms-2 small" style={{ color: "#999" }}>
                                        ({disabledReason})
                                      </span>
                                    )}
                                  </div>
                                  <div className="small" style={{ color: "#999" }}>{session.time}</div>
                                </div>
                                <div className="d-flex align-items-center gap-3">
                                  {getAvailabilityBadge(session.bookedCount, session)}
                                  <div 
                                    className={`rounded-circle border d-flex align-items-center justify-content-center`}
                                    style={{ 
                                      width: 22, 
                                      height: 22,
                                      backgroundColor: isSelected ? "#FFD700" : "transparent",
                                      borderColor: isSelected ? "#FFD700" : "#666",
                                      transition: "all 0.3s ease"
                                    }}
                                  >
                                    {isSelected && <i className="bi bi-check-lg" style={{ color: "#000" }} />}
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
                        className="btn d-flex align-items-center flex-grow-1 me-3"
                        onClick={() => setShowSundayClass1(!showSundayClass1)}
                        style={{
                          backgroundColor: "transparent",
                          border: "1px solid #FFD700",
                          color: "#FFD700",
                          transition: "all 0.3s ease",
                          position: "relative"
                        }}
                      >
                        <div className="d-flex align-items-center gap-2 flex-grow-1">
                          <i className="bi bi-calendar"></i>
                          <div className="d-flex flex-column align-items-start flex-grow-1">
                            <span>Sunday Class 1 (4:30pm-6:00pm) - {sundayClass1Dates.length} sessions</span>
                            <small style={{ fontSize: "0.75rem", color: "#999", fontWeight: "normal" }}>
                              Click to select individual sessions
                            </small>
                          </div>
                          <div 
                            className="d-flex align-items-center justify-content-center"
                            style={{
                              width: "32px",
                              height: "32px",
                              backgroundColor: showSundayClass1 ? "#FFD700" : "rgba(255, 215, 0, 0.1)",
                              borderRadius: "4px",
                              transition: "all 0.3s ease"
                            }}
                          >
                            <svg 
                              width="16" 
                              height="16" 
                              viewBox="0 0 16 16" 
                              fill="none" 
                              xmlns="http://www.w3.org/2000/svg"
                              style={{ 
                                transition: "transform 0.3s ease",
                                transform: showSundayClass1 ? "rotate(180deg)" : "rotate(0deg)"
                              }}
                            >
                              <path 
                                d="M2 5L8 11L14 5" 
                                stroke={showSundayClass1 ? "#000" : "#FFD700"}
                                strokeWidth="2.5" 
                                strokeLinecap="round" 
                                strokeLinejoin="round"
                              />
                            </svg>
                          </div>
                        </div>
                      </button>
                      <div className="d-flex gap-2 align-items-center">
                        {selectedSundayClass1Dates.length > 0 && (
                          <button 
                            className="btn btn-sm" 
                            onClick={clearAllSundayClass1}
                            style={{
                              backgroundColor: "transparent",
                              border: "1px solid #dc3545",
                              color: "#dc3545",
                              transition: "all 0.3s ease"
                            }}
                            title="Clear all selections"
                          >
                            <i className="bi bi-x"></i>
                          </button>
                        )}
                        <div className="d-flex flex-column align-items-center">
                          <div 
                            className={`rounded-circle border d-flex align-items-center justify-content-center`}
                            style={{ 
                              width: 28, 
                              height: 28, 
                              cursor: 'pointer',
                              backgroundColor: allSundayClass1Selected ? "#FFD700" : "transparent",
                              borderColor: allSundayClass1Selected ? "#FFD700" : "#666",
                              transition: "all 0.3s ease"
                            }}
                            onClick={(e) => handleSelectAllSundayClass1({ target: { checked: !allSundayClass1Selected } })}
                            title="Select all sessions"
                          >
                            {allSundayClass1Selected && <i className="bi bi-check-lg" style={{ color: "#000" }} />}
                          </div>
                          <small style={{ fontSize: "0.65rem", color: "#999", marginTop: "2px", whiteSpace: "nowrap" }}>
                            Book All
                          </small>
                        </div>
                      </div>
                    </div>
                    
                    {showSundayClass1 && (
                      <div className="mt-2" style={{
                        animation: "fadeIn 0.3s ease-in"
                      }}>
                        <div className="mb-2 px-2" style={{ 
                          backgroundColor: "#1a1a1a", 
                          padding: "8px 12px", 
                          borderRadius: "4px",
                          border: "1px solid #333"
                        }}>
                          <small style={{ color: "#999", fontSize: "0.85rem" }}>
                            <i className="bi bi-info-circle me-1" style={{ color: "#FFD700" }}></i>
                            Select individual sessions below or use "Book All" above
                          </small>
                        </div>
                        <div className="list-group">
                          {sundayClass1Dates.map((session) => {
                            const isSelected = selectedSundayClass1Dates.includes(session.id);
                            const isDisabled = isSessionDisabled(session);
                            const disabledReason = getDisabledReason(session);

                            return (
                              <button
                                key={session.id}
                                type="button"
                                onClick={() => toggleSundayClass1Selection(session.id, session)}
                                className={`list-group-item list-group-item-action d-flex justify-content-between align-items-center ${isDisabled ? "disabled" : ""}`}
                                aria-disabled={isDisabled}
                                title={isDisabled ? disabledReason : ""}
                                style={{ 
                                  cursor: isDisabled ? "not-allowed" : "pointer",
                                  backgroundColor: isSelected ? "#2a2a2a" : "#1a1a1a",
                                  border: `1px solid ${isSelected ? "#FFD700" : "#333"}`,
                                  color: "#d4d4d4",
                                  opacity: isDisabled ? 0.5 : 1,
                                  transition: "all 0.3s ease"
                                }}
                              >
                                <div>
                                  <div className="fw-semibold" style={{ color: isDisabled ? "#666" : "#FFD700" }}>
                                    {formatDate(session.date)}
                                    {isDisabled && disabledReason && (
                                      <span className="ms-2 small" style={{ color: "#999" }}>
                                        ({disabledReason})
                                      </span>
                                    )}
                                  </div>
                                  <div className="small" style={{ color: "#999" }}>{session.time}</div>
                                </div>
                                <div className="d-flex align-items-center gap-3">
                                  {getAvailabilityBadge(session.bookedCount, session)}
                                  <div 
                                    className={`rounded-circle border d-flex align-items-center justify-content-center`}
                                    style={{ 
                                      width: 22, 
                                      height: 22,
                                      backgroundColor: isSelected ? "#FFD700" : "transparent",
                                      borderColor: isSelected ? "#FFD700" : "#666",
                                      transition: "all 0.3s ease"
                                    }}
                                  >
                                    {isSelected && <i className="bi bi-check-lg" style={{ color: "#000" }} />}
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
                  <div className="mb-3 " style={{ pointerEvents: 'none', opacity: 0.5 }} >
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <button
                        className="btn d-flex align-items-center flex-grow-1 me-3"
                        onClick={() => setShowSundayClass2(!showSundayClass2)}
                        style={{
                          backgroundColor: "transparent",
                          border: "1px solid #FFD700",
                          color: "#FFD700",
                          transition: "all 0.3s ease",
                          position: "relative"
                        }}
                      >
                        <div className="d-flex align-items-center gap-2 flex-grow-1">
                          <i className="bi bi-calendar"></i>
                          <div className="d-flex flex-column align-items-start flex-grow-1">
                            <span>Sunday Class 2 (6:00pm-7:30pm) - {sundayClass2Dates.length} sessions</span>
                            <small style={{ fontSize: "0.75rem", color: "#999", fontWeight: "normal" }}>
                              Click to select individual sessions
                            </small>
                          </div>
                          <div 
                            className="d-flex align-items-center justify-content-center"
                            style={{
                              width: "32px",
                              height: "32px",
                              backgroundColor: showSundayClass2 ? "#FFD700" : "rgba(255, 215, 0, 0.1)",
                              borderRadius: "4px",
                              transition: "all 0.3s ease"
                            }}
                          >
                            <svg 
                              width="16" 
                              height="16" 
                              viewBox="0 0 16 16" 
                              fill="none" 
                              xmlns="http://www.w3.org/2000/svg"
                              style={{ 
                                transition: "transform 0.3s ease",
                                transform: showSundayClass2 ? "rotate(180deg)" : "rotate(0deg)"
                              }}
                            >
                              <path 
                                d="M2 5L8 11L14 5" 
                                stroke={showSundayClass2 ? "#000" : "#FFD700"}
                                strokeWidth="2.5" 
                                strokeLinecap="round" 
                                strokeLinejoin="round"
                              />
                            </svg>
                          </div>
                        </div>
                      </button>
                      <div className="d-flex gap-2 align-items-center">
                        {selectedSundayClass2Dates.length > 0 && (
                          <button 
                            className="btn btn-sm" 
                            onClick={clearAllSundayClass2}
                            style={{
                              backgroundColor: "transparent",
                              border: "1px solid #dc3545",
                              color: "#dc3545",
                              transition: "all 0.3s ease"
                            }}
                            title="Clear all selections"
                          >
                            <i className="bi bi-x"></i>
                          </button>
                        )}
                        <div className="d-flex flex-column align-items-center">
                          <div 
                            className={`rounded-circle border d-flex align-items-center justify-content-center`}
                            style={{ 
                              width: 28, 
                              height: 28, 
                              cursor: 'pointer',
                              backgroundColor: allSundayClass2Selected ? "#FFD700" : "transparent",
                              borderColor: allSundayClass2Selected ? "#FFD700" : "#666",
                              transition: "all 0.3s ease"
                            }}
                            onClick={(e) => handleSelectAllSundayClass2({ target: { checked: !allSundayClass2Selected } })}
                            title="Select all sessions"
                          >
                            {allSundayClass2Selected && <i className="bi bi-check-lg" style={{ color: "#000" }} />}
                          </div>
                          <small style={{ fontSize: "0.65rem", color: "#999", marginTop: "2px", whiteSpace: "nowrap" }}>
                            Book All
                          </small>
                        </div>
                      </div>
                    </div>
                    
                    {showSundayClass2 && (
                      <div className="mt-2" style={{
                        animation: "fadeIn 0.3s ease-in"
                      }}>
                        <div className="mb-2 px-2" style={{ 
                          backgroundColor: "#1a1a1a", 
                          padding: "8px 12px", 
                          borderRadius: "4px",
                          border: "1px solid #333"
                        }}>
                          <small style={{ color: "#999", fontSize: "0.85rem" }}>
                            <i className="bi bi-info-circle me-1" style={{ color: "#FFD700" }}></i>
                            Select individual sessions below or use "Book All" above
                          </small>
                        </div>
                        <div className="list-group">
                          {sundayClass2Dates.map((session) => {
                            const isSelected = selectedSundayClass2Dates.includes(session.id);
                            const isDisabled = isSessionDisabled(session);
                            const disabledReason = getDisabledReason(session);

                            return (
                              <button
                                key={session.id}
                                type="button"
                                onClick={() => toggleSundayClass2Selection(session.id, session)}
                                className={`list-group-item list-group-item-action d-flex justify-content-between align-items-center ${isDisabled ? "disabled" : ""}`}
                                aria-disabled={isDisabled}
                                title={isDisabled ? disabledReason : ""}
                                style={{ 
                                  cursor: isDisabled ? "not-allowed" : "pointer",
                                  backgroundColor: isSelected ? "#2a2a2a" : "#1a1a1a",
                                  border: `1px solid ${isSelected ? "#FFD700" : "#333"}`,
                                  color: "#d4d4d4",
                                  opacity: isDisabled ? 0.5 : 1,
                                  transition: "all 0.3s ease"
                                }}
                              >
                                <div>
                                  <div className="fw-semibold" style={{ color: isDisabled ? "#666" : "#FFD700" }}>
                                    {formatDate(session.date)}
                                    {isDisabled && disabledReason && (
                                      <span className="ms-2 small" style={{ color: "#999" }}>
                                        ({disabledReason})
                                      </span>
                                    )}
                                  </div>
                                  <div className="small" style={{ color: "#999" }}>{session.time}</div>
                                </div>
                                <div className="d-flex align-items-center gap-3">
                                  {getAvailabilityBadge(session.bookedCount, session)}
                                  <div 
                                    className={`rounded-circle border d-flex align-items-center justify-content-center`}
                                    style={{ 
                                      width: 22, 
                                      height: 22,
                                      backgroundColor: isSelected ? "#FFD700" : "transparent",
                                      borderColor: isSelected ? "#FFD700" : "#666",
                                      transition: "all 0.3s ease"
                                    }}
                                  >
                                    {isSelected && <i className="bi bi-check-lg" style={{ color: "#000" }} />}
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
            <div className="card mb-3 border-0 shadow-sm" style={{
              backgroundColor: "#1a1a1a",
              transition: "transform 0.3s ease"
            }}>
              <div className="card-body py-3">
                <div className="d-flex gap-2 align-items-start">
                  <input 
                    type="checkbox" 
                    checked={acceptDataPolicy} 
                    onChange={(e) => setAcceptDataPolicy(e.target.checked)}
                    style={{
                      accentColor: "#FFD700"
                    }}
                  />
                  <div className="small" style={{ color: "#d4d4d4" }}>
                  I give permission for photos and videos to be taken during sessions for training analysis and promotional use.                  </div>
                </div>
              </div>
            </div>
  
           {/* Terms */}
            <div className="card mb-3 border-0 shadow-sm" style={{
              backgroundColor: "#1a1a1a",
              transition: "transform 0.3s ease"
            }}>
              <div className="card-body py-3">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h6 className="mb-0" style={{ color: "#FFD700" }}>Terms and Conditions</h6>
                  <button 
                    className="btn btn-sm" 
                    onClick={() => setShowTerms(true)}
                    style={{
                      backgroundColor: "transparent",
                      border: "1px solid #FFD700",
                      color: "#FFD700",
                      transition: "all 0.3s ease"
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = "#FFD700";
                      e.target.style.color = "#000";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = "transparent";
                      e.target.style.color = "#FFD700";
                    }}
                  >
                    Read Terms
                  </button>
                </div>
                <div className="d-flex gap-2 align-items-start">
                  <input 
                    type="checkbox" 
                    checked={acceptTerms} 
                    onChange={(e) => setAcceptTerms(e.target.checked)}
                    disabled={!termsScrolledToEnd}
                    style={{
                      accentColor: "#FFD700"
                    }}
                  />
                  <div className="small" style={{ color: "#d4d4d4" }}>
                    I have read and accept the <button type="button" className="btn btn-link p-0 align-baseline" style={{ color: "#FFD700" }} onClick={() => setShowTerms(true)}>Masterclass Cricket Academy Terms & Conditions</button> and confirm all information provided is accurate.
                    {!termsScrolledToEnd && <div className="small mt-1" style={{ color: "#FFD700" }}>Please scroll through and read the full terms to continue</div>}
                  </div>
                </div>
              </div>
            </div>

            {/* Terms Modal */}
            {showTerms && (
              <div style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "rgba(0,0,0,0.8)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 9999,
                padding: "20px"
              }}>
                <div style={{
                  backgroundColor: "#1a1a1a",
                  borderRadius: "8px",
                  maxWidth: "800px",
                  width: "100%",
                  maxHeight: "90vh",
                  display: "flex",
                  flexDirection: "column",
                  border: "1px solid #FFD700"
                }}>
                  <div style={{
                    padding: "20px",
                    borderBottom: "1px solid #333",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                  }}>
                    <h5 style={{ color: "#FFD700", margin: 0 }}>Masterclass Cricket Academy – Terms & Conditions</h5>
                    <button 
                      onClick={() => setShowTerms(false)}
                      style={{
                        background: "none",
                        border: "none",
                        color: "#FFD700",
                        fontSize: "24px",
                        cursor: "pointer",
                        padding: "0",
                        width: "30px",
                        height: "30px"
                      }}
                    >
                      ×
                    </button>
                  </div>
                  <div 
                    onScroll={(e) => {
                      const element = e.target;
                      const isAtBottom = Math.abs(element.scrollHeight - element.scrollTop - element.clientHeight) < 5;
                      if (isAtBottom) {
                        setTermsScrolledToEnd(true);
                      }
                    }}
                    style={{
                      padding: "20px",
                      overflowY: "auto",
                      flex: 1,
                      color: "#d4d4d4"
                    }}
                  >
                    <p style={{ marginBottom: "20px" }}>
                      These Terms & Conditions ("Terms") apply to all participants ("Players") and their parents/guardians ("Parents") enrolling in programmes, classes, and activities run by Masterclass Cricket Academy ("MCA"). By enrolling, you agree to these Terms.
                    </p>

                    <h6 style={{ color: "#FFD700", marginTop: "20px", marginBottom: "10px" }}>1. Programme Requirements</h6>
                    <ul style={{ paddingLeft: "20px" }}>
                      <li>Players must arrive at least 10 minutes before the scheduled start time to get padded and ready.</li>
                      <li>All kit must be clearly labelled to avoid mix-ups.</li>
                      <li>Protective equipment (helmet and box) is mandatory for all Players.</li>
                      <li>Parents may observe only from designated viewing areas.</li>
                      <li>Parents/Players must inform MCA in writing of any medical conditions, allergies, injuries, or medication before participation.</li>
                    </ul>

                    <h6 style={{ color: "#FFD700", marginTop: "20px", marginBottom: "10px" }}>2. Refunds, Cancellations & Credits</h6>
                    
                    <p style={{ fontWeight: "bold", marginTop: "15px" }}>2.1 No Cash Refunds</p>
                    <ul style={{ paddingLeft: "20px" }}>
                      <li>MCA does not issue cash refunds under any circumstances.</li>
                      <li>All remedies will be in the form of credits, redeemable for MCA coaching sessions or activities.</li>
                    </ul>

                    <p style={{ fontWeight: "bold", marginTop: "15px" }}>2.2 Missed Sessions (Single Bookings)</p>
                    <ul style={{ paddingLeft: "20px" }}>
                      <li>If Parents/Players provide at least 48 hours' notice before a scheduled session, a credit will be issued.</li>
                      <li>No credits will be given for cancellations with less than 48 hours' notice or for no-shows.</li>
                    </ul>

                    <p style={{ fontWeight: "bold", marginTop: "15px" }}>2.3 Block Bookings & Platinum Passes</p>
                    <ul style={{ paddingLeft: "20px" }}>
                      <li>A minimum of 14 days' notice before the programme start date is required to cancel a block booking or Platinum Pass. If notice is given, MCA will issue credits (no refunds).</li>
                      <li>If cancellation is requested with less than 14 days' notice, no credits will be issued unless there is a documented medical or family emergency (proof required).</li>
                      <li>Once a block booking or Platinum Pass has started, it is strictly non-cancellable and non-creditable, except in the event of a medical or family emergency with valid supporting evidence.</li>
                      <li>In all such cases, only credits will be issued; refunds will not be provided.</li>
                    </ul>

                    <p style={{ fontWeight: "bold", marginTop: "15px" }}>2.4 Use and Expiry of Credits</p>
                    <p>Credits may only be redeemed for:</p>
                    <ul style={{ paddingLeft: "20px" }}>
                      <li>1-to-1 coaching sessions, or</li>
                      <li>Participation in another MCA group class (subject to availability).</li>
                    </ul>
                    <p>Additional rules:</p>
                    <ul style={{ paddingLeft: "20px" }}>
                      <li>Credits are non-transferable and can only be used by the original Player.</li>
                      <li>All credits must be redeemed by 01/09/2026. Unused credits will expire with no entitlement to refund or further claim.</li>
                    </ul>

                    <p style={{ fontWeight: "bold", marginTop: "15px" }}>2.5 MCA Authority</p>
                    <ul style={{ paddingLeft: "20px" }}>
                      <li>MCA retains the final authority on all credit decisions.</li>
                      <li>Parents/Players accept that credits are the sole form of compensation for missed, cancelled, or altered bookings.</li>
                    </ul>

                    <h6 style={{ color: "#FFD700", marginTop: "20px", marginBottom: "10px" }}>3. Safety, Liability & Insurance</h6>
                    <ul style={{ paddingLeft: "20px" }}>
                      <li>Parents acknowledge that cricket involves physical risks.</li>
                      <li>MCA maintains appropriate insurance and follows strict safety protocols.</li>
                      <li>Except in cases of proven negligence, MCA accepts no liability for:
                        <ul style={{ paddingLeft: "20px", marginTop: "5px" }}>
                          <li>Injuries sustained during participation,</li>
                          <li>Loss, theft, or damage to personal belongings.</li>
                        </ul>
                      </li>
                      <li>Players must follow all safety instructions. Deliberate disregard may result in removal (see Section 4).</li>
                    </ul>

                    <h6 style={{ color: "#FFD700", marginTop: "20px", marginBottom: "10px" }}>4. Conduct, Removal & Termination</h6>
                    <ul style={{ paddingLeft: "20px" }}>
                      <li>Players must behave respectfully, follow coach instructions, and demonstrate good sportsmanship.</li>
                      <li>MCA reserves the right to remove a Player without refund or credit for:
                        <ul style={{ paddingLeft: "20px", marginTop: "5px" }}>
                          <li>Unsafe behaviour,</li>
                          <li>Disruptive conduct,</li>
                          <li>Breach of these Terms.</li>
                        </ul>
                      </li>
                      <li>If a Player is removed, no refunds or credits for remaining sessions will be issued.</li>
                    </ul>

                    <h6 style={{ color: "#FFD700", marginTop: "20px", marginBottom: "10px" }}>5. Data Protection & Media</h6>
                    <ul style={{ paddingLeft: "20px" }}>
                      <li>MCA collects and processes personal data only for:
                        <ul style={{ paddingLeft: "20px", marginTop: "5px" }}>
                          <li>Programme administration,</li>
                          <li>Safety and emergency purposes,</li>
                          <li>Session communications.</li>
                        </ul>
                      </li>
                      <li>Data is handled in line with GDPR. Parents/Players have rights to access, correct, or request deletion of personal data.</li>
                      <li>MCA may photograph or video sessions for coaching or marketing purposes. Consent will be requested separately; consent may be withdrawn at any time in writing.</li>
                    </ul>

                    <h6 style={{ color: "#FFD700", marginTop: "20px", marginBottom: "10px" }}>6. Force Majeure & Changes</h6>
                    <ul style={{ paddingLeft: "20px" }}>
                      <li>MCA is not liable for failure or delay in delivering sessions caused by events outside its reasonable control (e.g. severe weather, venue closure, restrictions).</li>
                      <li>If MCA cancels a session, it will endeavour to reschedule or issue a credit (no refunds).</li>
                      <li>If MCA makes significant and unacceptable changes (e.g. venue relocation or major schedule alteration), Parents may withdraw and receive a pro-rata credit for unused sessions.</li>
                    </ul>

                    <h6 style={{ color: "#FFD700", marginTop: "20px", marginBottom: "10px" }}>7. Changes to Terms</h6>
                    <ul style={{ paddingLeft: "20px" }}>
                      <li>MCA may amend these Terms from time to time. Material changes will be notified at least 14 days in advance.</li>
                      <li>Continued participation constitutes acceptance of updated Terms.</li>
                    </ul>

                    <h6 style={{ color: "#FFD700", marginTop: "20px", marginBottom: "10px" }}>8. Governing Law & Disputes</h6>
                    <ul style={{ paddingLeft: "20px" }}>
                      <li>These Terms are governed by the laws of England & Wales.</li>
                      <li>If any provision is found invalid, the remainder will continue in effect.</li>
                      <li>Disputes should first be raised with MCA in writing. If unresolved, disputes will be handled by the courts of England & Wales.</li>
                    </ul>

                    <h6 style={{ color: "#FFD700", marginTop: "20px", marginBottom: "10px" }}>9. Acceptance</h6>
                    <p>
                      By enrolling in MCA programmes, Parents and Players confirm they have read, understood, and accepted these Terms & Conditions.
                    </p>

                    <div style={{
                      marginTop: "30px",
                      padding: "15px",
                      backgroundColor: "#2a2a2a",
                      borderRadius: "5px",
                      textAlign: "center"
                    }}>
                      <p style={{ margin: 0, color: "#FFD700" }}>
                        {termsScrolledToEnd ? "✓ You have read the complete terms" : "↓ Please scroll to the bottom to continue"}
                      </p>
                    </div>
                  </div>
                  <div style={{
                    padding: "20px",
                    borderTop: "1px solid #333",
                    textAlign: "right"
                  }}>
                    <button 
                      onClick={() => setShowTerms(false)}
                      disabled={!termsScrolledToEnd}
                      style={{
                        backgroundColor: termsScrolledToEnd ? "#FFD700" : "#666",
                        color: termsScrolledToEnd ? "#000" : "#999",
                        border: "none",
                        padding: "10px 30px",
                        borderRadius: "5px",
                        cursor: termsScrolledToEnd ? "pointer" : "not-allowed",
                        fontWeight: "bold"
                      }}
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            )}
  
            {/* Total & Confirm */}
            <div className="card border-0 shadow"
            style={{
              backgroundColor: "#1a1a1a",
              border: "1px solid #FFD700",
              transition: "transform 0.3s ease"
            }}>
              <div className="card-body d-flex justify-content-between align-items-center mb-3">
                <div>
                  <h6 className="mb-0" style={{ color: "#FFD700" }}>Total</h6>
                  <div className="small" style={{ color: "#999" }}>
                    {isPlatinumSelected ? "Platinum Pass Selected" : `${totalSelectedSessions} session${totalSelectedSessions !== 1 ? "s" : ""} selected`}
                  </div>
                  {(isFullFridayBlock || isFullSundayClass1Block || isFullSundayClass2Block) && !isPlatinumSelected && (
                    <div className="small" style={{ color: "#4ade80" }}>Block Discount Applied!</div>
                  )}
                </div>
                <div className="text-end">
                  {!isPlatinumSelected && discountAmount > 0 && <div className="text-decoration-line-through" style={{ color: "#666" }}>£{regularPrice}</div>}
                  <div className="fs-3 fw-bold" style={{ color: "#FFD700" }}>£{finalPrice}</div>
                  {!isPlatinumSelected && discountAmount > 0 && <div className="small" style={{ color: "#4ade80" }}>You save £{discountAmount}</div>}
                </div>
              </div>
  
              <div className="card-footer border-0" style={{ backgroundColor: "#0a0a0a" }}>
                <button
                  type="button"
                  className="btn w-100"
                  disabled={(totalSelectedSessions === 0 && !isPlatinumSelected) || !selectedChild || !acceptTerms || !acceptDataPolicy}
                  onClick={handleConfirmBooking}
                  style={{
                    backgroundColor: (totalSelectedSessions === 0 && !isPlatinumSelected) || !selectedChild || !acceptTerms || !acceptDataPolicy ? "#333" : "#FFD700",
                    color: "#000",
                    border: "none",
                    fontWeight: "600",
                    transition: "all 0.3s ease"
                  }}
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
              <div className="card border-0 shadow" style={{
                backgroundColor: "#1a1a1a",
                border: "1px solid #FFD700"
              }}>
                <div className="card-header" style={{
                  backgroundColor: "#FFD700",
                  color: "#000"
                }}>
                  <h5 className="mb-0"><i className="bi bi-check-circle me-2"></i>Confirm Your Booking</h5>
                </div>
                <div className="card-body">
                  {/* Child Details */}
                  <div className="mb-4">
                    <h6 className="border-bottom pb-2 mb-3" style={{ color: "#FFD700", borderColor: "#FFD700 !important" }}>Child Details</h6>
                    {getSelectedChildDetails() && (
                      <div className="row">
                        <div className="col-md-6">
                          <p style={{ color: "#d4d4d4" }}><strong style={{ color: "#FFD700" }}>Name:</strong> {getSelectedChildDetails().firstName} {getSelectedChildDetails().lastName}</p>
                          <p style={{ color: "#d4d4d4" }}><strong style={{ color: "#FFD700" }}>Age:</strong> {getSelectedChildDetails().age}</p>
                          <p style={{ color: "#d4d4d4" }}><strong style={{ color: "#FFD700" }}>Level:</strong> {getSelectedChildDetails().level}</p>
                        </div>
                        <div className="col-md-6">
                          <p style={{ color: "#d4d4d4" }}><strong style={{ color: "#FFD700" }}>Club:</strong> {getSelectedChildDetails().club}</p>
                          <p style={{ color: "#d4d4d4" }}><strong style={{ color: "#FFD700" }}>Medical Info:</strong> {getSelectedChildDetails().medicalInfo}</p>
                        </div>
                      </div>
                    )}
                  </div>
  
                  {/* Venue & Programme */}
                  <div className="mb-4">
                    <h6 className="border-bottom pb-2 mb-3" style={{ color: "#FFD700", borderColor: "#FFD700 !important" }}>Programme Details</h6>
                    <div className="row">
                      <div className="col-md-6">
                        <p style={{ color: "#d4d4d4" }}><strong style={{ color: "#FFD700" }}>Programme:</strong> Block 1 - Technical Development</p>
                        <p style={{ color: "#d4d4d4" }}><strong style={{ color: "#FFD700" }}>Venue:</strong> Tiffin Girls School, KT2 5PL</p>
                      </div>
                      <div className="col-md-6">
                        <p style={{ color: "#d4d4d4" }}><strong style={{ color: "#FFD700" }}>Age Group:</strong> 8-13 years (Girls & Boys)</p>
                      </div>
                    </div>
                  </div>
  
                  {/* Selected Sessions */}
                  <div className="mb-4">
                    <h6 className="border-bottom pb-2 mb-3" style={{ color: "#FFD700", borderColor: "#FFD700 !important" }}>
                      {isPlatinumSelected ? "Platinum Pass - Full Access" : `Selected Sessions (${totalSelectedSessions})`}
                    </h6>
                    
                    {isPlatinumSelected ? (
                      <div className="alert" style={{
                        backgroundColor: "rgba(255, 215, 0, 0.1)",
                        border: "1px solid #FFD700",
                        color: "#FFD700"
                      }}>
                        <i className="bi bi-star-fill me-2"></i>
                        <strong>Platinum Pass Selected</strong>
                        <p className="mb-0 mt-2">You have full access to all sessions and can join any available class without restrictions.</p>
                      </div>
                    ) : (
                      <>
                        {selectedFridayDates.length > 0 && (
                          <div className="mb-3">
                            <strong style={{ color: "#FFD700" }}>Friday Sessions:</strong>
                            <ul className="list-unstyled mt-2">
                              {selectedFridayDates.map(sessionId => {
                                const session = fridayDates.find(s => s.id === sessionId);
                                return (
                                  <li key={sessionId} className="mb-1" style={{ color: "#d4d4d4" }}>
                                    <i className="bi bi-calendar-event me-2" style={{ color: "#FFD700" }}></i>
                                    {formatDate(session.date)} - {session.time}
                                  </li>
                                );
                              })}
                            </ul>
                          </div>
                        )}
  
                        {selectedSundayClass1Dates.length > 0 && (
                          <div className="mb-3">
                            <strong style={{ color: "#FFD700" }}>Sunday Class 1 Sessions:</strong>
                            <ul className="list-unstyled mt-2">
                              {selectedSundayClass1Dates.map(sessionId => {
                                const session = sundayClass1Dates.find(s => s.id === sessionId);
                                return (
                                  <li key={sessionId} className="mb-1" style={{ color: "#d4d4d4" }}>
                                    <i className="bi bi-calendar-event me-2" style={{ color: "#FFD700" }}></i>
                                    {formatDate(session.date)} - {session.time}
                                  </li>
                                );
                              })}
                            </ul>
                          </div>
                        )}
  
                        {selectedSundayClass2Dates.length > 0 && (
                          <div className="mb-3">
                            <strong style={{ color: "#FFD700" }}>Sunday Class 2 Sessions:</strong>
                            <ul className="list-unstyled mt-2">
                              {selectedSundayClass2Dates.map(sessionId => {
                                const session = sundayClass2Dates.find(s => s.id === sessionId);
                                return (
                                  <li key={sessionId} className="mb-1" style={{ color: "#d4d4d4" }}>
                                    <i className="bi bi-calendar-event me-2" style={{ color: "#FFD700" }}></i>
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
                    <h6 className="border-bottom pb-2 mb-3" style={{ color: "#FFD700", borderColor: "#FFD700 !important" }}>Billing Summary</h6>
                    <div className="row">
                      <div className="col-md-8">
                        {isPlatinumSelected ? (
                          <>
                            <div className="d-flex justify-content-between mb-2" style={{ color: "#d4d4d4" }}>
                              <span>Platinum Pass (Full Access)</span>
                              <span>£899</span>
                            </div>
                            <hr style={{ borderColor: "#FFD700" }} />
                            <div className="d-flex justify-content-between h6">
                              <strong style={{ color: "#FFD700" }}>Total Amount</strong>
                              <strong style={{ color: "#FFD700" }}>£900</strong>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="d-flex justify-content-between mb-2" style={{ color: "#d4d4d4" }}>
                              <span>Sessions ({totalSelectedSessions} × £40)</span>
                              <span>£{regularPrice}</span>
                            </div>
                            {discountAmount > 0 && (
                              <div className="d-flex justify-content-between mb-2" style={{ color: "#4ade80" }}>
                                <span>Block Discount{discountAmount > 50 ? "s" : ""}</span>
                                <span>-£{discountAmount}</span>
                              </div>
                            )}
                            <hr style={{ borderColor: "#FFD700" }} />
                            <div className="d-flex justify-content-between h6">
                              <strong style={{ color: "#FFD700" }}>Total Amount</strong>
                              <strong style={{ color: "#FFD700" }}>£{finalPrice}</strong>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
  
                  {/* What to Bring */}
                  <div className="mb-4">
                    <h6 className="border-bottom pb-2 mb-3" style={{ color: "#FFD700", borderColor: "#FFD700 !important" }}>What to Bring</h6>
                    <div className="alert" style={{
                      backgroundColor: "rgba(255, 215, 0, 0.1)",
                      border: "1px solid #FFD700",
                      color: "#d4d4d4"
                    }}>
                      <small>
                        <strong style={{ color: "#FFD700" }}>Required Equipment:</strong> Full cricket kit (bat, pads, gloves, helmet, thigh guard, box, arm guard if used), 
                        appropriate footwear for indoor sports hall, water bottle. 
                        <br /><strong style={{ color: "#FFD700" }}>Note:</strong> This is hard-ball practice - protective gear is mandatory.
                      </small>
                    </div>
                  </div>
                </div>
  
                <div className="card-footer border-0" style={{ backgroundColor: "#0a0a0a" }}>
                  <div className="d-flex gap-2">
                    <button 
                      type="button" 
                      className="btn"
                      onClick={() => setShowBookingConfirmation(false)}
                      style={{
                        backgroundColor: "transparent",
                        border: "1px solid #FFD700",
                        color: "#FFD700",
                        transition: "all 0.3s ease"
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = "#FFD700";
                        e.target.style.color = "#000";
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = "transparent";
                        e.target.style.color = "#FFD700";
                      }}
                    >
                      <i className="bi bi-arrow-left me-2"></i>Back to Selection
                    </button>
                    <button 
                      type="button" 
                      className="btn flex-fill"
                      onClick={processBooking}
                      style={{
                        backgroundColor: "#FFD700",
                        color: "#000",
                        border: "none",
                        fontWeight: "600",
                        transition: "all 0.3s ease"
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.transform = "scale(1.02)";
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = "scale(1)";
                      }}
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
  
      {/* Booking Process Success Modal */}
      {showBookingProcessModal && (
        <>
          <div className="modal-backdrop fade show" style={{ backgroundColor: "rgba(0, 0, 0, 0.8)" }}></div>
          <div className="modal fade show d-block" tabIndex="-1" role="dialog" style={{ zIndex: 1050 }}>
            <div className="modal-dialog modal-dialog-centered" role="document">
              <div className="modal-content" style={{
                backgroundColor: "#1a1a1a",
                border: "2px solid #FFD700"
              }}>
                <div className="modal-header" style={{
                  backgroundColor: "#FFD700",
                  color: "#000",
                  borderBottom: "none"
                }}>
                  <h5 className="modal-title fw-bold">
                    <i className="bi bi-check-circle-fill me-2"></i>
                    Booking Prepared Successfully!
                  </h5>
                </div>
                <div className="modal-body text-center">
                  <div className="mb-4">
                    <i className="bi bi-check-circle" style={{ fontSize: '3rem', color: "#FFD700" }}></i>
                  </div>
                  <h5 className="mb-3" style={{ color: "#FFD700" }}>Ready for Payment!</h5>
                  <div className="alert" style={{
                    backgroundColor: "rgba(255, 215, 0, 0.1)",
                    border: "1px solid #FFD700"
                  }}>
                    <div className="row text-start small">
                      <div className="col-6"><strong style={{ color: "#FFD700" }}>Total Amount:</strong></div>
                      <div className="col-6" style={{ color: "#d4d4d4" }}>£{finalPrice}</div>
                      <div className="col-6"><strong style={{ color: "#FFD700" }}>Booking Type:</strong></div>
                      <div className="col-6" style={{ color: "#d4d4d4" }}>{isPlatinumSelected ? "Platinum Pass" : "Individual Sessions"}</div>
                      <div className="col-6"><strong style={{ color: "#FFD700" }}>Child:</strong></div>
                      <div className="col-6" style={{ color: "#d4d4d4" }}>{getSelectedChildDetails()?.firstName} {getSelectedChildDetails()?.lastName}</div>
                    </div>
                  </div>
                  <p className="mb-3" style={{ color: "#d4d4d4" }}>Your booking data has been prepared and saved. Click below to proceed to the secure payment page.</p>
                </div>
                <div className="modal-footer" style={{ backgroundColor: "#0a0a0a", borderTop: "1px solid #FFD700" }}>
                  <button 
                    type="button" 
                    className="btn" 
                    onClick={() => setShowBookingProcessModal(false)}
                    style={{
                      backgroundColor: "transparent",
                      border: "1px solid #FFD700",
                      color: "#FFD700",
                      transition: "all 0.3s ease"
                    }}
                  >
                    Go Back
                  </button>
                  <button 
                    type="button" 
                    className="btn" 
                    onClick={handleProceedToPayment}
                    style={{
                      backgroundColor: "#FFD700",
                      color: "#000",
                      border: "none",
                      fontWeight: "600",
                      transition: "all 0.3s ease"
                    }}
                  >
                    <i className="bi bi-credit-card me-2"></i>
                    Continue to Payment
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
  
  {showPlatinumInfo && (
        <>
          <style>{`
            @keyframes cardFlip {
              0% {
                transform: perspective(1200px) rotateY(-15deg) rotateX(5deg) translateZ(-100px);
                opacity: 0;
              }
              100% {
                transform: perspective(1200px) rotateY(0deg) rotateX(0deg) translateZ(0);
                opacity: 1;
              }
            }

            @keyframes metalSheen {
              0% {
                background-position: -200% center;
              }
              100% {
                background-position: 200% center;
              }
            }

            @keyframes subtleGlow {
              0%, 100% {
                box-shadow: 
                  0 20px 60px rgba(0, 0, 0, 0.5),
                  0 0 0 1px rgba(255, 255, 255, 0.1) inset,
                  0 8px 30px rgba(180, 180, 200, 0.3);
              }
              50% {
                box-shadow: 
                  0 20px 60px rgba(0, 0, 0, 0.5),
                  0 0 0 1px rgba(255, 255, 255, 0.2) inset,
                  0 8px 40px rgba(180, 180, 200, 0.5);
              }
            }

            @keyframes fadeInUp {
              from {
                opacity: 0;
                transform: translateY(15px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }

            @keyframes gentleFloat {
              0%, 100% {
                transform: translateY(0px);
              }
              50% {
                transform: translateY(-6px);
              }
            }

            .platinum-modal-content {
              background: 
                linear-gradient(
                  145deg,
                  #c8c8c8 0%,
                  #e8e8e8 15%,
                  #f8f8f8 30%,
                  #ffffff 50%,
                  #f8f8f8 70%,
                  #e8e8e8 85%,
                  #c8c8c8 100%
                ) !important;
              border: none !important;
              border-radius: 16px !important;
              position: relative;
              overflow: hidden;
              animation: cardFlip 0.8s cubic-bezier(0.34, 1.56, 0.64, 1), subtleGlow 4s ease-in-out infinite;
              transform-style: preserve-3d;
            }

            .platinum-modal-content::before {
              content: '';
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              background: 
                linear-gradient(
                  110deg,
                  transparent 20%,
                  rgba(255, 255, 255, 0) 25%,
                  rgba(255, 255, 255, 0.5) 50%,
                  rgba(255, 255, 255, 0) 55%,
                  transparent 60%
                );
              background-size: 200% 100%;
              animation: metalSheen 4s ease-in-out infinite;
              pointer-events: none;
              z-index: 1;
            }

            .platinum-modal-content::after {
              content: '';
              position: absolute;
              top: -2px;
              left: -2px;
              right: -2px;
              bottom: -2px;
              background: linear-gradient(145deg, #a0a0a0, #d0d0d0, #f0f0f0, #d0d0d0, #a0a0a0);
              border-radius: 16px;
              z-index: -1;
              opacity: 0.5;
            }

            .modal-dialog {
              transform: perspective(1200px);
              max-width: 450px;
            }

            .platinum-header {
              background: 
                linear-gradient(
                  135deg,
                  #b0b0b0 0%,
                  #d4d4d4 25%,
                  #e8e8e8 50%,
                  #d4d4d4 75%,
                  #b0b0b0 100%
                ) !important;
              border-bottom: none !important;
              border-radius: 14px 14px 0 0 !important;
              position: relative;
              z-index: 2;
              padding: 0.75rem 1rem !important;
              box-shadow: 0 3px 15px rgba(0, 0, 0, 0.1);
            }

            .platinum-header h5 {
              text-transform: uppercase;
              letter-spacing: 1.5px;
              font-size: 0.75rem;
              font-weight: 700;
              color: #2a2a2a;
              margin: 0;
            }

            .modal-body {
              position: relative;
              z-index: 2;
              padding: 1rem 1.25rem !important;
            }

            .platinum-trophy {
              animation: fadeInUp 0.6s ease-out 0.3s both, gentleFloat 4s ease-in-out 1.5s infinite;
              filter: drop-shadow(0 3px 10px rgba(0, 0, 0, 0.15));
              margin-bottom: 0.75rem !important;
            }

            .platinum-title {
              animation: fadeInUp 0.6s ease-out 0.4s both;
              font-weight: 700;
              font-size: 1.1rem;
              color: #1a1a1a;
              margin-bottom: 0.75rem !important;
              text-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
            }

            .platinum-benefits {
              background: rgba(255, 255, 255, 0.6) !important;
              border: 1px solid rgba(200, 200, 200, 0.5) !important;
              border-radius: 10px !important;
              backdrop-filter: blur(10px);
              padding: 0.85rem !important;
              animation: fadeInUp 0.6s ease-out 0.5s both;
              box-shadow: 
                0 3px 15px rgba(0, 0, 0, 0.08),
                inset 0 1px 0 rgba(255, 255, 255, 0.8);
            }

            .platinum-benefits h6 {
              font-weight: 700;
              font-size: 0.75rem;
              color: #2a2a2a;
              text-transform: uppercase;
              letter-spacing: 0.8px;
              margin-bottom: 0.5rem !important;
            }

            .platinum-benefits ul {
              list-style: none;
              padding-left: 0 !important;
              margin-bottom: 0 !important;
            }

            .platinum-benefits ul li {
              padding: 0.35rem 0;
              padding-left: 1.3rem;
              color: #3a3a3a;
              font-size: 0.75rem;
              font-weight: 500;
              position: relative;
              transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
              animation: fadeInUp 0.4s ease-out both;
            }

            .platinum-benefits ul li::before {
              content: '◆';
              position: absolute;
              left: 0;
              color: #888;
              font-size: 0.6rem;
              transition: all 0.3s ease;
            }

            .platinum-benefits ul li:nth-child(1) { animation-delay: 0.6s; }
            .platinum-benefits ul li:nth-child(2) { animation-delay: 0.65s; }
            .platinum-benefits ul li:nth-child(3) { animation-delay: 0.7s; }
            .platinum-benefits ul li:nth-child(4) { animation-delay: 0.75s; }
            .platinum-benefits ul li:nth-child(5) { animation-delay: 0.8s; }
            .platinum-benefits ul li:nth-child(6) { animation-delay: 0.85s; }

            .platinum-benefits ul li:hover {
              padding-left: 1.5rem;
              color: #1a1a1a;
            }

            .platinum-benefits ul li:hover::before {
              color: #2a2a2a;
              left: 0.2rem;
            }

            .platinum-price-section {
              animation: fadeInUp 0.7s ease-out 0.9s both;
              padding: 0.85rem;
              margin-top: 0.75rem;
              background: linear-gradient(135deg, rgba(240, 240, 240, 0.8), rgba(255, 255, 255, 0.6));
              border-radius: 10px;
              border: 1px solid rgba(200, 200, 200, 0.4);
              box-shadow: 0 3px 12px rgba(0, 0, 0, 0.06);
            }

            .platinum-price-section h6 {
              color: #666;
              font-weight: 600;
              font-size: 0.7rem;
              margin-bottom: 0.25rem;
              text-transform: uppercase;
              letter-spacing: 0.8px;
            }

            .platinum-price-section h4 {
              color: #1a1a1a;
              font-weight: 800;
              font-size: 1.75rem;
              margin: 0.4rem 0;
              text-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
            }

            .value-badge {
              display: inline-block;
              padding: 0.4rem 1rem;
              background: linear-gradient(135deg, #2a2a2a, #4a4a4a);
              border-radius: 20px;
              color: #ffffff;
              font-weight: 700;
              font-size: 0.7rem;
              letter-spacing: 0.4px;
              box-shadow: 0 3px 12px rgba(0, 0, 0, 0.2);
            }

            .platinum-footer {
              background: 
                linear-gradient(
                  135deg,
                  #d4d4d4 0%,
                  #e8e8e8 50%,
                  #d4d4d4 100%
                ) !important;
              border-top: none !important;
              border-radius: 0 0 14px 14px !important;
              padding: 0.85rem 1.25rem !important;
              position: relative;
              z-index: 2;
              box-shadow: 0 -3px 15px rgba(0, 0, 0, 0.05);
            }

            .btn-platinum-primary {
              background: linear-gradient(135deg, #2a2a2a, #3a3a3a, #2a2a2a) !important;
              color: #ffffff !important;
              border: none !important;
              border-radius: 6px !important;
              font-weight: 700 !important;
              font-size: 0.7rem !important;
              padding: 0.6rem 1.25rem !important;
              text-transform: uppercase;
              letter-spacing: 0.8px;
              transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1) !important;
              position: relative;
              overflow: hidden;
              box-shadow: 0 3px 12px rgba(0, 0, 0, 0.3);
            }

            .btn-platinum-primary::before {
              content: '';
              position: absolute;
              top: 0;
              left: -100%;
              width: 100%;
              height: 100%;
              background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
              transition: left 0.5s ease;
            }

            .btn-platinum-primary:hover::before {
              left: 100%;
            }

            .btn-platinum-primary:hover {
              transform: translateY(-2px);
              box-shadow: 0 6px 18px rgba(0, 0, 0, 0.4);
              background: linear-gradient(135deg, #3a3a3a, #4a4a4a, #3a3a3a) !important;
            }

            .btn-platinum-secondary {
              background: transparent !important;
              border: 2px solid #6a6a6a !important;
              border-radius: 6px !important;
              color: #3a3a3a !important;
              font-weight: 600 !important;
              font-size: 0.7rem !important;
              padding: 0.6rem 1.25rem !important;
              text-transform: uppercase;
              letter-spacing: 0.8px;
              transition: all 0.3s ease !important;
            }

            .btn-platinum-secondary:hover {
              background: rgba(0, 0, 0, 0.05) !important;
              border-color: #3a3a3a !important;
              color: #1a1a1a !important;
              transform: translateY(-2px);
            }

            .bi-gem, .bi-trophy-fill, .bi-check-circle-fill {
              font-size: 0.75rem;
            }

            .platinum-trophy .bi-trophy-fill {
              font-size: 2.5rem !important;
            }
          `}</style>

          <div className="modal-backdrop fade show" style={{ backgroundColor: "rgba(0, 0, 0, 0.75)" }}></div>
          <div className="modal fade show d-block" tabIndex="-1" role="dialog" style={{ zIndex: 1050 }}>
            <div className="modal-dialog modal-dialog-centered" role="document">
              <div className="modal-content platinum-modal-content">
                <div className="modal-header platinum-header">
                  <h5 className="modal-title">
                    <i className="bi bi-gem me-2"></i>
                    Platinum Pass Benefits
                  </h5>
                </div>
                <div className="modal-body text-center">
                  <div className="platinum-trophy">
                    <i className="bi bi-trophy-fill" style={{ color: "#6a6a6a" }}></i>
                  </div>
                  <h5 className="platinum-title">
                    Ultimate Cricket Experience
                  </h5>
                  <div className="alert text-start platinum-benefits">
                    <h6>What You Get</h6>
                    <ul>
                      <li>Access to ALL Friday sessions (10 weeks)</li>
                      <li>Access to ALL Sunday Class 1 sessions (10 weeks)</li>
                      <li>Access to ALL Sunday Class 2 sessions (10 weeks)</li>
                      <li>Plus 2 hours free 1-2-1 worth £180.00</li>
                      {/* <li>Total value worth £1360.00. Save £460.00</li> */}
                      <li>Priority booking for future programmes</li>
                    </ul>
                  </div>
                  <div className="platinum-price-section">
                    <h6>Total Value: £1380</h6>
                    <h4>£899</h4>
                    <div className="value-badge">
                      Save £481 + Maximum Flexibility
                    </div>
                  </div>
                </div>
                <div className="modal-footer platinum-footer">
                  <button 
                    type="button" 
                    className="btn btn-platinum-secondary"
                    onClick={handlePlatinumMaybeLater}
                  >
                    Maybe Later
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-platinum-primary"
                    onClick={() => setShowPlatinumInfo(false)}
                  >
                    <i className="bi bi-check-circle-fill me-2"></i>
                    Continue with Platinum
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
      
      {/* <div className="container mt-4 text-center">
        <button 
          className="btn btn-primary"
          onClick={() => setShowPlatinumInfo(true)}
        >
          Show Platinum Info
        </button>
      </div> */}
  
      {/* Block Discount Popups */}
      {showFridayDiscount && (
        <>
          <div className="modal-backdrop fade show" style={{ backgroundColor: "rgba(0, 0, 0, 0.8)" }}></div>
          <div className="modal fade show d-block" tabIndex="-1" role="dialog" style={{ zIndex: 1050 }}>
            <div className="modal-dialog modal-dialog-centered" role="document">
              <div className="modal-content" style={{
                backgroundColor: "#1a1a1a",
                border: "2px solid #FFD700"
              }}>
                <div className="modal-header" style={{
                  backgroundColor: "#FFD700",
                  color: "#000",
                  borderBottom: "none"
                }}>
                  <h5 className="modal-title fw-bold">
                    <i className="bi bi-trophy-fill me-2"></i>
                    Friday Block Discount Unlocked!
                  </h5>
                </div>
                <div className="modal-body text-center">
                  <div className="mb-3">
                    <i className="bi bi-check-circle-fill" style={{ fontSize: '3rem', color: "#4ade80" }}></i>
                  </div>
                  <h5 className="mb-3" style={{ color: "#4ade80" }}>Congratulations!</h5>
                  <p className="mb-3" style={{ color: "#d4d4d4" }}>You've selected all Friday sessions and unlocked our special discount!</p>
                  <div className="alert" style={{
                    backgroundColor: "rgba(74, 222, 128, 0.1)",
                    border: "1px solid #4ade80"
                  }}>
                    <h6 className="mb-1" style={{ color: "#4ade80" }}>Friday Block Price: £350</h6>
                    <p className="mb-0" style={{ color: "#d4d4d4" }}>You save £50 compared to individual session pricing!</p>
                  </div>
                </div>
                <div className="modal-footer" style={{ backgroundColor: "#0a0a0a", borderTop: "1px solid #FFD700" }}>
                  <button 
                    type="button" 
                    className="btn" 
                    onClick={() => setShowFridayDiscount(false)}
                    style={{
                      backgroundColor: "#FFD700",
                      color: "#000",
                      border: "none",
                      fontWeight: "600",
                      transition: "all 0.3s ease"
                    }}
                  >
                    <i className="bi bi-hand-thumbs-up me-2"></i>
                    Brilliant! Continue
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
  
      {showSundayClass1Discount && (
        <>
          <div className="modal-backdrop fade show" style={{ backgroundColor: "rgba(0, 0, 0, 0.8)" }}></div>
          <div className="modal fade show d-block" tabIndex="-1" role="dialog" style={{ zIndex: 1050 }}>
            <div className="modal-dialog modal-dialog-centered" role="document">
              <div className="modal-content" style={{
                backgroundColor: "#1a1a1a",
                border: "2px solid #FFD700"
              }}>
                <div className="modal-header" style={{
                  backgroundColor: "#FFD700",
                  color: "#000",
                  borderBottom: "none"
                }}>
                  <h5 className="modal-title fw-bold">
                    <i className="bi bi-trophy-fill me-2"></i>
                    Sunday Class 1 Block Discount Unlocked!
                  </h5>
                </div>
                <div className="modal-body text-center">
                  <div className="mb-3">
                    <i className="bi bi-check-circle-fill" style={{ fontSize: '3rem', color: "#4ade80" }}></i>
                  </div>
                  <h5 className="mb-3" style={{ color: "#4ade80" }}>Fantastic!</h5>
                  <p className="mb-3" style={{ color: "#d4d4d4" }}>You've selected all Sunday Class 1 sessions and earned our block discount!</p>
                  <div className="alert" style={{
                    backgroundColor: "rgba(74, 222, 128, 0.1)",
                    border: "1px solid #4ade80"
                  }}>
                    <h6 className="mb-1" style={{ color: "#4ade80" }}>Sunday Class 1 Block: £350</h6>
                    <p className="mb-0" style={{ color: "#d4d4d4" }}>You save £50 compared to individual sessions!</p>
                  </div>
                </div>
                <div className="modal-footer" style={{ backgroundColor: "#0a0a0a", borderTop: "1px solid #FFD700" }}>
                  <button 
                    type="button" 
                    className="btn" 
                    onClick={() => setShowSundayClass1Discount(false)}
                    style={{
                      backgroundColor: "#FFD700",
                      color: "#000",
                      border: "none",
                      fontWeight: "600",
                      transition: "all 0.3s ease"
                    }}
                  >
                    <i className="bi bi-hand-thumbs-up me-2"></i>
                    Excellent! Continue
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
  
      {showSundayClass2Discount && (
        <>
          <div className="modal-backdrop fade show" style={{ backgroundColor: "rgba(0, 0, 0, 0.8)" }}></div>
          <div className="modal fade show d-block" tabIndex="-1" role="dialog" style={{ zIndex: 1050 }}>
            <div className="modal-dialog modal-dialog-centered" role="document">
              <div className="modal-content" style={{
                backgroundColor: "#1a1a1a",
                border: "2px solid #FFD700"
              }}>
                <div className="modal-header" style={{
                  backgroundColor: "#FFD700",
                  color: "#000",
                  borderBottom: "none"
                }}>
                  <h5 className="modal-title fw-bold">
                    <i className="bi bi-trophy-fill me-2"></i>
                    Sunday Class 2 Block Discount Unlocked!
                  </h5>
                </div>
                <div className="modal-body text-center">
                  <div className="mb-3">
                    <i className="bi bi-check-circle-fill" style={{ fontSize: '3rem', color: "#4ade80" }}></i>
                  </div>
                  <h5 className="mb-3" style={{ color: "#4ade80" }}>Outstanding!</h5>
                  <p className="mb-3" style={{ color: "#d4d4d4" }}>You've selected all Sunday Class 2 sessions and earned our block discount!</p>
                  <div className="alert" style={{
                    backgroundColor: "rgba(74, 222, 128, 0.1)",
                    border: "1px solid #4ade80"
                  }}>
                    <h6 className="mb-1" style={{ color: "#4ade80" }}>Sunday Class 2 Block: £350</h6>
                    <p className="mb-0" style={{ color: "#d4d4d4" }}>You save £50 compared to individual sessions!</p>
                  </div>
                </div>
                <div className="modal-footer" style={{ backgroundColor: "#0a0a0a", borderTop: "1px solid #FFD700" }}>
                  <button 
                    type="button" 
                    className="btn" 
                    onClick={() => setShowSundayClass2Discount(false)}
                    style={{
                      backgroundColor: "#FFD700",
                      color: "#000",
                      border: "none",
                      fontWeight: "600",
                      transition: "all 0.3s ease"
                    }}
                  >
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
          <div className="modal-backdrop fade show" style={{ backgroundColor: "rgba(0, 0, 0, 0.8)" }}></div>
          <div className="modal fade show d-block" tabIndex="-1" role="dialog" style={{ zIndex: 1050 }}>
            <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable" role="document">
              <div className="modal-content" style={{
                backgroundColor: "#1a1a1a",
                border: "1px solid #FFD700"
              }}>
                <div className="modal-header" style={{
                  backgroundColor: "#FFD700",
                  color: "#000",
                  borderBottom: "none"
                }}>
                  <h5 className="modal-title fw-bold">10-Week Technical Masterclass Clinic</h5>
                  <button type="button" className="btn-close" onClick={() => setShowDescription(false)} style={{ filter: "invert(1)" }}></button>
                </div>
                <div className="modal-body" style={{ color: "#d4d4d4" }}>
                  <div className="alert" style={{
                    backgroundColor: "rgba(255, 215, 0, 0.1)",
                    border: "1px solid #FFD700"
                  }}>
                    <h6 style={{ color: "#FFD700" }}><i className="bi bi-trophy me-2"></i>Ages 8–13 (Girls & Boys) | Real, Measurable Improvement</h6>
                    <p className="mb-0">At Masterclass Cricket Academy, we help young cricketers achieve genuine improvement through structured development.</p>
                </div>

                <h6 style={{ color: "#FFD700" }}><i className="bi bi-calendar-range me-2"></i>Programme Schedule</h6>
                <p><strong style={{ color: "#FFD700" }}>Block 1 Dates:</strong></p>
                <ul>
                  <li><strong style={{ color: "#FFD700" }}>Fridays:</strong> 10th October - 12th December 2025 (5:45pm - 7:15pm)</li>
                  <li><strong style={{ color: "#FFD700" }}>Sundays:</strong> 12th October - 14th December 2025
                    <ul>
                      <li>Class 1: 4:30pm - 6:00pm</li>
                      <li>Class 2: 6:00pm - 7:30pm</li>
                    </ul>
                  </li>
                </ul>

                <h6 style={{ color: "#FFD700" }}><i className="bi bi-bullseye me-2"></i>What the 10 Weeks Will Cover</h6>
                
                <p><strong style={{ color: "#FFD700" }}>Batting Excellence</strong></p>
                <ul>
                  <li>Playing the swinging ball with control</li>
                  <li>Developing skills against off-spin and leg-spin</li>
                  <li>Power hitting: how to generate and use power</li>
                  <li>Controlling the bat under pressure + mastering different shots</li>
                </ul>

                <p><strong style={{ color: "#FFD700" }}>Bowling Development</strong></p>
                <ul>
                  <li>Building a repeatable action for consistency</li>
                  <li>Increasing bowling speed</li>
                  <li>Helping spinners generate more revolutions</li>
                  <li>Improving line and length accuracy</li>
                </ul>

                <p><strong style={{ color: "#FFD700" }}>Mental Skills</strong></p>
                <ul>
                  <li>Handling pressure and overcoming fear</li>
                  <li>Developing a winning mindset</li>
                  <li>Building self-belief to perform confidently in the middle</li>
                </ul>

                <h6 style={{ color: "#FFD700" }}><i className="bi bi-gear me-2"></i>What to Bring</h6>
                <div className="alert" style={{
                  backgroundColor: "rgba(255, 215, 0, 0.1)",
                  border: "1px solid #FFD700",
                  color: "#d4d4d4"
                }}>
                  <p><strong style={{ color: "#FFD700" }}>Hard-Ball Practice - Full Kit Required:</strong></p>
                  <ul className="mb-2">
                    <li>Full cricket kit (bat, pads, gloves, helmet, thigh guard, box, arm guard if used)</li>
                    <li>Appropriate footwear for indoor sports hall (non-marking soles)</li>
                    <li>Water bottle and optional light snack</li>
                  </ul>
                  <p className="mb-0"><strong style={{ color: "#FFD700" }}>Note:</strong> Protective gear is mandatory - no player will be allowed to bat or bowl without it.</p>
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
        <div className="modal-backdrop fade show" style={{ backgroundColor: "rgba(0, 0, 0, 0.8)" }}></div>
        <div className="modal fade show d-block" tabIndex="-1" role="dialog" style={{ zIndex: 1050 }}>
          <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable" role="document">
            <div className="modal-content" style={{
              backgroundColor: "#1a1a1a",
              border: "1px solid #FFD700"
            }}>
              <div className="modal-header" style={{
                backgroundColor: "#FFD700",
                color: "#000",
                borderBottom: "none"
              }}>
                <h5 className="modal-title fw-bold">Masterclass Cricket Academy – Terms & Conditions</h5>
                <button type="button" className="btn-close" onClick={() => setShowTerms(false)} style={{ filter: "invert(1)" }}></button>
              </div>
              <div 
                className="modal-body" 
                style={{ maxHeight: '60vh', overflowY: 'scroll', color: "#d4d4d4" }}
                onScroll={handleTermsScroll}
              >
                <p>These Terms & Conditions ("Terms") apply to all participants ("Players") and their parents/guardians ("Parents") enrolling in programmes, classes, and activities run by Masterclass Cricket Academy ("MCA"). By enrolling, you agree to these Terms.</p>
                
                <hr style={{ borderColor: "#FFD700" }} />

                <h6 style={{ color: "#FFD700" }}>1. Programme Requirements</h6>
                <ul>
                  <li>Players must arrive 10 minutes early to get padded up and ready.</li>
                  <li>All kit should be clearly labelled to avoid mix-ups.</li>
                  <li>Protective gear (helmet and box) is mandatory for all players.</li>
                  <li>Parents may observe only from designated areas.</li>
                  <li>Parents must inform MCA of any injuries, medical conditions, or allergies before participation.</li>
                </ul>

                <hr style={{ borderColor: "#FFD700" }} />

                <h6 style={{ color: "#FFD700" }}>2. Refund & Cancellation Policy</h6>
                
                <p><strong style={{ color: "#FFD700" }}>2.1 Missed Sessions</strong></p>
                <ul>
                  <li>Credits for missed sessions will be provided only if MCA receives 48+ hours' notice.</li>
                  <li>No credits or refunds will be issued for late cancellations or no-shows.</li>
                </ul>

                <p><strong style={{ color: "#FFD700" }}>2.2 Bookings Made Within 7 Days</strong></p>
                <ul>
                  <li>Any class or programme booked within 7 days of the start date is strictly non-refundable, regardless of circumstances.</li>
                </ul>

                <p><strong style={{ color: "#FFD700" }}>2.3 Block Bookings & Platinum Passes</strong></p>
                <ul>
                  <li>Fees for Block Bookings (e.g. 10-week packages) and Platinum Passes are non-refundable under all circumstances.</li>
                  <li>The only exception is a medical exemption, supported by a valid medical certificate, in which case MCA may issue credit at its discretion.</li>
                </ul>

                <p><strong style={{ color: "#FFD700" }}>2.4 Use of Credits</strong></p>
                <ul>
                  <li>Credits will be issued as 1-to-1 coaching sessions or participation in other MCA activities.</li>
                  <li>Credits are non-transferable and must be used before 01/09/2026.</li>
                  <li>MCA reserves the right to determine how credits are applied.</li>
                </ul>

                <p><strong style={{ color: "#FFD700" }}>2.5 Final Authority</strong></p>
                <ul>
                  <li>MCA reserves the right to make final decisions on all credit, cancellation, and refund matters.</li>
                </ul>

                <hr style={{ borderColor: "#FFD700" }} />

                <h6 style={{ color: "#FFD700" }}>3. Safety & Liability</h6>
                <ul>
                  <li>Parents acknowledge that cricket involves inherent physical risks.</li>
                  <li>MCA follows strict safety protocols and maintains appropriate insurance, but Players participate at their own risk.</li>
                  <li>MCA accepts no liability for:
                    <ul>
                      <li>Injuries sustained during participation (unless caused by proven negligence of MCA staff),</li>
                      <li>Loss or damage to personal belongings.</li>
                    </ul>
                  </li>
                </ul>

                <hr style={{ borderColor: "#FFD700" }} />

                <h6 style={{ color: "#FFD700" }}>4. Conduct & Removal</h6>
                <ul>
                  <li>MCA expects all Players to maintain discipline, respect, and sportsmanship.</li>
                  <li>Parents and Players must comply with coach instructions at all times.</li>
                  <li>MCA reserves the right to remove a Player from a session or programme without refund for:
                    <ul>
                      <li>Unsafe behaviour,</li>
                      <li>Disruptive conduct,</li>
                      <li>Breach of these Terms.</li>
                    </ul>
                  </li>
                </ul>

                <hr style={{ borderColor: "#FFD700" }} />

                <h6 style={{ color: "#FFD700" }}>5. Data Protection</h6>
                <ul>
                  <li>MCA collects and processes personal information only for:
                    <ul>
                      <li>Programme administration,</li>
                      <li>Safety and emergency purposes,</li>
                      <li>Communication regarding sessions.</li>
                    </ul>
                  </li>
                  <li>All data will be handled in line with GDPR regulations and not shared with third parties without consent, unless required by law.</li>
                </ul>

                <hr style={{ borderColor: "#FFD700" }} />

                <h6 style={{ color: "#FFD700" }}>6. Acceptance of Terms</h6>
                <p>By enrolling in MCA programmes, Parents and Players confirm they have read, understood, and accepted these Terms & Conditions.</p>

                <div className="alert mt-4" style={{
                  backgroundColor: "rgba(74, 222, 128, 0.1)",
                  border: "1px solid #4ade80"
                }}>
                  <i className="bi bi-check-circle me-2" style={{ color: "#4ade80" }}></i>
                  <strong style={{ color: "#4ade80" }}>You have read the complete terms and conditions.</strong>
                </div>
              </div>
              <div className="modal-footer" style={{ backgroundColor: "#0a0a0a", borderTop: "1px solid #FFD700" }}>
                <button 
                  type="button" 
                  className="btn" 
                  onClick={() => setShowTerms(false)}
                  style={{
                    backgroundColor: "#FFD700",
                    color: "#000",
                    border: "none",
                    fontWeight: "600",
                    transition: "all 0.3s ease"
                  }}
                >
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
        <div className="modal-backdrop fade show" style={{ backgroundColor: "rgba(0, 0, 0, 0.8)" }}></div>
        <div className="modal fade show d-block" tabIndex="-1" role="dialog" style={{ zIndex: 1050 }}>
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content" style={{
              backgroundColor: "#1a1a1a",
              border: "1px solid #FFD700"
            }}>
              <div className="modal-header" style={{
                backgroundColor: "#FFD700",
                color: "#000",
                borderBottom: "none"
              }}>
                <h5 className="modal-title fw-bold">Confirm Your Selection</h5>
                <button type="button" className="btn-close" onClick={() => setShowConfirmDialog(false)} style={{ filter: "invert(1)" }}></button>
              </div>
              <div className="modal-body text-center">
                <div className="mb-3">
                  <i className="bi bi-exclamation-circle" style={{ fontSize: '3rem', color: "#FFD700" }}></i>
                </div>
                <p style={{ color: "#d4d4d4" }}>You've selected only 1 session. Would you like to check other available slots before proceeding?</p>
                <p className="small" style={{ color: "#999" }}>Consider our block discounts - save £50 when booking 10 sessions from any category!</p>
              </div>
              <div className="modal-footer" style={{ backgroundColor: "#0a0a0a", borderTop: "1px solid #FFD700" }}>
                <button 
                  type="button" 
                  className="btn" 
                  onClick={() => setShowConfirmDialog(false)}
                  style={{
                    backgroundColor: "transparent",
                    border: "1px solid #FFD700",
                    color: "#FFD700",
                    transition: "all 0.3s ease"
                  }}
                >
                  Check Other Slots
                </button>
                <button 
                  type="button" 
                  className="btn" 
                  onClick={() => { setShowConfirmDialog(false); setShowBookingConfirmation(true); }}
                  style={{
                    backgroundColor: "#FFD700",
                    color: "#000",
                    border: "none",
                    fontWeight: "600",
                    transition: "all 0.3s ease"
                  }}
                >
                  Continue with Single Session
                </button>
              </div>
            </div>
          </div>
        </div>
      </>
    )}

    <style>{`
      @keyframes fadeIn {
        from {
          opacity: 0;
          transform: translateY(-10px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
    `}</style>
  </div>
  <Footer />
  </>;
}

export default CricketAcademyBooking;