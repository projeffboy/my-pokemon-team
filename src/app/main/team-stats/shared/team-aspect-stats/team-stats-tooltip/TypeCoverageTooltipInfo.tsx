import Box from "@mui/material/Box";
import { observer } from "mobx-react-lite";
import store from "@/store";
import { pokemonTypes } from "@/shared/pokedex";
import fill from "@/app/shared/fill";
import { useTranslation } from "@/app/shared/TranslationContext";
import {
  moveAgainstType,
  moveType as getMoveType,
} from "@/store/shared/effectiveness";
import PokemonIcon from "@/app/main/shared/PokemonIcon";
import { MOVE_KEYS, type PokemonType } from "@/types";

const TypeCoverageTooltipInfo = observer(function TypeCoverageTooltipInfo({
  typeColor,
  type,
}: {
  typeColor: string;
  type: PokemonType;
}) {
  const { t, names } = useTranslation();
  const superEffectiveMoves = store.team.flatMap((member, i) =>
    MOVE_KEYS.flatMap(key => {
      const { name: pokemon, ability } = member;
      const move = member[key];
      if (!move || moveAgainstType(move, type, pokemon, ability) !== -1) {
        return [];
      }
      const moveType = getMoveType(move, pokemon, ability);
      const isStab = !!moveType && pokemonTypes(pokemon).includes(moveType);
      return [{ key: `${i}-${key}`, move, pokemon, isStab }];
    }),
  );

  return (
    <>
      <p>
        {fill(t.stats.superEffectiveAgainst, {
          type: (
            <Box component="span" sx={{ color: typeColor }}>
              {names.type(type)}
            </Box>
          ),
        })}
      </p>
      <Box component="ul" sx={{ listStyle: "none", p: 0 }}>
        {superEffectiveMoves.length === 0 && (
          <Box component="li" sx={{ textAlign: "center" }}>
            {t.nothing}
          </Box>
        )}
        {superEffectiveMoves.map(({ key, move, pokemon, isStab }) => (
          <Box
            component="li"
            key={key}
            sx={{
              display: "flex",
              alignItems: "center",
              fontWeight: isStab ? 500 : 400,
            }}
          >
            <Box component="span" sx={{ width: 150 }}>
              {names.move(move)}
            </Box>
            <span>{`${names.pokemon(pokemon)} `}</span>
            <PokemonIcon pokemonProperty="name" value={pokemon} />
          </Box>
        ))}
      </Box>
    </>
  );
});

export default TypeCoverageTooltipInfo;
