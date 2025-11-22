import { Box, CircularProgress, Typography } from "@mui/material";

export default function LoadingState({ message = "Loading..." }) {
  return (
    <Box sx={{ textAlign: "center", py: 6 }}>
      <CircularProgress />
      <Typography sx={{ mt: 2 }}>{message}</Typography>
    </Box>
  );
}
