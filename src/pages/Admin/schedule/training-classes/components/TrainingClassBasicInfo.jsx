"use client";

import { Box, Grid, TextField, MenuItem, Typography } from "@mui/material";
import dayjs from "dayjs";

export default function TrainingClassBasicInfo({
  classId,
  setClassId,
  classes = [],
  venueId,
  setVenueId,
  venues = [],
  termId,
  setTermId,
  terms = [],
  capacity,
  setCapacity,
}) {
  return (
    <Box>
      <Typography variant="h6" fontWeight={600} mb={2}>
        Basic details
      </Typography>

      <Grid container spacing={3}>
        {/* Training Class (from API) */}
        <Grid item xs={12}>
          <TextField
            select
            label="Training class"
            fullWidth
            value={classId}
            onChange={(e) => setClassId(e.target.value)}
            helperText="Select the coaching program"
          >
            {classes.map((c) => (
              <MenuItem key={c.id} value={c.id}>
                {c.className}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        {/* Venue */}
        <Grid item xs={12} md={6}>
          <TextField
            select
            label="Venue"
            fullWidth
            value={venueId}
            onChange={(e) => setVenueId(e.target.value)}
            helperText="Where this class will be conducted"
          >
            {venues.map((v) => (
              <MenuItem key={v.id} value={v.id}>
                {v.venueName}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        {/* Term */}
        <Grid item xs={12} md={6}>
          <TextField
            select
            label="Term"
            fullWidth
            value={termId}
            onChange={(e) => setTermId(e.target.value)}
            helperText="Sessions will be generated within this term"
          >
            {terms.map((t) => (
              <MenuItem key={t.id} value={t.id}>
                <Box>
                  <Typography fontSize={14}>{t.termName}</Typography>
                  <Typography fontSize={12} color="text.secondary">
                    {dayjs(t.startWeek).format("DD MMM YYYY")} –{" "}
                    {dayjs(t.endWeek).format("DD MMM YYYY")}
                  </Typography>
                </Box>
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        {/* Capacity */}
        <Grid item xs={12} md={4}>
          <TextField
            label="Capacity"
            type="number"
            fullWidth
            value={capacity}
            onChange={(e) => setCapacity(e.target.value)}
            helperText="Maximum participants per session"
          />
        </Grid>
      </Grid>
    </Box>
  );
}
