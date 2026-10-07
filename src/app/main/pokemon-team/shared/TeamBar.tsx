import type { ReactNode } from "react";
import Button from "@mui/material/Button";
import Collapse from "@mui/material/Collapse";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import UndoIcon from "@mui/icons-material/Undo";
import RedoIcon from "@mui/icons-material/Redo";
import { observer } from "mobx-react-lite";
import store from "@/store";
import { redoEdit, undoEdit } from "@/app/shared/history-actions";
import { useTranslation } from "@/app/shared/TranslationContext";
import MoreToggle from "./MoreToggle";
import TeamToolbar from "./TeamToolbar";
import TeamSearchTools from "./TeamSearchTools";
import useCompactHistory from "./use-compact-history";

const TeamBar = observer(function TeamBar({ tabs }: { tabs: ReactNode }) {
  const { t } = useTranslation();
  const history = useCompactHistory(
    `${store.isMoreOpen}-${t.undo}-${t.redo}-${t.team.filters}-${t.team.sort}-${t.team.less}-${t.team.more}`,
  );

  return (
    <Grid size={12} sx={{ display: "flex", flexDirection: "column" }}>
      <Paper
        ref={history.ref}
        role="toolbar"
        aria-label={t.team.teamActions}
        sx={{
          display: "flex",
          alignItems: "stretch",
          minHeight: { sm: 48 },
          boxSizing: "border-box",
          mb: 1,
          "& .MuiButton-root": {
            flex: "1 1 auto",
            minWidth: 0,
            minHeight: 0,
            px: 0.5,
            py: 0.5,
            fontSize: 12,
            whiteSpace: "nowrap",
            gap: 0.5,
          },
          "& .MuiButton-startIcon": {
            ml: 0,
            mr: 0,
            "& > svg": { fontSize: 20 },
          },
          ...(history.compact && {
            "& .history-button": { flex: "0 0 auto" },
            "& .history-label": { display: "none" },
          }),
        }}
      >
        <Button
          className="history-button"
          aria-label={t.undo}
          title={t.undo}
          startIcon={<UndoIcon />}
          onClick={undoEdit}
          disabled={!store.canUndo}
        >
          <span className="history-label">{t.undo}</span>
        </Button>
        <Button
          className="history-button"
          aria-label={t.redo}
          title={t.redo}
          startIcon={<RedoIcon />}
          onClick={redoEdit}
          disabled={!store.canRedo}
        >
          <span className="history-label">{t.redo}</span>
        </Button>
        <TeamSearchTools />
        <MoreToggle />
      </Paper>
      <Collapse in={store.isMoreOpen}>
        <Paper sx={{ mb: 1 }}>
          <TeamToolbar />
        </Paper>
      </Collapse>
      <Paper sx={{ minWidth: 0 }}>{tabs}</Paper>
    </Grid>
  );
});

export default TeamBar;
