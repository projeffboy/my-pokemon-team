import Box from "@mui/material/Box";
import PokemonInput from "./pokemon/PokemonInput";
import Sprite from "./pokemon/Sprite";

interface PokemonProps {
  teamIndex: number;
  width: string;
}

function Pokemon(props: PokemonProps) {
  const placeholders = [
    "Name",
    "Move",
    "",
    "Move",
    "Move",
    "Move",
    "Item",
    "Ability",
  ];

  let counter = 1;

  // 8 Grid Items About Each Pokemon
  const pokemonInputs = placeholders.map((placeholder, i) => {
    if (placeholder) {
      let pokemonProp = placeholder.toLowerCase();
      if (placeholder === "Move") {
        pokemonProp += counter;
        counter++;
      }
      return (
        <PokemonInput
          key={i}
          placeholder={placeholder}
          teamIndex={props.teamIndex}
          pokemonProp={pokemonProp}
        />
      );
    } else {
      let width = "md";
      if (props.width === "lg" || props.width === "xl") {
        width = props.width;
      }

      return <Sprite key={i} teamIndex={props.teamIndex} width={width} />;
    }
  });

  return (
    <Box
      sx={{
        display: "grid",
        gridColumnGap: "10px",
        gridTemplateColumns: "1fr 1fr",
      }}
      role="region"
      aria-label={`Pokemon ${props.teamIndex + 1}`}
    >
      {pokemonInputs}
    </Box>
  );
}

export default Pokemon;
