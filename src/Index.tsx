import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
// Roboto for Material UI, self-hosted so it ships with the bundle's long-lived cache
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";

const rootEl = document.getElementById("root");
if (!rootEl) throw new Error("Root element not found");
createRoot(rootEl).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
