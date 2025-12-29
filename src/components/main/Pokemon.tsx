import PokemonInput from "./pokemon/PokemonInput";
import Sprite from "./pokemon/Sprite";
import Paper from "@mui/material/Paper";

interface PokemonProps {
  teamIndex: number;
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
      return <Sprite key={i} teamIndex={props.teamIndex} />;
    }
  });

  return (
    <Paper
      sx={{
        display: "grid",
        gridColumnGap: "10px",
        gridTemplateColumns: "1fr 1fr",
        py: 2,
      }}
      role="region"
      aria-label={`Pokemon ${props.teamIndex + 1}`}
    >
      {pokemonInputs}
    </Paper>
  );
}

export default Pokemon;
