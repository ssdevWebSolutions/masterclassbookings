import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import 'bootstrap/dist/css/bootstrap.min.css';

const PaymentPage = () => {
  const [bookingData, setBookingData] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [reservationData, setReservationData] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [initializing, setInitializing] = useState(true); // ADDED
  const valueToken = useSelector(state => state.auth.loginData.token);

  


  useEffect(() => {
    const savedBookingData = sessionStorage.getItem('cricketBookingData');
    if (savedBookingData) {
      setBookingData(JSON.parse(savedBookingData));
    } else {
      window.location.href = '/';
      return; // stop further init if redirecting
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

    setInitializing(false); // ADDED
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

  // Loader until initialized to prevent 00:00 flash
  if (initializing || !bookingData) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
        <div className="spinner-border" role="status" aria-live="polite" aria-label="Loading" />
      </div>
    );
  }

 

  return (
    <div className="min-vh-100 bg-light d-flex align-items-center justify-content-center py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5">
            <div className="card shadow-sm border-0">
              <div className="card-body p-5">
                <h2 className="text-center mb-3">{reservationData ? 'Complete Payment' : 'Reserve Slots'}</h2>
                {reservationData && <p className="text-center text-success">Time remaining: {formatTime(timeRemaining)}</p>}

                {!reservationData ? (
                  <button className="btn btn-warning w-100" onClick={reserveSlots} disabled={isProcessing}>
                    {isProcessing ? 'Reserving...' : 'Reserve Slots'}
                  </button>
                ) : (
                  <>
                    <button className="btn btn-primary w-100 mb-2" onClick={handlePaymentWithReservation} disabled={isProcessing}>
                      {isProcessing ? 'Processing...' : `Pay £${bookingData.totalAmount}`}
                    </button>
                    <button className="btn btn-outline-secondary w-100" onClick={releaseReservation} disabled={isProcessing}>
                      Cancel & Release Slots
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
