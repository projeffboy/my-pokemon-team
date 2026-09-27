import type { ReactNode } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import { observer } from "mobx-react-lite";
import store from "@/store";
import MoreToggle from "./MoreToggle";
import TeamToolbar from "../TeamToolbar";

// The slot tabs beside the More button. When More is open, the team toolbar sits
// above them and joins the button, so the two read as one shape.
const TeamBar = observer(function TeamBar({ tabs }: { tabs: ReactNode }) {
  const { isMoreOpen } = store;

  return (
    <Grid
      size={12}
      sx={[
        { display: "flex", flexDirection: "column" },
        // One shadow around the joined shape instead of one per part
        isMoreOpen && {
          filter:
            "drop-shadow(0 1px 1px rgba(0,0,0,0.14)) drop-shadow(0 1px 3px rgba(0,0,0,0.12))",
        },
      ]}
    >
      {isMoreOpen && (
        <Paper elevation={0} sx={{ borderRadius: "4px 4px 0 4px" }}>
          <TeamToolbar />
        </Paper>
      )}
      <Box sx={{ display: "flex", gap: 1 }}>
        <Paper
          elevation={isMoreOpen ? 0 : 1}
          sx={{ flexGrow: 1, minWidth: 0, mt: isMoreOpen ? 1 : 0 }}
        >
          {tabs}
        </Paper>
        <Paper
          elevation={isMoreOpen ? 0 : 1}
          sx={[
            { display: "flex", width: 56, flexShrink: 0 },
            isMoreOpen && { borderRadius: "0 0 4px 4px" },
          ]}
        >
          <MoreToggle />
        </Paper>
      </Box>
    </Grid>
  );
});

export default TeamBar;
