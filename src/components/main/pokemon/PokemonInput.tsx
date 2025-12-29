import Box from "@mui/material/Box";
import { Observer } from "mobx-react";
import store, { type TeamMember } from "store";
import PokemonInputSelect from "./pokemon-input/PokemonInputSelect";

interface PokemonInputProps {
  placeholder: string;
  pokemonProp: string;
  teamIndex: number;
}

const PokemonInput = ({
  placeholder,
  pokemonProp,
  teamIndex,
}: PokemonInputProps) => {
  const handleChange = (inputVal: string | null) => {
    const val = inputVal || "";
    if (pokemonProp === "name") {
      store.clearTeamPkmnProps(teamIndex);
    }

    store.team[teamIndex][pokemonProp as keyof TeamMember] = val;

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
        let optionValues: any[] = [];
        let optionLabels: any[] = [];

        switch (pokemonProp) {
          case "name":
            optionValues = store.filteredPokemon; // store.allPokemon
            optionLabels = store.filteredPokemonNames; // store.allPokemonNames
            let pkmnName =
              store.team[teamIndex][pokemonProp as keyof TeamMember];
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
              value={store.team[teamIndex][pokemonProp as keyof TeamMember]}
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
