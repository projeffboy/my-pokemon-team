import { useState, type ChangeEvent, type MouseEvent } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Link from "@mui/material/Link";
import ImportExport from "@mui/icons-material/ImportExport";
import FileCopy from "@mui/icons-material/FileCopy";
import { observer } from "mobx-react";
import store from "@/store";
import { applyTeamText, serializeTeamText } from "@/team-link";

const PokemonShowdownTeam = observer(function PokemonShowdownTeam() {
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
      applyTeamText(textArea);
    } else {
      store.openSnackbar("No changes made.");
    }

    handleClose();
  };

  const handleCopy = (text: string) => {
    if (text !== "") {
      // Copied this code from https://hackernoon.com/copying-text-to-clipboard-with-javascript-df4d4988697f

      let textArea = document.createElement("textarea");

      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      textArea.remove();

      //

      store.openSnackbar("Team copied.");
    } else {
      store.openSnackbar("Empty team, nothing to copy.");
    }
  };

  const pokemonShowdownTeamInfo = serializeTeamText();

  return (
    <Grid
      container
      sx={{
        pt: 1,
        pb: 2,
        justifyContent: "center",
        minHeight: { sm: 122 },
        alignItems: "center",
      }}
    >
      <Grid>
        <Button onClick={e => handleClick(e, pokemonShowdownTeamInfo)}>
          Import/Export Team <ImportExport style={{ marginLeft: 5 }} />
        </Button>
        <Dialog
          open={isDialogOpen}
          onClose={handleClose}
          aria-labelledby="form-dialog-title"
          style={{ height: "calc(100% - 60px)" }}
        >
          <DialogTitle id="form-dialog-title">Import/Export</DialogTitle>
          <DialogContent>
            <DialogContentText>
              You can take a look at and change the raw data of your pokemon
              team.
              <br />
              If you use{" "}
              <Link
                style={{ color: "#2196f3" }}
                target="_blank"
                rel="noopener"
                href="https://play.pokemonshowdown.com/teambuilder"
              >
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
            <Button onClick={() => handleImport(pokemonShowdownTeamInfo)}>
              Update
            </Button>
          </DialogActions>
        </Dialog>
      </Grid>
      <Grid>
        <Button
          onClick={() => handleCopy(pokemonShowdownTeamInfo)}
          sx={{ ml: 1 }}
        >
          Copy Team <FileCopy style={{ marginLeft: 5 }} />
        </Button>
      </Grid>
    </Grid>
  );
});

export default PokemonShowdownTeam;
