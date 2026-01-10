"use client";

import { useState } from "react";
import { createTrainingClass } from "../../../../api/trainingclassesapi/trainingClassesApi";

export default function useCreateTrainingClass() {
  const [loading, setLoading] = useState(false);

  /* ---------- VALIDATION ---------- */
  const validate = (data) => {
    if (!data.classId) return "Select a class";
    if (!data.termId) return "Select a term";
    if (!data.venueId) return "Select a venue";
    if (!data.capacity || data.capacity <= 0)
      return "Enter valid capacity";

    if (!data.weeklyPlans || data.weeklyPlans.length === 0)
      return "Select at least one day";

    const hasEmptyDay = data.weeklyPlans.some(
      (plan) => !plan.slots || plan.slots.length === 0
    );
    if (hasEmptyDay)
      return "Each selected day must have at least one time slot";

    if (
      (data.pricingType === "TERM" || data.pricingType === "BOTH") &&
      !data.termPrice
    )
      return "Enter term price";

    if (
      (data.pricingType === "SESSION" || data.pricingType === "BOTH") &&
      !data.sessionPrice
    )
      return "Enter session price";

    return null;
  };

  /* ---------- SUBMIT ---------- */
  const submit = async (form) => {
    const error = validate(form);
    if (error) throw new Error(error);

    setLoading(true);
    try {
      await createTrainingClass(form);
    } finally {
      setLoading(false);
    }
  };

  return { submit, loading };
}
