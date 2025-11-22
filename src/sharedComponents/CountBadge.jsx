import { Box } from "@mui/material";

export default function CountBadge({ count }) {
  return (
    <Box
      sx={{
        backgroundColor: "#d4af37",
        color: "#000",
        borderRadius: "50%",
        minWidth: 20,
        height: 20,
        fontSize: "0.7rem",
        fontWeight: 600,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {count}
    </Box>
  );
}
