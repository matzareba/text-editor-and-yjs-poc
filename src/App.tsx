import { BrowserRouter as Router, useRoutes } from "react-router-dom";
import { routes } from "./routes";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";
import { LicenseInfo } from "@mui/x-license";

LicenseInfo.setLicenseKey(
  "5ba637400a65b8c85c9a337db92a168aTz0xMDgyMDgsRT0xNzcxNjMxOTk5MDAwLFM9cHJvLExNPXN1YnNjcmlwdGlvbixQVj1pbml0aWFsLEtWPTI=",
);

const AppRoutes = () => {
  return useRoutes(routes);
};

export default function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}
