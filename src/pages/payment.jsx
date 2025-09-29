import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from '@/Components/Header';
import Footer from '@/Components/Footer';

const PaymentPage = () => {
  const [bookingData, setBookingData] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [reservationData, setReservationData] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [initializing, setInitializing] = useState(true);
  const valueToken = useSelector(state => state.auth.loginData.token);

  useEffect(() => {
    const savedBookingData = sessionStorage.getItem('cricketBookingData');
    if (savedBookingData) {
      setBookingData(JSON.parse(savedBookingData));
    } else {
      window.location.href = '/';
      return;
    }

    const paymentInProgress = sessionStorage.getItem('paymentInProgress');

    const existingReservation = sessionStorage.getItem('reservationData');
    if (existingReservation) {
      const reservation = JSON.parse(existingReservation);
      setReservationData(reservation);

      const expiresAt = new Date(reservation.expiresAt).getTime();
      const now = new Date().getTime();
      const remaining = Math.max(0, Math.floor((expiresAt - now) / 1000));
      setTimeRemaining(remaining);
    } else if (!paymentInProgress) {
      // Only redirect if no reservation and not coming back from Stripe
      // window.location.href = '/class1';
    }

    setInitializing(false);
  }, []);

  useEffect(() => {
    if (timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            releaseReservation();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [timeRemaining]);

  const reserveSlots = async () => {
    if (!bookingData) return;

    setIsProcessing(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/payments/booking/reserve`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${valueToken}`,
          },
          body: JSON.stringify({
            parentId: bookingData.parentId,
            childId: bookingData.childId,
            sessionIds: bookingData.sessionIds,
            totalAmount: bookingData.totalAmount,
          }),
        }
      );

      const data = await response.json();
      if (response.ok && data.success) {
        setReservationData(data);
        sessionStorage.setItem('reservationData', JSON.stringify(data));
        sessionStorage.setItem('reservationId', data.reservationId);
        setTimeRemaining(data.ttlSeconds || 300);
      } else {
        if (response.status === 409) {
          alert('Selected slots are no longer available. Please choose again.');
          window.location.href = '/';
        } else alert(data.message || 'Failed to reserve slots.');
      }
    } catch (err) {
      console.error(err);
      alert('Network error. Try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePaymentWithReservation = async () => {
    if (!reservationData) {
      alert('No reservation found. Please reserve slots first.');
      return;
    }

    setIsProcessing(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/payments/create-checkout-session`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${valueToken}`,
          },
          body: JSON.stringify({
            reservationId: reservationData.reservationId,
            amount: bookingData.totalAmount * 100,
            currency: 'GBP',
          }),
        }
      );

      const data = await response.json();
      if (data.url) {
        sessionStorage.setItem('paymentInProgress', 'true');
        window.location.href = data.url;
      } else {
        console.error('Stripe response:', data);
        alert('Failed to initiate payment');
      }
    } catch (err) {
      console.error(err);
      alert('Payment failed. Try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const releaseReservation = async () => {
    if (!reservationData) return;

    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/payments/booking/release-reservation`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${valueToken}`,
        },
        body: JSON.stringify({ reservationId: reservationData.reservationId }),
      });
      sessionStorage.clear();
    } catch (err) {
      console.error('Failed to release reservation:', err);
    } finally {
      setReservationData(null);
      setTimeRemaining(0);
      sessionStorage.removeItem('reservationData');
      sessionStorage.removeItem('reservationId');
      sessionStorage.removeItem('paymentInProgress');
      window.location.href = '/';
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  if (initializing || !bookingData) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center" style={{ background: "#0a0a0a" }}>
        <div className="text-center">
          <div className="spinner-border" role="status" style={{ color: "#ffc107", width: "3rem", height: "3rem" }}>
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3" style={{ color: "#ffc107" }}>Loading payment details...</p>
        </div>
      </div>
    );
  }

  return (
    <>
    <Header />
      <div className="min-vh-100 d-flex align-items-center justify-content-center py-5" style={{ 
        background: "linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)"
      }}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-6 col-lg-5">
              <div className="card border-0 payment-card" style={{
                background: "linear-gradient(135deg, #1a1a1a 0%, #262626 100%)",
                border: "1px solid rgba(255, 193, 7, 0.2)",
                animation: "slideUp 0.5s ease"
              }}>
                <div className="card-body p-5">
                  {/* Header */}
                  <div className="text-center mb-4">
                    <div className="mb-3">
                      <i className="fas fa-lock" style={{ 
                        fontSize: "3rem", 
                        color: "#ffc107",
                        animation: "pulse 2s infinite"
                      }}></i>
                    </div>
                    <h2 className="mb-2" style={{ color: "#ffc107", fontWeight: "600" }}>
                      {reservationData ? 'Complete Payment' : 'Reserve Slots'}
                    </h2>
                    <p style={{ color: "#999", fontSize: "0.9rem" }}>
                      {reservationData ? 'Your slots are reserved' : 'Secure your booking now'}
                    </p>
                  </div>

                  {/* Timer Display */}
                  {reservationData && (
                    <div className="text-center mb-4 timer-box" style={{
                      background: "linear-gradient(135deg, #ffc107 0%, #ff9800 100%)",
                      padding: "20px",
                      borderRadius: "12px",
                      animation: "fadeIn 0.5s ease"
                    }}>
                      <div style={{ color: "#000", fontSize: "0.85rem", fontWeight: "600", marginBottom: "5px" }}>
                        TIME REMAINING
                      </div>
                      <div style={{ 
                        color: "#000", 
                        fontSize: "2.5rem", 
                        fontWeight: "700",
                        fontFamily: "monospace",
                        letterSpacing: "2px"
                      }}>
                        {formatTime(timeRemaining)}
                      </div>
                      <div style={{ color: "#000", fontSize: "0.75rem", opacity: "0.8" }}>
                        Complete payment before time expires
                      </div>
                    </div>
                  )}

                  {/* Booking Summary */}
                  <div className="mb-4 p-3" style={{
                    backgroundColor: "#0a0a0a",
                    borderRadius: "8px",
                    border: "1px solid #333"
                  }}>
                    <h6 style={{ color: "#ffc107", fontSize: "0.9rem", marginBottom: "15px" }}>
                      <i className="fas fa-file-invoice me-2"></i>Booking Summary
                    </h6>
                    <div className="d-flex justify-content-between mb-2">
                      <span style={{ color: "#999" }}>Sessions:</span>
                      <span style={{ color: "#fff", fontWeight: "600" }}>
                        {bookingData.sessionIds?.length || 0}
                      </span>
                    </div>
                    <div className="d-flex justify-content-between">
                      <span style={{ color: "#999" }}>Total Amount:</span>
                      <span style={{ color: "#ffc107", fontSize: "1.5rem", fontWeight: "700" }}>
                        £{bookingData.totalAmount}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  {!reservationData ? (
                    <button 
                      className="btn w-100 btn-hover" 
                      onClick={reserveSlots} 
                      disabled={isProcessing}
                      style={{
                        backgroundColor: "#ffc107",
                        color: "#000",
                        border: "none",
                        padding: "15px",
                        fontSize: "1.1rem",
                        fontWeight: "600",
                        borderRadius: "8px",
                        transition: "all 0.3s ease",
                        position: "relative",
                        overflow: "hidden"
                      }}
                    >
                      {isProcessing ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2"></span>
                          Reserving...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-lock me-2"></i>
                          Reserve Slots
                        </>
                      )}
                    </button>
                  ) : (
                    <>
                      <button 
                        className="btn w-100 mb-3 btn-hover" 
                        onClick={handlePaymentWithReservation} 
                        disabled={isProcessing}
                        style={{
                          backgroundColor: "#ffc107",
                          color: "#000",
                          border: "none",
                          padding: "15px",
                          fontSize: "1.1rem",
                          fontWeight: "600",
                          borderRadius: "8px",
                          transition: "all 0.3s ease"
                        }}
                      >
                        {isProcessing ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2"></span>
                            Processing...
                          </>
                        ) : (
                          <>
                            <i className="fas fa-credit-card me-2"></i>
                            Pay £{bookingData.totalAmount}
                          </>
                        )}
                      </button>
                      <button 
                        className="btn w-100 btn-cancel" 
                        onClick={releaseReservation} 
                        disabled={isProcessing}
                        style={{
                          backgroundColor: "transparent",
                          color: "#999",
                          border: "1px solid #333",
                          padding: "12px",
                          fontSize: "0.95rem",
                          fontWeight: "500",
                          borderRadius: "8px",
                          transition: "all 0.3s ease"
                        }}
                      >
                        <i className="fas fa-times me-2"></i>
                        Cancel & Release Slots
                      </button>
                    </>
                  )}

                  {/* Security Badge */}
                  <div className="text-center mt-4 pt-3" style={{ borderTop: "1px solid #333" }}>
                    <small style={{ color: "#666" }}>
                      <i className="fas fa-shield-alt me-2" style={{ color: "#4caf50" }}></i>
                      Secured by Stripe Payment Gateway
                    </small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
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

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.1);
            opacity: 0.8;
          }
        }

        .payment-card {
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .payment-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 40px rgba(255, 193, 7, 0.2) !important;
          border: 1px solid rgba(255, 193, 7, 0.4) !important;
        }

        .btn-hover:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(255, 193, 7, 0.3);
        }

        .btn-hover:active:not(:disabled) {
          transform: translateY(0);
        }

        .btn-cancel:hover:not(:disabled) {
          background-color: rgba(255, 193, 7, 0.1) !important;
          border-color: #ffc107 !important;
          color: #ffc107 !important;
        }

        .timer-box {
          box-shadow: 0 10px 30px rgba(255, 193, 7, 0.3);
        }

        .spinner-border {
          border-width: 3px;
        }

        button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
      `}</style>
      <Footer />
    </>
  );
};

export default PaymentPage;