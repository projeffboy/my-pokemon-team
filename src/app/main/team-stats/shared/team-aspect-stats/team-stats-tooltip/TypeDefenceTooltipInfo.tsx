import Box from "@mui/material/Box";
import { observer } from "mobx-react-lite";
import store from "@/store";
import { defenceMultiplier } from "@/store/matrix";
import fill from "@/app/shared/fill";
import { useTranslation } from "@/app/shared/TranslationContext";
import PokemonIcon from "@/app/shared/PokemonIcon";
import type { PokemonType } from "@/types";
import TypeBadge from "./shared/TypeBadge";

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
          type: <TypeBadge type={type} typeColor={typeColor} />,
        })}
      </p>
      <Box component="ul" sx={{ listStyle: "none", p: 0 }}>
        {store.analysisTeam.map(({ name: pokemon, ability, item }, i) => {
          if (!pokemon) return null;
          const multiplier = defenceMultiplier(
            type,
            pokemon,
            ability,
            item,
            store.currentTeam.generation,
          );
          const color =
            multiplier >= 3 ? "error.main"
            : multiplier > 1 ? "warning.main"
            : multiplier < 1 ? "success.main"
            : "inherit";
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
              <Box component="span" sx={{ flexGrow: 1, pr: 0.25 }}>
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
