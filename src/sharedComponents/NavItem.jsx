import { ListItemButton, ListItemIcon, ListItemText, Box } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CountBadge from "./CountBadge";

export default function NavItem({ label, icon, active, onClick, expandable, open, unread }) {
  return (
    <ListItemButton
      onClick={onClick}
      selected={active}
      sx={{
        minHeight: 38,
        borderRadius: 1,
        px: 1,
        "&.Mui-selected": {
          backgroundColor: "rgba(255,193,8,0.15)",
          color: "accent.main",
        },
        "&:hover": {
          backgroundColor: "rgba(255,193,8,0.1)",
        },
      }}
    >
      <ListItemIcon sx={{ minWidth: 32, color: "accent.main" }}>
        {icon}
      </ListItemIcon>

      <ListItemText primary={label} />

      {/* ✅ Only show badge when unread > 0 */}
      {unread > 0 && (
        <CountBadge count={unread} />
      )}

      {/* ✅ Show expand icon only if expandable */}
      {expandable && (
        <ExpandMoreIcon
          fontSize="small"
          sx={{
            ml: 1,
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            transition: "0.2s",
          }}
        />
      )}
    </ListItemButton>
  );
}
