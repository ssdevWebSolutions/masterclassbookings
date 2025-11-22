import { Typography, Box } from "@mui/material";

export default function SectionHeader({ title }) {
  return (
    <Box sx={{ mb: 2 }}>
      <Typography variant="h3">{title}</Typography>
    </Box>
  );
}
