import { useDeferredValue, useMemo, useState } from "react";
import Button from "@mui/material/Button";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import Link from "@mui/material/Link";
import TextField from "@mui/material/TextField";
import type { SxProps, Theme } from "@mui/material/styles";
import { observer } from "mobx-react-lite";
import store from "@/store";
import {
  parseTeamsText,
  parseTeamText,
  serializeTeam,
  teamTextProblems,
} from "@/store/team-text";
import fill from "@/app/shared/fill";
import { useTranslation } from "@/app/shared/TranslationContext";
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
        />
        <TeamTextProblems problems={problems} />
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
