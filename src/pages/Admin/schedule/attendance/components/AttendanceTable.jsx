"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Checkbox,
  Box,
  Typography,
} from "@mui/material";

export default function AttendanceTable({
  sessions,
  students,
  onToggle,
}) {
  return (
    <Box>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell><b>Child</b></TableCell>
            <TableCell><b>Age</b></TableCell>
            {sessions.map((s) => (
              <TableCell key={s.sessionId} align="center">
                <Typography variant="body2">
                  {new Date(s.date).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                  })}
                </Typography>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>

        <TableBody>
          {students.map((student) => (
            <TableRow key={student.bookingId}>
              <TableCell>{student.childName}</TableCell>
              <TableCell>{student.age}</TableCell>

              {sessions.map((s) => (
                <TableCell key={s.sessionId} align="center">
                  <Checkbox
                    checked={student.attendance[s.sessionId] || false}
                    onChange={(e) =>
                      onToggle({
                        bookingId: student.bookingId,
                        sessionId: s.sessionId,
                        attended: e.target.checked,
                      })
                    }
                  />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
}
