import Grid from "@mui/material/Grid";
import ImportExportTeam from "./save-load-team/ImportExportTeam";
import CopyTeam from "./save-load-team/CopyTeam";

export default function SaveLoadTeam() {
  return (
    <Grid
      container
      sx={{
        pt: 1,
        pb: 2,
        justifyContent: "center",
        minHeight: { sm: 122 },
        alignItems: "center",
      }}
    >
      <Grid>
        <ImportExportTeam />
      </Grid>
      <Grid>
        <CopyTeam />
      </Grid>
    </Grid>
  );
}
