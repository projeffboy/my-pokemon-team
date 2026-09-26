import { useId, useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Link from "@mui/material/Link";
import { observer } from "mobx-react-lite";
import store from "@/store";
import {
  parseTeamsText,
  parseTeamText,
  serializeTeamText,
} from "@/app/shared/team-text";
import fill from "@/app/shared/fill";
import { useTranslation } from "@/app/shared/TranslationContext";

const ImportTeamForm = observer(function ImportTeamForm({
  isImport,
  titleId,
}: {
  isImport: boolean;
  titleId: string;
}) {
  const { t } = useTranslation();
  const { importDialog } = t;
  const initialText = isImport ? "" : serializeTeamText();
  const [text, setText] = useState(initialText);
  const close = () => store.closeDialog();

  const handleImport = () => {
    const teams = parseTeamsText(text);
    for (const { name, generation, format, team } of teams) {
      store.addTeam({ ...(name && { name }), generation, format, team });
    }
    store.openSnackbar(
      teams.length === 1 ?
        importDialog.imported
      : importDialog.importedMany(teams.length),
    );
    close();
  };

  const handleUpdate = () => {
    if (text !== initialText) store.replaceTeam(parseTeamText(text));
    else store.openSnackbar(importDialog.noChanges);
    close();
  };

  return (
    <>
      <DialogTitle id={titleId}>
        {isImport ? importDialog.importTitle : importDialog.editTitle}
      </DialogTitle>
      <DialogContent>
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
          onChange={event => setText(event.target.value)}
        />
        <DialogContentText>{importDialog.kept}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={close}>{t.cancel}</Button>
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

// Imports pasted Showdown text as new teams, or edits the current team's text
const ImportTeamDialog = observer(function ImportTeamDialog() {
  const titleId = useId();
  const name = store.dialog?.name;
  const isOpen = name === "importTeam" || name === "editTeam";

  return (
    <Dialog
      open={isOpen}
      onClose={() => store.closeDialog()}
      aria-labelledby={titleId}
      sx={{ height: "calc(100% - 60px)" }}
      fullWidth
    >
      {isOpen && (
        <ImportTeamForm
          key={name}
          isImport={name === "importTeam"}
          titleId={titleId}
        />
      )}
    </Dialog>
  );
});

export default ImportTeamDialog;
