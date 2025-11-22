import { Box, Typography, Button } from "@mui/material";

export default function EmptyState({ message, actionLabel, onAction }) {
  return (
    <Box sx={{ textAlign: "center", py: 6, opacity: 0.8 }}>
      <Typography sx={{ mb: 2 }}>{message}</Typography>
      {actionLabel && (
        <Button variant="contained" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </Box>
  );
}
