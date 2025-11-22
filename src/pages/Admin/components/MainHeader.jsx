import { Box, IconButton, Typography, Button } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";

export default function MainHeader({ activeNav, onMenuToggle }) {
  return (
    <Box
      sx={{
        height: 60,
        px: 2,
        backgroundColor: "background.default",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottom: "1px solid rgba(255,193,8,0.12)",
      }}
    >
      {/* LEFT ─ Menu Icon */}
      <IconButton onClick={onMenuToggle} sx={{ color: "accent.main" }}>
        <MenuIcon fontSize="medium" />
      </IconButton>

      {/* CENTER ─ Active Nav Title */}
      <Typography
        variant="subtitle1"
        sx={{
          color: "accent.main",
          textTransform: "capitalize",
          position: "absolute",
          left: "50%",
          transform: "translateX(-50%)",
        }}
      >
        {activeNav}
      </Typography>

      {/* RIGHT ─ Reminder Button */}
      <IconButton
        sx={{
          border: "1px solid",
          borderColor: "accent.main",
          color: "accent.main",
          width: 34,
          height: 34,
          borderRadius: "8px",
          "&:hover": {
            backgroundColor: "rgba(255,193,8,0.12)",
            borderColor: "accent.main",
          },
        }}
      >
        <NotificationsActiveIcon fontSize="small" />
      </IconButton>

    </Box>
  );
}
