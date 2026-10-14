import type { ReactNode } from "react";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import TeamToolbar from "./TeamToolbar";

// The team toolbar above the slot tabs, on phones and tablets
export default function TeamBar({ tabs }: { tabs: ReactNode }) {
  return (
    <Grid size={12} sx={{ display: "flex", flexDirection: "column" }}>
      <Paper sx={{ mb: 1 }}>
        <TeamToolbar />
      </Paper>
      <Paper sx={{ minWidth: 0 }}>{tabs}</Paper>
    </Grid>
  );
}
