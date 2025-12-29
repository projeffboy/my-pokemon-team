import { useState } from "react";
// Material UI Core Imports
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Link from "@mui/material/Link";
// Material UI Icons Imports
import ImportExport from "@mui/icons-material/ImportExport";
import FileCopy from "@mui/icons-material/FileCopy";
// Custom Imports
import { Observer } from "mobx-react";
import store, { type TeamMember } from "store";
import { range } from "helper";

const PokemonShowdownTeam = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [textArea, setTextArea] = useState("");

  const handleClick = (_e: any, pokemonShowdownTeamInfo: string) => {
    setIsDialogOpen(true);
    setTextArea(pokemonShowdownTeamInfo);
  };

  const handleClose = () => {
    setIsDialogOpen(false);
  };

  const handleTextArea = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTextArea(e.target.value);
  };

  const handleImport = (pokemonShowdownTeamInfo: string) => {
    let text = textArea;
    if (text === "") {
      text = pokemonShowdownTeamInfo;
    }

    // If the text is different from the original team info
    if (text !== pokemonShowdownTeamInfo) {
      // Split by double newline to separate pokemons
      const importedTeam = text.split("\n\n");

      // We only want the first 6 pokemons
      const numberOfTeamPkmn = Math.min(importedTeam.length, 6);

      // Loop through each pokemon
      importedTeam.slice(0, 6).forEach((pkmnRawData, teamIndex) => {
        // Split by newline to separate lines
        const lines = pkmnRawData.split("\n");

        // First line contains Name, Item, Gender
        const firstLine = lines[0];

        // If first line exists
        if (firstLine) {
          // Parse Name
          let name = firstLine.split("@")[0].trim();
          // Handle Gender (M) or (F)
          if (name.includes("(M)")) {
            name = name.replace("(M)", "").trim();
          }
          if (name.includes("(F)")) {
            name = name.replace("(F)", "").trim();
          }

          // Handle Nicknames e.g. Carly Rae (Iron Moth)
          if (name.includes("(") && name.includes(")")) {
            name = name.split("(")[1].split(")")[0];
          }

          const species = store.pkmnNameInverse(name);
          if (species) {
            store.team[teamIndex].name = species;
          }

          // Parse Item
          if (firstLine.includes("@")) {
            const itemName = firstLine.split("@")[1].trim();
            const item = store.itemNameInverse(itemName);
            if (item) {
              store.team[teamIndex].item = item;
            }
          } else {
            store.team[teamIndex].item = "";
          }

          // Parse Ability and Moves
          let moveNum = 1;
          let abilityChanged = false;

          lines.slice(1).forEach(line => {
            if (line.startsWith("Ability:")) {
              const ability = line.split(":")[1].trim();
              store.team[teamIndex].ability = ability;
              abilityChanged = true;
            } else if (line.startsWith("-")) {
              const moveName = line
                .slice(1)
                .trim()
                .replace("[", "")
                .replace("]", "");

              const move = store.moveNameInverse(moveName);
              const pkmn = store.team[teamIndex].name;
              let validMove = move && store.canItLearn(move, pkmn) ? move : "";

              store.team[teamIndex][("move" + moveNum) as keyof TeamMember] =
                validMove;
              moveNum++;
            }
          });

          // If team raw data does not mention ability, leave it blank
          if (!abilityChanged) {
            store.team[teamIndex].ability = "";
            store.autoSelectAbility();
          }
        }
      });

      // Clear unwanted duplicate pokemon
      for (let i = numberOfTeamPkmn; i < 6; i++) {
        store.clearTeamPkmnProps(i);
      }
    } else {
      store.openSnackbar("No changes made.");
    }

    handleClose();
  };

  const handleCopy = (text: string) => {
    if (text !== "") {
      let textArea = document.createElement("textarea");
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      textArea.remove();
      store.openSnackbar("Team copied.");
    } else {
      store.openSnackbar("Empty team, nothing to copy.");
    }
  };

  return (
    <Observer>
      {() => {
        const pokemonShowdownTeamInfo = range(6)
          .map(teamIndex => {
            const { name, item, ability } = store.team[teamIndex];

            if (name) {
              return `${store.pkmnName(name)} @ ${store.itemName(item)}
Ability: ${ability}
${range(4, 1)
  .map(num => {
    const move = store.team[teamIndex][("move" + num) as keyof TeamMember];

    if (move) {
      return "-" + store.moveName(move);
    } else {
      return "-";
    }
  })
  .join("\n")}\n\n`;
            } else {
              return "";
            }
          })
          .join("");

        return (
          <>
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
                    variant="inherit"
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
                  id="name"
                  placeholder="Your team is empty"
                  label="Pokemon Showdown Team Raw Text"
                  multiline
                  fullWidth
                  sx={{ m: "20px 0" }}
                  defaultValue={pokemonShowdownTeamInfo}
                  onChange={handleTextArea}
                />
                <DialogContentText>
                  Note: The above raw text ignores nicknames, EVs, IVs, natures,
                  level, gender, happiness, and shiny.
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose} color="primary">
                  Cancel
                </Button>
                <Button
                  onClick={() => handleImport(pokemonShowdownTeamInfo)}
                  color="primary"
                >
                  Update
                </Button>
              </DialogActions>
            </Dialog>
            <Button
              onClick={() => handleCopy(pokemonShowdownTeamInfo)}
              sx={{ m: 1 }}
            >
              Copy Team <FileCopy style={{ marginLeft: 5 }} />
            </Button>
          </>
        );
      }}
    </Observer>
  );
};

export default PokemonShowdownTeam;
