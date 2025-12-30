import Box from "@mui/material/Box";
import { Observer } from "mobx-react";
import store, { type TeamMember } from "store";
import PokemonInputSelect from "./pokemon-input/PokemonInputSelect";

const PokemonInput = ({
  placeholder,
  pokemonProp,
  teamSlot,
}: {
  placeholder: string;
  pokemonProp: string;
  teamSlot: number;
}) => {
  const handleChange = (inputVal: string | null) => {
    const val = inputVal || "";
    if (pokemonProp === "name") {
      store.clearTeamPkmnProps(teamSlot);
    }

    store.team[teamSlot][pokemonProp as keyof TeamMember] = val;

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
              store.team[teamSlot][pokemonProp as keyof TeamMember];
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
            optionValues = store.teamAbilities[teamSlot];
            optionLabels = optionValues;
            break;
          default: // for the moves
            optionValues = store.teamLearnsets.values[teamSlot];
            optionLabels = store.teamLearnsets.labels[teamSlot];
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
              value={store.team[teamSlot][pokemonProp as keyof TeamMember]}
              pokemonProp={pokemonProp}
              teamSlot={teamSlot}
            />
          </Box>
        );
      }}
    </Observer>
  );
};

export default PokemonInput;
