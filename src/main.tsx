import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { LicenseInfo } from '@mui/x-license';

LicenseInfo.setLicenseKey(import.meta.env.VITE_MUI_LICENSE_KEY);


const root = createRoot(document.getElementById("root")!);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
