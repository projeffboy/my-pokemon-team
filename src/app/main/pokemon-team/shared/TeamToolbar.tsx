import Stack from "@mui/material/Stack";
import FolderIcon from "@mui/icons-material/Folder";
import TeamDiceIcon from "./team-toolbar/TeamDiceIcon";
import LinkIcon from "@mui/icons-material/Link";
import UndoIcon from "@mui/icons-material/Undo";
import RedoIcon from "@mui/icons-material/Redo";
import { observer } from "mobx-react-lite";
import store from "@/store";
import copyToClipboard from "@/app/shared/copy-to-clipboard";
import { redoEdit, undoEdit } from "@/app/shared/history-actions";
import { useIsMdDown } from "@/app/shared/WidthContext";
import { useTranslation } from "@/app/shared/TranslationContext";
import ManageTeamMenu from "./team-toolbar/ManageTeamMenu";
import ToolbarButton from "./team-toolbar/shared/ToolbarButton";
import useFittingLabel from "@/app/shared/use-fitting-label";
import useDiceRoll from "@/app/shared/use-dice-roll";
import useTeamToolsToggle from "./use-team-tools-toggle";
import type { SyntheticEvent } from "react";
import TeamSearchTools from "./TeamSearchTools";
import useCompactHistory from "./use-compact-history";

export const shareTeamLink = () => {
  const { team } = store.translation.t;
  if (store.isTeamEmpty) store.openSnackbar(team.teamEmpty, false, "warning");
  else
    copyToClipboard(
      window.location.href,
      team.linkCopied,
      team.linkNotCopied,
      "link",
    );
};

// Actions on the whole team: switching teams, randomizing, sharing, and managing it.
// Smaller screens keep undo and redo above the slot tabs.
const TeamToolbar = observer(function TeamToolbar() {
  const { t } = useTranslation();
  const isMdDown = useIsMdDown();
  const { isMoreOpen } = store;
  const {
    label: modeLabel,
    ariaLabel: modeAriaLabel,
    Icon: ModeIcon,
    iconColor: modeIconColor,
    pressed: modePressed,
  } = useTeamToolsToggle();
  const randomLabels = t.teams.randomTeamLabels;
  const history = useCompactHistory(
    `${isMoreOpen}-${t.undo}-${t.redo}-${t.team.filters}-${t.team.sort}-${modeLabel}`,
  );
  const random = useFittingLabel(randomLabels);
  const diceRoll = useDiceRoll();
  const handleRandomize = (event: SyntheticEvent<HTMLElement>) => {
    const teamId = store.currentTeamId;
    diceRoll.onClick(event, () => {
      if (store.currentTeamId !== teamId) return;
      store.randomizeTeam();
      store.openSnackbar(t.team.randomizedTeam, true, "random");
    });
  };

  return (
    <Stack
      ref={history.ref}
      direction="row"
      role="toolbar"
      aria-label={t.team.teamActions}
      sx={
        history.compact ?
          {
            "& .history-button": { flex: "0 0 auto" },
            "& .history-button > span": { display: "none" },
          }
        : {}
      }
    >
      <ToolbarButton
        icon={<FolderIcon />}
        onClick={() => store.openDialog("teams")}
      >
        {t.team.teams}
      </ToolbarButton>
      <ToolbarButton
        ref={random.ref}
        icon={<TeamDiceIcon />}
        {...diceRoll}
        onClick={handleRandomize}
        disabled={!store.learnsetsLoaded}
        aria-label={randomLabels[0]}
        data-full-label={randomLabels[0]}
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
            className="history-button"
            aria-label={t.undo}
            title={t.undo}
            icon={<UndoIcon />}
            onClick={undoEdit}
            disabled={!store.canUndo}
          >
            {t.undo}
          </ToolbarButton>
          <ToolbarButton
            className="history-button"
            aria-label={t.redo}
            title={t.redo}
            icon={<RedoIcon />}
            onClick={redoEdit}
            disabled={!store.canRedo}
          >
            {t.redo}
          </ToolbarButton>
          <ManageTeamMenu />
          <TeamSearchTools stacked />
          {/* Phones and tablets have the More toggle above the slot tabs instead */}
          <ToolbarButton
            icon={<ModeIcon sx={{ color: modeIconColor }} />}
            onClick={() => (store.isMoreOpen = !isMoreOpen)}
            aria-expanded={isMoreOpen}
            aria-pressed={modePressed}
            aria-label={modeAriaLabel}
          >
            {modeLabel}
          </ToolbarButton>
        </>
      )}
      {isMdDown && <ManageTeamMenu />}
    </Stack>
  );
});

export default TeamToolbar;
