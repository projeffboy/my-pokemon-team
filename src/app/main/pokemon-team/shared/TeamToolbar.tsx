import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import FolderIcon from "@mui/icons-material/Folder";
import TeamDiceIcon from "./team-toolbar/TeamDiceIcon";
import LinkIcon from "@mui/icons-material/Link";
import UndoIcon from "@mui/icons-material/Undo";
import RedoIcon from "@mui/icons-material/Redo";
import { observer } from "mobx-react-lite";
import store from "@/store";
import copyToClipboard from "@/app/shared/copy-to-clipboard";
import { teamUrl } from "@/app/shared/team-link";
import { redoEdit, undoEdit } from "@/app/shared/history-actions";
import { useTranslation } from "@/app/shared/TranslationContext";
import MoreMenu from "./team-toolbar/MoreMenu";
import ToolbarButton from "./team-toolbar/shared/ToolbarButton";
import useFittingLabel from "@/app/shared/use-fitting-label";
import useDiceRoll from "@/app/shared/use-dice-roll";
import type { SyntheticEvent } from "react";

export const shareTeamLink = () => {
  const { team } = store.translation.t;
  if (store.isTeamEmpty) store.openSnackbar(team.teamEmpty, false, "warning");
  else
    copyToClipboard(
      teamUrl(store.team),
      team.linkCopied,
      team.linkNotCopied,
      "link",
    );
};

// Actions on the whole team: switching teams, randomizing, sharing, history, and managing
// it. Every button keeps its label, so a toolbar too narrow for one row of them wraps
// onto two, with the team's actions above its history and settings.
const TeamToolbar = observer(function TeamToolbar() {
  const { t } = useTranslation();
  const randomLabels = t.teams.randomTeamLabels;
  const shortLabels = [
    t.team.teams,
    randomLabels.at(-1) ?? "",
    t.team.shareTeam,
    t.undo,
    t.redo,
    t.team.more,
  ];
  const count = shortLabels.length;
  // The probe is one column of a single row: the row holds if every short label fits it
  const { ref: column, label: oneRow } = useFittingLabel<HTMLSpanElement>([
    shortLabels.join("\n"),
    "",
  ]);
  // On two rows, the first three buttons share the top row and the rest the bottom one
  const basis = (index: number) =>
    oneRow ? undefined : `${Math.floor(90 / (index < 3 ? 3 : count - 3))}%`;
  const random = useFittingLabel(randomLabels);
  const diceRoll = useDiceRoll();
  const handleRandomize = (event: SyntheticEvent<HTMLElement>) => {
    const teamId = store.currentTeamId;
    diceRoll.onClick(event, () => {
      if (store.currentTeamId !== teamId) return;
      if (store.randomizeTeam())
        store.openSnackbar(t.team.randomizedTeam, true, "random");
      else store.openSnackbar(t.team.noMatchingPokemon, false, "warning");
    });
  };

  return (
    <Stack
      direction="row"
      role="toolbar"
      aria-label={t.team.teamActions}
      sx={{ position: "relative", flexWrap: oneRow ? "nowrap" : "wrap" }}
    >
      <Box
        component="span"
        ref={column}
        sx={{
          position: "absolute",
          width: `${100 / count}%`,
          // The buttons' own padding and label font
          px: 0.25,
          typography: "button",
          fontSize: 12,
          letterSpacing: 0,
          textTransform: "none",
        }}
      />
      <ToolbarButton
        basis={basis(0)}
        icon={<FolderIcon />}
        onClick={() => store.openDialog("teams")}
      >
        {t.team.teams}
      </ToolbarButton>
      <ToolbarButton
        ref={random.ref}
        basis={basis(1)}
        icon={<TeamDiceIcon />}
        {...diceRoll}
        onClick={handleRandomize}
        disabled={!store.learnsetsLoaded}
        aria-label={randomLabels[0]}
      >
        {random.label}
      </ToolbarButton>
      <ToolbarButton
        basis={basis(2)}
        icon={<LinkIcon />}
        onClick={shareTeamLink}
        aria-label={t.team.shareTeamLink}
      >
        {t.team.shareTeam}
      </ToolbarButton>
      <ToolbarButton
        basis={basis(3)}
        icon={<UndoIcon />}
        onClick={undoEdit}
        disabled={!store.canUndo}
      >
        {t.undo}
      </ToolbarButton>
      <ToolbarButton
        basis={basis(4)}
        icon={<RedoIcon />}
        onClick={redoEdit}
        disabled={!store.canRedo}
      >
        {t.redo}
      </ToolbarButton>
      <MoreMenu basis={basis(5)} />
    </Stack>
  );
});

export default TeamToolbar;
