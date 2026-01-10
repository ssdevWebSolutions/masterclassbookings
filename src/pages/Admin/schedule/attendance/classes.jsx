"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  Box,
  Typography,
  Card,
  CardActionArea,
  Stack,
  Divider,
} from "@mui/material";
import { fetchClassesByTerm } from "../../../api/attendaceapi/adminAttendanceApi";
import AdminLayout from "../../../adminlayouts";



export default function AdminAttendanceClasses() {
  const router = useRouter();
  const { termId } = router.query;

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!termId) return;

    fetchClassesByTerm(termId)
      .then(setData)
      .finally(() => setLoading(false));
  }, [termId]);

  /* ---------- GROUP BY DAY ---------- */
  const groupedByDay = data.reduce((acc, item) => {
    acc[item.day] = acc[item.day] || [];
    acc[item.day].push(item);
    return acc;
  }, {});

  if (loading) {
    return <Typography p={4}>Loading…</Typography>;
  }

  return (
    <AdminLayout>
      <Box sx={{ p: 3 }}>
        <Typography variant="h5" fontWeight={700} mb={3}>
          Attendance • Classes
        </Typography>

        {Object.entries(groupedByDay).map(([day, slots]) => (
          <Box key={day} mb={4}>
            <Typography
              variant="h6"
              fontWeight={600}
              sx={{ mb: 2, textTransform: "capitalize" }}
            >
              {day}
            </Typography>

            <Stack spacing={2}>
              {slots.map((slot) => (
                <Card key={`${slot.trainingClassId}-${slot.startTime}`}>
                  <CardActionArea
                    onClick={() =>
                      router.push(
                        `/admin/schedule/attendance/${slot.trainingClassId}` +
                        `?startTime=${slot.startTime}&endTime=${slot.endTime}`
                      )
                    }
                    
                  >
                    <Box sx={{ p: 2 }}>
                      <Typography fontWeight={600}>
                        {slot.className}
                      </Typography>

                      <Typography variant="body2" color="text.secondary">
                        {slot.startTime} – {slot.endTime}
                      </Typography>

                      <Typography variant="body2" color="text.secondary">
                        {slot.venueName}
                      </Typography>
                    </Box>
                  </CardActionArea>
                </Card>
              ))}
            </Stack>

            <Divider sx={{ mt: 3 }} />
          </Box>
        ))}
      </Box>
    </AdminLayout>
  );
}
