import Box from "@mui/material/Box";
import { observer } from "mobx-react-lite";
import store from "@/store";
import fill from "@/app/shared/fill";
import { useTranslation } from "@/app/shared/TranslationContext";
import {
  moveAgainstType,
  moveType as getMoveType,
  effectivePokemonTypes,
} from "@/store/shared/effectiveness";
import PokemonIcon from "@/app/shared/PokemonIcon";
import typeIcons from "@/images/type-icons";
import { MOVE_KEYS, type PokemonType } from "@/types";
import TypeBadge from "./shared/TypeBadge";

const TypeCoverageTooltipInfo = observer(function TypeCoverageTooltipInfo({
  typeColor,
  type,
}: {
  typeColor: string;
  type: PokemonType;
}) {
  const { t, names } = useTranslation();
  const { generation } = store.currentTeam;
  const format = store.dataFormat;
  const superEffectiveMoves = store.analysisTeam.flatMap((member, i) =>
    MOVE_KEYS.flatMap(key => {
      const { name: pokemon, ability, item } = member;
      const move = member[key];
      if (
        !move ||
        moveAgainstType(
          move,
          type,
          pokemon,
          ability,
          generation,
          item,
          member.happiness,
          member,
          format,
        ) !== -1
      ) {
        return [];
      }
      const moveType = getMoveType(
        move,
        pokemon,
        ability,
        generation,
        item,
        format,
      );
      const isStab =
        !!moveType &&
        effectivePokemonTypes(pokemon, ability, item, generation).includes(
          moveType,
        );
      return [{ key: `${i}-${key}`, move, moveType, pokemon, isStab }];
    }),
  );

  return (
    <>
      <p>
        {fill(t.stats.superEffectiveAgainst, {
          type: <TypeBadge type={type} typeColor={typeColor} />,
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
