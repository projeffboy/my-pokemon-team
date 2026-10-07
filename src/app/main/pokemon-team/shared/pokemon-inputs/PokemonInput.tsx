import { useMemo } from "react";
import { observer } from "mobx-react-lite";
import store from "@/store";
import { sortPokemon } from "@/store/sorting";
import { useTranslation } from "@/app/shared/TranslationContext";
import PokemonInputSelect from "./pokemon-input/PokemonInputSelect";
import { PokemonProperties } from "@/types";
import { canSelectMove } from "@/shared/moves";

const PokemonInput = observer(function PokemonInput({
  placeholder,
  pokemonProperty,
  teamIndex,
  leadingIcon = false,
}: {
  placeholder: string;
  pokemonProperty: PokemonProperties;
  teamIndex: number;
  leadingIcon?: boolean;
}) {
  const handleChange = (inputValue: string) => {
    if (pokemonProperty === "name") {
      store.selectPokemon(teamIndex, inputValue);
      return;
    }
    const member = store.team[teamIndex];
    if (!member) return;
    if (pokemonProperty === "item" || pokemonProperty === "ability")
      member[pokemonProperty] = inputValue;
    else store.selectMove(teamIndex, pokemonProperty, inputValue);
  };

  const { names } = useTranslation();
  const member = store.team[teamIndex];
  // Stable while the language is, since a new array resets the text being typed
  const items = store.teamItems;
  const allItemNames = useMemo(() => items.map(names.item), [items, names]);
  const abilities = store.teamAbilities[teamIndex];
  const abilityNames = useMemo(
    () => abilities?.map(names.ability) ?? [],
    [abilities, names],
  );
  let optionValues: readonly string[];
  let optionLabels: readonly string[];

  switch (pokemonProperty) {
    case "name": {
      optionValues = store.filteredPokemon;
      optionLabels = store.filteredPokemonNames;
      const selected = member?.name;
      if (selected && !optionValues.includes(selected)) {
        optionValues = sortPokemon(
          [...optionValues, selected],
          store.sort,
          store.translation,
          store.currentTeam.generation,
        );
        optionLabels = optionValues.map(names.pokemon);
      }
      break;
    }
    case "item":
      optionValues = items;
      optionLabels = allItemNames;
      break;
    case "ability":
      optionValues = abilities ?? [];
      optionLabels = abilityNames;
      break;
    default: // for the moves
      optionValues = (store.teamLearnsets.values[teamIndex] ?? []).filter(
        move =>
          !member ||
          move === member[pokemonProperty] ||
          canSelectMove(member, pokemonProperty, move),
      );
      optionLabels = optionValues.map(names.move);
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
      leadingIcon={leadingIcon}
    />
  );
});

export default PokemonInput;
