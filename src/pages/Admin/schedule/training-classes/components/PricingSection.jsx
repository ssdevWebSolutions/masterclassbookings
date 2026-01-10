"use client";

import {
  Box,
  Typography,
  TextField,
  RadioGroup,
  FormControlLabel,
  Radio,
  Grid,
} from "@mui/material";

export default function PricingSection({
  pricingType,
  setPricingType,
  termPrice,
  setTermPrice,
  sessionPrice,
  setSessionPrice,
}) {
  return (
    <Box>
      <Typography variant="h6" fontWeight={600} mb={2}>
        Pricing
      </Typography>

      <Typography variant="body2" color="text.secondary" mb={3}>
        Choose how customers will be charged for this training class.
      </Typography>

      {/* Pricing Type */}
      <RadioGroup
        row
        value={pricingType}
        onChange={(e) => setPricingType(e.target.value)}
      >
        <FormControlLabel value="TERM" control={<Radio />} label="Per term" />
        <FormControlLabel value="SESSION" control={<Radio />} label="Per session" />
        <FormControlLabel value="BOTH" control={<Radio />} label="Both" />
      </RadioGroup>

      <Grid container spacing={3} mt={1}>
        {/* Term Price */}
        <Grid item xs={12} md={6}>
          <TextField
            label="Term price"
            type="number"
            fullWidth
            disabled={pricingType === "SESSION"}
            value={termPrice}
            onChange={(e) => setTermPrice(e.target.value)}
            helperText="Charged once for the full term"
          />
        </Grid>

        {/* Session Price */}
        <Grid item xs={12} md={6}>
          <TextField
            label="Session price"
            type="number"
            fullWidth
            disabled={pricingType === "TERM"}
            value={sessionPrice}
            onChange={(e) => setSessionPrice(e.target.value)}
            helperText="Charged per individual session"
          />
        </Grid>
      </Grid>
    </Box>
  );
}
