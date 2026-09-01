import PokemonInput from "./pokemon-inputs/PokemonInput";
import PokemonSprite from "./pokemon-inputs/PokemonSprite";
import { PokemonProperties } from "@/types";

export default function PokemonInputs({ teamIndex }: { teamIndex: number }) {
  const inputs: Array<
    | { placeholder: string; pokemonProperty: PokemonProperties }
    | { placeholder: "" }
  > = [
    { placeholder: "Name", pokemonProperty: "name" },
    { placeholder: "Move", pokemonProperty: "move1" },
    { placeholder: "" }, // pokemon sprite
    { placeholder: "Move", pokemonProperty: "move2" },
    { placeholder: "Move", pokemonProperty: "move3" },
    { placeholder: "Move", pokemonProperty: "move4" },
    { placeholder: "Item", pokemonProperty: "item" },
    { placeholder: "Ability", pokemonProperty: "ability" },
  ];

  return (
    <div
      style={{
        display: "grid",
        gridColumnGap: "10px",
        gridTemplateColumns: "1fr 1fr",
      }}
      role="region"
      aria-label={`Pokemon ${teamIndex + 1}`}
    >
      {inputs.map((input, i) => {
        if ("pokemonProperty" in input) {
          return (
            <PokemonInput
              key={i}
              placeholder={input.placeholder}
              teamIndex={teamIndex}
              pokemonProperty={input.pokemonProperty}
            />
          );
        } else {
          return <PokemonSprite key={i} teamIndex={teamIndex} forceFullSize />;
        }
      })}
    </div>
  );
}
