"use client";

import {
  Box,
  Typography,
  IconButton,
  Button,
  Stack,
  Alert,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import TimeSlotRow from "./TimeSlotRow";

/* ---------- UTILS ---------- */
const timeToMinutes = (time) => {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
};

const hasOverlap = (slots) => {
  const sorted = [...slots].sort(
    (a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime)
  );

  for (let i = 0; i < sorted.length - 1; i++) {
    if (
      timeToMinutes(sorted[i].endTime) >
      timeToMinutes(sorted[i + 1].startTime)
    ) {
      return true;
    }
  }
  return false;
};

/* ---------- COMPONENT ---------- */
export default function DaySlotEditor({ day, slots, setSlots }) {
  const showOverlapError = hasOverlap(slots);

  /* ADD SLOT */
  const addSlot = () => {
    setSlots([
      ...slots,
      { startTime: "16:00", endTime: "17:00" },
    ]);
  };

  /* UPDATE SLOT */
  const updateSlot = (index, updatedSlot) => {
    const updated = [...slots];
    updated[index] = updatedSlot;
    setSlots(updated);
  };

  /* REMOVE SLOT */
  const removeSlot = (index) => {
    const updated = [...slots];
    updated.splice(index, 1);
    setSlots(updated);
  };

  return (
    <Box
      sx={{
        mb: 3,
        p: 2,
        border: "1px solid rgba(255,193,8,0.25)",
        borderRadius: 2,
        backgroundColor: "background.paper",
      }}
    >
      <Typography fontWeight={600} mb={1}>
        {day}
      </Typography>

      <Stack spacing={1}>
        {slots.map((slot, index) => (
          <Box
            key={index}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <TimeSlotRow
              slot={slot}
              onChange={(updated) =>
                updateSlot(index, updated)
              }
            />

            <IconButton
              color="error"
              size="small"
              onClick={() => removeSlot(index)}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Box>
        ))}
      </Stack>

      {showOverlapError && (
        <Alert severity="error" sx={{ mt: 2 }}>
          Time slots must not overlap
        </Alert>
      )}

      <Button
        startIcon={<AddIcon />}
        variant="outlined"
        size="small"
        sx={{ mt: 2 }}
        onClick={addSlot}
      >
        Add time slot
      </Button>
    </Box>
  );
}
