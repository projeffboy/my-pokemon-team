import React from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import type { SelectChangeEvent } from "@mui/material/Select";
import Grid from "@mui/material/Grid";
import { observer } from "mobx-react";
import store from "../../../store";
import { SearchFilterKey } from "../../../types";

type InputLabelKey = "Format" | "Type" | "Region" | "Moves";

const SearchFilters = observer(function SearchFilters() {
  const inputToFilterKey: Record<InputLabelKey, SearchFilterKey> = {
    Format: "format",
    Type: "type",
    Region: "region",
    Moves: "moves",
  };

  const handleChange = (
    inputLabel: InputLabelKey,
    e: SelectChangeEvent<string>,
  ) => {
    store.searchFilters[inputToFilterKey[inputLabel]] = e.target.value;
  };

  const inputLabels: Record<InputLabelKey, string[]> = {
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

  return (Object.keys(inputLabels) as InputLabelKey[]).map(inputLabel => (
    <Grid
      key={inputLabel}
      container
      justifyContent="center"
      size={{ xs: 6, lg: 3 }}
    >
      <FormControl
        variant="standard"
        sx={{
          minWidth: { xs: 90, md: 120 },
          margin: { xs: "0 10px 10px", lg: "10px" },
        }}
      >
        {/* E.g. Format */}
        <InputLabel htmlFor={inputLabel}>{inputLabel}</InputLabel>
        <Select
          variant="standard"
          value={store.searchFilters[inputToFilterKey[inputLabel]]}
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
          {inputLabels[inputLabel].map((inputValue: string) => (
            <MenuItem key={inputValue} value={inputValue}>
              {inputValue}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Grid>
  ));
});

export default SearchFilters;
