import { BrowserRouter as Router, useRoutes } from "react-router-dom";
import { routes } from "./routes";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";

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
