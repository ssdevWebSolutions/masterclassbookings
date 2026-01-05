// pages/_app.js
import "@/styles/globals.css";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { CssBaseline, ThemeProvider } from "@mui/material";
import theme from "../theme";
import { store, persistor } from "../store";
import { bodyFont, titleFont } from "@/theme/fonts";
import MaintenanceNotice from "../Components/MaintenanceNotice";

// Set this to true to enable maintenance mode
const MAINTENANCE_MODE = true;

export default function App({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <div className={`${titleFont.variable} ${bodyFont.variable}`}>
            {/* Show maintenance notice if enabled, otherwise show normal app */}
            {MAINTENANCE_MODE ? (
              <MaintenanceNotice />
            ) : (
              <Component {...pageProps} />
            )}
          </div>
        </ThemeProvider>
      </PersistGate>
    </Provider>
  );
}
