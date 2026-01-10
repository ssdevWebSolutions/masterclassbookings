"use client";

import {
  Box,
  Typography,
  Checkbox,
  FormControlLabel,
  Grid,
  Divider,
} from "@mui/material";
import { useMemo } from "react";
import DaySlotEditor from "./DaySlotEditor";

/* ---------- WEEK DAYS ---------- */
const WEEK_DAYS = [
  { key: "MONDAY", label: "Monday" },
  { key: "TUESDAY", label: "Tuesday" },
  { key: "WEDNESDAY", label: "Wednesday" },
  { key: "THURSDAY", label: "Thursday" },
  { key: "FRIDAY", label: "Friday" },
  { key: "SATURDAY", label: "Saturday" },
  { key: "SUNDAY", label: "Sunday" },
];

/**
 * weeklyPlan shape:
 * {
 *   MONDAY: [{ startTime, endTime }],
 *   WEDNESDAY: [...]
 * }
 */
export default function WeeklyPlanSection({
  weeklyPlan = {},          // ✅ default value
  setWeeklyPlan,
}) {
  /* ---------- SELECTED DAYS ---------- */
  const selectedDays = useMemo(
    () => Object.keys(weeklyPlan),
    [weeklyPlan]
  );

  /* ---------- TOGGLE DAY ---------- */
  const toggleDay = (day) => {
    setWeeklyPlan((prev = {}) => {
      if (prev[day]) {
        const copy = { ...prev };
        delete copy[day];
        return copy;
      }

      return {
        ...prev,
        [day]: [],
      };
    });
  };

  /* ---------- UPDATE SLOTS ---------- */
  const updateSlotsForDay = (day, slots) => {
    setWeeklyPlan((prev = {}) => ({
      ...prev,
      [day]: slots,
    }));
  };

  return (
    <Box>
      <Typography variant="h6" fontWeight={600} mb={2}>
        Weekly plan
      </Typography>

      <Typography variant="body2" color="text.secondary" mb={2}>
        Select days and define one or more session time slots per day.
      </Typography>

      {/* DAY CHECKBOXES */}
      <Grid container spacing={1} mb={3}>
        {WEEK_DAYS.map((day) => (
          <Grid item xs={6} sm={4} md={3} key={day.key}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={Boolean(weeklyPlan[day.key])}  
                  onChange={() => toggleDay(day.key)}
                />
              }
              label={day.label}
            />
          </Grid>
        ))}
      </Grid>

      <Divider sx={{ mb: 3 }} />

      {/* EMPTY STATE */}
      {selectedDays.length === 0 && (
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ textAlign: "center", py: 3 }}
        >
          Select at least one day to add time slots
        </Typography>
      )}

      {/* SLOT EDITORS */}
      {selectedDays.map((day) => (
        <DaySlotEditor
          key={day}
          day={day}
          slots={weeklyPlan[day]}
          setSlots={(slots) => updateSlotsForDay(day, slots)}
        />
      ))}
    </Box>
  );
}
