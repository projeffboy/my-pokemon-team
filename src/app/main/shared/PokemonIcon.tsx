import pokedex from "@/data/pokedex";
import items from "@/data/items";
import altSpriteNum from "@/data/altSpriteNum";
import PokemonIconsSheet from "@/images/icon-sheets/pokemonicons-sheet.webp";
import ItemIconsSheet from "@/images/icon-sheets/itemicons-sheet.webp";

/*
 * Returns an icon of a pokemon (pokemonProperty === 'name') or an item (pokemonProperty === 'item)
 * "smicons" is short for sun and moon icons for all the pokemon
 * You can find them here: https://play.pokemonshowdown.com/sprites/smicons-sheet.png
 * You can find the "itemicons" here: https://play.pokemonshowdown.com/sprites/itemicons-sheet.png
 */
export default function PokemonIcon({
  pokemonProperty,
  value,
}: {
  pokemonProperty: string;
  value: string;
}) {
  if (pokemonProperty === "name" || pokemonProperty === "item") {
    let type;
    let left;
    let top;
    let width;
    let height;

    if (pokemonProperty === "name") {
      type = PokemonIconsSheet;

      const pokedexNumber = altSpriteNum[value] ?? pokedex[value]?.num ?? 0;

      // Copied from Pokemon Showdown code
      left = (pokedexNumber % 12) * 40;
      top = Math.floor(pokedexNumber / 12) * 30;

      width = 40;
      height = 30;
    } else if (pokemonProperty === "item") {
      type = ItemIconsSheet;

      const itemNumber = items[value]?.spritenum ?? 0;

      // Copied from Pokemon Showdown code
      left = (itemNumber % 16) * 24;
      top = Math.floor(itemNumber / 16) * 24;

      width = 24;
      height = 24;
    }

    return (
      <span
        // eslint-disable-next-line no-restricted-syntax -- the sheet offset differs per icon
        style={{
          background: `
          transparent 
          url(${type}) 
          no-repeat 
          scroll 
          -${left}px -${top}px
        `,
          overflow: "visible",
          width,
          height,
        }}
      />
    );
  } else {
    return null;
  }
}
