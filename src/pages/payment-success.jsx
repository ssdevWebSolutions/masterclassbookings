import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { useSelector, useDispatch } from 'react-redux';
import { saveBooking } from '../Redux/bookingSlice/bookingSlice';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from '@/Components/Header';
import Footer from '@/Components/Footer';

const PaymentSuccess = () => {
  const router = useRouter();
  const token = useSelector(state => state.auth.loginData?.token);
  const dispatch = useDispatch();
  const hasSaved = useRef(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 100);

    const saveBookingData = async () => {
      try {
        const bookingData = sessionStorage.getItem("cricketBookingData");

        if (bookingData && token && !hasSaved.current) {
          hasSaved.current = true;

          const parsedBooking = JSON.parse(bookingData);

          const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/payments/bookings`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify(parsedBooking),
          });

          if (!res.ok) throw new Error("Failed to save booking");

          const savedBooking = await res.json();
          console.log("Booking saved:", savedBooking);

          dispatch(saveBooking(savedBooking));

          sessionStorage.removeItem("cricketBookingData");
        }
      } catch (err) {
        console.error("Booking error:", err);
      }
    };

    saveBookingData();
  }, [token, dispatch]);

  return (
    <>
    <Header />
      <style jsx>{`
        .payment-container {
          min-height: 100vh;
          background: #000000;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding: 20px;
        }

        .success-card {
          background: linear-gradient(135deg, #1a1a1a 0%, #000000 100%);
          border: 1px solid #333;
          border-radius: 20px;
          padding: 60px 40px;
          max-width: 500px;
          width: 100%;
          box-shadow: 0 20px 60px rgba(255, 215, 0, 0.1);
          opacity: 0;
          transform: translateY(30px);
          transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .success-card.visible {
          opacity: 1;
          transform: translateY(0);
        }

        .icon-wrapper {
          width: 100px;
          height: 100px;
          margin: 0 auto 30px;
          position: relative;
          opacity: 0;
          transform: scale(0) rotate(180deg);
          transition: all 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55);
          transition-delay: 0.3s;
        }

        .success-card.visible .icon-wrapper {
          opacity: 1;
          transform: scale(1) rotate(0deg);
        }

        .icon-circle {
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, #FFD700 0%, #FFC700 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 10px 30px rgba(255, 215, 0, 0.3);
          position: relative;
        }

        .icon-circle::before {
          content: '';
          position: absolute;
          width: 100%;
          height: 100%;
          background: #FFD700;
          border-radius: 50%;
          animation: pulse 2s infinite;
          opacity: 0.3;
        }

        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
            opacity: 0.3;
          }
          50% {
            transform: scale(1.2);
            opacity: 0;
          }
        }

        .checkmark {
          width: 50px;
          height: 50px;
          border: 5px solid #000;
          border-top: none;
          border-right: none;
          transform: rotate(-45deg);
          position: relative;
          z-index: 1;
        }

        .content-wrapper {
          text-align: center;
          opacity: 0;
          transform: translateY(20px);
          transition: all 0.8s ease;
          transition-delay: 0.5s;
        }

        .success-card.visible .content-wrapper {
          opacity: 1;
          transform: translateY(0);
        }

        .success-title {
          color: #FFD700;
          font-size: 32px;
          font-weight: 700;
          margin-bottom: 15px;
        }

        .success-text {
          color: #999;
          font-size: 16px;
          line-height: 1.6;
          margin-bottom: 40px;
        }

        .button-wrapper {
          opacity: 0;
          transform: translateY(20px);
          transition: all 0.8s ease;
          transition-delay: 0.7s;
        }

        .success-card.visible .button-wrapper {
          opacity: 1;
          transform: translateY(0);
        }

        .btn-booking {
          background: #FFD700;
          color: #000;
          font-weight: 600;
          padding: 14px 40px;
          border: none;
          border-radius: 10px;
          font-size: 16px;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(255, 215, 0, 0.2);
          width: 100%;
        }

        .btn-booking:hover {
          background: #FFC700;
          transform: translateY(-2px);
          box-shadow: 0 6px 25px rgba(255, 215, 0, 0.4);
        }

        .btn-booking:active {
          transform: translateY(0);
        }

        .footer-text {
          color: #555;
          font-size: 14px;
          margin-top: 30px;
          opacity: 0;
          transition: opacity 0.8s ease;
          transition-delay: 0.9s;
        }

        .success-card.visible .footer-text {
          opacity: 1;
        }

        .glow-effect {
          position: absolute;
          width: 300px;
          height: 300px;
          background: radial-gradient(circle, rgba(255, 215, 0, 0.1) 0%, transparent 70%);
          border-radius: 50%;
          pointer-events: none;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          z-index: -1;
        }
      `}</style>

      <div className="payment-container">
        <div className={`success-card ${isVisible ? 'visible' : ''}`}>
          <div className="glow-effect"></div>
          
          <div className="icon-wrapper">
            <div className="icon-circle">
              <div className="checkmark"></div>
            </div>
          </div>

          <div className="content-wrapper">
            <h1 className="success-title">Payment Successful!</h1>
            <p className="success-text">
              Your booking has been confirmed. Thank you for your payment.
            </p>
          </div>

          <div className="button-wrapper">
            <button
              className="btn-booking"
              onClick={() => router.push('/bookings')}
            >
              Go to Bookings
            </button>
          </div>

          <p className="footer-text">
            A confirmation email has been sent to your inbox
          </p>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default PaymentSuccess;