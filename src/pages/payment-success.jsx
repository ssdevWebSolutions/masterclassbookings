import React, { useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { useSelector, useDispatch } from 'react-redux';
import { saveBooking } from '../Redux/bookingSlice/bookingSlice'; // your booking slice action
import 'bootstrap/dist/css/bootstrap.min.css';

const PaymentSuccess = () => {
  const router = useRouter();
  const token = useSelector(state => state.auth.loginData?.token);
  const dispatch = useDispatch();
  const hasSaved = useRef(false);

  useEffect(() => {
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

          const savedBooking = await res.json(); // 🎯 use JSON to get BookingResponseDto
          console.log("Booking saved:", savedBooking);

          // ✅ Dispatch to Redux store
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
    <div className="min-vh-100 d-flex flex-column justify-content-center align-items-center">
      <h1 className="text-success">Payment Successful!</h1>
      <p>Your booking has been confirmed. Thank you for your payment.</p>
      <button
        className="btn btn-primary mt-3"
        onClick={() => router.push('/class1')}
      >
        Go to Dashboard
      </button>
    </div>
  );
};

export default PaymentSuccess;
