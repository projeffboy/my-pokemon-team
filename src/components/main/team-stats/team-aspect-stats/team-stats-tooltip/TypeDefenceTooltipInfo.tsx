import store from "@/store";
import PokemonIcon from "../../../pokemon-team/pokemon-input/pokemon-input-select/PokemonIcon";
import type { PokemonType } from "@/types";

export default function TypeDefenceTooltipInfo({
  typeColor,
  type,
}: {
  typeColor: string;
  type: PokemonType;
}) {
  return (
    <>
      <p>
        <span style={{ color: `#${typeColor}` }}>{type}</span> does...
      </p>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {store.team.map((teamPokemonProperties, i) => {
          const { name: pokemon, ability, item } = teamPokemonProperties;
          if (!pokemon) return null;
          const effectiveness = store.typeAgainstPokemon(
            type,
            pokemon,
            ability,
            item,
          );
          let multiplier = 1;
          let color = "initial";
          switch (effectiveness) {
            case -2:
              multiplier = 4;
              color = "red";
              break;
            case -1.5:
              multiplier = 3;
              color = "red";
              break;
            case -1:
              multiplier = 2;
              color = "#f9d130";
              break;
            case -0.5:
              multiplier = 1.5;
              color = "#f9d130";
              break;
            case 1:
              multiplier = 0.5;
              color = "yellowgreen";
              break;
            case 2:
              multiplier = 0.25;
              color = "forestgreen";
              break;
            case 3:
              multiplier = 0;
              color = "grey";
              break;
          }
          return (
            <li
              key={teamPokemonProperties.name + i}
              style={{ display: "flex", alignItems: "center" }}
            >
              <span
                style={{
                  color,
                  width: 40,
                  textAlign: "right",
                  paddingRight: 4,
                }}
              >
                {multiplier}x
              </span>
              <span style={{ paddingRight: 2 }}>
                to {store.pokemonName(pokemon)}
              </span>
              <PokemonIcon pokemonProperty="name" value={pokemon} />
            </li>
          );
        })}
      </ul>
    </>
  );
}
