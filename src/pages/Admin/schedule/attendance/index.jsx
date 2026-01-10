"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  CircularProgress,
  Stack,
} from "@mui/material";

import AdminLayout from "@/pages/admin/AdminLayout";
import { getTerms } from "@/pages/api/attendaceapi/adminAttendanceApi";

export default function AttendanceTermsPage() {
  const router = useRouter();
  const [terms, setTerms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getTerms()
      .then(setTerms)
      .catch(() => setError("Unable to load terms"))
      .finally(() => setLoading(false));
  }, []);

  const goToClasses = (termId) => {
    router.push(`/admin/schedule/attendance/classes?termId=${termId}`);
  };

  return (
    <AdminLayout activeNav="Schedule">
      <Box sx={{ p: { xs: 2, md: 3 } }}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ sm: "center" }}
          gap={2}
          mb={3}
        >
          <Typography variant="h5" fontWeight={700}>
            Attendance • Terms
          </Typography>
        </Stack>

        {loading && (
          <Box textAlign="center" py={5}>
            <CircularProgress sx={{ color: "accent.main" }} />
          </Box>
        )}

        {!loading && error && (
          <Typography color="error" mb={2}>
            {error}
          </Typography>
        )}

        {!loading && !error && terms.length === 0 && (
          <Typography color="text.secondary">
            No terms available yet.
          </Typography>
        )}

        <Stack spacing={2}>
          {terms.map((term) => (
            <Card
              key={term.id}
              sx={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <CardContent
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 2,
                }}
              >
                <Box>
                  <Typography variant="subtitle1" fontWeight={700}>
                    {term.termName || "Term"}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {term.startWeek} – {term.endWeek}
                  </Typography>
                </Box>

                <Button
                  variant="contained"
                  onClick={() => goToClasses(term.id)}
                >
                  View Classes
                </Button>
              </CardContent>
            </Card>
          ))}
        </Stack>
      </Box>
    </AdminLayout>
  );
}

