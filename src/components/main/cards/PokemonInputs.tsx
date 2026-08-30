import PokemonInput from "./pokemon-inputs/PokemonInput";
import PokemonSprite from "./pokemon-inputs/PokemonSprite";
import { PokemonProp } from "@/types";

export default function PokemonInputs({ teamIndex }: { teamIndex: number }) {
  const inputs: Array<
    { placeholder: string; pokemonProp: PokemonProp } | { placeholder: "" }
  > = [
    { placeholder: "Name", pokemonProp: "name" },
    { placeholder: "Move", pokemonProp: "move1" },
    { placeholder: "" }, // pokemon sprite
    { placeholder: "Move", pokemonProp: "move2" },
    { placeholder: "Move", pokemonProp: "move3" },
    { placeholder: "Move", pokemonProp: "move4" },
    { placeholder: "Item", pokemonProp: "item" },
    { placeholder: "Ability", pokemonProp: "ability" },
  ];

  // 8 Grid Items About Each Pokemon
  const pokemonInputs = inputs.map((input, i) => {
    if ("pokemonProp" in input) {
      return (
        <PokemonInput
          key={i}
          placeholder={input.placeholder}
          teamIndex={teamIndex}
          pokemonProp={input.pokemonProp}
        />
      );
    } else {
      return <PokemonSprite key={i} teamIndex={teamIndex} forceFullSize />;
    }
  });

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
      {pokemonInputs}
    </div>
  );
}
