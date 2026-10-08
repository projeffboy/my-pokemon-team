import { MOVE_KEYS, type Generation, type ReadonlyTeam } from "@/types";
import { moveDataIn } from "@/shared/generation-data";
import { LATEST_GENERATION } from "@/shared/generations";
import { pokemonTypes } from "@/shared/pokedex";
import type { Messages } from "@/i18n/en";

// The labels live in src/i18n, under these keys
export type ChecklistGroupKey = keyof Messages["checklist"]["groups"];
export type ChecklistItemKey = keyof Messages["checklist"]["items"];

export interface ChecklistItem {
  key: ChecklistItemKey;
  check: (
    team: ReadonlyTeam,
    generation: Generation,
    format: string,
  ) => boolean;
}

export interface ChecklistGroup {
  key: ChecklistGroupKey;
  items: ChecklistItem[];
}

type Check = ChecklistItem["check"];

const moveset = (pokemon: ReadonlyTeam[number]) =>
  MOVE_KEYS.map(key => pokemon[key]);

const teamMoves = (team: ReadonlyTeam) => team.flatMap(moveset);

const hasAnyMove =
  (names: string[]): Check =>
  team =>
    teamMoves(team).some(move => names.includes(move));

const hasAnyItem =
  (names: string[]): Check =>
  team =>
    team.some(({ item }) => names.includes(item));

// Does one pokemon have all of these moves? An entry may list alternatives.
const hasMovesTogether =
  (required: (string | string[])[]): Check =>
  team =>
    team.some(pokemon => {
      const pokemonMoves = moveset(pokemon);
      return required.every(move =>
        [move].flat().some(alt => pokemonMoves.includes(alt)),
      );
    });

// Moves that inflict a non-volatile status, like Toxic, or always do so as a
// side effect, like Nuzzle
const inflictsStatus: Check = (team, generation, format) =>
  teamMoves(team).some(move => {
    const { status, secondary } = moveDataIn(move, generation, format) ?? {};
    return !!(
      move === "yawn" ||
      status ||
      (secondary?.chance === 100 && secondary.status)
    );
  });

// Curse, Belly Drum, or moves that raise stats by two or more stages in total
const boostsStats: Check = (team, generation, format) =>
  team.some(member =>
    moveset(member).some(
      move =>
        (move === "curse" &&
          !pokemonTypes(member.name, generation).includes("Ghost")) ||
        move === "bellydrum" ||
        Object.entries(
          moveDataIn(move, generation, format)?.boosts ?? {},
        ).reduce(
          // Gen 1 stores its one Special stat in both modern Special fields.
          (sum, [stat, boost]) =>
            sum + (generation === 1 && stat === "spd" ? 0 : boost),
          0,
        ) >= 2,
    ),
  );

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
        check: (team, generation) =>
          teamMoves(team).some(
            move =>
              ["rapidspin", "courtchange", "tidyup", "mortalspin"].includes(
                move,
              ) ||
              (move === "defog" && generation >= 6),
          ),
      },
      {
        key: "recovery",
        check: (team, generation, format) =>
          hasRecovery(team, generation, format) ||
          hasWishAndProtect(team, generation, format),
      },
    ],
  },
  {
    key: "defensive",
    items: [
      { key: "cleric", check: hasAnyMove(["aromatherapy", "healbell"]) },
      { key: "status", check: inflictsStatus },
      {
        key: "phazer",
        check: hasAnyMove(["circlethrow", "dragontail", "roar", "whirlwind"]),
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
  format = "",
) {
  return checklist.map(({ key, items }) => ({
    key,
    items: items.map(({ key, check }) => ({
      key,
      isChecked: check(team, generation, format),
    })),
  }));
}
