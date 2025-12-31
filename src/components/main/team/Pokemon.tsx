import PokemonInput from "./pokemon/PokemonInput";
import Sprite from "./common/Sprite";
import Paper from "@mui/material/Paper";

function Pokemon(props: { teamSlot: number }) {
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
          teamSlot={props.teamSlot}
          pokemonProp={pokemonProp}
        />
      );
    } else {
      return <Sprite key={i} teamSlot={props.teamSlot} />;
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
      component="section"
      aria-label={`Pokemon ${props.teamSlot + 1}`}
    >
      {pokemonInputs}
    </Paper>
  );
}

export default Pokemon;
