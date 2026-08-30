import React from "react";
import PokemonInput from "./pokemon/pokemon-input";
import Sprite from "./pokemon/sprite";
import { PokemonProp } from "../../types";

interface PokemonProps {
  teamIndex: number;
}

export default function Pokemon(props: PokemonProps) {
  const inputs: Array<
    { placeholder: string; pokemonProp: PokemonProp } | { placeholder: "" }
  > = [
    { placeholder: "Name", pokemonProp: "name" },
    { placeholder: "Move", pokemonProp: "move1" },
    { placeholder: "" },
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
          teamIndex={props.teamIndex}
          pokemonProp={input.pokemonProp}
        />
      );
    } else {
      return <Sprite key={i} teamIndex={props.teamIndex} forceFullSize />;
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
      aria-label={`Pokemon ${props.teamIndex + 1}`}
    >
      {pokemonInputs}
    </div>
  );
}
