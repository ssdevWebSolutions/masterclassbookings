"use client";

import { Box, Typography, Chip, Divider, Button } from "@mui/material";
import { useRouter } from "next/router";
import dayjs from "dayjs";
import AdminLayout from "../../../../adminlayouts/AdminLayout";
import useTerms from "../hooks/useTerms";
import { getTermStatus } from "../../../../../../utils/termStatus";


export default function TermViewPage() {
  const router = useRouter();
  const { id } = router.query;
  const { getTermById } = useTerms();

  const term = getTermById(id);
  if (!term) return null;

  const status = getTermStatus(term.startWeek, term.endWeek);

  return (
    <AdminLayout activeNav="Terms">
      <Box sx={{ maxWidth: 700, mx: "auto", p: 2 }}>
        <Typography variant="h4" fontWeight={700}>
          {term.termName}
        </Typography>

        <Chip
          label={status}
          color={
            status === "Active"
              ? "success"
              : status === "Future"
              ? "warning"
              : "default"
          }
          sx={{ mt: 1 }}
        />

        <Divider sx={{ my: 3 }} />

        <Typography>
          <strong>Start:</strong>{" "}
          {dayjs(term.startWeek).format("DD MMM YYYY")}
        </Typography>

        <Typography>
          <strong>End:</strong>{" "}
          {dayjs(term.endWeek).format("DD MMM YYYY")}
        </Typography>

        <Divider sx={{ my: 3 }} />

        <Typography fontWeight={600}>Holidays</Typography>

        {term.holidays.length === 0 && (
          <Typography color="text.secondary">
            No holidays configured
          </Typography>
        )}

        {term.holidays.map((d) => (
          <Chip
            key={d}
            label={dayjs(d).format("DD MMM YYYY")}
            sx={{ mr: 1, mt: 1 }}
          />
        ))}

        <Divider sx={{ my: 4 }} />

        <Button
          variant="contained"
          onClick={() =>
            router.push(`/admin/schedule/term/${id}/edit`)
          }
        >
          Edit Term
        </Button>
      </Box>
    </AdminLayout>
  );
}
