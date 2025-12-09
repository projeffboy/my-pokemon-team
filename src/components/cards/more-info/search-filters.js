import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Grid from "@mui/material/Grid";
import { Observer } from "mobx-react";
import store from "../../../store";

const SearchFilters = () => {
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
              container
              justifyContent="center"
              size={{ xs: 6, lg: 3 }}
            >
              <FormControl
                sx={{
                  minWidth: { xs: 90, md: 120 },
                  m: { xs: "0 10px 10px", lg: "10px" },
                  position: "relative",
                  zIndex: 1,
                }}
              >
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

export default SearchFilters;
