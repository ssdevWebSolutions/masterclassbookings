// exports final theme
import { createTheme } from "@mui/material/styles";
import palette from "./palette";
import typography from "./typography";
import components from "./components";

const theme = createTheme({
  palette,
  typography,
  components,

  
  spacing: 8, // 1 unit = 8px (industry standard)

  shape: {
    borderRadius: 8, // smooth premium rounding
  },

  shadows: [
    "none",
    "0px 2px 4px rgba(0,0,0,0.35)", // subtle card shadow
    "0px 4px 8px rgba(0,0,0,0.45)",
    ...Array(23).fill("none"), // we override only first few
  ],
});

export default theme;
