/**
 * Booking Service
 * Single Responsibility: Handle booking creation and checkout
 */

import { createBooking, createCheckoutSession } from "../../api/bookingapi/bookingApi";

/**
 * Process booking and redirect to checkout
 * @param {Object} bookingData - Booking data {userId, kidId, trainingClassId, sessionIds}
 * @param {number} finalPrice - Final price for the booking
 * @param {string|number} classId - Training class ID
 * @returns {Promise<void>}
 */
const processBooking = async (bookingData, finalPrice, classId) => {
  try {
    // Create booking
    const booking = await createBooking({
      userId: bookingData.userId,
      kidId: Number(bookingData.kidId),
      trainingClassId: Number(bookingData.trainingClassId),
      sessionIds: bookingData.sessionIds,
      consent:bookingData.consent
    });

    const bookingId = booking?.id || booking?.bookingId || booking?.data?.id || booking?.data?.bookingId;
    // const totalAmount = booking?.totalAmount || booking?.amount || booking?.data?.totalAmount || booking?.data?.amount || finalPrice;
    const totalAmount = finalPrice;
    console.log(totalAmount,"price");
    if (!bookingId) {
      throw new Error("Booking ID not found in response.");
    }

    // Create checkout session
    const stripe = await createCheckoutSession({
      bookingId: bookingId,
      amount: totalAmount,
      currency: "gbp",
    });

    const checkoutUrl = stripe?.url || stripe?.checkoutUrl || stripe?.checkout_url || stripe?.data?.url;

    if (!checkoutUrl) {
      throw new Error("Checkout URL not found in response.");
    }

    // Store booking ID for redirect after payment
    sessionStorage.setItem("pendingBookingId", bookingId);
    sessionStorage.setItem("pendingClassId", classId);
    
    // Redirect to checkout
    window.location.href = checkoutUrl;
  } catch (error) {
    console.error("❌ Booking error:", error);
    throw error;
  }
};

export default  processBooking;
