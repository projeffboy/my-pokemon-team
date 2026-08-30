import React, { useState } from "react";
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
import { observer } from "mobx-react";
import store from "../../../store";
import { pokemonShowdownTeamStyles } from "../../../styles";
import { Breakpoint } from "../../../types";

interface PokemonShowdownTeamProps {
  width: Breakpoint;
}

const PokemonShowdownTeam = observer(function PokemonShowdownTeam(
  _props: PokemonShowdownTeamProps
) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [textArea, setTextArea] = useState("");

    const handleTextArea = (
      event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
      setTextArea(event.target.value);
    };

    const handleClick = (_event: React.MouseEvent<HTMLElement>, text: string) => {
      setIsDialogOpen(true);
      setTextArea(text);
    };

    const handleClose = () => setIsDialogOpen(false);

    const handleImport = (initialText: string) => {
      if (textArea !== initialText) {
        let teamPkmnRawData = textArea.split("\n\n"); // split team into each pokemon
        let numberOfTeamPkmn = 0;

        teamPkmnRawData = teamPkmnRawData
          .filter(eachPkmnData => eachPkmnData) // get rid of empty lines
          .slice(0, 6); // a team has at most 6 pokemon
        teamPkmnRawData.forEach((eachPkmnData, teamIndex) => {
          numberOfTeamPkmn++;

          const lines = eachPkmnData.split("\n"); // split pokemon into its properties

          // Get pokemon and item names
          const pkmnAndItemNames = lines[0].split("@").map(str => str.trim());
          const [pkmnNameAndNickname, itemName] = pkmnAndItemNames;

          // Check for nickname
          let pkmnName = pkmnNameAndNickname;
          if (pkmnName.includes("(")) {
            pkmnName = pkmnName.split("(")[1].replace(")", "");
          }

          // Check if the pokemon the user typed is legit
          const pkmn = store.pkmnNameInverse(
            pkmnName.replace(/\(.\)/, "").trim()
          );
          if (pkmn) {
            store.team[teamIndex].name = pkmn; // if legit, set pokemon ID/name

            // If team raw data does not mention item, leave it blank
            if (itemName) {
              // Check if item is legit
              const item = store.itemNameInverse(itemName);
              if (item) {
                store.team[teamIndex].item = item; // if legit, set item ID/name
              } else {
                store.autoSelectItem();
              }
            } else {
              store.team[teamIndex].item = "";
            }

            let moveNum = 1;
            let abilityChanged = false;

            lines.slice(1).forEach(line => {
              if (line.includes("Ability:")) {
                // if property has to do with abilities
                const ability = line.replace("Ability:", "").trim();

                // If legit, set ability
                if (Object.values(store.abilities(pkmn)).includes(ability)) {
                  store.team[teamIndex].ability = ability;
                  abilityChanged = true;
                }
              } else if (line[0] === "-" && moveNum <= 4) {
                // if property has to do with moves
                const moveName = line
                  .slice(1)
                  .trim()
                  .replace("[", "") // Smogon accepts, for instance, 'Hidden Power [Fire]' as a move
                  .replace("]", "");

                // If legit, set move
                // Otherwise, set it blank
                const move = store.moveNameInverse(moveName);

                const validMove = store.canItLearn(move, pkmn) && move ? move : "";

                store.team[teamIndex]["move" + moveNum] = validMove;

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

        /*
         * Clears unwanted duplicate pokemon
         * Happens when the user for example...
         *  -adds pikachu to the 3rd team slot (`teamIndex` of 2)
         *  -presses import/export button
         *  -modifies that pikachu's raw data
         *  -presses OK
         * Without this code, there will be two pikachus, at slot 1 and slot 3
         */
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

      const pokemonShowdownTeamInfo = [0, 1, 2, 3, 4, 5]
        .map(teamIndex => {
          const { name, item, ability } = store.team[teamIndex];

          if (name) {
            return `${store.pkmnName(name)} @ ${store.itemName(item)}
Ability: ${ability}
${[1, 2, 3, 4]
  .map(num => {
    const move = store.team[teamIndex]["move" + num];

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
          <Button
            onClick={e => handleClick(e, pokemonShowdownTeamInfo)}
          >
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
                variant="standard"
                id="name"
                placeholder="Your team is empty"
                label="Pokemon Showdown Team Raw Text"
                multiline
                fullWidth
                sx={pokemonShowdownTeamStyles.textField}
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
            sx={pokemonShowdownTeamStyles.button}
          >
            Copy Team <FileCopy style={{ marginLeft: 5 }} />
          </Button>
        </>
      );
});

export default PokemonShowdownTeam;
