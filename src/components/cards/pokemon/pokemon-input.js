import React from "react";
import Box from "@mui/material/Box";
import { Observer } from "mobx-react";
import store from "../../../store";
import PokemonInputSelect from "./pokemon-input/pokemon-input-select";

const PokemonInput = ({ placeholder, pokemonProp, teamIndex }) => {
  const handleChange = inputVal => {
    if (pokemonProp === "name") {
      store.clearTeamPkmnProps(teamIndex);
    }

    store.team[teamIndex][pokemonProp] = inputVal;

    /*
     * If the input is where you put your pokemon name,
     * and the pokemon has only one type,
     * then auto select its ability.
     */
    if (pokemonProp === "name") {
      store.autoSelectItem();
      store.autoSelectAbility();
    }
  };

  return (
    <Observer>
      {() => {
        let optionValues = [];
        let optionLabels = [];

        switch (pokemonProp) {
          case "name":
            optionValues = store.filteredPokemon; // store.allPokemon
            optionLabels = store.filteredPokemonNames; // store.allPokemonNames
            let pkmnName = store.team[teamIndex][pokemonProp];
            if (pkmnName && !optionValues.includes(pkmnName)) {
              optionValues = [...optionValues, pkmnName];
              optionLabels = [...optionLabels, store.pkmnName(pkmnName)];
            }
            break;
          case "item":
            optionValues = store.itemsArr;
            optionLabels = store.itemNamesArr;
            break;
          case "ability":
            optionValues = store.teamAbilities[teamIndex];
            optionLabels = optionValues;
            break;
          default: // for the moves
            optionValues = store.teamLearnsets.values[teamIndex];
            optionLabels = store.teamLearnsets.labels[teamIndex];
        }

        return (
          <Box
            sx={{
              minWidth: 0,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <PokemonInputSelect
              placeholder={placeholder}
              optionValues={optionValues}
              optionLabels={optionLabels}
              onChange={handleChange}
              value={store.team[teamIndex][pokemonProp]}
              pokemonProp={pokemonProp}
              teamIndex={teamIndex}
            />
          </Box>
        );
      }}
    </Observer>
  );
};

export default PokemonInput;
