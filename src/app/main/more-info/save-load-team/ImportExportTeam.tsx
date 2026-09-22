import { useId, useState, type ChangeEvent, type MouseEvent } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Link from "@mui/material/Link";
import ImportExport from "@mui/icons-material/ImportExport";
import { observer } from "mobx-react-lite";
import store from "@/store";
import { parseTeamText, serializeTeamText } from "@/app/shared/team-text";

const ImportExportTeam = observer(function ImportExportTeam() {
  const titleId = useId();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [textArea, setTextArea] = useState("");

  const handleTextArea = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setTextArea(event.target.value);
  };

  const handleClick = (_event: MouseEvent<HTMLElement>, text: string) => {
    setIsDialogOpen(true);
    setTextArea(text);
  };

  const handleClose = () => setIsDialogOpen(false);

  const handleImport = (initialText: string) => {
    if (textArea !== initialText) {
      store.replaceTeam(parseTeamText(textArea));
    } else {
      store.openSnackbar("No changes made.");
    }

    handleClose();
  };

  const pokemonShowdownTeamInfo = serializeTeamText();

  return (
    <>
      <Button onClick={e => handleClick(e, pokemonShowdownTeamInfo)}>
        Import/Export Team <ImportExport sx={{ ml: 0.5 }} />
      </Button>
      <Dialog
        open={isDialogOpen}
        onClose={handleClose}
        aria-labelledby={titleId}
        sx={{ height: "calc(100% - 60px)" }}
      >
        <DialogTitle id={titleId}>Import/Export</DialogTitle>
        <DialogContent>
          <DialogContentText>
            You can take a look at and change the raw data of your pokemon team.
            <br />
            If you use{" "}
            <Link href="https://play.pokemonshowdown.com/teambuilder">
              Pokemon Showdown
            </Link>
            , you can paste your team here.
            <br />
            Likewise, you can copy your team here and paste it to Pokemon
            Showdown.
          </DialogContentText>
          <TextField
            autoFocus
            variant="standard"
            id="name"
            placeholder="Your team is empty"
            label="Pokemon Showdown Team Raw Text"
            multiline
            fullWidth
            sx={{ my: 2.5 }}
            defaultValue={pokemonShowdownTeamInfo}
            onChange={handleTextArea}
          />
          <DialogContentText>
            Note: The above raw text ignores nicknames, EVs, IVs, natures,
            level, gender, happiness, and shiny.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            onClick={() => handleImport(pokemonShowdownTeamInfo)}
            disabled={!store.learnsetsLoaded}
          >
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
});

export default ImportExportTeam;
