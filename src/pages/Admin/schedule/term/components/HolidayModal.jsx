"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import dayjs from "dayjs";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Chip,
  Stack,
  Typography,
  Box,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { StaticDatePicker, PickersDay } from "@mui/x-date-pickers";
import { isDateInTerm } from "../../../../../../utils/dateUtils";

export default function HolidayModal({
  open,
  onClose,
  startWeek,
  endWeek,
  holidays,
  setHolidays,
}) {
  /* ---------- LOCAL STATE (CONFIRMATION FLOW) ---------- */
  const [tempHolidays, setTempHolidays] = useState([]);

  useEffect(() => {
    if (open) {
      setTempHolidays(holidays || []);
    }
  }, [open, holidays]);

  /* ---------- TOGGLE HOLIDAY ---------- */
  const toggleHoliday = useCallback(
    (date) => {
      if (!date || !isDateInTerm(date, startWeek, endWeek)) return;

      const key = date.format("YYYY-MM-DD");

      setTempHolidays((prev) =>
        prev.includes(key)
          ? prev.filter((h) => h !== key)
          : [...prev, key]
      );
    },
    [startWeek, endWeek]
  );

  /* ---------- SAFE SORT (NO MUTATION) ---------- */
  const sortedTempHolidays = useMemo(
    () => [...tempHolidays].sort(),
    [tempHolidays]
  );

  /* ---------- DAY RENDER ---------- */
  const renderDay = (props) => {
    const { day, outsideCurrentMonth, ...other } = props;

    const inTerm = isDateInTerm(day, startWeek, endWeek);
    const isHoliday = tempHolidays.includes(day.format("YYYY-MM-DD"));

    return (
      <PickersDay
        {...other}
        day={day}
        outsideCurrentMonth={outsideCurrentMonth}
        disabled={!inTerm}
        onClick={() => toggleHoliday(day)}
        sx={{
          ...(inTerm &&
            !isHoliday && {
              backgroundColor: "#f5c84c",
              color: "#000",
              fontWeight: 600,
            }),

          ...(isHoliday && {
            backgroundColor: "transparent",
            color: "#fff",
            opacity: 0.4,
            textDecoration: "line-through",
          }),

          fontSize: "0.75rem",
          width: 34,
          height: 34,
        }}
      />
    );
  };

  /* ---------- ACTIONS ---------- */
  const handleCancel = () => {
    onClose();
  };

  const handleConfirm = () => {
    setHolidays(sortedTempHolidays);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleCancel} fullWidth maxWidth="sm">
      <DialogTitle>
        Select Holidays
        <IconButton
          onClick={handleCancel}
          sx={{ position: "absolute", right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        {/* ✅ Responsive Calendar Wrapper */}
        <Box
          sx={{
            maxWidth: 360,
            mx: "auto",
            "& .MuiPickersCalendarHeader-root": {
              px: 1,
            },
          }}
        >
          <StaticDatePicker
            value={null}
            onChange={() => {}}
            minDate={dayjs(startWeek).startOf("week")}
            maxDate={dayjs(endWeek).endOf("week")}
            slots={{ day: renderDay }}
            slotProps={{
              actionBar: { actions: [] },
            }}
          />
        </Box>

        {/* ✅ CONFIRMATION LIST */}
        {sortedTempHolidays.length > 0 && (
          <>
            <Typography fontWeight={600} mt={3} mb={1}>
              Selected holidays
            </Typography>

            <Stack direction="row" spacing={1} flexWrap="wrap">
              {sortedTempHolidays.map((d) => (
                <Chip
                  key={d}
                  label={dayjs(d).format("DD MMM YYYY")}
                  size="small"
                />
              ))}
            </Stack>
          </>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={handleCancel}>Cancel</Button>
        <Button variant="contained" onClick={handleConfirm}>
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
}
