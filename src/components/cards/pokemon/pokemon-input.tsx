import React from "react";
import { observer } from "mobx-react";
import store from "../../../store";
import PokemonInputSelect from "./pokemon-input/pokemon-input-select";
import { PokemonProp } from "../../../types";

interface PokemonInputProps {
  placeholder: string;
  pokemonProp: PokemonProp;
  teamIndex: number;
}

/*
 * 1. If you change the pokemon name, <PokemonInputSelect /> triggers handleChange.
 * 2. It updates the change to the store.
 * 3. Since the store is reactive, the prop value passed to <PokemonInputSelect /> will be updated too.
 */
const PokemonInput = observer(function PokemonInput(props: PokemonInputProps) {
  const { pokemonProp, teamIndex } = props;

  const handleChange = (inputVal: string) => {
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

  let optionValues: string[] = [];
  let optionLabels: string[] = [];

  switch (pokemonProp) {
    case "name":
      optionValues = store.filteredPokemon; // store.allPokemon
      // Fall back to the ID so labels stay aligned with optionValues
      optionLabels = store.filteredPokemonNames.map(
        (name, i) => name ?? optionValues[i]
      ); // store.allPokemonNames
      let pkmnName = store.team[teamIndex][pokemonProp];
      if (pkmnName && !optionValues.includes(pkmnName)) {
        optionValues = [...optionValues, pkmnName];
        optionLabels = [
          ...optionLabels,
          store.pkmnName(pkmnName) ?? pkmnName,
        ];
      }
      break;
    case "item":
      optionValues = store.itemsArr;
      optionLabels = store.itemNamesArr.map(
        (name, i) => name ?? store.itemsArr[i]
      );
      break;
    case "ability":
      optionValues = store.teamAbilities[teamIndex];
      optionLabels = optionValues;
      break;
    default: // for the moves
      optionValues = store.teamLearnsets.values[teamIndex];
      optionLabels = store.teamLearnsets.labels[teamIndex].map(
        (name, i) => name ?? optionValues[i]
      );
  }

  return (
    <PokemonInputSelect
      placeholder={props.placeholder}
      optionValues={optionValues}
      optionLabels={optionLabels}
      onChange={handleChange}
      value={store.team[teamIndex][pokemonProp]}
      pokemonProp={pokemonProp}
      teamIndex={teamIndex}
    />
  );
});

export default PokemonInput;
