import { createRoot } from "react-dom/client";
import App from "./app";

const rootEl = document.getElementById("root");
if (!rootEl) throw new Error("Root element not found");
createRoot(rootEl).render(<App />);
