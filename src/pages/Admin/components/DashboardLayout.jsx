import { Box } from "@mui/material";

export default function DashboardLayout({
  sidebar,
  header,
  children,
  sidebarOpen,
  onOverlayClick
}) {
  return (
    <Box
      sx={{
        height: "100vh",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "background.default",
        position: "relative",
      }}
    >
      {/* HEADER */}
      {header}

      {/* OVERLAY FOR MOBILE (when sidebar open) */}
      {sidebarOpen && (
        <Box
          onClick={onOverlayClick}
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.6)",
            zIndex: 1200,
          }}
        />
      )}

      {/* SIDEBAR (Drawer is inside this prop) */}
      {sidebar}

      {/* MAIN CONTENT */}
      <Box
        sx={{
          flexGrow: 1,
          overflowY: "auto",
          p: 2,
          width: "100%",        // ✅ FULL WIDTH ALWAYS
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
