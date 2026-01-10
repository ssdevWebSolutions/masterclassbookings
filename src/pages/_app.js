// pages/_app.js
import "@/styles/globals.css";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { CssBaseline, ThemeProvider } from "@mui/material";
import theme from "../theme";
import { store, persistor } from "../store"; // make sure store.js is in store folder
import { bodyFont, titleFont } from "@/theme/fonts";
import { SnackbarProvider } from "notistack";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers";

export default function App({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeProvider theme={theme} >
          <CssBaseline />
          <div className={`${titleFont.variable} ${bodyFont.variable}`} style={{ minHeight: '100vh', height: 'auto', overflow: 'visible' }}>
            <SnackbarProvider maxSnack={3}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Component {...pageProps} />
              </LocalizationProvider>
            </SnackbarProvider>
          </div>
        </ThemeProvider>
      </PersistGate>
    </Provider>
  );
}
