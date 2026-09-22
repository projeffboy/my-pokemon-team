import moves from "@/data/moves";
import { MOVE_KEYS, type ReadonlyTeam } from "@/types";

export interface ChecklistItem {
  label: string;
  // Shorter labels for screens at lg and below, then shorter still at md and below
  shortLabel?: string;
  shorterLabel?: string;
  check: (team: ReadonlyTeam) => boolean;
}

export interface ChecklistGroup {
  title: string;
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
const inflictsStatus: Check = team =>
  teamMoves(team).some(move => {
    const { status, secondary } = moves[move] ?? {};
    return !!(status || (secondary?.chance === 100 && secondary.status));
  });

// Curse, or moves that raise stats by two or more stages in total
const boostsStats: Check = team =>
  teamMoves(team).some(
    move =>
      move === "curse" ||
      Object.values(moves[move]?.boosts ?? {}).reduce(
        (sum, boost) => sum + boost,
        0,
      ) >= 2,
  );

const hasRecovery = hasAnyMove([
  "healorder",
  "floralhealing",
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
  ["protect", "detect", "banefulbunker", "spikyshield", "kingsshield"],
]);

export const checklist: ChecklistGroup[] = [
  {
    title: "General",
    items: [
      {
        label: "Entry Hazard",
        shortLabel: "Hazard",
        check: hasAnyMove([
          "spikes",
          "stealthrock",
          "toxicspikes",
          "stickyweb",
          "stoneaxe",
        ]),
      },
      {
        label: "Spinner/Defogger",
        shortLabel: "Spinner",
        shorterLabel: "Spin",
        check: hasAnyMove([
          "rapidspin",
          "defog",
          "courtchange",
          "tidyup",
          "mortalspin",
        ]),
      },
      {
        label: "Reliable Recovery",
        shortLabel: "Recovery",
        shorterLabel: "Heal",
        check: team => hasRecovery(team) || hasWishAndProtect(team),
      },
    ],
  },
  {
    title: "Defensive",
    items: [
      { label: "Cleric", check: hasAnyMove(["aromatherapy", "healbell"]) },
      { label: "Status Move", shortLabel: "Status", check: inflictsStatus },
      {
        label: "Phazer",
        check: hasAnyMove(["circlethrow", "dragontail", "roar", "whirlwind"]),
      },
    ],
  },
  {
    title: "Offensive",
    items: [
      { label: "Boosting Move", shortLabel: "Setup", check: boostsStats },
      {
        label: "Volt-turn Move",
        shortLabel: "Volt-turn",
        shorterLabel: "Volturn",
        check: hasAnyMove(["voltswitch", "uturn", "flipturn"]),
      },
      {
        label: "Choice Item",
        shortLabel: "Choice",
        check: hasAnyItem(["choicescarf", "choiceband", "choicespecs"]),
      },
    ],
  },
];

// The label shown at a viewport width: shorterLabel below md, shortLabel below lg
export const checklistLabel = (
  { label, shortLabel, shorterLabel }: Omit<ChecklistItem, "check">,
  { isMdDown, isLgDown }: { isMdDown: boolean; isLgDown: boolean },
) =>
  isMdDown ? (shorterLabel ?? shortLabel ?? label)
  : isLgDown ? (shortLabel ?? label)
  : label;

export function evaluateChecklist(team: ReadonlyTeam) {
  return checklist.map(({ title, items }) => ({
    title,
    items: items.map(({ check, ...item }) => ({
      ...item,
      isChecked: check(team),
    })),
  }));
}
