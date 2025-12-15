import pokedex from "../../../../../../data/pokedex";
import items from "../../../../../../data/items";
import altSpriteNum from "../../../../../../data/altSpriteNum";
import PokemonIconsSheet from "../../../../../../assets/pokemonicons-sheet.png";
import ItemIconsSheet from "../../../../../../assets/itemicons-sheet.png";

/*
 * Returns an icon of a pokemon (pkmnProp === 'pkmn') or an item (pkmnProp === 'item)
 * "smicons" is short for sun and moon icons for all the pokemon
 * You can find them here: https://play.pokemonshowdown.com/sprites/smicons-sheet.png
 * You can find the "itemicons" here: https://play.pokemonshowdown.com/sprites/itemicons-sheet.png
 */
interface PokemonIconProps {
  pkmnProp: string;
  value: string;
}

export default function PokemonIcon(props: PokemonIconProps) {
  const { pkmnProp, value } = props;

  if (pkmnProp === "pkmn" || pkmnProp === "item") {
    let type;
    let left;
    let top;
    let width;
    let height;

    if (pkmnProp === "pkmn") {
      type = PokemonIconsSheet;

      const pokedexNumber = (altSpriteNum as any)[value] || (pokedex as any)[value].num;

      // Copied from Pokemon Showdown code
      left = (pokedexNumber % 12) * 40;
      top = Math.floor(pokedexNumber / 12) * 30;

      width = 40;
      height = 30;
    } else if (pkmnProp === "item") {
      type = ItemIconsSheet;

      const itemNumber = (items as any)[value].spritenum;

      // Copied from Pokemon Showdown code
      left = (itemNumber % 16) * 24;
      top = Math.floor(itemNumber / 16) * 24;

      width = 24;
      height = 24;
    }

    return (
      <span
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
