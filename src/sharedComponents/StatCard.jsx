import { Card, Box, Typography } from "@mui/material";

export default function StatCard({ label, value, icon }) {
  return (
    <Card
      elevation={1}
      sx={{
        p: 2,
        display: "flex",
        alignItems: "center",
        gap: 2,
      }}
    >
      {icon && (
        <Box sx={{ color: "#ffc108", fontSize: "1.8rem" }}>
          {icon}
        </Box>
      )}

      <Box>
        <Typography variant="h3" sx={{ fontSize: "1.4rem" }}>
          {value}
        </Typography>
        <Typography sx={{ fontSize: "0.75rem", color: "text.secondary" }}>
          {label}
        </Typography>
      </Box>
    </Card>
  );
}
