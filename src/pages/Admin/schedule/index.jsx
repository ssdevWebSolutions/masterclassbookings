"use client";

import { useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Chip,
  CircularProgress,
  Divider,
  Stack,
} from "@mui/material";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";

import AdminLayout from "@/pages/admin/AdminLayout";
import { fetchTrainingClasses } from "@/Redux/trainingClassesSlice/trainingClassesSlice";

/* ---------- HELPERS ---------- */
const formatTime = (t) =>
  t?.slice(0, 5); // "16:00:00" → "16:00"

const formatSlots = (slots = []) =>
  slots.map(
    (s) => `${formatTime(s.startTime)} – ${formatTime(s.endTime)}`
  ).join(", ");

export default function TrainingClassesIndexPage() {
  const router = useRouter();
  const dispatch = useDispatch();

  const { items: classes = [], loading } = useSelector(
    (state) => state.trainingClasses
  );

  useEffect(() => {
    dispatch(fetchTrainingClasses());
  }, [dispatch]);

  if (loading) {
    return (
      <AdminLayout activeNav="TrainingClasses">
        <Box p={4} textAlign="center">
          <CircularProgress />
        </Box>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout activeNav="TrainingClasses">
      <Box sx={{ p: { xs: 2, md: 3 } }}>
        {/* HEADER */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ sm: "center" }}
          gap={2}
          mb={3}
        >
          <Typography variant="h4" fontWeight={700}>
            Training Classes
          </Typography>

          <Button
            variant="contained"
            onClick={() =>
              router.push("/admin/schedule/training-classes/create")
            }
          >
            Schedule a Class
          </Button>
        </Stack>

        {/* EMPTY */}
        {classes.length === 0 && (
          <Typography color="text.secondary">
            No training classes created yet.
          </Typography>
        )}

        {/* DESKTOP TABLE */}
        <Box
          sx={{
            display: { xs: "none", md: "block" },
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 2,
            overflow: "hidden",
          }}
        >
          {/* HEADER ROW */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns:
                "80px 180px 220px 1fr 120px 160px",
              p: 2,
              background: "rgba(255,255,255,0.04)",
              fontWeight: 600,
              fontSize: 14,
            }}
          >
            <div>Day</div>
            <div>Time</div>
            <div>Venue</div>
            <div>Class</div>
            <div>Status</div>
            <div />
          </Box>

          {classes.map((item) => {
            const plan = item.weeklyPlans?.[0];

            return (
              <Box
                key={item.id}
                sx={{
                  display: "grid",
                  gridTemplateColumns:
                    "80px 180px 220px 1fr 120px 160px",
                  p: 2,
                  borderTop: "1px solid rgba(255,255,255,0.06)",
                  alignItems: "center",
                }}
              >
                <Typography fontSize={14}>
                  {plan?.dayOfWeek?.slice(0, 3)}
                </Typography>

                <Typography fontSize={14}>
                  {formatSlots(plan?.slots)}
                </Typography>

                <Typography fontSize={14}>
                  {item.venueName}
                </Typography>

                <Typography fontSize={14} fontWeight={500}>
                  {item.className}
                </Typography>

                <Chip
                  size="small"
                  label="Active"
                  color="success"
                />

                <Button
                  size="small"
                  variant="outlined"
                  onClick={() =>
                    router.push(
                      `/admin/schedule/training-classes/${item.id}/edit`
                    )
                  }
                >
                  Edit
                </Button>
              </Box>
            );
          })}
        </Box>

        {/* MOBILE CARDS */}
        <Stack
          spacing={2}
          sx={{ display: { xs: "flex", md: "none" } }}
        >
          {classes.map((item) => {
            const plan = item.weeklyPlans?.[0];

            return (
              <Box
                key={item.id}
                sx={{
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 2,
                  p: 2,
                }}
              >
                <Typography fontWeight={600}>
                  {item.className}
                </Typography>

                <Typography fontSize={13} color="text.secondary">
                  {item.venueName}
                </Typography>

                <Divider sx={{ my: 1.5 }} />

                <Typography fontSize={13}>
                  <b>Day:</b> {plan?.dayOfWeek}
                </Typography>

                <Typography fontSize={13}>
                  <b>Time:</b> {formatSlots(plan?.slots)}
                </Typography>

                <Box mt={1}>
                  <Chip
                    size="small"
                    label="Active"
                    color="success"
                  />
                </Box>

                <Button
                  fullWidth
                  sx={{ mt: 2 }}
                  variant="outlined"
                  onClick={() =>
                    router.push(
                      `/admin/schedule/training-classes/${item.id}/edit`
                    )
                  }
                >
                  Edit Schedule
                </Button>
              </Box>
            );
          })}
        </Stack>
      </Box>
    </AdminLayout>
  );
}
