import { useMemo } from "react";
import { observer } from "mobx-react-lite";
import store from "@/store";
import { allItemIds } from "@/shared/names";
import { useTranslation } from "@/app/shared/TranslationContext";
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
  const handleChange = (inputValue: string) => {
    if (pokemonProperty === "name") {
      store.selectPokemon(teamIndex, inputValue);
      return;
    }
    const member = store.team[teamIndex];
    if (member) member[pokemonProperty] = inputValue;
  };

  const { names } = useTranslation();
  const member = store.team[teamIndex];
  // Stable while the language is, since a new array resets the text being typed
  const allItemNames = useMemo(() => allItemIds.map(names.item), [names]);
  let optionValues: readonly string[];
  let optionLabels: readonly string[];

  switch (pokemonProperty) {
    case "name": {
      optionValues = store.filteredPokemon;
      optionLabels = store.filteredPokemonNames;
      const selected = member?.name;
      if (selected && !optionValues.includes(selected)) {
        optionValues = [...optionValues, selected];
        optionLabels = [...optionLabels, names.pokemon(selected)];
      }
      break;
    }
    case "item":
      optionValues = allItemIds;
      optionLabels = allItemNames;
      break;
    case "ability":
      optionValues = store.teamAbilities[teamIndex] ?? [];
      optionLabels = optionValues.map(names.ability);
      break;
    default: // for the moves
      optionValues = store.teamLearnsets.values[teamIndex] ?? [];
      optionLabels = store.teamLearnsets.labels[teamIndex] ?? [];
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
