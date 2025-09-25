import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import 'bootstrap/dist/css/bootstrap.min.css';

const PaymentPage = () => {
  const [bookingData, setBookingData] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const valueToken = useSelector(state => state.auth.loginData.token);

  useEffect(() => {
    const savedBookingData = sessionStorage.getItem('cricketBookingData');
    if (savedBookingData) setBookingData(JSON.parse(savedBookingData));
    else window.location.href = '/class1';
  }, []);

  const handlePayment = async () => {
    if (!bookingData) return;

    setIsProcessing(true);

    try {
      const response = await fetch(
        'http://localhost:8080/api/auth/payments/create-checkout-session',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${valueToken}`,
          },
          body: JSON.stringify({
            bookingId: bookingData.id,
            amount: bookingData.totalAmount * 100, // Stripe expects cents
            currency: 'GBP',
          }),
        }
      );

      const data = await response.json(); // ✅ parse JSON correctly

      if (data.url) {
        window.location.href = data.url; // redirect to Stripe Checkout
      } else {
        console.error('Stripe response:', data);
        alert('Failed to initiate payment');
      }
    } catch (error) {
      console.error('Payment failed:', error);
      alert('Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!bookingData) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="text-muted">Loading payment details...</p>
        </div>
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
                {/* Header */}
                <div className="text-center mb-4">
                  <div className="bg-primary bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{width: '64px', height: '64px'}}>
                    <svg width="24" height="24" fill="currentColor" className="text-primary" viewBox="0 0 16 16">
                      <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                      <path d="M8 13A5 5 0 1 1 8 3a5 5 0 0 1 0 10zm0 1A6 6 0 1 0 8 2a6 6 0 0 0 0 12z"/>
                    </svg>
                  </div>
                  <h2 className="h4 fw-bold text-dark mb-2">Complete Your Payment</h2>
                  <p className="text-muted mb-0">Secure checkout powered by Stripe</p>
                </div>

                {/* Payment Summary */}
                <div className="bg-light rounded p-4 mb-4">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="text-muted">Cricket Booking</span>
                    <span className="text-dark fw-medium">#{bookingData.id}</span>
                  </div>
                  <hr className="my-3"/>
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="h5 fw-bold text-dark mb-0">Total Amount</span>
                    <span className="h4 fw-bold text-primary mb-0">£{bookingData.totalAmount}</span>
                  </div>
                </div>

                {/* Payment Button */}
                <button 
                  onClick={handlePayment} 
                  disabled={isProcessing}
                  className="btn btn-primary btn-lg w-100 fw-semibold py-3 mb-3"
                  style={{
                    background: isProcessing ? 'linear-gradient(45deg, #6c757d, #5a6268)' : 'linear-gradient(45deg, #0d6efd, #0b5ed7)',
                    border: 'none',
                    borderRadius: '8px',
                    transition: 'all 0.3s ease'
                  }}
                >
                  {isProcessing ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                      Processing Payment...
                    </>
                  ) : (
                    <>
                      <svg width="16" height="16" fill="currentColor" className="me-2" viewBox="0 0 16 16">
                        <path d="M12.5 16a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Zm.5-5v1h1a.5.5 0 0 1 0 1h-1v1a.5.5 0 0 1-1 0v-1h-1a.5.5 0 0 1 0-1h1v-1a.5.5 0 0 1 1 0Z"/>
                        <path d="M1 5.5a.5.5 0 0 1 .5-.5h4.396a1.5 1.5 0 0 1 0 3H1.5a.5.5 0 0 1-.5-.5V5.5Z"/>
                        <path d="M1 11.5a.5.5 0 0 1 .5-.5h4.396a1.5 1.5 0 0 1 0 3H1.5a.5.5 0 0 1-.5-.5v-1Z"/>
                      </svg>
                      Pay £{bookingData.totalAmount}
                    </>
                  )}
                </button>

                {/* Security Info */}
                <div className="text-center">
                  <small className="text-muted d-flex align-items-center justify-content-center">
                    <svg width="12" height="12" fill="currentColor" className="me-1" viewBox="0 0 16 16">
                      <path d="M5.338 1.59a61.44 61.44 0 0 0-2.837.856.481.481 0 0 0-.328.39c-.554 4.157.726 7.19 2.253 9.188a10.725 10.725 0 0 0 2.287 2.233c.346.244.652.42.893.533.12.057.218.095.293.118a.55.55 0 0 0 .101.025.615.615 0 0 0 .1-.025c.076-.023.174-.061.294-.118.24-.113.547-.29.893-.533a10.726 10.726 0 0 0 2.287-2.233c1.527-1.997 2.807-5.031 2.253-9.188a.48.48 0 0 0-.328-.39c-.651-.213-1.75-.56-2.837-.855C9.552 1.29 8.531 1.067 8 1.067c-.53 0-1.552.223-2.662.524zM5.072.56C6.157.265 7.31 0 8 0s1.843.265 2.928.56c1.11.3 2.229.655 2.887.87a1.54 1.54 0 0 1 1.044 1.262c.596 4.477-.787 7.795-2.465 9.99a11.775 11.775 0 0 1-2.517 2.453 7.159 7.159 0 0 1-1.048.625c-.28.132-.581.24-.829.24s-.548-.108-.829-.24a7.158 7.158 0 0 1-1.048-.625 11.777 11.777 0 0 1-2.517-2.453C1.928 10.487.545 7.169 1.141 2.692A1.54 1.54 0 0 1 2.185 1.43 62.456 62.456 0 0 1 5.072.56z"/>
                    </svg>
                    Your payment is secured with 256-bit SSL encryption
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;