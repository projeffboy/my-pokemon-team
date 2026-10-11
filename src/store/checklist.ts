import { moveDataIn } from "@/shared/generation-data";
import { MOVE_KEYS, type Generation, type ReadonlyTeam } from "@/types";
import type { Messages } from "@/i18n/en";
import {
  activeItem,
  effectivePokemonTypes,
  flingItem,
  isMoveUsable,
} from "./shared/effectiveness";
import { LATEST_GENERATION } from "@/shared/generations";

// The labels live in src/i18n, under these keys
export type ChecklistGroupKey = keyof Messages["checklist"]["groups"];
export type ChecklistItemKey = keyof Messages["checklist"]["items"];

export interface ChecklistItem {
  key: ChecklistItemKey;
  check: (team: ReadonlyTeam, generation?: Generation) => boolean;
}

export interface ChecklistGroup {
  key: ChecklistGroupKey;
  items: ChecklistItem[];
}

type Check = ChecklistItem["check"];

const moveset = (
  pokemon: ReadonlyTeam[number],
  generation = LATEST_GENERATION,
) =>
  MOVE_KEYS.map(key => pokemon[key]).filter(move =>
    isMoveUsable(move, pokemon.name, pokemon.item, pokemon.ability, generation),
  );

const teamMoves = (team: ReadonlyTeam, generation = LATEST_GENERATION) =>
  team.flatMap(pokemon => moveset(pokemon, generation));

const hasAnyMove =
  (names: string[]): Check =>
  (team, generation = LATEST_GENERATION) =>
    teamMoves(team, generation).some(move => names.includes(move));

const hasAnyItem =
  (names: string[]): Check =>
  (team, generation = LATEST_GENERATION) =>
    team.some(({ item, ability }) =>
      names.includes(activeItem(item, ability, generation)),
    );

// Does one pokemon have all of these moves? An entry may list alternatives.
const hasMovesTogether =
  (required: (string | string[])[]): Check =>
  (team, generation = LATEST_GENERATION) =>
    team.some(pokemon => {
      const pokemonMoves = moveset(pokemon, generation);
      return required.every(move =>
        [move].flat().some(alt => pokemonMoves.includes(alt)),
      );
    });

// Moves that inflict a non-volatile status, like Toxic, or always do so as a
// side effect, like Nuzzle
const inflictsStatus: Check = (team, generation = LATEST_GENERATION) =>
  team.some(pokemon =>
    moveset(pokemon, generation).some(move => {
      const { status, secondary } = moveDataIn(move, generation) ?? {};
      return !!(
        move === "yawn" ||
        status ||
        (move === "fling" &&
          flingItem(pokemon.item, pokemon.ability, generation, pokemon.name)
            ?.status) ||
        (secondary?.chance === 100 && secondary.status)
      );
    }),
  );

// Curse and callback-based moves need explicit self-boost effects.
const boostsStats: Check = (team, generation = LATEST_GENERATION) =>
  team.some(pokemon => {
    const contrary = generation >= 5 && pokemon.ability === "Contrary";
    const modifier =
      contrary ? -1
      : generation >= 4 && pokemon.ability === "Simple" ? 2
      : 1;
    return moveset(pokemon, generation).some(move => {
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
      const data = moveDataIn(move, generation);
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
  });

const hasRecovery = hasAnyMove([
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
const hasWishAndProtect = hasMovesTogether([
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

export const checklist: ChecklistGroup[] = [
  {
    key: "general",
    items: [
      {
        key: "entryHazard",
        check: hasAnyMove([
          "spikes",
          "stealthrock",
          "toxicspikes",
          "stickyweb",
          "stoneaxe",
          "ceaselessedge",
        ]),
      },
      {
        key: "spinner",
        check: (team, generation = LATEST_GENERATION) =>
          hasAnyMove(["rapidspin", "courtchange", "tidyup", "mortalspin"])(
            team,
            generation,
          ) ||
          (generation >= 6 && hasAnyMove(["defog"])(team, generation)),
      },
      {
        key: "recovery",
        check: (team, generation = LATEST_GENERATION) =>
          hasRecovery(team, generation) || hasWishAndProtect(team, generation),
      },
    ],
  },
  {
    key: "defensive",
    items: [
      {
        key: "cleric",
        check: hasAnyMove(["aromatherapy", "healbell", "sparklyswirl"]),
      },
      { key: "status", check: inflictsStatus },
      {
        key: "phazer",
        check: (team, generation = LATEST_GENERATION) =>
          teamMoves(team, generation).some(
            move => !!moveDataIn(move, generation)?.forceSwitch,
          ),
      },
    ],
  },
  {
    key: "offensive",
    items: [
      { key: "boosting", check: boostsStats },
      {
        key: "voltTurn",
        check: hasAnyMove(["voltswitch", "uturn", "flipturn"]),
      },
      {
        key: "choice",
        check: hasAnyItem(["choicescarf", "choiceband", "choicespecs"]),
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
) {
  return checklist.map(({ key, items }) => ({
    key,
    items: items.map(({ key, check }) => ({
      key,
      isChecked: check(team, generation),
    })),
  }));
}
