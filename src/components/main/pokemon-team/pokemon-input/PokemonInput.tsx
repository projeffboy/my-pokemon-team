import { observer } from "mobx-react";
import store from "@/store";
import PokemonInputSelect from "./PokemonInputSelect";
import { PokemonProperties } from "@/types";

const PokemonInput = observer(function PokemonInput({
  placeholder,
  pokemonProperty,
  teamIndex,
}: {
  placeholder: string;
  pokemonProperty: PokemonProperties;
  teamIndex: number;
}) {
  const handleChange = (inputVal: string) => {
    if (pokemonProperty === "name") {
      store.clearTeamPokemonProperties(teamIndex);
    }

    store.team[teamIndex][pokemonProperty] = inputVal;

    // if pokemon can only have one item and/or ability
    if (pokemonProperty === "name") {
      store.autoSelectItem();
      store.autoSelectAbility();
    }
  };

  let optionValues: string[] = [];
  let optionLabels: string[] = [];

  switch (pokemonProperty) {
    case "name":
      optionValues = store.filteredPokemon;
      optionLabels = store.filteredPokemonNames.map(
        (name, i) => name ?? optionValues[i],
      );
      let pokemonName = store.team[teamIndex].name;
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
      value={store.team[teamIndex][pokemonProperty]}
      pokemonProperty={pokemonProperty}
      teamIndex={teamIndex}
    />
  );
});

export default PokemonInput;
