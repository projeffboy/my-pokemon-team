import Box from "@mui/material/Box";
import PokemonInput from "./pokemon-inputs/PokemonInput";
import PokemonSprite from "./PokemonSprite";
import { PokemonProperties } from "@/types";

// "sprite" marks the pokemon sprite's cell in the grid
const INPUTS: ReadonlyArray<
  { placeholder: string; pokemonProperty: PokemonProperties } | "sprite"
> = [
  { placeholder: "Name", pokemonProperty: "name" },
  { placeholder: "Move", pokemonProperty: "move1" },
  "sprite",
  { placeholder: "Move", pokemonProperty: "move2" },
  { placeholder: "Move", pokemonProperty: "move3" },
  { placeholder: "Move", pokemonProperty: "move4" },
  { placeholder: "Item", pokemonProperty: "item" },
  { placeholder: "Ability", pokemonProperty: "ability" },
];

export default function PokemonInputs({ teamIndex }: { teamIndex: number }) {
  return (
    <Box
      sx={{
        display: "grid",
        columnGap: 1,
        gridTemplateColumns: "1fr 1fr",
      }}
      role="region"
      aria-label={`Pokemon ${teamIndex + 1}`}
    >
      {INPUTS.map(input =>
        input === "sprite" ?
          <PokemonSprite key="sprite" teamIndex={teamIndex} forceFullSize />
        : <PokemonInput
            key={input.pokemonProperty}
            placeholder={input.placeholder}
            teamIndex={teamIndex}
            pokemonProperty={input.pokemonProperty}
          />,
      )}
    </Box>
  );
}
