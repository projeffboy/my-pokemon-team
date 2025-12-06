import React from "react";
import { withStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import Grid from "@material-ui/core/Grid";
import { Observer } from "mobx-react";
import store from "../../../store";
import { searchFiltersStyles } from "../../../styles";

const SearchFilters = ({ classes }) => {
  const handleChange = (inputLabel, e) => {
    store.searchFilters[inputLabel.toLowerCase()] = e.target.value;
  };

  const inputLabels = {
    Format: [
      "Battle Stadium Singles",
      "Uber",
      "OU: Over Used",
      "UU: Under Used",
      "RU: Rarely Used",
      "NU: Never Used",
      "PU",
      "ZU",
      "Little Cup (LC)",
      "Doubles Uber",
      "Doubles OU",
      "Doubles UU",
    ],
    Type: [
      "Bug",
      "Dark",
      "Dragon",
      "Electric",
      "Fighting",
      "Fairy",
      "Fire",
      "Flying",
      "Ghost",
      "Grass",
      "Ground",
      "Ice",
      "Normal",
      "Poison",
      "Psychic",
      "Rock",
      "Steel",
      "Water",
    ],
    Region: [
      "Kanto",
      "Johto",
      "Hoenn",
      "Sinnoh",
      "Unova",
      "Kalos",
      "Alola",
      "Galar",
      "Hisui",
      "Paldea",
    ],
    Moves: ["Viable"],
  };

  return (
    <Observer>
      {() => (
        <>
          {Object.keys(inputLabels).map((inputLabel, i) => (
            <Grid
              key={inputLabel}
              item
              container
              justify="center"
              xs={6}
              lg={3}
            >
              <FormControl className={classes.formControl}>
                {/* E.g. Format */}
                <InputLabel htmlFor={inputLabel}>{inputLabel}</InputLabel>
                <Select
                  value={store.searchFilters[inputLabel.toLowerCase()]}
                  onChange={e => handleChange(inputLabel, e)}
                  inputProps={{ id: inputLabel }}
                  MenuProps={{
                    anchorOrigin: {
                      vertical: "top", // Anchor the menu higher
                      horizontal: "left",
                    },
                    transformOrigin: {
                      vertical: "bottom", // Transform it upwards
                      horizontal: "left",
                    },
                    PaperProps: {
                      style: {
                        maxHeight: 450, // Limit the menu height
                        overflowY: "auto", // Enable scrolling for overflow
                      },
                    },
                  }}
                >
                  <MenuItem value="">All</MenuItem>
                  {/* OU: OverUsed */}
                  {inputLabels[inputLabel].map(inputValue => (
                    <MenuItem key={inputValue} value={inputValue}>
                      {inputValue}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          ))}
        </>
      )}
    </Observer>
  );
};

export default withStyles(searchFiltersStyles)(SearchFilters);
