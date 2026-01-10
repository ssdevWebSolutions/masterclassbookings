"use client";

import { useState } from "react";
import { updateTrainingSchedule } from "../../../../api/trainingclassesapi/trainingClassesApi";

export default function useUpdateTrainingSchedule() {
  const [loading, setLoading] = useState(false);

  const submit = async (id, weeklyPlans) => {
    if (!weeklyPlans.length)
      throw new Error("Select at least one day");

    setLoading(true);
    try {
      await updateTrainingSchedule(id, { weeklyPlans });
    } finally {
      setLoading(false);
    }
  };

  return { submit, loading };
}
