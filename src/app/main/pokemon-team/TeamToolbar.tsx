import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import GroupsIcon from "@mui/icons-material/Groups";
import CasinoIcon from "@mui/icons-material/Casino";
import LinkIcon from "@mui/icons-material/Link";
import { observer } from "mobx-react-lite";
import store from "@/store";
import copyToClipboard from "@/app/main/shared/copy-to-clipboard";
import ManageTeamMenu from "./team-toolbar/ManageTeamMenu";

export const shareTeamLink = () => {
  if (store.isTeamEmpty) store.openSnackbar("Pokemon team is empty");
  else
    copyToClipboard(
      window.location.href,
      "Pokemon team link copied",
      "Could not copy the link.",
    );
};

// Actions on the whole team: switching teams, randomizing, sharing, and managing it
const TeamToolbar = observer(function TeamToolbar() {
  const handleRandomize = () => {
    store.randomizeTeam();
    store.openSnackbar("Randomized");
  };

  return (
    <Stack
      direction="row"
      role="toolbar"
      aria-label="Team actions"
      useFlexGap
      spacing={0.5}
      sx={{ flexWrap: "wrap", justifyContent: "center" }}
    >
      <Button
        startIcon={<GroupsIcon />}
        onClick={() => store.openDialog("teams")}
      >
        Teams
      </Button>
      <Button
        startIcon={<CasinoIcon />}
        onClick={handleRandomize}
        disabled={!store.learnsetsLoaded}
      >
        Randomize
      </Button>
      <Button
        startIcon={<LinkIcon />}
        onClick={shareTeamLink}
        aria-label="Share pokemon team link"
      >
        Share Team
      </Button>
      <ManageTeamMenu />
    </Stack>
  );
});

export default TeamToolbar;
