'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { XCircle, Home, Calendar } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useDispatch } from 'react-redux';
import { getLoginUserData } from '@/Redux/Authentication/AuthenticationSlice';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useRouter } from 'next/router';

export default function BookingCancelled() {
  const searchParams = useSearchParams();
  const [isCancelled, setIsCancelled] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const cancelled = searchParams.get('cancelled');
    setIsCancelled(cancelled === 'true');
    dispatch(getLoginUserData({}));
  }, [searchParams]);

  if (!isCancelled) {
    return null;
  }
  const router = useRouter();

  const handleHome=()=>{
    router.push("/");
  }

  return (
    <>
      <style jsx>{`
        .booking-cancelled-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #f9fafb 0%, #e5e7eb 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
        }

        .booking-cancelled-card {
          max-width: 28rem;
          width: 100%;
          background: white;
          border-radius: 1rem;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
          padding: 2rem;
        }

        .content-wrapper {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }

        .icon-circle {
          width: 5rem;
          height: 5rem;
          background-color: #fee2e2;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1.5rem;
        }

        .cancel-icon {
          width: 3rem;
          height: 3rem;
          color: #dc2626;
        }

        .title {
          font-size: 1.875rem;
          font-weight: bold;
          color: #111827;
          margin-bottom: 0.75rem;
        }

        .message {
          color: #4b5563;
          margin-bottom: 2rem;
          line-height: 1.625;
        }

        .info-box {
          width: 100%;
          background-color: #dbeafe;
          border: 1px solid #bfdbfe;
          border-radius: 0.5rem;
          padding: 1rem;
          margin-bottom: 2rem;
        }

        .info-text {
          font-size: 0.875rem;
          color: #1e40af;
          margin: 0;
        }

        .button-group {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          width: 100%;
        }

        .btn-primary,
        .btn-secondary {
          flex: 1;
          font-weight: 600;
          padding: 0.75rem 1.5rem;
          border-radius: 0.5rem;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          transition: all 0.2s ease;
        }

        .btn-primary {
          background-color: #2563eb;
          color: white;
        }

        .btn-primary:hover {
          background-color: #1d4ed8;
        }

        .btn-secondary {
          background-color: #e5e7eb;
          color: #1f2937;
        }

        .btn-secondary:hover {
          background-color: #d1d5db;
        }

        .btn-icon {
          width: 1.25rem;
          height: 1.25rem;
        }

        .support-text {
          font-size: 0.875rem;
          color: #6b7280;
          margin-top: 1.5rem;
          margin-bottom: 0;
        }

        .support-link {
          color: #2563eb;
          font-weight: 500;
          text-decoration: none;
        }

        .support-link:hover {
          color: #1d4ed8;
          text-decoration: underline;
        }

        @media (min-width: 640px) {
          .button-group {
            flex-direction: row;
          }
        }
      `}</style>

      <Header />
      <div className="booking-cancelled-container">
        <div className="booking-cancelled-card">
          <div className="content-wrapper">
            {/* Icon */}
            <div className="icon-circle">
              <XCircle className="cancel-icon" />
            </div>

            {/* Title */}
            <h1 className="title">Booking Cancelled</h1>

            {/* Message */}
            <p className="message">
              Your booking has been successfully cancelled. 
            </p>

            {/* Info Box */}
            {/* <div className="info-box">
              <p className="info-text">
                If you were charged, the refund will be processed within 5-7 business days according to our cancellation policy.
              </p>
            </div> */}

            {/* Action Buttons */}
            <div className="button-group">
              <button className="btn-primary" onClick={handleHome}>
                <Home className="btn-icon" />
                Go to Home
              </button>
              {/* <button className="btn-secondary">
                <Calendar className="btn-icon" />
                New Booking
              </button> */}
            </div>

            {/* Support Link */}
            <p className="support-text">
              Need help?{' '}
              <a href="" className="support-link">
                Contact admin@masterclasscricket.co.uk
              </a>
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}