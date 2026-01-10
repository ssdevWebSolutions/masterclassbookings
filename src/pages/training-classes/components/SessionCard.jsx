import { Box, Typography, Checkbox } from "@mui/material";
import dayjs from "dayjs";

export default function SessionCard({
  session,
  selected,
  onToggle,
  capacity,
}) {
  const isFull = session.bookedCount >= capacity;

  return (
    <Box
      sx={{
        p: 2,
        borderRadius: 2,
        border: "1px solid",
        borderColor: selected ? "primary.main" : "divider",
        opacity: isFull ? 0.5 : 1,
        cursor: isFull ? "not-allowed" : "pointer",
      }}
      onClick={() => !isFull && onToggle(session.id)}
    >
      <Box display="flex" justifyContent="space-between">
        <Box>
          <Typography fontWeight={600}>
            {dayjs(session.sessionDate).format("dddd, DD MMM")}
          </Typography>
          <Typography fontSize={14}>
            {session.startTime} – {session.endTime}
          </Typography>
          <Typography fontSize={12} color="text.secondary">
            {session.bookedCount}/{capacity} booked
          </Typography>
        </Box>

        <Checkbox checked={selected} disabled={isFull} />
      </Box>
    </Box>
  );
}
