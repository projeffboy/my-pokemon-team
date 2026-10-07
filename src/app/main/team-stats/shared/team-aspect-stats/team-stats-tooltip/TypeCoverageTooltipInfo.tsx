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
import PokemonIcon from "@/app/shared/PokemonIcon";
import typeIcons from "@/images/type-icons";
import { MOVE_KEYS, type PokemonType } from "@/types";
import TypeBadge from "./shared/TypeBadge";

const TypeCoverageTooltipInfo = observer(function TypeCoverageTooltipInfo({
  typeColor,
  type,
  hasIcon,
}: {
  typeColor: string;
  type: PokemonType;
  hasIcon: boolean;
}) {
  const { t, names } = useTranslation();
  const { generation } = store.currentTeam;
  const superEffectiveMoves = store.analysisTeam.flatMap((member, i) =>
    MOVE_KEYS.flatMap(key => {
      const { name: pokemon, ability } = member;
      const move = member[key];
      if (
        !move ||
        moveAgainstType(move, type, pokemon, ability, generation) !== -1
      ) {
        return [];
      }
      const moveType = getMoveType(move, pokemon, ability, generation);
      const isStab =
        !!moveType && pokemonTypes(pokemon, generation).includes(moveType);
      return [{ key: `${i}-${key}`, move, moveType, pokemon, isStab }];
    }),
  );

  return (
    <>
      <p>
        {fill(t.stats.superEffectiveAgainst, {
          type: (
            <TypeBadge type={type} typeColor={typeColor} hasIcon={hasIcon} />
          ),
        })}
      </p>
      <Box component="ul" sx={{ listStyle: "none", p: 0 }}>
        {superEffectiveMoves.length === 0 && (
          <Box component="li" sx={{ textAlign: "center" }}>
            {t.nothing}
          </Box>
        )}
        {superEffectiveMoves.map(({ key, move, moveType, pokemon, isStab }) => (
          <Box
            component="li"
            key={key}
            sx={{
              display: "flex",
              alignItems: "center",
              fontWeight: isStab ? 500 : 400,
            }}
          >
            <Box
              component="span"
              sx={{
                width: 150,
                display: "flex",
                alignItems: "center",
                gap: 0.75,
              }}
            >
              {moveType && (
                <Box
                  component="img"
                  src={typeIcons[moveType]}
                  alt={names.type(moveType)}
                  sx={{ width: 20, height: 20, flexShrink: 0 }}
                />
              )}
              <span>{names.move(move)}</span>
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
