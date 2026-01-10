import { useState, useMemo } from "react";

// const CAPACITY = 36;

const getAvailabilityStatus = (bookedCount,CAPACITY) => {
  const count = Number(bookedCount) || 0;
  if (count >= CAPACITY) return "not-available";
  if (count >= CAPACITY * 0.8) return "filling-fast";
  return "available";
};

const useSessionSelection = (sessions = [], trainingClass = null) => {
  const [selected, setSelected] = useState([]);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState(null);

  /* ------------------ SAFETY DEFAULTS ------------------ */
  const discounts = trainingClass?.discounts ?? [];
  const sessionPrice = trainingClass?.sessionPrice ?? 0;

  /* ------------------ SESSION TOGGLE ------------------ */
  const toggleSession = (id, bookedCount) => {
    if (getAvailabilityStatus(bookedCount,trainingClass.capacity) === "not-available") return;

    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const toggleAllSessionsInSlot = (slotSessions) => {
    const availableIds = slotSessions
      .filter(s => getAvailabilityStatus(s.bookedCount,trainingClass.capacity) !== "not-available")
      .map(s => s.id);

    const allSelected = availableIds.every(id => selected.includes(id));

    setSelected(prev =>
      allSelected
        ? prev.filter(id => !availableIds.includes(id))
        : [...new Set([...prev, ...availableIds])]
    );
  };

  /* ------------------ GROUPED SESSIONS ------------------ */
  const groupedSessions = useMemo(() => {
    const groups = {};

    sessions.forEach((session) => {
      const date = new Date(session.date || session.sessionDate);
      if (isNaN(date)) return;

      const dayName = date.toLocaleDateString("en-GB", { weekday: "long" });
      const startTime = session.startTime || "";
      const endTime = session.endTime || "";
      const slotKey = `${dayName}-${startTime}-${endTime}`;

      if (!groups[slotKey]) {
        groups[slotKey] = {
          dayName,
          timeSlot: `${startTime} - ${endTime}`,
          startTime,
          endTime,
          sessions: [],
        };
      }

      groups[slotKey].sessions.push({
        ...session,
        date,
        dateStr: date.toLocaleDateString("en-GB", {
          day: "numeric",
          month: "long",
        }),
      });
    });

    return Object.values(groups);
  }, [sessions]);

  /* ------------------ COUPON APPLY ------------------ */
  const handleApplyCoupon = (couponCode) => {
    if (!couponCode) {
      setCouponError("Please enter a coupon code");
      return false;
    }

    const normalized = couponCode.trim().toUpperCase();

    const discount = discounts.find(
      d => d.couponCode?.toUpperCase() === normalized
    );

    if (!discount) {
      setCouponError("Invalid coupon code");
      return false;
    }

    if (!discount.active || !discount.isRunning) {
      setCouponError("This coupon is not active");
      return false;
    }

    if (discount.blockedForUsers) {
      setCouponError("This coupon is not available for you");
      return false;
    }

    if (selected.length !== discount.requiredSessions) {
      setCouponError(
        `Coupon valid only for ${discount.requiredSessions} sessions`
      );
      return false;
    }

    setAppliedCoupon(discount);
    setCouponError(null);
    return true;
  };

  /* ------------------ PRICING ------------------ */
  const selectedCount = selected.length;
  const regularPrice = selectedCount * sessionPrice;

  const finalPrice = appliedCoupon
    ? appliedCoupon.discountedPrice
    : regularPrice;

  const discountAmount = appliedCoupon
    ? regularPrice - appliedCoupon.discountedPrice
    : 0;

  const pricing = {
    selectedCount,
    regularPrice,
    discountAmount,
    finalPrice,
    isFullBlock: !!appliedCoupon,
  };

  return {
    selected,
    setSelected,
    toggleSession,
    toggleAllSessionsInSlot,
    groupedSessions,
    pricing,
    getAvailabilityStatus,
    handleApplyCoupon,
    appliedCoupon,
    couponError,
  };
};

export { useSessionSelection };
