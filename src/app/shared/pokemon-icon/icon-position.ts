// The sheet holds species icons up to Pecharunt's, then the forme icons that
// Showdown's altSpriteNum indexes point to
const LAST_SPECIES_ICON = 1025;

// Pokemon Showdown's getPokemonIconNum: icon 0 is the question mark
export function pokemonIconPosition(num: number, iconIndex?: number) {
  const index = iconIndex ?? (num < 0 || num > LAST_SPECIES_ICON ? 0 : num);
  return { left: (index % 12) * 40, top: Math.floor(index / 12) * 30 };
}
