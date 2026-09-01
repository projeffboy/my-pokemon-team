import PokemonInput from "./pokemon-inputs/PokemonInput";
import PokemonSprite from "./pokemon-inputs/PokemonSprite";
import { PokemonProperties } from "@/types";

export default function PokemonInputs({ teamIndex }: { teamIndex: number }) {
  const inputs: Array<
    | { placeholder: string; pokemonProperties: PokemonProperties }
    | { placeholder: "" }
  > = [
    { placeholder: "Name", pokemonProperties: "name" },
    { placeholder: "Move", pokemonProperties: "move1" },
    { placeholder: "" }, // pokemon sprite
    { placeholder: "Move", pokemonProperties: "move2" },
    { placeholder: "Move", pokemonProperties: "move3" },
    { placeholder: "Move", pokemonProperties: "move4" },
    { placeholder: "Item", pokemonProperties: "item" },
    { placeholder: "Ability", pokemonProperties: "ability" },
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
        if ("pokemonProperties" in input) {
          return (
            <PokemonInput
              key={i}
              placeholder={input.placeholder}
              teamIndex={teamIndex}
              pokemonProperties={input.pokemonProperties}
            />
          );
        } else {
          return <PokemonSprite key={i} teamIndex={teamIndex} forceFullSize />;
        }
      })}
    </div>
  );
}
