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
import {
  createEmptyTeam,
  getAutoSelectedAbility,
  getAutoSelectedItem,
  isTeamEmpty,
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
import { hasNoAbility, pokemonAbilities } from "@/shared/pokedex";
import {
  DEFAULT_LEVEL,
  DEFAULT_HAPPINESS,
  MAX_HAPPINESS,
  MAX_IV,
  MAX_LEVEL,
  STAT_NAMES,
  TERA_TYPES,
} from "@/shared/set-details";
import {
  gameFormat,
  parseShowdownFormatId,
  showdownFormatId,
} from "@/shared/formats";
import {
  COMBINED_GENERATIONS_PROFILE,
  teamDataFormat,
} from "@/shared/generation-profile";
import { canItLearn, isItemAvailable } from "./learnsets";
import { generationRules } from "@/shared/generation-rules";
import { canHyperTrain, matchImportedHiddenPower } from "@/shared/hidden-power";

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
function serializeMember(
  member: Readonly<TeamPokemon>,
  generation: Generation,
  format: string,
): string {
  const { name, item, ability, gender, level, shiny, teraType } = member;
  // The Advanced dialog keeps a space being typed, which the text leaves out
  const nickname = member.nickname?.trim();
  const species = pokemonName(name) ?? name;
  const nameLine = [
    nickname ? `${nickname} (${species})` : species,
    gender === "M" || gender === "F" ? `(${gender})` : "",
    `@ ${itemName(item)}`,
  ]
    .filter(part => part)
    .join(" ");
  const evs =
    statsLine(member.evs, value => value === 0) ||
    (generation <= 2 ? "0 HP / 0 Atk / 0 Def / 0 SpA / 0 SpD / 0 Spe" : "");
  const ivs =
    statsLine(member.ivs, value => value === MAX_IV) ||
    ((
      generationRules(generation, format).ivs &&
      canHyperTrain(member, generation) &&
      MOVE_KEYS.some(key => member[key].startsWith("hiddenpower"))
    ) ?
      "31 HP / 31 Atk / 31 Def / 31 SpA / 31 SpD / 31 Spe"
    : "");
  const nature = member.nature ? natureName(member.nature) : undefined;
  const happiness = member.happiness ?? DEFAULT_HAPPINESS;

  return [
    nameLine,
    `Ability: ${ability || "No Ability"}`,
    level !== undefined && level !== DEFAULT_LEVEL ? `Level: ${level}` : "",
    shiny ? "Shiny: Yes" : "",
    (
      happiness !== DEFAULT_HAPPINESS ||
      MOVE_KEYS.some(key => member[key] === "frustration")
    ) ?
      `Happiness: ${happiness}`
    : "",
    teraType ? `Tera Type: ${teraType}` : "",
    evs ? `EVs: ${evs}` : "",
    member.statExperience ?
      `Stat Experience: ${statsLine(member.statExperience, value => value === 0)}`
    : "",
    member.effortLevels ?
      `Effort Levels: ${statsLine(member.effortLevels, value => value === 0)}`
    : "",
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

export const serializeTeam = (
  team: ReadonlyTeam,
  generation: Generation = 9,
  format = "",
) =>
  team
    .map(member =>
      member.name ? `${serializeMember(member, generation, format)}\n\n` : "",
    )
    .join("");

// Every team, each under a header like Showdown's backup: === [gen9ou] Team name ===
const BACKUP_MARKER = "# mypokemonteam backup: preserve team names";
const GENERATION_PROFILE_MARKER = `# mypokemonteam generation profile: ${COMBINED_GENERATIONS_PROFILE}`;

export const serializeTeams = (teams: readonly SavedTeam[]) => {
  const preserveNames = teams.some(({ name }) => name.includes("/"));
  return teams
    .map(({ name, generation, format, generationProfile, team }) => {
      const sets = serializeTeam(team, generation, format);
      const combined = generationProfile === COMBINED_GENERATIONS_PROFILE;
      const metadata = [
        ...(preserveNames ? [BACKUP_MARKER] : []),
        ...(combined ? [GENERATION_PROFILE_MARKER] : []),
      ];
      // Populated teams keep metadata inside their first set for Showdown imports.
      const text =
        sets ?
          metadata.length ?
            sets.replace("\n", `\n${metadata.join("\n")}\n`)
          : sets
        : combined ? `${GENERATION_PROFILE_MARKER}\n\n`
        : "";
      return `=== [${showdownFormatId(generation, format)}] ${name || "Team"} ===\n\n${text}`;
    })
    .join("");
};

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

// The pokemon, nickname, and gender of a first line without its item, or undefined
// when it names no pokemon. Accepts "Nickname (Species)", as Showdown writes it, and
// "Species (Nickname)". The species is the last name in parentheses, so a nickname
// may hold parentheses, and when both names are pokemon, such as a Mewtwo nicknamed
// Mew, the one in parentheses is the species.
function parseName(text: string) {
  const gender = GENDER_SUFFIX.exec(text)?.[1] as Gender | undefined;
  const name = text.replace(GENDER_SUFFIX, "").trim();
  const last = /^(.*)\(([^()]*)\)$/.exec(name);
  const first = /^([^(]*)\(([^)]+)\)/.exec(name);
  const readings = [
    { species: name, nickname: "" },
    { species: last?.[2], nickname: last?.[1] },
    { species: first?.[2], nickname: first?.[1] },
    { species: first?.[1], nickname: first?.[2] },
  ];
  for (const { species = "", nickname = "" } of readings) {
    const pokemon = pokemonNameInverse(species.trim());
    if (pokemon) return { pokemon, nickname: nickname.trim(), gender };
  }
  return undefined;
}

// The item follows the last @ whose left side names a pokemon, so a nickname may hold one
function parseFirstLine(line: string) {
  const ats = [...line.matchAll(/@/g)].map(match => match.index).reverse();
  for (const at of ats) {
    const name = parseName(line.slice(0, at));
    const [itemText = ""] = line.slice(at + 1).split("@");
    if (name) return { ...name, itemText: itemText.trim() };
  }
  const name = parseName(line);
  return name && { ...name, itemText: undefined };
}

// Original links omitted zero training and interpreted blank abilities as auto-selection.
export const LEGACY_LINK_PARSING_OPTIONS = {
  inferFrustrationHappiness: false,
  inferLegacyTraining: false,
  inferHiddenPowerIvs: false,
  preserveBlankAbilityDefault: true,
  allowHyperTraining: false,
} as const;

// Parses Pokemon Showdown team text into a fresh six-slot team.
// Unrecognized pokemon/items/moves/abilities are ignored (left blank or auto-selected).
export function parseTeamText(
  text: string,
  generation: Generation = 9,
  format = "",
  {
    inferFrustrationHappiness = true,
    inferLegacyTraining = true,
    inferHiddenPowerIvs = true,
    preserveBlankAbilityDefault = false,
    allowHyperTraining = true,
  }: {
    inferFrustrationHappiness?: boolean;
    inferLegacyTraining?: boolean;
    inferHiddenPowerIvs?: boolean;
    preserveBlankAbilityDefault?: boolean;
    allowHyperTraining?: boolean;
  } = {},
): Team {
  const rules = generationRules(generation, format);
  const team = createEmptyTeam();
  const teamPokemonRawData = text
    .replace(/^\s*---\s*$/gm, "\n")
    .split(/\n\s*\n/)
    .map(eachPokemonData => eachPokemonData.trim())
    .filter(eachPokemonData => eachPokemonData) // get rid of empty lines
    .slice(0, 6); // a team has at most 6 pokemon

  teamPokemonRawData.forEach((eachPokemonData, teamIndex) => {
    const lines = eachPokemonData.split("\n"); // split pokemon into its properties

    const [firstLine = ""] = lines;
    const parsed = parseFirstLine(firstLine);
    const member = team[teamIndex];
    if (!parsed || !member) return;
    const { pokemon, nickname, gender, itemText } = parsed;

    member.name = pokemon;
    const abilities = Array.from({ length: 9 }, (_, i) =>
      pokemonAbilities(pokemon, (i + 1) as Generation),
    ).flat();
    member.ability =
      rules.abilities ?
        getAutoSelectedAbility(pokemon, generation, format)
      : "";
    if (nickname) member.nickname = nickname;
    if (gender && rules.gender) member.gender = gender;

    // If team raw data does not mention item, leave it blank
    if (itemText) {
      // Check if item is legit
      const item = itemNameInverse(itemText);
      member.item =
        item ||
        getAutoSelectedItem(pokemon, "", item =>
          isItemAvailable(item, generation, format),
        );
    }

    let moveIndex = 0;
    let gigantamax = false;
    let hasHappiness = false;

    lines.slice(1).forEach(rawLine => {
      const line = rawLine.trim();
      const value = (prefix: string) => line.slice(prefix.length).trim();
      const startsWith = (prefix: string) =>
        line.toLowerCase().startsWith(prefix.toLowerCase());

      if (startsWith("Ability:") || startsWith("Trait:")) {
        const ability = line.slice(line.indexOf(":") + 1).trim();

        if (
          ability === "No Ability" ||
          (!ability && !preserveBlankAbilityDefault)
        )
          member.ability =
            hasNoAbility(pokemon, generation, format) ? "No Ability" : "";
        else if (abilities.includes(ability)) {
          member.ability = ability;
        }
      } else if (startsWith("Gigantamax:")) {
        gigantamax = value("Gigantamax:").toLowerCase() === "yes";
      } else if (startsWith("Level:")) {
        const level = Math.round(Number(value("Level:")));
        if (level >= 1 && level <= MAX_LEVEL && level !== DEFAULT_LEVEL)
          member.level = level;
      } else if (startsWith("Shiny:") && rules.shiny) {
        if (value("Shiny:").toLowerCase() === "yes") member.shiny = true;
      } else if (startsWith("Happiness:") && rules.happiness) {
        const raw = value("Happiness:");
        const happiness = Number(raw);
        if (
          raw &&
          Number.isInteger(happiness) &&
          happiness >= 0 &&
          happiness <= MAX_HAPPINESS
        ) {
          hasHappiness = true;
          if (happiness === DEFAULT_HAPPINESS) delete member.happiness;
          else member.happiness = happiness;
        }
      } else if (startsWith("Tera Type:") && rules.tera) {
        const teraType = value("Tera Type:");
        if (TERA_TYPES.includes(teraType)) member.teraType = teraType;
      } else if (startsWith("EVs:") && rules.investment !== "effortLevels") {
        const evs = parseStats(value("EVs:"), 255, ev => ev === 0);
        if (evs) member.evs = evs;
      } else if (startsWith("Stat Experience:")) {
        member.statExperience = parseStats(
          value("Stat Experience:"),
          65535,
          n => n === 0,
        );
      } else if (startsWith("Effort Levels:")) {
        member.effortLevels = parseStats(
          value("Effort Levels:"),
          10,
          n => n === 0,
        );
      } else if (startsWith("IVs:") && rules.ivs) {
        const ivs = parseStats(value("IVs:"), MAX_IV, iv => iv === MAX_IV);
        if (ivs) member.ivs = ivs;
      } else if (/ Nature$/i.test(line) && rules.nature) {
        const nature = natureNameInverse(
          line.slice(0, -" Nature".length).trim(),
        );
        if (nature) member.nature = nature;
      } else if (/^(?:-|~|Move:)/i.test(line) && moveIndex < MOVE_KEYS.length) {
        // if property has to do with moves
        const moveText = line
          .replace(/^(?:[-~]\s*|Move:\s*)/i, "")
          .trim()
          .replace("[", "") // Smogon accepts, for instance, 'Hidden Power [Fire]' as a move
          .replace("]", "");

        // If legit, set move
        // Otherwise, set it blank
        const move = moveNameInverse(moveText);

        const validMove =
          canItLearn(move, pokemon, generation, format) && move ? move : "";

        const moveKey = MOVE_KEYS[moveIndex];
        if (moveKey) member[moveKey] = validMove;

        moveIndex++;
      }
    });
    // Old Gen 1/2 site exports wrote a blank Ability line and omitted zero EVs.
    if (
      rules.legacy &&
      inferLegacyTraining &&
      !lines.some(line =>
        /^(?:Ability:\s*$|EVs:|Stat Experience:)/i.test(line.trim()),
      )
    )
      member.evs = Object.fromEntries(STAT_KEYS.map(stat => [stat, 252]));
    if (gigantamax) {
      const forme = pokemonNameInverse(`${pokemonName(member.name)}-Gmax`);
      if (forme) member.name = forme;
    }
    if (
      inferFrustrationHappiness &&
      rules.happiness &&
      !hasHappiness &&
      MOVE_KEYS.some(key => member[key] === "frustration")
    )
      member.happiness = 0;
    if (
      inferHiddenPowerIvs &&
      !lines.some(line => /^IVs:/i.test(line.trim()))
    ) {
      const hiddenPower = MOVE_KEYS.map(key => member[key]).find(move =>
        move.startsWith("hiddenpower"),
      );
      if (hiddenPower)
        matchImportedHiddenPower(member, hiddenPower, generation, format, {
          allowHyperTraining,
        });
    }
  });

  return team;
}

const TEAM_HEADER = /^===\s*(?:\[([^\]]*)\])?\s*(.*?)\s*===\s*$/;

export interface ParsedTeam {
  name: string;
  generation: Generation;
  generationProfile?: SavedTeam["generationProfile"];
  format: string;
  team: Team;
}

// Splits a Showdown backup with `=== [gen9ou] Folder/Name ===` headers into its
// teams that have pokemon; text without headers is one team
export function parseTeamsText(
  text: string,
  defaults: Pick<SavedTeam, "generation" | "format" | "generationProfile"> = {
    generation: 9,
    format: "",
  },
): ParsedTeam[] {
  const preserveNames = text
    .split("\n")
    .some(line => line.trim() === BACKUP_MARKER);
  const chunks: { header?: RegExpExecArray; lines: string[] }[] = [];
  for (const line of text.split("\n")) {
    const header = TEAM_HEADER.exec(line);
    if (header) chunks.push({ header, lines: [] });
    else if (chunks.length) chunks[chunks.length - 1]?.lines.push(line);
    else chunks.push({ lines: [line] });
  }
  const isEmptyBackup = (index: number) =>
    !!chunks[index]?.header?.[2]?.trim() &&
    chunks[index]?.lines.every(
      line =>
        !line.trim() ||
        line.trim() === BACKUP_MARKER ||
        line.trim() === GENERATION_PROFILE_MARKER,
    );
  const teams = chunks.map(({ header, lines }, index): ParsedTeam => {
    const hasFormat = header?.[1] !== undefined;
    const hasCombinedMetadata =
      !!header && lines.some(line => line.trim() === GENERATION_PROFILE_MARKER);
    const settings =
      hasFormat || hasCombinedMetadata ?
        parseShowdownFormatId(header?.[1] ?? "")
      : { generation: defaults.generation, format: defaults.format };
    const generationProfile =
      (
        settings.generation === 9 &&
        !gameFormat(settings.format) &&
        (hasCombinedMetadata ||
          (!hasFormat &&
            defaults.generationProfile === COMBINED_GENERATIONS_PROFILE))
      ) ?
        COMBINED_GENERATIONS_PROFILE
      : undefined;
    const rawName = header?.[2] ?? "";
    const name =
      preserveNames || isEmptyBackup(index) ? rawName : (
        (rawName.split("/").pop()?.trim() ?? "")
      );
    return {
      name,
      ...settings,
      ...(generationProfile && { generationProfile }),
      team: parseTeamText(
        lines
          .filter(line => line.trim() !== GENERATION_PROFILE_MARKER)
          .join("\n"),
        settings.generation,
        teamDataFormat({ format: settings.format, generationProfile }),
      ),
    };
  });
  return teams.filter(
    ({ team }, index) => !isTeamEmpty(team) || isEmptyBackup(index),
  );
}
