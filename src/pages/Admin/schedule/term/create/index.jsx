"use client";

import { useState, useMemo, useCallback } from "react";
import dayjs from "dayjs";
import updateLocale from "dayjs/plugin/updateLocale";
import localeData from "dayjs/plugin/localeData";

import {
  Box,
  Typography,
  TextField,
  Alert,
  Button,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Chip,
  Stack,
  Divider,
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";

import {
  LocalizationProvider,
  DatePicker,
  PickersDay,
  StaticDatePicker,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import AdminLayout from "../../../AdminLayout";
import { createTermApi } from "../../../../api/termapi/terms-api";

/* ---------------- DAYJS CONFIG ---------------- */
dayjs.extend(updateLocale);
dayjs.extend(localeData);
dayjs.updateLocale("en", { weekStart: 1 });

/* ---------------- UTILITY FUNCTIONS (Single Responsibility) ---------------- */

/**
 * Checks if a day is in the same week as the selected date
 */
const isSameWeek = (day, selected) => {
  if (!selected) return false;
  const start = dayjs(selected).startOf("week");
  const end = dayjs(selected).endOf("week");
  return day.isBetween(start, end, "day", "[]");
};

/**
 * Formats week text for display
 */
const weekText = (date) =>
  date
    ? `Week starting ${dayjs(date).startOf("week").format("DD MMM YYYY")}`
    : "";

/**
 * Generates all dates between start and end week (inclusive)
 */
const generateAllDatesInRange = (startWeek, endWeek) => {
  const start = dayjs(startWeek).startOf("week");
  const end = dayjs(endWeek).endOf("week");
  const dates = [];
  let current = start;

  while (current.isBefore(end) || current.isSame(end, "day")) {
    dates.push(current.format("YYYY-MM-DD"));
    current = current.add(1, "day");
  }

  return dates;
};

/**
 * Checks if a date is within the term range
 */
const isInTermRange = (date, startWeek, endWeek) => {
  if (!date) return false;
  const start = dayjs(startWeek).startOf("week");
  const end = dayjs(endWeek).endOf("week");
  return date.isBetween(start, end, "day", "[]") || date.isSame(start, "day") || date.isSame(end, "day");
};

/**
 * Checks if a date is marked as a holiday
 */
const isHoliday = (date, holidays) => {
  if (!date) return false;
  return holidays.includes(date.format("YYYY-MM-DD"));
};

/* ---------------- HOLIDAY MODAL COMPONENT (Single Responsibility) ---------------- */

/**
 * HolidayModal - Displays a calendar with all days in range selected by default.
 * Users can click to unselect days to mark them as holidays.
 */
function HolidayModal({
  open,
  onClose,
  startWeek,
  endWeek,
  holidays,
  setHolidays,
}) {
  const [selectedDate, setSelectedDate] = useState(null);

  // Generate all dates in the range
  const allDatesInRange = useMemo(
    () => generateAllDatesInRange(startWeek, endWeek),
    [startWeek, endWeek]
  );

  /**
   * Toggles a date as a holiday (unselects it)
   */
  const toggleHoliday = useCallback(
    (date) => {
      if (!date || !isInTermRange(date, startWeek, endWeek)) return;

      const dateKey = date.format("YYYY-MM-DD");
      setHolidays((prev) =>
        prev.includes(dateKey)
          ? prev.filter((h) => h !== dateKey)
          : [...prev, dateKey]
      );
    },
    [startWeek, endWeek, setHolidays]
  );

  /**
   * Custom day renderer that shows selected/unselected state
   */
  const renderDay = useCallback(
    (props) => {
      const { day, ...otherProps } = props;
      const isInRange = isInTermRange(day, startWeek, endWeek);
      const isHolidayDate = isHoliday(day, holidays);

      return (
        <PickersDay
          {...otherProps}
          day={day}
          onClick={() => {
            if (isInRange) {
              toggleHoliday(day);
            }
          }}
          sx={{
            ...(isInRange && !isHolidayDate && {
              backgroundColor: "#f5c84c",
              color: "#000",
              fontWeight: 600,
              "&:hover": {
                backgroundColor: "#f0b830",
              },
            }),
            ...(isHolidayDate && {
              backgroundColor: "transparent",
              color: "#fff",
              textDecoration: "line-through",
              opacity: 0.5,
              "&:hover": {
                backgroundColor: "rgba(255, 193, 7, 0.1)",
                opacity: 0.8,
              },
            }),
            ...(!isInRange && {
              opacity: 0.3,
              pointerEvents: "none",
            }),
          }}
        />
      );
    },
    [startWeek, endWeek, holidays, toggleHoliday]
  );

  const handleDateChange = (newDate) => {
    setSelectedDate(newDate);
    if (newDate && isInTermRange(newDate, startWeek, endWeek)) {
      toggleHoliday(newDate);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" fontWeight={600}>
            Select Holidays
          </Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
        <Typography variant="body2" color="text.secondary" mt={1}>
          All days in the term range are selected by default. Click on a day to
          mark it as a holiday (unselect it).
        </Typography>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <StaticDatePicker
            value={selectedDate}
            onChange={handleDateChange}
            minDate={dayjs(startWeek).startOf("week")}
            maxDate={dayjs(endWeek).endOf("week")}
            slots={{
              day: renderDay,
            }}
            slotProps={{
              actionBar: {
                actions: [],
              },
            }}
            sx={{
              "& .MuiPickersCalendarHeader-root": {
                color: "#fff",
              },
              "& .MuiDayCalendar-weekContainer": {
                color: "#fff",
              },
              "& .MuiPickersDay-root": {
                color: "#fff",
              },
            }}
          />

          {holidays.length > 0 && (
            <Box>
              <Typography fontWeight={600} mb={2}>
                Selected Holidays ({holidays.length})
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                {holidays
                  .sort()
                  .map((dateKey) => (
                    <Chip
                      key={dateKey}
                      label={dayjs(dateKey).format("DD MMM YYYY")}
                      onDelete={() =>
                        setHolidays((prev) =>
                          prev.filter((h) => h !== dateKey)
                        )
                      }
                      sx={{
                        backgroundColor: "rgba(255, 193, 7, 0.2)",
                        color: "#ffc107",
                        "& .MuiChip-deleteIcon": {
                          color: "#ffc107",
                        },
                      }}
                    />
                  ))}
              </Stack>
            </Box>
          )}
        </Box>
      </DialogContent>

      <DialogActions>
        <Button variant="outlined" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="contained" onClick={onClose}>
          Done
        </Button>
      </DialogActions>
    </Dialog>
  );
}

/* ---------------- TERM FORM COMPONENT (Single Responsibility) ---------------- */

/**
 * TermFormFields - Handles term name and date range inputs
 */
function TermFormFields({
  termName,
  onTermNameChange,
  startWeek,
  onStartWeekChange,
  endWeek,
  onEndWeekChange,
}) {
  return (
    <>
      <TextField
        fullWidth
        label="Term name"
        value={termName}
        onChange={(e) => onTermNameChange(e.target.value)}
        sx={{ mb: 3 }}
        required
      />

      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <DatePicker
            value={startWeek}
            onChange={onStartWeekChange}
            format="DD MMM YYYY"
            slots={{
              day: (props) => (
                <PickersDay
                  {...props}
                  sx={{
                    ...(isSameWeek(props.day, startWeek) && {
                      backgroundColor: "#f5c84c",
                      color: "#000",
                      borderRadius: 0,
                    }),
                  }}
                />
              ),
            }}
            slotProps={{
              textField: {
                fullWidth: true,
                label: "First week of term",
                helperText: weekText(startWeek),
                InputLabelProps: { shrink: true },
                sx: {
                  backgroundColor: "#111",
                  borderRadius: 2,
                  "& .MuiInputBase-input": { color: "#fff" },
                  "& .MuiSvgIcon-root": { color: "#fff" },
                },
              },
            }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <DatePicker
            value={endWeek}
            minDate={startWeek}
            onChange={onEndWeekChange}
            format="DD MMM YYYY"
            slots={{
              day: (props) => (
                <PickersDay
                  {...props}
                  sx={{
                    ...(isSameWeek(props.day, endWeek) && {
                      backgroundColor: "#f5c84c",
                      color: "#000",
                      borderRadius: 0,
                    }),
                  }}
                />
              ),
            }}
            slotProps={{
              textField: {
                fullWidth: true,
                label: "Last week of term",
                helperText: weekText(endWeek),
                InputLabelProps: { shrink: true },
                sx: {
                  backgroundColor: "#111",
                  borderRadius: 2,
                  "& .MuiInputBase-input": { color: "#fff" },
                  "& .MuiSvgIcon-root": { color: "#fff" },
                },
              },
            }}
          />
        </Grid>
      </Grid>
    </>
  );
}

/* ---------------- PAYLOAD SERVICE (Single Responsibility) ---------------- */

/**
 * Creates the term payload with proper formatting
 */
const createTermPayload = (termName, startWeek, endWeek, holidays) => {
  return {
    termName: termName.trim(),
    startWeek: dayjs(startWeek).startOf("week").toISOString(),
    endWeek: dayjs(endWeek).endOf("week").toISOString(),
    holidays: holidays.sort(), // Sort holidays chronologically
  };
};

/* ---------------- MAIN PAGE COMPONENT ---------------- */

/**
 * TermCreatePage - Main component for creating a new term
 * Follows SOLID principles:
 * - Single Responsibility: Each component has one clear purpose
 * - Open/Closed: Components are extensible without modification
 * - Liskov Substitution: Components can be replaced with compatible ones
 * - Interface Segregation: Components receive only needed props
 * - Dependency Inversion: Depends on abstractions (functions) not implementations
 */
export default function TermCreatePage() {
  const today = dayjs();

  // State management
  const [termName, setTermName] = useState("");
  const [startWeek, setStartWeek] = useState(today);
  const [endWeek, setEndWeek] = useState(today.add(4, "week"));
  const [holidays, setHolidays] = useState([]);
  const [openHoliday, setOpenHoliday] = useState(false);

  // Memoized payload generation
  const payload = useMemo(
    () => createTermPayload(termName, startWeek, endWeek, holidays),
    [termName, startWeek, endWeek, holidays]
  );

  // Handlers
  const handleSaveTerm = useCallback(async () => {
    if (!termName.trim()) {
      alert("Please enter a term name");
      return;
    }
  
    if (dayjs(endWeek).isBefore(dayjs(startWeek))) {
      alert("End week must be after start week");
      return;
    }
  
    try {
      console.log("TERM PAYLOAD ✅", payload);
  
      let response;
  
      
        // CREATE term
        response = await createTermApi(payload);
        alert("Term created successfully ✅");
      
  
      console.log("API RESPONSE ✅", response);
  
      // Optional actions after save
      // onClose();
      // refetchTerms();
      // resetForm();
  
    } catch (error) {
      console.error("Save term failed ❌", error);
      alert("Something went wrong while saving the term");
    }
  }, [payload, termName, startWeek, endWeek]);
  

  const handleOpenHoliday = useCallback(() => {
    setOpenHoliday(true);
  }, []);

  const handleCloseHoliday = useCallback(() => {
    setOpenHoliday(false);
  }, []);

  return (
    <AdminLayout activeNav="Terms">
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Box sx={{ maxWidth: 900, mx: "auto", p: 2 }}>
          <Typography variant="h4" fontWeight={700} mb={1}>
            Add a new term
          </Typography>

          <Typography color="text.secondary" mb={3}>
            Set the term duration and holidays
          </Typography>

          <Alert severity="warning" sx={{ mb: 3 }}>
            You need at least one future term.
          </Alert>

          <TermFormFields
            termName={termName}
            onTermNameChange={setTermName}
            startWeek={startWeek}
            onStartWeekChange={setStartWeek}
            endWeek={endWeek}
            onEndWeekChange={setEndWeek}
          />

          <Divider sx={{ my: 4 }} />

          <Box
            sx={{
              display: "flex",
              gap: 2,
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <Button variant="outlined" onClick={handleOpenHoliday}>
              Manage Holidays ({holidays.length})
            </Button>

            <Button
              variant="contained"
              size="large"
              onClick={handleSaveTerm}
              disabled={!termName.trim()}
            >
              Save term
            </Button>
          </Box>
        </Box>

        <HolidayModal
          open={openHoliday}
          onClose={handleCloseHoliday}
          startWeek={startWeek}
          endWeek={endWeek}
          holidays={holidays}
          setHolidays={setHolidays}
        />
      </LocalizationProvider>
    </AdminLayout>
  );
}
