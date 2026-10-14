import { Component, type ReactNode } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useTranslation } from "./TranslationContext";

// What an ErrorBoundary shows by default: saved teams are safe, and a reload recovers
export function ErrorMessage() {
  const { t } = useTranslation();
  return (
    <Box role="alert" sx={{ p: 3, textAlign: "center" }}>
      <Typography variant="h6" component="p" gutterBottom>
        {t.error.title}
      </Typography>
      <Typography sx={{ color: "text.secondary" }} gutterBottom>
        {t.teams.savedInBrowser} {t.error.description}
      </Typography>
      <Button variant="outlined" onClick={() => location.reload()}>
        {t.error.reload}
      </Button>
    </Box>
  );
}

// Shows a message in place of children that throw while rendering, such as a lazy
// component whose code could not be fetched, instead of React unmounting the page
export default class ErrorBoundary extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    return this.state.failed ? <ErrorMessage /> : this.props.children;
  }
}
