import { Fragment } from "react";
import { observer } from "mobx-react-lite";
import store from "@/store";
import { moveName, pokemonName } from "@/shared/names";
import { pokemonTypes } from "@/shared/pokedex";
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
  let hasSuperEffectiveMove = false;

  return (
    <>
      <p>
        Super effective against{" "}
        <span style={{ color: `#${typeColor}` }}>{type}</span>:
      </p>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {store.team.map((teamPokemonProperties, i) => {
          const { name: pokemon, ability } = teamPokemonProperties;
          return (
            <Fragment key={pokemon + i}>
              {MOVE_KEYS.map((key, index) => {
                const move = teamPokemonProperties[key];
                if (
                  move &&
                  moveAgainstType(move, type, pokemon, ability) === -1
                ) {
                  hasSuperEffectiveMove = true;
                  const moveType = getMoveType(move, pokemon, ability);
                  return (
                    <li
                      key={move + key}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        fontWeight:
                          moveType && pokemonTypes(pokemon).includes(moveType) ?
                            500
                          : 400,
                      }}
                    >
                      <span style={{ width: 150 }}>{moveName(move)}</span>
                      <span>{pokemonName(pokemon) + " "}</span>
                      <PokemonIcon pokemonProperty="name" value={pokemon} />
                    </li>
                  );
                }
                if (index === 3 && i === 5 && !hasSuperEffectiveMove)
                  return (
                    <li key={pokemon + i} style={{ textAlign: "center" }}>
                      Nothing
                    </li>
                  );
                return null;
              })}
            </Fragment>
          );
        })}
      </ul>
    </>
  );
});

export default TypeCoverageTooltipInfo;
