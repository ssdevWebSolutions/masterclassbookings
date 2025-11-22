import { Box, Typography } from "@mui/material";

export default function HighlightTile({ title, children }) {
  return (
    <Box
      sx={{
        p: 2,
        borderRadius: 2,
        background: "linear-gradient(135deg, #1a1a1a, #0f0f0f)",
        border: "1px solid rgba(255,193,8,0.25)",
      }}
    >
      <Typography
        variant="h3"
        sx={{ fontSize: "1rem", mb: 1, color: "#ffc108" }}
      >
        {title}
      </Typography>

      {children}
    </Box>
  );
}
