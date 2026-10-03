import type { ReactNode } from "react";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import { observer } from "mobx-react-lite";
import store from "@/store";
import MoreToggle from "./MoreToggle";
import TeamToolbar from "./TeamToolbar";

// The slot tabs beside the More button. When More is open, the team toolbar sits
// above them and joins the button, so the two read as one shape.
const TeamBar = observer(function TeamBar({ tabs }: { tabs: ReactNode }) {
  const { isMoreOpen } = store;

  return (
    <Grid
      size={12}
      sx={[
        { display: "flex", flexDirection: "column" },
        // One shadow around the joined shape instead of one per part. The parts keep
        // their elevation, which lightens them in the dark scheme.
        isMoreOpen && {
          "& > .MuiPaper-root, & > div > .MuiPaper-root": { boxShadow: "none" },
          filter:
            "drop-shadow(0 1px 1px rgba(0,0,0,0.14)) drop-shadow(0 1px 3px rgba(0,0,0,0.12))",
        },
      ]}
    >
      {/* The toolbar slides open and shut */}
      <Collapse in={isMoreOpen}>
        <Paper sx={{ borderRadius: "4px 4px 0 4px", mb: 1 }}>
          <TeamToolbar />
        </Paper>
      </Collapse>
      <Box sx={{ display: "flex", gap: 1 }}>
        <Paper sx={{ flexGrow: 1, minWidth: 0 }}>{tabs}</Paper>
        <Paper
          sx={[
            { display: "flex", width: 56, flexShrink: 0 },
            // Overlaps the toolbar by a pixel, so no line shows where they join
            isMoreOpen && {
              borderRadius: "0 0 4px 4px",
              mt: "-1px",
              pt: "1px",
            },
          ]}
        >
          <MoreToggle />
        </Paper>
      </Box>
    </Grid>
  );
});

export default TeamBar;
