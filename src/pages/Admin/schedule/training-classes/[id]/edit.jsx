"use client";

import { useEffect, useState, useMemo } from "react";
import { Box, Typography, Button, Divider } from "@mui/material";
import { useRouter } from "next/router";


import WeeklyPlanSection from "../components/WeeklyPlanSection";
import useUpdateTrainingSchedule from "../hooks/useUpdateTrainingSchedule";
import { fetchTrainingClassById } from "../../../../api/trainingclassesapi/trainingClassesApi";
import AdminLayout from "@/pages/admin/AdminLayout";

export default function EditTrainingClassSchedule() {
  const router = useRouter();
  const { id } = router.query;

  const { submit, loading } = useUpdateTrainingSchedule();

  const [weeklyPlan, setWeeklyPlan] = useState({});
  const [className, setClassName] = useState("");

  /* ---------- LOAD CLASS ---------- */
  useEffect(() => {
    if (!id) return;

    fetchTrainingClassById(id).then((data) => {
      setClassName(data.className);

      /**
       * IMPORTANT FIX:
       * Merge duplicate dayOfWeek entries safely
       */
      const plan = {};

      data.weeklyPlans.forEach((p) => {
        if (!plan[p.dayOfWeek]) {
          plan[p.dayOfWeek] = [];
        }

        if (p.slots && p.slots.length > 0) {
          plan[p.dayOfWeek] = [
            ...plan[p.dayOfWeek],
            ...p.slots,
          ];
        }
      });

      setWeeklyPlan(plan);
    });
  }, [id]);

  /* ---------- BUILD PAYLOAD ---------- */
  const payload = useMemo(
    () =>
      Object.entries(weeklyPlan).map(([dayOfWeek, slots]) => ({
        dayOfWeek,
        slots,
      })),
    [weeklyPlan]
  );

  /* ---------- SAVE ---------- */
  const handleSave = async () => {
    await submit(id, payload);
    router.push("/admin/schedule/training-classes");
  };

  return (
    <AdminLayout activeNav="TrainingClasses">
      <Box sx={{ maxWidth: 900, mx: "auto", p: { xs: 2, md: 3 } }}>
        <Typography variant="h4" fontWeight={700} mb={1}>
          Update Schedule
        </Typography>

        <Typography color="text.secondary" mb={3}>
          {className}
        </Typography>

        <WeeklyPlanSection
          weeklyPlan={weeklyPlan}
          setWeeklyPlan={setWeeklyPlan}
        />

        <Divider sx={{ my: 4 }} />

        <Box display="flex" justifyContent="flex-end" gap={2}>
          <Button
            variant="outlined"
            onClick={() => router.back()}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={handleSave}
            disabled={loading}
          >
            Save changes
          </Button>
        </Box>
      </Box>
    </AdminLayout>
  );
}
