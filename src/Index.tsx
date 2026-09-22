import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
// Roboto for Material UI, self-hosted so it ships with the bundle's long-lived cache
import "@fontsource/roboto/latin-300.css";
import "@fontsource/roboto/latin-400.css";
import "@fontsource/roboto/latin-500.css";

// A deploy replaces the hashed chunk files, so a tab opened before it cannot load a lazy chunk;
// reloading picks up the new build. The timer stops a reload loop when the chunk is truly unreachable.
window.addEventListener("vite:preloadError", event => {
  const key = "lastPreloadErrorReload";
  if (Date.now() - Number(sessionStorage.getItem(key)) < 60_000) return;
  sessionStorage.setItem(key, String(Date.now()));
  event.preventDefault();
  window.location.reload();
});

const rootEl = document.getElementById("root");
if (!rootEl) throw new Error("Root element not found");
createRoot(rootEl).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
