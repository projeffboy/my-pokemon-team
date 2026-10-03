import Stack from "@mui/material/Stack";
import FolderIcon from "@mui/icons-material/Folder";
import TeamDiceIcon from "./team-toolbar/TeamDiceIcon";
import LinkIcon from "@mui/icons-material/Link";
import UndoIcon from "@mui/icons-material/Undo";
import RedoIcon from "@mui/icons-material/Redo";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { observer } from "mobx-react-lite";
import store from "@/store";
import copyToClipboard from "@/app/shared/copy-to-clipboard";
import { redoEdit, undoEdit } from "@/app/shared/history-actions";
import { useIsMdDown } from "@/app/shared/WidthContext";
import { useTranslation } from "@/app/shared/TranslationContext";
import ManageTeamMenu from "./team-toolbar/ManageTeamMenu";
import ToolbarButton from "./team-toolbar/shared/ToolbarButton";
import useFittingLabel from "./team-toolbar/use-fitting-label";

export const shareTeamLink = () => {
  const { team } = store.translation.t;
  if (store.isTeamEmpty) store.openSnackbar(team.teamEmpty);
  else
    copyToClipboard(window.location.href, team.linkCopied, team.linkNotCopied);
};

// Actions on the whole team: switching teams, randomizing, sharing, and managing it.
// Undo and redo are here on desktops, and in the Manage Team menu where there is less room.
const TeamToolbar = observer(function TeamToolbar() {
  const { t } = useTranslation();
  const isMdDown = useIsMdDown();
  const { isMoreOpen } = store;
  const randomLabels = t.teams.randomTeamLabels;
  const random = useFittingLabel(randomLabels);
  const handleRandomize = () => {
    store.randomizeTeam();
    store.openSnackbar(t.team.randomizedTeam, true);
  };

  return (
    <Stack direction="row" role="toolbar" aria-label={t.team.teamActions}>
      <ToolbarButton
        icon={<FolderIcon />}
        onClick={() => store.openDialog("teams")}
      >
        {t.team.teams}
      </ToolbarButton>
      <ToolbarButton
        ref={random.ref}
        icon={<TeamDiceIcon />}
        onClick={handleRandomize}
        disabled={!store.learnsetsLoaded}
        aria-label={randomLabels[0]}
      >
        {random.label}
      </ToolbarButton>
      <ToolbarButton
        icon={<LinkIcon />}
        onClick={shareTeamLink}
        aria-label={t.team.shareTeamLink}
      >
        {t.team.shareTeam}
      </ToolbarButton>
      {!isMdDown && (
        <>
          <ToolbarButton
            icon={<UndoIcon />}
            onClick={undoEdit}
            disabled={!store.canUndo}
          >
            {t.undo}
          </ToolbarButton>
          <ToolbarButton
            icon={<RedoIcon />}
            onClick={redoEdit}
            disabled={!store.canRedo}
          >
            {t.redo}
          </ToolbarButton>
          {/* Phones and tablets have the More toggle beside the slot tabs instead */}
          <ToolbarButton
            icon={isMoreOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            onClick={() => (store.isMoreOpen = !isMoreOpen)}
            aria-expanded={isMoreOpen}
            aria-label={isMoreOpen ? t.team.fewerTools : t.team.moreTools}
          >
            {isMoreOpen ? t.team.less : t.team.more}
          </ToolbarButton>
        </>
      )}
      <ManageTeamMenu />
    </Stack>
  );
});

export default TeamToolbar;
