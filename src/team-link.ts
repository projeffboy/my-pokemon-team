// Shared Pokemon Showdown team text <-> store <-> URL conversion (see https://pokepast.es/syntax.html)
import store from "@/store";
import { toBase64Url, fromBase64Url } from "@/base64url";

// Limit applies to the raw (still-encoded) URL param, before any decoding is attempted
export const MAX_ENCODED_TEAM_PARAM_LENGTH = 16 * 1024;

// Converts the store's current team into Pokemon Showdown team text format
export function serializeTeamText(): string {
  return [0, 1, 2, 3, 4, 5]
    .map(teamIndex => {
      const { name, item, ability } = store.team[teamIndex];

      if (!name) return "";

      return `${store.pokemonName(name)} @ ${store.itemName(item)}
Ability: ${ability}
${[1, 2, 3, 4]
  .map(num => {
    const move = store.team[teamIndex]["move" + num];
    return move ? `- ${store.moveName(move)}` : "-";
  })
  .join("\n")}\n\n`;
    })
    .join("");
}

// Parses Pokemon Showdown team text and mutates the store's team accordingly.
// Unrecognized pokemon/items/moves/abilities are ignored (left blank or auto-selected).
export function applyTeamText(text: string): void {
  let teamPokemonRawData = text
    .split("\n\n")
    .filter(eachPokemonData => eachPokemonData) // get rid of empty lines
    .slice(0, 6); // a team has at most 6 pokemon
  let numberOfTeamPokemon = 0;

  teamPokemonRawData.forEach((eachPokemonData, teamIndex) => {
    numberOfTeamPokemon++;

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

    store.team[teamIndex].name = pokemon; // if legit, set pokemon ID/name

    // If team raw data does not mention item, leave it blank
    if (itemName) {
      // Check if item is legit
      const item = store.itemNameInverse(itemName);
      if (item) {
        store.team[teamIndex].item = item; // if legit, set item ID/name
      } else {
        store.autoSelectItem();
      }
    } else {
      store.team[teamIndex].item = "";
    }

    let moveNum = 1;
    let abilityChanged = false;

    lines.slice(1).forEach(line => {
      if (line.includes("Ability:")) {
        // if property has to do with abilities
        const ability = line.replace("Ability:", "").trim();

        // If legit, set ability
        if (Object.values(store.abilities(pokemon)).includes(ability)) {
          store.team[teamIndex].ability = ability;
          abilityChanged = true;
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

        store.team[teamIndex]["move" + moveNum] = validMove;

        moveNum++;
      }
    });

    // If team raw data does not mention ability, leave it blank
    if (!abilityChanged) {
      store.team[teamIndex].ability = "";
      store.autoSelectAbility();
    }
  });

  // Clears unwanted duplicate pokemon left over from a previously longer team
  for (let i = numberOfTeamPokemon; i < 6; i++) {
    store.clearTeamPokemonProperties(i);
  }
}

// Returns the `team` URL param value for the store's current team, or "" if the team is empty
export function encodeTeamForUrl(): string {
  if (store.isTeamEmpty) return "";
  return toBase64Url(serializeTeamText());
}

// Decodes a `team` URL param value and applies it to the store. Malformed, oversized,
// or non-UTF-8 payloads are ignored rather than throwing.
export function importTeamFromUrlParam(param: string): void {
  if (!param || param.length > MAX_ENCODED_TEAM_PARAM_LENGTH) return;

  let text: string;
  try {
    text = fromBase64Url(param);
  } catch {
    return;
  }

  applyTeamText(text);
}
