// Pokemon Showdown team text <-> store conversion (see https://pokepast.es/syntax.html)
import { MOVE_KEYS } from "@/types";
import store from "@/store";
import { createEmptyTeam, getAutoSelectedItem } from "@/shared/team";
import type { Team } from "@/types";

// Converts the store's current team into Pokemon Showdown team text format
export function serializeTeamText(): string {
  return [0, 1, 2, 3, 4, 5]
    .map(teamIndex => {
      const { name, item, ability } = store.team[teamIndex];

      if (!name) return "";

      return `${store.pokemonName(name)} @ ${store.itemName(item)}
Ability: ${ability}
${MOVE_KEYS
  .map(key => {
    const move = store.team[teamIndex][key];
    return move ? `- ${store.moveName(move)}` : "-";
  })
  .join("\n")}\n\n`;
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
    const pokemonAndItemNames = lines[0].split("@").map(str => str.trim());
    const [pokemonNameAndNickname, itemName] = pokemonAndItemNames;

    // Ignore nicknames and keep the actual species name, while accepting either
    // "Species (Nickname)" or "Nickname (Species)" input.
    let pokemonName = pokemonNameAndNickname.trim();
    if (pokemonName.includes("(")) {
      const beforeParen = pokemonName.split("(")[0].trim();
      const insideParen = pokemonName.match(/\(([^)]+)\)/)?.[1]?.trim();
      const validCandidate = [beforeParen, insideParen].find(candidate =>
        candidate ? !!store.pokemonNameInverse(candidate) : false,
      );
      pokemonName = validCandidate || beforeParen || insideParen || pokemonName;
    }

    // Check if the pokemon the user typed is legit
    const pokemon = store.pokemonNameInverse(pokemonName.trim());
    if (!pokemon) return;

    const member = team[teamIndex];
    member.name = pokemon;
    const abilities = Object.values(store.abilities(pokemon));
    member.ability = abilities.length === 1 ? abilities[0] : "";

    // If team raw data does not mention item, leave it blank
    if (itemName) {
      // Check if item is legit
      const item = store.itemNameInverse(itemName);
      member.item = item || getAutoSelectedItem(pokemon, "");
    }

    let moveNum = 1;

    lines.slice(1).forEach(line => {
      if (line.includes("Ability:")) {
        // if property has to do with abilities
        const ability = line.replace("Ability:", "").trim();

        // If legit, set ability
        if (abilities.includes(ability)) {
          member.ability = ability;
        }
      } else if (line.startsWith("-") && moveNum <= 4) {
        // if property has to do with moves
        const moveName = line
          .replace(/^\-\s*/, "")
          .trim()
          .replace("[", "") // Smogon accepts, for instance, 'Hidden Power [Fire]' as a move
          .replace("]", "");

        // If legit, set move
        // Otherwise, set it blank
        const move = store.moveNameInverse(moveName);

        const validMove = store.canItLearn(move, pokemon) && move ? move : "";

        const moveKey = MOVE_KEYS[moveNum - 1];
        if (moveKey) member[moveKey] = validMove;

        moveNum++;
      }
    });
  });

  return team;
}
