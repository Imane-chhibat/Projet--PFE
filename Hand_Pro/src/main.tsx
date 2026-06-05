import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import 'leaflet/dist/leaflet.css';
import "./index.css";
import App from "./App";
import { CustomAlertProvider } from "./components/CustomAlertProvider";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <CustomAlertProvider>
      <App />
    </CustomAlertProvider>
  </StrictMode>
);
