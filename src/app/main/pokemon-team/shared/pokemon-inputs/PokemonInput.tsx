import { observer } from "mobx-react-lite";
import store from "@/store";
import { allItemIds, allItemNames, pokemonName } from "@/shared/names";
import PokemonInputSelect from "./pokemon-input/PokemonInputSelect";
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
    const member = store.team[teamIndex];
    if (!member) return;

    if (pokemonProperty === "name") {
      store.clearTeamPokemonProperties(teamIndex);
    }

    member[pokemonProperty] = inputVal;

    // if pokemon can only have one item and/or ability
    if (pokemonProperty === "name") {
      store.autoSelectItem();
      store.autoSelectAbility();
    }
  };

  const member = store.team[teamIndex];
  let optionValues: readonly string[];
  let optionLabels: readonly string[];

  switch (pokemonProperty) {
    case "name": {
      optionValues = store.filteredPokemon;
      optionLabels = store.filteredPokemonNames.map(
        (name, i) => name ?? optionValues[i] ?? "",
      );
      const selected = member?.name;
      if (selected && !optionValues.includes(selected)) {
        optionValues = [...optionValues, selected];
        optionLabels = [...optionLabels, pokemonName(selected) ?? selected];
      }
      break;
    }
    case "item":
      optionValues = allItemIds;
      optionLabels = allItemNames;
      break;
    case "ability":
      optionValues = store.teamAbilities[teamIndex] ?? [];
      optionLabels = optionValues;
      break;
    default: // for the moves
      optionValues = store.teamLearnsets.values[teamIndex] ?? [];
      optionLabels = (store.teamLearnsets.labels[teamIndex] ?? []).map(
        (name, i) => name ?? optionValues[i] ?? "",
      );
  }

  return (
    <PokemonInputSelect
      placeholder={placeholder}
      optionValues={optionValues}
      optionLabels={optionLabels}
      onChange={handleChange}
      value={member?.[pokemonProperty] ?? ""}
      pokemonProperty={pokemonProperty}
      teamIndex={teamIndex}
    />
  );
});

export default PokemonInput;
