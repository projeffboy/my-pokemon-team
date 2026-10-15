import { useState } from "react";
import Button from "@mui/material/Button";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import Link from "@mui/material/Link";
import TextField from "@mui/material/TextField";
import { inputLabelClasses } from "@mui/material/InputLabel";
import type { SxProps, Theme } from "@mui/material/styles";
import { observer } from "mobx-react-lite";
import store from "@/store";
import {
  parseTeamsText,
  parseTeamText,
  serializeTeam,
} from "@/store/team-text";
import fill from "@/app/shared/fill";
import { useTranslation } from "@/app/shared/TranslationContext";

// A dialog's body and actions for pasting Showdown text: either new teams to import,
// or the current team's text to edit. Importing or updating calls onDone; cancelling
// calls onClose.
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
  const { importDialog } = t;
  const [initialText] = useState(() =>
    isImport ? "" : (
      serializeTeam(store.team, store.currentTeam.generation, store.dataFormat)
    ),
  );
  const [text, setText] = useState(initialText);
  const [isNothingFound, setIsNothingFound] = useState(false);

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
      store.replaceTeam(
        parseTeamText(text, store.currentTeam.generation, store.dataFormat),
      );
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
          variant="standard"
          placeholder={
            isImport ?
              importDialog.importPlaceholder
            : importDialog.editPlaceholder
          }
          label={importDialog.label}
          multiline
          fullWidth
          sx={{ my: 2.5 }}
          value={text}
          onChange={event => {
            setText(event.target.value);
            setIsNothingFound(false);
          }}
          error={isNothingFound}
          helperText={isNothingFound && importDialog.nothingFound}
          slotProps={{
            // Above the text rather than over it, so a long label wraps instead of being
            // cut off at 320px
            inputLabel: {
              shrink: true,
              sx: {
                position: "static",
                transform: "none",
                maxWidth: "100%",
                whiteSpace: "normal",
                // The size the shrunk label had when it floated
                fontSize: "0.75rem",
              },
            },
            input: { sx: { [`.${inputLabelClasses.root} + &`]: { mt: 0 } } },
          }}
        />
        <DialogContentText>{importDialog.kept}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{t.cancel}</Button>
        <Button
          onClick={isImport ? handleImport : handleUpdate}
          disabled={!store.learnsetsLoaded || (isImport && !text.trim())}
        >
          {isImport ? importDialog.import : importDialog.update}
        </Button>
      </DialogActions>
    </>
  );
});

export default ImportTeamForm;
