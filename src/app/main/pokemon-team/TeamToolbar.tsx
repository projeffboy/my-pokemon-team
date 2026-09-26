import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import GroupsIcon from "@mui/icons-material/Groups";
import CasinoIcon from "@mui/icons-material/Casino";
import LinkIcon from "@mui/icons-material/Link";
import { observer } from "mobx-react-lite";
import store from "@/store";
import copyToClipboard from "@/app/main/shared/copy-to-clipboard";
import { useTranslation } from "@/app/shared/TranslationContext";
import ManageTeamMenu from "./team-toolbar/ManageTeamMenu";

export const shareTeamLink = () => {
  const { team } = store.translation.t;
  if (store.isTeamEmpty) store.openSnackbar(team.teamEmpty);
  else
    copyToClipboard(window.location.href, team.linkCopied, team.linkNotCopied);
};

// Actions on the whole team: switching teams, randomizing, sharing, and managing it
const TeamToolbar = observer(function TeamToolbar() {
  const { t } = useTranslation();
  const handleRandomize = () => {
    store.randomizeTeam();
    store.openSnackbar(t.team.randomized);
  };

  return (
    <Stack
      direction="row"
      role="toolbar"
      aria-label={t.team.teamActions}
      useFlexGap
      spacing={0.5}
      sx={{ flexWrap: "wrap", justifyContent: "center" }}
    >
      <Button
        startIcon={<GroupsIcon />}
        onClick={() => store.openDialog("teams")}
      >
        {t.team.teams}
      </Button>
      <Button
        startIcon={<CasinoIcon />}
        onClick={handleRandomize}
        disabled={!store.learnsetsLoaded}
      >
        {t.team.randomize}
      </Button>
      <Button
        startIcon={<LinkIcon />}
        onClick={shareTeamLink}
        aria-label={t.team.shareTeamLink}
      >
        {t.team.shareTeam}
      </Button>
      <ManageTeamMenu />
    </Stack>
  );
});

export default TeamToolbar;
