const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

/* =========================
   GET CLASS SESSIONS
   ========================= */
export async function fetchClassSessions(classId) {
  const res = await fetch(
    `${API_BASE}/training-classes/${classId}/sessions`
  );

  if (!res.ok) {
    throw new Error("Failed to fetch sessions");
  }

  return res.json();
}

/* =========================
   CREATE BOOKING
   ========================= */
export async function createBooking(payload) {
  const res = await fetch(
    `${API_BASE}/training-class-bookings`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }
  );

  if (!res.ok) {
    throw new Error(await res.text());
  }

  return res.json(); // { bookingId, totalAmount }
}

/* =========================
   STRIPE CHECKOUT
   ========================= */
export async function createCheckoutSession({ bookingId, amount, currency }) {
  if (!bookingId) {
    throw new Error("Booking ID is required");
  }

  const res = await fetch(
    `${API_BASE}/payments/training-classes/${bookingId}/checkout`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount,
        currency,
      }),
    }
  );

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText || "Failed to create checkout session");
  }

  return res.json(); // { url } or { checkoutUrl }
}

export async function getBookingStatus(bookingId) {
    const res = await fetch(
      `${API_BASE}/training-class-bookings/${bookingId}/status`
    );
  
    if (!res.ok) {
      throw new Error("Failed to fetch booking status");
    }
  
    return res.json();
  }

/* =========================
   GET USER BOOKINGS
   ========================= */
export async function getUserBookings(userId) {
  if (!userId) {
    throw new Error("User ID is required");
  }

  const res = await fetch(
    `${API_BASE}/training-class-bookings/user/${userId}`,
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    }
  );

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText || "Failed to fetch user bookings");
  }

  return res.json();
}
  
