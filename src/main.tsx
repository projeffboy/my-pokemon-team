import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

// Importing Roboto font for MUI: https://mui.com/material-ui/getting-started/installation/#roboto-font
// Comment the unused font weights
// import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
// import '@fontsource/roboto/700.css';

const container = document.getElementById("root");
if (!container) throw new Error("Failed to find the root element");
const root = createRoot(container);
root.render(
	<StrictMode>
		<App />
	</StrictMode>
);
