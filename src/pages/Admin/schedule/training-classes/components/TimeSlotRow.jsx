"use client";

import { Box, Select, MenuItem, Typography } from "@mui/material";

/* ---------- CONSTANTS ---------- */
const HOURS = Array.from({ length: 24 }, (_, i) =>
  i.toString().padStart(2, "0")
);

const MINUTES = ["00", "15", "30", "45"];

/* ---------- HELPERS ---------- */
const toMinutes = (time) => {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
};

/* ---------- COMPONENT ---------- */
export default function TimeSlotRow({ slot, onChange }) {
  const [startHour, startMinute] = slot.startTime.split(":");
  const [endHour, endMinute] = slot.endTime.split(":");

  const updateStart = (h, m) => {
    const newStart = `${h}:${m}`;
    if (toMinutes(newStart) >= toMinutes(slot.endTime)) return;
    onChange({ ...slot, startTime: newStart });
  };

  const updateEnd = (h, m) => {
    const newEnd = `${h}:${m}`;
    if (toMinutes(newEnd) <= toMinutes(slot.startTime)) return;
    onChange({ ...slot, endTime: newEnd });
  };

  return (
    <Box
      sx={{
        display: "flex",
        gap: 1,
        alignItems: "center",
        flexWrap: "wrap",
      }}
    >
      {/* START TIME */}
      <Select
        size="small"
        value={startHour}
        onChange={(e) =>
          updateStart(e.target.value, startMinute)
        }
      >
        {HOURS.map((h) => (
          <MenuItem key={h} value={h}>
            {h}
          </MenuItem>
        ))}
      </Select>

      <Select
        size="small"
        value={startMinute}
        onChange={(e) =>
          updateStart(startHour, e.target.value)
        }
      >
        {MINUTES.map((m) => (
          <MenuItem key={m} value={m}>
            {m}
          </MenuItem>
        ))}
      </Select>

      <Typography>to</Typography>

      {/* END TIME */}
      <Select
        size="small"
        value={endHour}
        onChange={(e) =>
          updateEnd(e.target.value, endMinute)
        }
      >
        {HOURS.map((h) => (
          <MenuItem key={h} value={h}>
            {h}
          </MenuItem>
        ))}
      </Select>

      <Select
        size="small"
        value={endMinute}
        onChange={(e) =>
          updateEnd(endHour, e.target.value)
        }
      >
        {MINUTES.map((m) => (
          <MenuItem key={m} value={m}>
            {m}
          </MenuItem>
        ))}
      </Select>
    </Box>
  );
}
