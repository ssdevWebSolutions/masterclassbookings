"use client";

import { Grid, TextField } from "@mui/material";
import { DatePicker, PickersDay } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { weekText } from "../../../../../../utils/dateUtils";


const isSameWeek = (day, selected) => {
  if (!selected) return false;
  return day.isBetween(
    dayjs(selected).startOf("week"),
    dayjs(selected).endOf("week"),
    "day",
    "[]"
  );
};

export default function TermFormFields({
  termName,
  setTermName,
  startWeek,
  setStartWeek,
  endWeek,
  setEndWeek,
}) {
  return (
    <>
      <TextField
        fullWidth
        label="Term name"
        value={termName}
        onChange={(e) => setTermName(e.target.value)}
        sx={{ mb: 3 }}
      />

      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <DatePicker
            value={startWeek}
            onChange={setStartWeek}
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
            onChange={setEndWeek}
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
