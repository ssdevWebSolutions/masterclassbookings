"use client";
import { useEffect, useState } from "react";

const PaymentSuccess = () => {
  const [sessionData, setSessionData] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get("session_id");

    if (sessionId) {
      fetch(`http://localhost:8080/api/auth/payments/checkout-session/${sessionId}`)
        .then(res => res.json())
        .then(data => setSessionData(data))
        .catch(err => console.error(err));
    }
  }, []);

  if (!sessionData) return <div>Loading payment details...</div>;

  return (
    <div className="container py-5">
      <h2 className="text-success">Payment Successful!</h2>
      <p>Booking ID: {sessionData.bookingId}</p>
      <p>Amount Paid: £{sessionData.amount / 100}</p>
    </div>
  );
};

export default PaymentSuccess;
