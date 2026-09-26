import Box from "@mui/material/Box";
import { observer } from "mobx-react-lite";
import store from "@/store";
import { typeAgainstPokemon } from "@/store/shared/effectiveness";
import fill from "@/app/shared/fill";
import { useTranslation } from "@/app/shared/TranslationContext";
import PokemonIcon from "@/app/main/shared/PokemonIcon";
import type { PokemonType } from "@/types";

// Keyed by the type defence score, which is negative when the type is super effective
const EFFECTIVENESS: Partial<
  Record<number, { multiplier: number; color: string }>
> = {
  [-2]: { multiplier: 4, color: "error.main" },
  [-1.5]: { multiplier: 3, color: "error.main" },
  [-1]: { multiplier: 2, color: "warning.main" },
  [-0.5]: { multiplier: 1.5, color: "warning.main" },
  [1]: { multiplier: 0.5, color: "success.light" },
  [2]: { multiplier: 0.25, color: "success.main" },
  [3]: { multiplier: 0, color: "text.disabled" },
};

const TypeDefenceTooltipInfo = observer(function TypeDefenceTooltipInfo({
  typeColor,
  type,
}: {
  typeColor: string;
  type: PokemonType;
}) {
  const { t, names } = useTranslation();
  return (
    <>
      <p>
        {fill(t.stats.typeDoes, {
          type: (
            <Box component="span" sx={{ color: typeColor }}>
              {names.type(type)}
            </Box>
          ),
        })}
      </p>
      <Box component="ul" sx={{ listStyle: "none", p: 0 }}>
        {store.team.map(({ name: pokemon, ability, item }, i) => {
          if (!pokemon) return null;
          const { multiplier = 1, color = "inherit" } =
            EFFECTIVENESS[typeAgainstPokemon(type, pokemon, ability, item)] ??
            {};
          return (
            <Box
              component="li"
              key={pokemon + i}
              sx={{ display: "flex", alignItems: "center" }}
            >
              <Box
                component="span"
                sx={{ color, width: 40, textAlign: "right", pr: 0.5 }}
              >
                {t.stats.multiplier(multiplier)}
              </Box>
              <Box component="span" sx={{ pr: 0.25 }}>
                {t.stats.toPokemon(names.pokemon(pokemon))}
              </Box>
              <PokemonIcon pokemonProperty="name" value={pokemon} />
            </Box>
          );
        })}
      </Box>
    </>
  );
});

export default TypeDefenceTooltipInfo;
