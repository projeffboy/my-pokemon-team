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

const ImportTeamForm = observer(function ImportTeamForm({
  isImport,
  titleId,
}: {
  isImport: boolean;
  titleId: string;
}) {
  const initialText = isImport ? "" : serializeTeamText();
  const [text, setText] = useState(initialText);
  const close = () => store.closeDialog();

  const handleImport = () => {
    const teams = parseTeamsText(text);
    for (const { name, generation, format, team } of teams) {
      store.addTeam({ ...(name && { name }), generation, format, team });
    }
    store.openSnackbar(
      teams.length === 1 ? "Team imported" : `${teams.length} teams imported`,
    );
    close();
  };

  const handleUpdate = () => {
    if (text !== initialText) store.replaceTeam(parseTeamText(text));
    else store.openSnackbar("No changes made.");
    close();
  };

  return (
    <>
      <DialogTitle id={titleId}>
        {isImport ? "Import Team" : "Edit Pokepaste"}
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          {isImport ?
            "Paste a team, or a whole backup with several teams, in "
          : "This is your team's raw text. Change it here, or paste it into "}
          <Link href="https://play.pokemonshowdown.com/teambuilder">
            Pokemon Showdown
          </Link>
          {isImport ? "'s format." : "."}
        </DialogContentText>
        <TextField
          autoFocus
          variant="standard"
          placeholder={isImport ? "Paste a team here" : "Your team is empty"}
          label="Pokemon Showdown Team Raw Text"
          multiline
          fullWidth
          sx={{ my: 2.5 }}
          value={text}
          onChange={event => setText(event.target.value)}
        />
        <DialogContentText>
          Nicknames, levels, genders, shiny, tera types, natures, EVs, and IVs
          are kept. Happiness is ignored.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={close}>Cancel</Button>
        <Button
          onClick={isImport ? handleImport : handleUpdate}
          disabled={!store.learnsetsLoaded || (isImport && !text.trim())}
        >
          {isImport ? "Import" : "Update"}
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
