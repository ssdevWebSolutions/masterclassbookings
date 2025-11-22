"use client";

import { Box, Typography, Button } from "@mui/material";
import Image from "next/image";

export default function ComingSoon({ title = "Coming Soon", onBack }) {
  return (
    <Box
      sx={{
        height: "100%",
        minHeight: "70vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        px: 2,
      }}
    >
      <Image
        src="/coming-soon.png" 
        alt="Coming Soon"
        width={250}
        height={250}
        style={{ marginBottom: 20 }}
      />

      <Typography variant="h3" sx={{ mb: 1 }}>
        {title}
      </Typography>

      <Typography variant="body1" sx={{ mb: 3, color: "text.secondary" }}>
        This module is under development. Stay tuned!
      </Typography>

      {onBack && (
        <Button
          variant="outlined"
          onClick={onBack}
          sx={{
            borderColor: "accent.main",
            color: "accent.main",
            textTransform: "none",
            "&:hover": {
              backgroundColor: "rgba(255,193,8,0.12)",
              borderColor: "accent.main",
            },
          }}
        >
          Go Back
        </Button>
      )}
    </Box>
  );
}
