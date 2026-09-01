import { observer } from "mobx-react";
import store from "@/store";
import PokemonInputSelect from "./pokemon-input/PokemonInputSelect";
import { PokemonProperties } from "@/types";

/*
 * 1. If you change the pokemon name, <PokemonInputSelect /> triggers handleChange.
 * 2. It updates the change to the store.
 * 3. Since the store is reactive, the prop value passed to <PokemonInputSelect /> will be updated too.
 */
const PokemonInput = observer(function PokemonInput({
  placeholder,
  pokemonProperties,
  teamIndex,
}: {
  placeholder: string;
  pokemonProperties: PokemonProperties;
  teamIndex: number;
}) {
  const handleChange = (inputVal: string) => {
    if (pokemonProperties === "name") {
      store.clearTeamPokemonProperties(teamIndex);
    }

    store.team[teamIndex][pokemonProperties] = inputVal;

    /*
     * If the input is where you put your pokemon name,
     * and the pokemon has only one type,
     * then auto select its ability.
     */
    if (pokemonProperties === "name") {
      store.autoSelectItem();
      store.autoSelectAbility();
    }
  };

  let optionValues: string[] = [];
  let optionLabels: string[] = [];

  switch (pokemonProperties) {
    case "name":
      optionValues = store.filteredPokemon;
      // Fall back to the ID so labels stay aligned with optionValues
      optionLabels = store.filteredPokemonNames.map(
        (name, i) => name ?? optionValues[i],
      );
      let pokemonName = store.team[teamIndex][pokemonProperties];
      if (pokemonName && !optionValues.includes(pokemonName)) {
        optionValues = [...optionValues, pokemonName];
        optionLabels = [
          ...optionLabels,
          store.pokemonName(pokemonName) ?? pokemonName,
        ];
      }
      break;
    case "item":
      optionValues = store.itemsArr;
      optionLabels = store.itemNamesArr.map(
        (name, i) => name ?? store.itemsArr[i],
      );
      break;
    case "ability":
      optionValues = store.teamAbilities[teamIndex];
      optionLabels = optionValues;
      break;
    default: // for the moves
      optionValues = store.teamLearnsets.values[teamIndex];
      optionLabels = store.teamLearnsets.labels[teamIndex].map(
        (name, i) => name ?? optionValues[i],
      );
  }

  return (
    <PokemonInputSelect
      placeholder={placeholder}
      optionValues={optionValues}
      optionLabels={optionLabels}
      onChange={handleChange}
      value={store.team[teamIndex][pokemonProperties]}
      pokemonProperties={pokemonProperties}
      teamIndex={teamIndex}
    />
  );
});

export default PokemonInput;
