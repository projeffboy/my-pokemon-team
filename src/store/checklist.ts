import { moveDataIn } from "@/shared/generation-data";
import {
  MOVE_KEYS,
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
  isMoveUsable,
} from "./shared/effectiveness";
import { isItemAvailable, isMoveAvailable } from "./learnsets";
import { LATEST_GENERATION } from "@/shared/generations";

// The labels live in src/i18n, under these keys
export type ChecklistGroupKey = keyof Messages["checklist"]["groups"];
export type ChecklistItemKey = keyof Messages["checklist"]["items"];

type Pokemon = Readonly<TeamPokemon>;

// The moves, or the held item, with which one pokemon fills a role
type Fills = (
  pokemon: Pokemon,
  generation: Generation,
  format: string,
) => string[];

export interface ChecklistItem {
  key: ChecklistItemKey;
  fills: Fills;
  // What the hint suggests: moves, moves that one pokemon needs together, or held items
  examples: (string | string[])[];
  heldItem?: boolean;
}

export interface ChecklistGroup {
  key: ChecklistGroupKey;
  items: ChecklistItem[];
}

// A pokemon that fills a role, and the moves or item it fills it with
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
// side effect, like Nuzzle
const inflictsStatus: Fills = (pokemon, generation, format) =>
  moveset(pokemon, generation, format).filter(move => {
    const { status, secondary } = moveDataIn(move, generation, format) ?? {};
    return !!(
      move === "yawn" ||
      status ||
      (move === "fling" &&
        flingItem(pokemon.item, pokemon.ability, generation, pokemon.name)
          ?.status) ||
      (secondary?.chance === 100 && secondary.status)
    );
  });

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
    const boosts =
      data?.selfBoosts ?? (data?.target === "self" ? data.boosts : undefined);
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
const PIVOTS = ["uturn", "voltswitch", "flipturn"];
const CHOICE_ITEMS = ["choiceband", "choicespecs", "choicescarf"];

export const checklist: ChecklistGroup[] = [
  {
    key: "general",
    items: [
      { key: "entryHazard", fills: anyMove(HAZARDS), examples: HAZARDS },
      {
        key: "spinner",
        // Defog clears the user's side too from Gen 6
        fills: (pokemon, generation, format) =>
          anyMove([
            "rapidspin",
            "courtchange",
            "tidyup",
            "mortalspin",
            ...(generation >= 6 ? ["defog"] : []),
          ])(pokemon, generation, format),
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

export function evaluateChecklist(
  team: ReadonlyTeam,
  generation = LATEST_GENERATION,
  format = "",
) {
  return checklist.map(({ key, items }) => ({
    key,
    items: items.map(item => {
      const fillers = team.flatMap(pokemon => {
        const by = pokemon.name ? item.fills(pokemon, generation, format) : [];
        return by.length ? [{ pokemon: pokemon.name, by }] : [];
      });
      return { ...item, isChecked: fillers.length > 0, fillers };
    }),
  }));
}

// E.g. "Gigalith: Stealth Rock"
export function describeFiller(
  { heldItem }: ChecklistItem,
  { pokemon, by }: ChecklistFiller,
  { locale, t, names }: Translation = english,
) {
  return t.checklist.filledBy(
    names.pokemon(pokemon),
    new Intl.ListFormat(locale, { type: "conjunction" }).format(
      by.map(heldItem ? names.item : names.move),
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

// What would fill a role: the examples that are in the game and fill it there
export function checklistHint(
  { key, fills, examples, heldItem }: ChecklistItem,
  { locale, t, names }: Translation = english,
  generation = LATEST_GENERATION,
  format = "",
) {
  const isAvailable = heldItem ? isItemAvailable : isMoveAvailable;
  const named = examples
    .map(example => [example].flat())
    .filter(
      ids =>
        ids.every(id => isAvailable(id, generation, format)) &&
        fills(standIn(ids, heldItem), generation, format).length > 0,
    )
    .map(ids => {
      const [first = "", second] = ids.map(heldItem ? names.item : names.move);
      return second ? t.checklist.together(first, second) : first;
    });
  return named.length ?
      t.checklist.items[key].hint(
        new Intl.ListFormat(locale, { type: "disjunction" }).format(named),
      )
    : t.checklist.unavailable;
}
