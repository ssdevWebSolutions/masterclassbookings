"use client";

import { Box, Typography, IconButton, Divider, Chip } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useRouter } from "next/router";
import dayjs from "dayjs";

export default function TermCard({ term, onDelete }) {
  const router = useRouter();

  return (
    <Box
      sx={{
        border: "1px solid rgba(255,193,8,0.25)",
        borderRadius: 2,
        p: 2,
        backgroundColor: "background.paper",
      }}
    >
      {/* TERM NAME */}
      <Typography variant="h6" sx={{ fontSize: "1rem" }}>
        {term.termName}
      </Typography>

      {/* DATE RANGE */}
      <Typography variant="body2" sx={{ mt: 1 }}>
        {dayjs(term.startWeek).format("DD MMM YYYY")} –{" "}
        {dayjs(term.endWeek).format("DD MMM YYYY")}
      </Typography>

      {/* HOLIDAYS */}
      {term.holidays?.length > 0 && (
        <Box sx={{ mt: 1, display: "flex", gap: 0.5, flexWrap: "wrap" }}>
          {term.holidays.map((date) => (
            <Chip
              key={date}
              size="small"
              label={dayjs(date).format("DD MMM")}
              color="warning"
            />
          ))}
        </Box>
      )}

      <Divider sx={{ my: 2, opacity: 0.1 }} />

      {/* ACTIONS */}
      <Box sx={{ display: "flex", gap: 1 }}>
        <IconButton
          color="primary"
          size="small"
          onClick={() =>
            router.push(`/admin/schedule/term/${term.id}/edit`)
          }
        >
          <EditIcon fontSize="small" />
        </IconButton>

        <IconButton
          color="error"
          size="small"
          onClick={() => onDelete(term.id)}
        >
          <DeleteIcon fontSize="small" />
        </IconButton>
      </Box>
    </Box>
  );
}
