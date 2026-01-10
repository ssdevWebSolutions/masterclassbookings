/**
 * Notifications Tab Component
 * Single Responsibility: Display notifications placeholder
 */

"use client";

import { Box, Typography } from "@mui/material";

export default function NotificationsTab() {
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
        Notifications functionality will be available soon.
      </Typography>
    </Box>
  );
}

