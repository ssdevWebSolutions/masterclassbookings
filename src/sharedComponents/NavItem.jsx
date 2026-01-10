import React from "react";
import { ListItemButton, ListItemIcon, ListItemText, Box, Typography } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CountBadge from "./CountBadge";

export default function NavItem({ label, icon, active, onClick, expandable, open, unread, disabled }) {
  // Handle disabled state
  const handleClick = () => {
    if (!disabled && onClick) {
      onClick();
    }
  };

  // Render icon - handle both component references and JSX elements
  const renderIcon = () => {
    if (!icon) return null;
    
    // Check if it's already a valid React element (JSX)
    if (React.isValidElement(icon)) {
      return icon;
    }
    
    // It's a component reference, render it
    const IconComponent = icon;
    return <IconComponent fontSize="small" />;
  };

  return (
    <ListItemButton
      onClick={handleClick}
      selected={active}
      disabled={disabled}
      sx={{
        minHeight: 38,
        borderRadius: 1,
        px: 1,
        opacity: disabled ? 0.5 : 1,
        "&.Mui-selected": {
          backgroundColor: "rgba(255,193,8,0.15)",
          color: "accent.main",
        },
        "&:hover": {
          backgroundColor: disabled ? "transparent" : "rgba(255,193,8,0.1)",
        },
        "&.Mui-disabled": {
          opacity: 0.5,
        },
      }}
    >
      <ListItemIcon sx={{ minWidth: 32, color: "accent.main" }}>
        {renderIcon()}
      </ListItemIcon>

      <ListItemText 
        primary={
          <Box display="flex" alignItems="center" justifyContent="space-between" width="100%">
            <span>{label}</span>
            {disabled && (
              <Typography variant="caption" sx={{ color: "text.secondary", fontSize: "0.688rem", ml: 1 }}>
                Coming Soon
              </Typography>
            )}
          </Box>
        }
      />

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
