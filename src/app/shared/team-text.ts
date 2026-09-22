// Pokemon Showdown team text <-> store conversion (see https://pokepast.es/syntax.html)
import { MOVE_KEYS } from "@/types";
import store from "@/store";
import {
  createEmptyTeam,
  getAutoSelectedAbility,
  getAutoSelectedItem,
} from "@/shared/team";
import {
  pokemonName,
  itemName,
  moveName,
  pokemonNameInverse,
  itemNameInverse,
  moveNameInverse,
} from "@/shared/names";
import { pokemonAbilities } from "@/shared/pokedex";
import { canItLearn } from "@/store/learnsets";
import type { Team } from "@/types";

// Converts the store's current team into Pokemon Showdown team text format
export function serializeTeamText(): string {
  return store.team
    .map(member => {
      const { name, item, ability } = member;

      if (!name) return "";

      return `${pokemonName(name)} @ ${itemName(item)}
Ability: ${ability}
${MOVE_KEYS.map(key => {
  const move = member[key];
  return move ? `- ${moveName(move)}` : "-";
}).join("\n")}\n\n`;
    })
    .join("");
}

// Parses Pokemon Showdown team text into a fresh six-slot team.
// Unrecognized pokemon/items/moves/abilities are ignored (left blank or auto-selected).
export function parseTeamText(text: string): Team {
  const team = createEmptyTeam();
  const teamPokemonRawData = text
    .split("\n\n")
    .filter(eachPokemonData => eachPokemonData) // get rid of empty lines
    .slice(0, 6); // a team has at most 6 pokemon

  teamPokemonRawData.forEach((eachPokemonData, teamIndex) => {
    const lines = eachPokemonData.split("\n"); // split pokemon into its properties

    // Get pokemon and item names
    const [firstLine = ""] = lines;
    const pokemonAndItemNames = firstLine.split("@").map(part => part.trim());
    const [pokemonNameAndNickname = "", itemText] = pokemonAndItemNames;

    // Ignore nicknames and keep the actual species name, while accepting either
    // "Species (Nickname)" or "Nickname (Species)" input.
    let species = pokemonNameAndNickname.trim();
    if (species.includes("(")) {
      const beforeParen = species.split("(")[0]?.trim();
      const insideParen = species.match(/\(([^)]+)\)/)?.[1]?.trim();
      const validCandidate = [beforeParen, insideParen].find(candidate =>
        candidate ? !!pokemonNameInverse(candidate) : false,
      );
      species = validCandidate || beforeParen || insideParen || species;
    }

    // Check if the pokemon the user typed is legit
    const pokemon = pokemonNameInverse(species.trim());
    const member = team[teamIndex];
    if (!pokemon || !member) return;

    member.name = pokemon;
    const abilities = pokemonAbilities(pokemon);
    member.ability = getAutoSelectedAbility(pokemon);

    // If team raw data does not mention item, leave it blank
    if (itemText) {
      // Check if item is legit
      const item = itemNameInverse(itemText);
      member.item = item || getAutoSelectedItem(pokemon, "");
    }

    let moveIndex = 0;

    lines.slice(1).forEach(line => {
      if (line.includes("Ability:")) {
        // if property has to do with abilities
        const ability = line.replace("Ability:", "").trim();

        // If legit, set ability
        if (abilities.includes(ability)) {
          member.ability = ability;
        }
      } else if (line.startsWith("-") && moveIndex < MOVE_KEYS.length) {
        // if property has to do with moves
        const moveText = line
          .replace(/^-\s*/, "")
          .trim()
          .replace("[", "") // Smogon accepts, for instance, 'Hidden Power [Fire]' as a move
          .replace("]", "");

        // If legit, set move
        // Otherwise, set it blank
        const move = moveNameInverse(moveText);

        const validMove = canItLearn(move, pokemon) && move ? move : "";

        const moveKey = MOVE_KEYS[moveIndex];
        if (moveKey) member[moveKey] = validMove;

        moveIndex++;
      }
    });
  });

  return team;
}
