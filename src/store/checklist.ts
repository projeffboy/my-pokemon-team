import formatBans from "@/data/format-bans";
import { moveDataIn } from "@/shared/generation-data";
import { showdownFormatId } from "@/shared/formats";
import {
  MOVE_KEYS,
  type BattleFormat,
  type Generation,
  type ReadonlyTeam,
  type TeamPokemon,
} from "@/types";
import type { Messages } from "@/i18n/en";
import { english, type Translation } from "@/i18n/translation";
import {
  activeItem,
  effectivePokemonTypes,
  flingItem,
  IMMUNE_SCORE,
  isMoveUsable,
  typeAgainstPokemon,
} from "./shared/effectiveness";
import { filterPokemon } from "./filtering";
import { isItemAvailable, isMoveAvailable } from "./learnsets";
import { LATEST_GENERATION } from "@/shared/generations";
import { generationRules } from "@/shared/generation-rules";
import {
  COMBINED_GENERATIONS_FORMAT,
  COMBINED_GENERATIONS_PROFILE,
} from "@/shared/generation-profile";

// The labels live in src/i18n, under these keys
export type ChecklistGroupKey = keyof Messages["checklist"]["groups"];
export type ChecklistItemKey = keyof Messages["checklist"]["items"];

type Pokemon = Readonly<TeamPokemon>;

// The moves, the held item, or the ability with which one pokemon fills a role
type Fills = (
  pokemon: Pokemon,
  generation: Generation,
  format: string,
  battleFormat?: BattleFormat,
) => string[];

export interface ChecklistItem {
  key: ChecklistItemKey;
  fills: Fills;
  // What the hint suggests: moves, moves that one pokemon needs together, or held items
  examples: (string | string[])[];
  heldItem?: boolean;
  // Abilities that fill the role on their own, which the hint names after the examples
  abilities?: string[];
}

export interface ChecklistGroup {
  key: ChecklistGroupKey;
  items: ChecklistItem[];
}

// A pokemon that fills a role, and the moves, item, or ability it fills it with
export interface ChecklistFiller {
  pokemon: string;
  by: string[];
}

const moveset = (pokemon: Pokemon, generation: Generation, format: string) =>
  MOVE_KEYS.map(key => pokemon[key]).filter(
    move =>
      move &&
      isMoveUsable(
        move,
        pokemon.name,
        pokemon.item,
        pokemon.ability,
        generation,
        format,
        pokemon,
      ),
  );

const anyMove =
  (names: string[]): Fills =>
  (pokemon, generation, format) =>
    moveset(pokemon, generation, format).filter(move => names.includes(move));

const anyItem =
  (names: string[]): Fills =>
  ({ item, ability }, generation) => {
    const held = activeItem(item, ability, generation);
    return names.includes(held) ? [held] : [];
  };

// The moves one pokemon has together, or none if it lacks one. An entry may list alternatives.
const movesTogether =
  (required: (string | string[])[]): Fills =>
  (pokemon, generation, format) => {
    const moves = moveset(pokemon, generation, format);
    const found = required.flatMap(alternatives =>
      moves.filter(move => [alternatives].flat().includes(move)).slice(0, 1),
    );
    return found.length === required.length ? found : [];
  };

// Moves that inflict a non-volatile status, like Toxic, or always do so as a
// side effect, like Nuzzle. Sheer Force removes side effects.
const inflictsStatus: Fills = (pokemon, generation, format) => {
  const sheerForce = generation >= 5 && pokemon.ability === "Sheer Force";
  return moveset(pokemon, generation, format).filter(move => {
    const { status, secondary } = moveDataIn(move, generation, format) ?? {};
    return !!(
      move === "yawn" ||
      status ||
      (move === "fling" &&
        flingItem(pokemon.item, pokemon.ability, generation, pokemon.name)
          ?.status) ||
      (!sheerForce && secondary?.chance === 100 && secondary.status)
    );
  });
};

// The user's boosts from moves that Showdown applies in a callback, so the
// move data has none
const callbackBoosts = (
  move: string,
  { name, item, ability }: Pokemon,
  generation: Generation,
): Record<string, number> | undefined => {
  const isGrass = () =>
    effectivePokemonTypes(name, ability, item, generation).includes("Grass");
  const plusOrMinus = ability === "Plus" || ability === "Minus";
  switch (move) {
    case "tidyup":
      return { atk: 1, spe: 1 };
    case "takeheart":
      return { spa: 1, spd: 1 };
    case "stuffcheeks":
      return item.endsWith("berry") ? { def: 2 } : undefined;
    case "gearup":
      return plusOrMinus ? { atk: 1, spa: 1 } : undefined;
    case "magneticflux":
      return plusOrMinus ? { def: 1, spd: 1 } : undefined;
    case "flowershield":
      return isGrass() ? { def: 1 } : undefined;
    // Only grounded Grass types, which Ground moves can hit
    case "rototiller":
      return (
          isGrass() &&
            typeAgainstPokemon("Ground", name, ability, item, generation) !==
              IMMUNE_SCORE
        ) ?
          { atk: 1, spa: 1 }
        : undefined;
    // The boost on the charging turn
    case "skullbash":
      return { def: 1 };
    case "meteorbeam":
    case "electroshot":
      return { spa: 1 };
  }
};

// Curse and callback-based moves need explicit self-boost effects.
const boostsStats: Fills = (pokemon, generation, format) => {
  const contrary = generation >= 5 && pokemon.ability === "Contrary";
  const modifier =
    contrary ? -1
    : generation >= 4 && pokemon.ability === "Simple" ? 2
    : 1;
  return moveset(pokemon, generation, format).filter(move => {
    if (move === "curse")
      return (
        !contrary &&
        !effectivePokemonTypes(
          pokemon.name,
          pokemon.ability,
          pokemon.item,
          generation,
        ).includes("Ghost")
      );
    if (move === "bellydrum" || move === "acupressure") return !contrary;
    if (move === "stockpile") return generation >= 4 && !contrary;
    const data = moveDataIn(move, generation, format);
    // From Gen 8, Howl targets "allies", which includes the user
    const boosts =
      data?.selfBoosts ??
      (data?.target === "self" || data?.target === "allies" ?
        data.boosts
      : undefined) ??
      callbackBoosts(move, pokemon, generation);
    return (
      Object.entries(boosts ?? {})
        // Gen1's single Special boost is represented as both SpA and SpD.
        .filter(
          ([stat]) =>
            generation !== 1 || stat !== "spd" || boosts?.spa === undefined,
        )
        .reduce((sum, [, boost]) => sum + boost * modifier, 0) >= 2
    );
  });
};

const healingMoves = anyMove([
  "healorder",
  "milkdrink",
  "moonlight",
  "morningsun",
  "recover",
  "roost",
  "slackoff",
  "shoreup",
  "softboiled",
  "strengthsap",
  "synthesis",
]);

// Wish with a protect-like move counts as reliable recovery
const wishAndProtect = movesTogether([
  "wish",
  [
    "protect",
    "detect",
    "banefulbunker",
    "spikyshield",
    "kingsshield",
    "obstruct",
    "silktrap",
    "burningbulwark",
  ],
]);

const HAZARDS = [
  "stealthrock",
  "spikes",
  "toxicspikes",
  "stickyweb",
  "stoneaxe",
  "ceaselessedge",
];
const CLERICS = ["healbell", "aromatherapy", "sparklyswirl"];
// Damaging moves with positive priority. Grassy Glide has it only in Grassy Terrain.
const PRIORITY_MOVES = [
  "accelerock",
  "aquajet",
  "bulletpunch",
  "extremespeed",
  "fakeout",
  "feint",
  "firstimpression",
  "iceshard",
  "jetpunch",
  "machpunch",
  "quickattack",
  "shadowsneak",
  "suckerpunch",
  "thunderclap",
  "upperhand",
  "vacuumwave",
  "watershuriken",
  "zippyzap",
];
// Moves and abilities that stop a foe from switching out for as long as the trapper
// stays in, unlike moves such as Whirlpool that trap for a few turns
const TRAPPING_MOVES = [
  "meanlook",
  "block",
  "spiderweb",
  "anchorshot",
  "spiritshackle",
  "jawlock",
  "thousandwaves",
  "octolock",
];
const TRAPPING_ABILITIES = ["Shadow Tag", "Arena Trap", "Magnet Pull"];
const traps: Fills = (pokemon, generation, format) => [
  ...anyMove(TRAPPING_MOVES)(pokemon, generation, format),
  ...((
    generationRules(generation, format).abilities &&
    TRAPPING_ABILITIES.includes(pokemon.ability)
  ) ?
    [pokemon.ability]
  : []),
];
const PIVOTS = ["uturn", "voltswitch", "flipturn"];
const CHOICE_ITEMS = ["choiceband", "choicespecs", "choicescarf"];

export const checklist: ChecklistGroup[] = [
  {
    key: "general",
    items: [
      { key: "entryHazard", fills: anyMove(HAZARDS), examples: HAZARDS },
      {
        key: "spinner",
        // Before Gen 6, Defog clears only its target's side, so it clears the user's own
        // side only by targeting an ally in doubles
        fills: (pokemon, generation, format, battleFormat) =>
          anyMove([
            "rapidspin",
            "courtchange",
            "tidyup",
            "mortalspin",
            ...(generation >= 6 || battleFormat === "doubles" ? ["defog"] : []),
          ])(pokemon, generation, format, battleFormat),
        examples: ["rapidspin", "defog", "courtchange", "tidyup", "mortalspin"],
      },
      {
        key: "recovery",
        fills: (pokemon, generation, format) => [
          ...healingMoves(pokemon, generation, format),
          ...wishAndProtect(pokemon, generation, format),
        ],
        examples: ["recover", "roost", "slackoff", ["wish", "protect"]],
      },
    ],
  },
  {
    key: "defensive",
    items: [
      { key: "cleric", fills: anyMove(CLERICS), examples: CLERICS },
      {
        key: "status",
        fills: inflictsStatus,
        examples: ["toxic", "willowisp", "thunderwave", "spore"],
      },
      {
        key: "phazer",
        fills: (pokemon, generation, format) =>
          moveset(pokemon, generation, format).filter(
            move => !!moveDataIn(move, generation, format)?.forceSwitch,
          ),
        examples: ["roar", "whirlwind", "dragontail", "circlethrow"],
      },
      {
        key: "trapper",
        fills: traps,
        examples: ["meanlook", "block", "anchorshot"],
        abilities: TRAPPING_ABILITIES,
      },
    ],
  },
  {
    key: "offensive",
    items: [
      {
        key: "boosting",
        fills: boostsStats,
        examples: ["swordsdance", "nastyplot", "dragondance", "calmmind"],
      },
      {
        key: "priority",
        fills: anyMove(PRIORITY_MOVES),
        // Quick Attack is the only one in Gen 1
        examples: ["extremespeed", "suckerpunch", "aquajet", "quickattack"],
      },
      { key: "voltTurn", fills: anyMove(PIVOTS), examples: PIVOTS },
      {
        key: "choice",
        fills: anyItem(CHOICE_ITEMS),
        examples: CHOICE_ITEMS,
        heldItem: true,
      },
    ],
  },
];

// The label shown at a viewport width: the shorter one below md, the short one below lg
export const checklistLabel = (
  {
    label,
    short,
    shorter,
  }: { label: string; short?: string; shorter?: string },
  { isMdDown, isLgDown }: { isMdDown: boolean; isLgDown: boolean },
) =>
  isMdDown ? (shorter ?? short ?? label)
  : isLgDown ? (short ?? label)
  : label;

// Without a battle format, a role that singles and doubles judge differently is
// neither checked nor unchecked but depends on it, and its fillers are those of the
// battle format that it is filled in
export function evaluateChecklist(
  team: ReadonlyTeam,
  generation = LATEST_GENERATION,
  format = "",
  battleFormat?: BattleFormat,
) {
  return checklist.map(({ key, items }) => ({
    key,
    items: items.map(item => {
      const fillersIn = (battle: BattleFormat) =>
        team.flatMap(pokemon => {
          const by =
            pokemon.name ? item.fills(pokemon, generation, format, battle) : [];
          return by.length ? [{ pokemon: pokemon.name, by }] : [];
        });
      const fillers = fillersIn(battleFormat ?? "singles");
      const doubles = battleFormat ? fillers : fillersIn("doubles");
      const dependsOnBattleFormat = fillers.length > 0 !== doubles.length > 0;
      return {
        ...item,
        isChecked: fillers.length > 0 && !dependsOnBattleFormat,
        dependsOnBattleFormat,
        fillers: fillers.length ? fillers : doubles,
      };
    }),
  }));
}

// E.g. "Gigalith: Stealth Rock"
export function describeFiller(
  { heldItem, abilities = [] }: ChecklistItem,
  { pokemon, by }: ChecklistFiller,
  { locale, t, names }: Translation = english,
) {
  return t.checklist.filledBy(
    names.pokemon(pokemon),
    new Intl.ListFormat(locale, { type: "conjunction" }).format(
      by.map(id =>
        heldItem ? names.item(id)
        : abilities.includes(id) ? names.ability(id)
        : names.move(id),
      ),
    ),
  );
}

// A pokemon with nothing but these moves, or this held item
const standIn = ([first = "", second = ""]: string[], heldItem = false) => ({
  name: "",
  ability: "",
  item: heldItem ? first : "",
  move1: heldItem ? "" : first,
  move2: second,
  move3: "",
  move4: "",
});

// What would fill a role: the examples that are in the game, that its tier allows, and
// that fill it there, in the team's battle format, or in both when it has none. The
// abilities are those that a pokemon allowed there can have. As in validateTeam, the
// format picks the games' data and the tier the bans and allowed pokemon; the tier is
// the format, except in Generations 6–9.
export function checklistHint(
  { key, fills, examples, heldItem, abilities = [] }: ChecklistItem,
  { locale, t, names }: Translation = english,
  generation = LATEST_GENERATION,
  format = "",
  battleFormat?: BattleFormat,
  tier = format,
) {
  const battleFormats: BattleFormat[] =
    battleFormat ? [battleFormat] : ["singles", "doubles"];
  const list = (items: string[]) =>
    new Intl.ListFormat(locale, { type: "disjunction" }).format(items);
  const isAvailable = heldItem ? isItemAvailable : isMoveAvailable;
  const bans = formatBans[showdownFormatId(generation, tier)];
  const banned = (heldItem ? bans?.items : bans?.moves) ?? [];
  const named = examples
    .map(example => [example].flat())
    .filter(
      ids =>
        ids.every(
          id => isAvailable(id, generation, format) && !banned.includes(id),
        ) &&
        battleFormats.every(
          battle =>
            fills(standIn(ids, heldItem), generation, format, battle).length >
            0,
        ),
    )
    .map(ids => {
      const [first = "", second] = ids.map(heldItem ? names.item : names.move);
      return second ? t.checklist.together(first, second) : first;
    });
  const namedAbilities =
    generationRules(generation, format).abilities ?
      abilities
        .filter(
          ability =>
            !bans?.abilities?.includes(ability) &&
            filterPokemon({
              generation,
              format: tier,
              // In Generations 6–9, abilities still come from those games' data
              generationProfile:
                format === COMBINED_GENERATIONS_FORMAT ?
                  COMBINED_GENERATIONS_PROFILE
                : undefined,
              region: "",
              type: "",
              ability,
            }).length > 0,
        )
        .map(names.ability)
    : [];
  return named.length ?
      t.checklist.items[key].hint(list(named), list(namedAbilities))
    : t.checklist.unavailable;
}
