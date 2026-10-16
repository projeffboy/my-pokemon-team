import { useDeferredValue, useMemo, useState } from "react";
import Button from "@mui/material/Button";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import Link from "@mui/material/Link";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import type { SxProps, Theme } from "@mui/material/styles";
import { observer } from "mobx-react-lite";
import store from "@/store";
import {
  parseTeamsText,
  parseTeamText,
  serializeTeam,
  teamTextProblems,
} from "@/store/team-text";
import copyToClipboard from "@/app/shared/copy-to-clipboard";
import fill from "@/app/shared/fill";
import { useTranslation } from "@/app/shared/TranslationContext";
import { verbatim } from "@/app/shared/text-entry";
import { useIsSmDown } from "@/app/shared/WidthContext";
import TeamTextProblems from "./import-team-form/TeamTextProblems";

// A dialog's body and actions for pasting Showdown text: either new teams to import,
// or the current team's text to edit, with the problems an update would work around.
// Importing or updating calls onDone; cancelling calls onClose.
const ImportTeamForm = observer(function ImportTeamForm({
  isImport,
  onClose,
  onDone = onClose,
  contentSx,
}: {
  isImport: boolean;
  onClose: () => void;
  onDone?: () => void;
  contentSx?: SxProps<Theme>;
}) {
  const { t } = useTranslation();
  const isSmDown = useIsSmDown();
  const { importDialog } = t;
  const [initialText] = useState(() =>
    isImport ? "" : (
      serializeTeam(store.team, store.currentTeam.generation, store.dataFormat)
    ),
  );
  const [text, setText] = useState(initialText);
  const [isNothingFound, setIsNothingFound] = useState(false);
  const { generation } = store.currentTeam;
  const { dataFormat, learnsetsLoaded } = store;
  const deferredText = useDeferredValue(text);
  const problems = useMemo(
    () =>
      isImport || !learnsetsLoaded ?
        []
      : teamTextProblems(deferredText, generation, dataFormat),
    [isImport, learnsetsLoaded, deferredText, generation, dataFormat],
  );

  const handleImport = () => {
    const teams = parseTeamsText(text, store.currentTeam);
    if (!teams.length) {
      setIsNothingFound(true);
      return;
    }
    for (const { name, ...settings } of teams)
      store.addTeam({ ...settings, ...(name && { name }) });
    store.openSnackbar(
      teams.length === 1 ?
        importDialog.imported
      : importDialog.importedMany(teams.length),
      false,
      "import",
    );
    onDone();
  };

  const handleUpdate = () => {
    if (text !== initialText)
      store.replaceTeam(parseTeamText(text, generation, dataFormat));
    else store.openSnackbar(importDialog.noChanges);
    onDone();
  };

  return (
    <>
      <DialogContent sx={contentSx}>
        <DialogContentText>
          {fill(
            isImport ?
              importDialog.importDescription
            : importDialog.editDescription,
            {
              showdown: (
                <Link href="https://play.pokemonshowdown.com/teambuilder">
                  {importDialog.showdown}
                </Link>
              ),
            },
          )}
        </DialogContentText>
        <TextField
          autoFocus
          placeholder={
            isImport ?
              importDialog.importPlaceholder
            : importDialog.editPlaceholder
          }
          multiline
          // Tall enough to read as a box when empty; a long team scrolls within the field,
          // keeping the problems below it in view
          minRows={isSmDown ? 4 : 8}
          maxRows={isSmDown ? 6 : 12}
          fullWidth
          sx={{ mt: 2, mb: 1 }}
          value={text}
          onChange={event => {
            setText(event.target.value);
            setIsNothingFound(false);
          }}
          error={isNothingFound}
          helperText={isNothingFound && importDialog.nothingFound}
          slotProps={{
            // The description above names the box, so the label is for screen readers
            htmlInput: {
              ...verbatim("team-text"),
              "aria-label": importDialog.label,
            },
            // Showdown's text lines up its moves and stats, as in its own import box
            input: { sx: { fontFamily: "monospace", fontSize: 14 } },
          }}
        />
        <TeamTextProblems problems={problems} />
        <Typography
          variant="caption"
          component="p"
          sx={{ color: "text.secondary", mt: 1 }}
        >
          {importDialog.kept}
        </Typography>
      </DialogContent>
      <DialogActions>
        {!isImport && (
          <Button
            startIcon={<ContentCopyIcon />}
            disabled={!text.trim()}
            onClick={() =>
              copyToClipboard(text, t.team.teamCopied, t.team.teamNotCopied)
            }
            // Apart from the actions that close the dialog
            sx={{ mr: "auto" }}
          >
            {importDialog.copy}
          </Button>
        )}
        <Button onClick={onClose}>{t.cancel}</Button>
        <Button
          onClick={isImport ? handleImport : handleUpdate}
          // Until the problems describe the current text, an update could skip them
          disabled={
            !store.learnsetsLoaded ||
            (isImport ? !text.trim() : deferredText !== text)
          }
        >
          {isImport ? importDialog.import : importDialog.update}
        </Button>
      </DialogActions>
    </>
  );
});

export default ImportTeamForm;
