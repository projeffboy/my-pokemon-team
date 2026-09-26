// Pokemon Showdown team text <-> store conversion (see https://pokepast.es/syntax.html)
import {
  MOVE_KEYS,
  STAT_KEYS,
  type BaseStats,
  type Gender,
  type Generation,
  type ReadonlyTeam,
  type SavedTeam,
  type StatKey,
  type Team,
  type TeamPokemon,
} from "@/types";
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
  natureName,
  natureNameInverse,
  pokemonNameInverse,
  itemNameInverse,
  moveNameInverse,
} from "@/shared/names";
import { pokemonAbilities } from "@/shared/pokedex";
import {
  DEFAULT_LEVEL,
  MAX_EV,
  MAX_IV,
  MAX_LEVEL,
  STAT_NAMES,
  TERA_TYPES,
} from "@/shared/set-details";
import { parseShowdownFormatId, showdownFormatId } from "@/shared/formats";
import { canItLearn } from "@/store/learnsets";

const statsLine = (
  stats: Partial<BaseStats> | undefined,
  isDefault: (value: number) => boolean,
) =>
  STAT_KEYS.filter(
    stat => stats?.[stat] !== undefined && !isDefault(stats[stat] ?? 0),
  )
    .map(stat => `${stats?.[stat]} ${STAT_NAMES[stat]}`)
    .join(" / ");

// One pokemon in Showdown's export format; details at their defaults are left out
function serializeMember(member: Readonly<TeamPokemon>): string {
  const { name, item, ability, nickname, gender, level, shiny, teraType } =
    member;
  const species = pokemonName(name) ?? name;
  const nameLine = [
    nickname ? `${nickname} (${species})` : species,
    gender === "M" || gender === "F" ? `(${gender})` : "",
    `@ ${itemName(item)}`,
  ]
    .filter(part => part)
    .join(" ");
  const evs = statsLine(member.evs, value => value === 0);
  const ivs = statsLine(member.ivs, value => value === MAX_IV);
  const nature = member.nature ? natureName(member.nature) : undefined;

  return [
    nameLine,
    `Ability: ${ability}`,
    level !== undefined && level !== DEFAULT_LEVEL ? `Level: ${level}` : "",
    shiny ? "Shiny: Yes" : "",
    teraType ? `Tera Type: ${teraType}` : "",
    evs ? `EVs: ${evs}` : "",
    nature ? `${nature} Nature` : "",
    ivs ? `IVs: ${ivs}` : "",
    ...MOVE_KEYS.map(key => {
      const move = member[key];
      return move ? `- ${moveName(move)}` : "-";
    }),
  ]
    .filter(line => line)
    .join("\n");
}

export const serializeTeam = (team: ReadonlyTeam) =>
  team
    .map(member => (member.name ? `${serializeMember(member)}\n\n` : ""))
    .join("");

// Converts the store's current team into Pokemon Showdown team text format
export function serializeTeamText(): string {
  return serializeTeam(store.team);
}

// Every team, each under a header like Showdown's backup: === [gen9ou] Team name ===
export const serializeTeams = (teams: readonly SavedTeam[]) =>
  teams
    .map(
      ({ name, generation, format, team }) =>
        `=== [${showdownFormatId(generation, format)}] ${name || "Team"} ===\n\n${serializeTeam(team)}`,
    )
    .join("");

const STAT_BY_NAME = new Map<string, StatKey>(
  STAT_KEYS.map(stat => [STAT_NAMES[stat].toLowerCase(), stat]),
);

// E.g. "252 Atk / 4 SpD" => { atk: 252, spd: 4 }, keeping only the stats that differ from the default
function parseStats(
  text: string,
  max: number,
  isDefault: (value: number) => boolean,
): Partial<BaseStats> | undefined {
  const stats: Partial<BaseStats> = {};
  for (const part of text.split("/")) {
    const [amount = "", name = ""] = part.trim().split(/\s+/);
    const stat = STAT_BY_NAME.get(name.toLowerCase());
    const value = Math.min(max, Math.max(0, Math.round(Number(amount))));
    if (stat && !Number.isNaN(value) && !isDefault(value)) stats[stat] = value;
  }
  return Object.keys(stats).length ? stats : undefined;
}

const GENDER_SUFFIX = /\s*\((M|F|N)\)\s*$/;

// Parses Pokemon Showdown team text into a fresh six-slot team.
// Unrecognized pokemon/items/moves/abilities are ignored (left blank or auto-selected).
export function parseTeamText(text: string): Team {
  const team = createEmptyTeam();
  const teamPokemonRawData = text
    .split(/\n\s*\n/)
    .map(eachPokemonData => eachPokemonData.trim())
    .filter(eachPokemonData => eachPokemonData) // get rid of empty lines
    .slice(0, 6); // a team has at most 6 pokemon

  teamPokemonRawData.forEach((eachPokemonData, teamIndex) => {
    const lines = eachPokemonData.split("\n"); // split pokemon into its properties

    // Get pokemon and item names
    const [firstLine = ""] = lines;
    const pokemonAndItemNames = firstLine.split("@").map(part => part.trim());
    const [pokemonNameAndNickname = "", itemText] = pokemonAndItemNames;

    // The gender comes last, e.g. "Jelly (Reuniclus) (F)"
    const genderMatch = GENDER_SUFFIX.exec(pokemonNameAndNickname);
    const gender = genderMatch?.[1] as Gender | undefined;
    let species = pokemonNameAndNickname.replace(GENDER_SUFFIX, "").trim();
    let nickname: string | undefined;

    // Keep the species name and the nickname, accepting either
    // "Species (Nickname)" or "Nickname (Species)" input.
    if (species.includes("(")) {
      const beforeParen = species.split("(")[0]?.trim() ?? "";
      const insideParen = species.match(/\(([^)]+)\)/)?.[1]?.trim() ?? "";
      const validCandidate = [beforeParen, insideParen].find(candidate =>
        candidate ? !!pokemonNameInverse(candidate) : false,
      );
      const other = validCandidate === beforeParen ? insideParen : beforeParen;
      species = validCandidate || beforeParen || insideParen || species;
      if (validCandidate && other) nickname = other;
    }

    // Check if the pokemon the user typed is legit
    const pokemon = pokemonNameInverse(species.trim());
    const member = team[teamIndex];
    if (!pokemon || !member) return;

    member.name = pokemon;
    const abilities = pokemonAbilities(pokemon);
    member.ability = getAutoSelectedAbility(pokemon);
    if (nickname) member.nickname = nickname;
    if (gender) member.gender = gender;

    // If team raw data does not mention item, leave it blank
    if (itemText) {
      // Check if item is legit
      const item = itemNameInverse(itemText);
      member.item = item || getAutoSelectedItem(pokemon, "");
    }

    let moveIndex = 0;

    lines.slice(1).forEach(rawLine => {
      const line = rawLine.trim();
      const value = (prefix: string) => line.slice(prefix.length).trim();

      if (line.startsWith("Ability:")) {
        const ability = value("Ability:");

        // If legit, set ability
        if (abilities.includes(ability)) {
          member.ability = ability;
        }
      } else if (line.startsWith("Level:")) {
        const level = Math.round(Number(value("Level:")));
        if (level >= 1 && level <= MAX_LEVEL && level !== DEFAULT_LEVEL)
          member.level = level;
      } else if (line.startsWith("Shiny:")) {
        if (value("Shiny:").toLowerCase() === "yes") member.shiny = true;
      } else if (line.startsWith("Tera Type:")) {
        const teraType = value("Tera Type:");
        if (TERA_TYPES.includes(teraType)) member.teraType = teraType;
      } else if (line.startsWith("EVs:")) {
        const evs = parseStats(value("EVs:"), MAX_EV, ev => ev === 0);
        if (evs) member.evs = evs;
      } else if (line.startsWith("IVs:")) {
        const ivs = parseStats(value("IVs:"), MAX_IV, iv => iv === MAX_IV);
        if (ivs) member.ivs = ivs;
      } else if (line.endsWith(" Nature")) {
        const nature = natureNameInverse(
          line.slice(0, -" Nature".length).trim(),
        );
        if (nature) member.nature = nature;
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

const TEAM_HEADER = /^===\s*(?:\[([^\]]*)\])?\s*(.*?)\s*===\s*$/;

export interface ParsedTeam {
  name: string;
  generation: Generation;
  format: string;
  team: Team;
}

// Splits a Showdown backup with `=== [gen9ou] Name ===` headers into its teams;
// text without headers is one team
export function parseTeamsText(text: string): ParsedTeam[] {
  const chunks: { header?: RegExpExecArray; lines: string[] }[] = [];
  for (const line of text.split("\n")) {
    const header = TEAM_HEADER.exec(line);
    if (header) chunks.push({ header, lines: [] });
    else if (chunks.length) chunks[chunks.length - 1]?.lines.push(line);
    else chunks.push({ lines: [line] });
  }
  const teams = chunks.map(({ header, lines }) => ({
    name: (header?.[2] ?? "").split("/").pop() ?? "",
    ...parseShowdownFormatId(header?.[1] ?? ""),
    team: parseTeamText(lines.join("\n")),
  }));
  const withPokemon = teams.filter(({ team }) => team.some(({ name }) => name));
  return withPokemon.length ? withPokemon : teams.slice(0, 1);
}
