/**
 * Service Request Tab Component
 * Single Responsibility: Display service request placeholder
 */

"use client";

import { Box, Typography } from "@mui/material";

export default function ServiceRequestTab() {
  return (
    <Box
      p={4}
      textAlign="center"
      sx={{
        backgroundColor: "background.paper",
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 2,
      }}
    >
      <Typography variant="h6" sx={{ color: "text.secondary", mb: 1 }}>
        Coming Soon
      </Typography>
      <Typography variant="body2" sx={{ color: "text.secondary" }}>
        Service Request functionality will be available soon.
      </Typography>
    </Box>
  );
}

