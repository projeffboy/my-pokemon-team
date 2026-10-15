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
  allAbilities,
  pokemonName,
  itemName,
  moveName,
  natureName,
  natureNameInverse,
  pokemonNameInverse,
  itemNameInverse,
  moveNameInverse,
} from "@/shared/names";
import { hasNoAbility } from "@/shared/pokedex";
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
import { anyGenerationAbilities, type DroppedEntry } from "./dropped-entries";
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
  const itemText = itemName(item) || item;
  const nameLine = [
    nickname ? `${nickname} (${species})` : species,
    gender === "M" || gender === "F" ? `(${gender})` : "",
    // Showdown leaves out " @ " when there is no item
    itemText ? `@ ${itemText}` : "",
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
      return move ? `- ${moveName(move) ?? move}` : "-";
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

// A part of team text that the parser could not use as written
export interface TeamTextProblem {
  slot: number; // the team slot, from 1
  pokemon?: string; // missing when the pokemon itself is the problem
  field:
    | "pokemon"
    | "item"
    | "ability"
    | "level"
    | "shiny"
    | "happiness"
    | "teraType"
    | "evs"
    | "statExperience"
    | "effortLevels"
    | "ivs"
    | "nature"
    | "move"
    | "line";
  move?: number; // the move slot, from 1
  stat?: StatKey; // the stat of a training value
  value: string;
  reason:
    | "unrecognized"
    | "unlearnable"
    | "wrongAbility"
    | "outOfRange"
    | "unsupported"
    | "tooManyPokemon"
    | "tooManyMoves"
    | "noGigantamax"
    | "unread";
  range?: readonly [number, number];
  replacement?: string; // what is used in its place (a number for a stat); otherwise it is left out
}

type Problem = Omit<TeamTextProblem, "slot" | "pokemon">;

const STAT_BY_NAME = new Map<string, StatKey>(
  STAT_KEYS.map(stat => [STAT_NAMES[stat].toLowerCase(), stat]),
);

// E.g. "252 Atk / 4 SpD" => { atk: 252, spd: 4 }, keeping only the stats that differ from the default
function parseStats(
  text: string,
  max: number,
  isDefault: (value: number) => boolean,
  report: (problem: Omit<Problem, "field">) => void,
): Partial<BaseStats> | undefined {
  const stats: Partial<BaseStats> = {};
  for (const part of text.split("/")) {
    const supplied = part.trim();
    const [amount = "", name = ""] = supplied.split(/\s+/);
    const stat = STAT_BY_NAME.get(name.toLowerCase());
    const value = Math.min(max, Math.max(0, Math.round(Number(amount))));
    if (stat && !Number.isNaN(value) && !isDefault(value)) stats[stat] = value;
    if (!supplied) continue;
    if (!stat) report({ value: supplied, reason: "unrecognized" });
    else if (value !== Number(amount))
      report({
        stat,
        value: supplied,
        reason: "outOfRange",
        range: [0, max],
        ...(!Number.isNaN(value) && { replacement: String(value) }),
      });
  }
  return Object.keys(stats).length ? stats : undefined;
}

const GENDER_SUFFIX = /\s*\((M|F|N)\)\s*$/;

// The pokemon, nickname, and gender of a first line without its item, or undefined
// when it names no pokemon. Accepts "Nickname (Species)", as Showdown writes it, and
// "Species (Nickname)". The species is the last name in parentheses, so a nickname
// may hold parentheses, and when both names are pokemon, such as a Mewtwo nicknamed
// Mew, the one in parentheses is the species. With speciesLast, only "Nickname (Species)".
function parseName(text: string, speciesLast = false) {
  const gender = GENDER_SUFFIX.exec(text)?.[1] as Gender | undefined;
  const name = text.replace(GENDER_SUFFIX, "").trim();
  const last = /^(.*)\(([^()]*)\)$/.exec(name);
  const first = /^([^(]*)\(([^)]+)\)/.exec(name);
  const lastReading = { species: last?.[2], nickname: last?.[1] };
  const readings =
    speciesLast ?
      [lastReading]
    : [
        { species: name, nickname: "" },
        lastReading,
        { species: first?.[2], nickname: first?.[1] },
        { species: first?.[1], nickname: first?.[2] },
      ];
  for (const { species = "", nickname = "" } of readings) {
    const pokemon = pokemonNameInverse(species.trim());
    if (pokemon) return { pokemon, nickname: nickname.trim(), gender };
  }
  return undefined;
}

// The item follows the last @ whose left side names a pokemon, so a nickname may hold one.
// Showdown leaves out " @ " when there is no item, so a line without one that ends in
// "(Species)" has no item, even when its nickname starts with a pokemon name and an @.
function parseFirstLine(line: string) {
  const showdownName = !line.includes(" @ ") && parseName(line, true);
  if (showdownName) return { ...showdownName, itemText: undefined };
  const ats = [...line.matchAll(/@/g)].map(match => match.index).reverse();
  for (const at of ats) {
    const name = parseName(line.slice(0, at));
    const [itemText = ""] = line.slice(at + 1).split("@");
    if (name) return { ...name, itemText: itemText.trim() };
  }
  const name = parseName(line);
  return name && { ...name, itemText: undefined };
}

// Original links omitted zero training and interpreted blank abilities as auto-selection, and
// could give formes such as totems their first stage's moves.
export const LEGACY_LINK_PARSING_OPTIONS = {
  inferFrustrationHappiness: false,
  inferLegacyTraining: false,
  inferHiddenPowerIvs: false,
  preserveBlankAbilityDefault: true,
  allowHyperTraining: false,
  acceptLegacyFormeInheritance: true,
  // Links decode every detail they carry, so each keeps loading the same team
  keepUnsupportedDetails: true,
} as const;

const splitSets = (text: string) =>
  text
    .replace(/^\s*---\s*$/gm, "\n")
    .split(/\n\s*\n/)
    .map(set => set.trim())
    .filter(set => set);

// Showdown's lines for details the site has no field for
const UNKEPT_DETAIL = /^(?:Pokeball|Dynamax Level|Hidden Power):/i;

// Parses Pokemon Showdown team text into a fresh six-slot team.
// Unrecognized pokemon/items/moves/abilities are ignored (left blank or auto-selected),
// and onProblem hears of each part of the text that could not be used as written.
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
    acceptLegacyFormeInheritance = false,
    keepUnsupportedDetails = false,
    onProblem = () => {},
  }: {
    inferFrustrationHappiness?: boolean;
    inferLegacyTraining?: boolean;
    inferHiddenPowerIvs?: boolean;
    preserveBlankAbilityDefault?: boolean;
    allowHyperTraining?: boolean;
    acceptLegacyFormeInheritance?: boolean;
    keepUnsupportedDetails?: boolean;
    onProblem?: (problem: TeamTextProblem) => void;
  } = {},
): Team {
  const rules = generationRules(generation, format);
  // Pasted text drops details the game has no field for
  const supports = (rule: boolean) => keepUnsupportedDetails || rule;
  const team = createEmptyTeam();
  const teamPokemonRawData = splitSets(text);

  teamPokemonRawData.forEach((eachPokemonData, teamIndex) => {
    const lines = eachPokemonData.split("\n"); // split pokemon into its properties

    const [firstLine = ""] = lines;
    const member = team[teamIndex]; // a team has at most 6 pokemon
    const parsed = member && parseFirstLine(firstLine);
    if (!member || !parsed) {
      onProblem({
        slot: teamIndex + 1,
        field: "pokemon",
        value: firstLine.trim(),
        reason: member ? "unrecognized" : "tooManyPokemon",
      });
      return;
    }
    const { pokemon, nickname, gender, itemText } = parsed;
    // A later line can override an earlier one, so a replacement that depends on the
    // final set is read once every line is parsed
    const pending: { problem: Problem; replacement?: () => string }[] = [];
    const report = (problem: Problem, replacement?: () => string) =>
      pending.push({ problem, ...(replacement && { replacement }) });

    member.name = pokemon;
    const abilities = anyGenerationAbilities(pokemon);
    member.ability =
      rules.abilities ?
        getAutoSelectedAbility(pokemon, generation, format)
      : "";
    if (nickname) member.nickname = nickname;
    if (gender && supports(rules.gender)) member.gender = gender;

    // If team raw data does not mention item, leave it blank
    if (itemText) {
      // Check if item is legit
      const item = itemNameInverse(itemText);
      member.item =
        item ||
        getAutoSelectedItem(pokemon, "", item =>
          isItemAvailable(item, generation, format),
        );
      if (!item)
        report({
          field: "item",
          value: itemText,
          reason: "unrecognized",
          ...(member.item && { replacement: member.item }),
        });
    }

    const gigantamaxForme = pokemonNameInverse(`${pokemonName(pokemon)}-Gmax`);
    let moveIndex = 0;
    let gigantamax = false;
    let hasHappiness = false;

    lines.slice(1).forEach(rawLine => {
      const line = rawLine.trim();
      const value = (prefix: string) => line.slice(prefix.length).trim();
      const startsWith = (prefix: string) =>
        line.toLowerCase().startsWith(prefix.toLowerCase());
      const statsIn = (
        field: "evs" | "statExperience" | "effortLevels" | "ivs",
        prefix: string,
        max: number,
        isDefault: (value: number) => boolean,
      ) =>
        parseStats(value(prefix), max, isDefault, problem => {
          const { stat } = problem;
          report(
            { field, ...problem },
            stat && problem.replacement ?
              () =>
                String(member[field]?.[stat] ?? (field === "ivs" ? MAX_IV : 0))
            : undefined,
          );
        });
      const unsupported = (field: Problem["field"], text: string) => {
        if (text) report({ field, value: text, reason: "unsupported" });
      };

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
        } else if (ability)
          report(
            {
              field: "ability",
              value: ability,
              reason:
                allAbilities.includes(ability) ? "wrongAbility" : (
                  "unrecognized"
                ),
            },
            () => member.ability,
          );
      } else if (startsWith("Gigantamax:")) {
        const answer = value("Gigantamax:").toLowerCase();
        gigantamax = answer === "yes";
        if (gigantamax && !gigantamaxForme)
          report({ field: "line", value: line, reason: "noGigantamax" });
        else if (!["", "yes", "no"].includes(answer))
          report({ field: "line", value: line, reason: "unrecognized" });
      } else if (startsWith("Level:")) {
        const raw = value("Level:");
        const level = Math.round(Number(raw));
        const isLevel = level >= 1 && level <= MAX_LEVEL;
        if (isLevel && level !== DEFAULT_LEVEL) member.level = level;
        if (raw && !(isLevel && level === Number(raw)))
          report(
            {
              field: "level",
              value: raw,
              reason: "outOfRange",
              range: [1, MAX_LEVEL],
            },
            () => String(member.level ?? rules.fixedLevel ?? DEFAULT_LEVEL),
          );
      } else if (startsWith("Shiny:")) {
        const shiny = value("Shiny:");
        if (!supports(rules.shiny)) unsupported("shiny", shiny);
        else if (shiny.toLowerCase() === "yes") member.shiny = true;
        else if (shiny && shiny.toLowerCase() !== "no")
          report({ field: "shiny", value: shiny, reason: "unrecognized" });
      } else if (startsWith("Happiness:")) {
        const raw = value("Happiness:");
        const happiness = Number(raw);
        if (!raw) return;
        if (!rules.happiness)
          report({ field: "happiness", value: raw, reason: "unsupported" });
        else if (
          Number.isInteger(happiness) &&
          happiness >= 0 &&
          happiness <= MAX_HAPPINESS
        ) {
          hasHappiness = true;
          if (happiness === DEFAULT_HAPPINESS) delete member.happiness;
          else member.happiness = happiness;
        } else
          report({
            field: "happiness",
            value: raw,
            reason: "outOfRange",
            range: [0, MAX_HAPPINESS],
          });
      } else if (startsWith("Tera Type:")) {
        const teraType = value("Tera Type:");
        if (!supports(rules.tera)) unsupported("teraType", teraType);
        else if (TERA_TYPES.includes(teraType)) member.teraType = teraType;
        else if (teraType)
          report({
            field: "teraType",
            value: teraType,
            reason: "unrecognized",
          });
      } else if (startsWith("EVs:")) {
        if (!supports(rules.investment !== "effortLevels"))
          unsupported("evs", value("EVs:"));
        else {
          const evs = statsIn("evs", "EVs:", 255, ev => ev === 0);
          if (evs) member.evs = evs;
        }
      } else if (startsWith("Stat Experience:")) {
        member.statExperience = statsIn(
          "statExperience",
          "Stat Experience:",
          65535,
          n => n === 0,
        );
      } else if (startsWith("Effort Levels:")) {
        member.effortLevels = statsIn(
          "effortLevels",
          "Effort Levels:",
          10,
          n => n === 0,
        );
      } else if (startsWith("IVs:")) {
        if (!supports(rules.ivs)) unsupported("ivs", value("IVs:"));
        else {
          const ivs = statsIn("ivs", "IVs:", MAX_IV, iv => iv === MAX_IV);
          if (ivs) member.ivs = ivs;
        }
      } else if (/ Nature$/i.test(line)) {
        const natureText = line.slice(0, -" Nature".length).trim();
        const nature = natureNameInverse(natureText);
        if (!supports(rules.nature)) unsupported("nature", natureText);
        else if (nature) member.nature = nature;
        else
          report({
            field: "nature",
            value: natureText,
            reason: "unrecognized",
          });
      } else if (/^(?:-|~|Move:)/i.test(line)) {
        // if property has to do with moves; a bare "-" is an empty move slot
        const supplied = line.replace(/^(?:[-~]\s*|Move:\s*)/i, "").trim();
        const moveKey = MOVE_KEYS[moveIndex];
        moveIndex++;
        const fail = (reason: Problem["reason"]) => {
          if (supplied)
            report({ field: "move", move: moveIndex, value: supplied, reason });
        };
        if (!moveKey) return fail("tooManyMoves");

        // Smogon accepts, for instance, 'Hidden Power [Fire]' as a move
        const move = moveNameInverse(
          supplied.replace("[", "").replace("]", ""),
        );

        // If legit, set move
        // Otherwise, set it blank
        const validMove =
          (
            move &&
            canItLearn(move, pokemon, generation, format, {
              acceptLegacyFormeInheritance,
            })
          ) ?
            move
          : "";
        member[moveKey] = validMove;
        if (!validMove) fail(move ? "unlearnable" : "unrecognized");
      } else if (!UNKEPT_DETAIL.test(line))
        report({ field: "line", value: line, reason: "unread" });
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
    if (gigantamax && gigantamaxForme) member.name = gigantamaxForme;
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
    for (const { problem, replacement } of pending) {
      const used = replacement ? replacement() : problem.replacement;
      const { replacement: _, ...rest } = problem;
      onProblem({
        slot: teamIndex + 1,
        pokemon,
        ...rest,
        ...(used && { replacement: used }),
      });
    }
  });

  return team;
}

// The team, with each pokemon, item, ability, and move of the text that it left
// blank or auto-selected, by slot
export function parseTeamTextReport(
  text: string,
  generation: Generation = 9,
  format = "",
  options: Omit<
    NonNullable<Parameters<typeof parseTeamText>[3]>,
    "onProblem"
  > = {},
) {
  const dropped: DroppedEntry[] = [];
  const team = parseTeamText(text, generation, format, {
    ...options,
    onProblem: ({ slot, pokemon = "", field, move = 0, value, reason }) => {
      const teamIndex = slot - 1;
      const moveKey = MOVE_KEYS[move - 1];
      if (reason === "tooManyPokemon" || reason === "tooManyMoves") return;
      if (field === "pokemon")
        dropped.push({
          teamIndex,
          pokemon,
          field,
          value: value.split("@")[0]?.trim() || value,
        });
      else if (field === "item" || field === "ability")
        dropped.push({ teamIndex, pokemon, field, value });
      else if (field === "move" && moveKey)
        dropped.push({ teamIndex, pokemon, field: moveKey, value });
    },
  });
  return { team, dropped };
}

// Each part of team text that parseTeamText could not use as written, in text order
export function teamTextProblems(
  text: string,
  generation: Generation,
  format: string,
): TeamTextProblem[] {
  const problems: TeamTextProblem[] = [];
  parseTeamText(text, generation, format, {
    onProblem: problem => problems.push(problem),
  });
  return problems;
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
// teams that have pokemon; text without headers is one team. A box (up to 24
// pokemon) becomes a team per 6: "Box 1", "Box 1 (2)", ...
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
    const header = TEAM_HEADER.exec(line.trim());
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
  return chunks.flatMap(({ header, lines }, index) => {
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
    // Showdown folder names hold no slashes, but its new client allows them in team names
    const name =
      preserveNames || isEmptyBackup(index) ? rawName : (
        rawName.slice(rawName.indexOf("/") + 1).trim()
      );
    const sets = splitSets(
      lines
        .filter(line => line.trim() !== GENERATION_PROFILE_MARKER)
        .join("\n"),
    );
    const groups = Array.from(
      { length: Math.max(1, Math.ceil(sets.length / 6)) },
      (_, i) => sets.slice(i * 6, i * 6 + 6),
    );
    return groups
      .map((group, i): ParsedTeam => ({
        name: i && name ? `${name} (${i + 1})` : name,
        ...settings,
        ...(generationProfile && { generationProfile }),
        team: parseTeamText(
          group.join("\n\n"),
          settings.generation,
          teamDataFormat({ format: settings.format, generationProfile }),
        ),
      }))
      .filter(({ team }) => !isTeamEmpty(team) || isEmptyBackup(index));
  });
}
