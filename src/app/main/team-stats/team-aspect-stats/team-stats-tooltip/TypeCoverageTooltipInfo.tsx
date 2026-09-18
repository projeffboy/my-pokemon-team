import { Fragment } from "react";
import store from "@/store";
import PokemonIcon from "@/app/main/shared/PokemonIcon";
import { MOVE_KEYS, type PokemonType } from "@/types";

export default function TypeCoverageTooltipInfo({
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
                  store.moveAgainstType(move, type, pokemon, ability) === -1
                ) {
                  hasSuperEffectiveMove = true;
                  const moveType = store.moveType(move, pokemon, ability);
                  return (
                    <li
                      key={move + key}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        fontWeight:
                          (
                            moveType &&
                            store.pokemonType(pokemon).includes(moveType)
                          ) ?
                            500
                          : 400,
                      }}
                    >
                      <span style={{ width: 150 }}>{store.moveName(move)}</span>
                      <span>{store.pokemonName(pokemon) + " "}</span>
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
}
