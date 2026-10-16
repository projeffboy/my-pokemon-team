import {
  MOVE_KEYS,
  STAT_KEYS,
  type GenerationTransferData,
  type ReadonlyTeam,
  type SavedTeam,
  type TeamPokemon,
} from "@/types";
import {
  COMBINED_GENERATIONS_FORMAT,
  teamDataFormat,
} from "@/shared/generation-profile";
import {
  generationRules,
  isShinyInGeneration,
} from "@/shared/generation-rules";
import {
  DEFAULT_HAPPINESS,
  DEFAULT_LEVEL,
  genderOptions,
  getIv,
  MAX_IV,
} from "@/shared/set-details";
import { pokemonAbilities } from "@/shared/pokedex";
import { getAutoSelectedAbility } from "@/shared/team";
import {
  planGenerationTransfer,
  type TransferLoss,
} from "./generation-transfer";
import { oldWebsiteLearnset } from "./learnsets";
import { serializeTeam } from "./team-text";

// A set detail, named as the team's generation names it
export type OldWebsiteDetail =
  | "nickname"
  | "level"
  | "gender"
  | "shiny"
  | "happiness"
  | "teraType"
  | "nature"
  | ReturnType<typeof generationRules>["investment"]
  | "ivs"
  | "dvs";

export interface OldWebsiteLoss {
  index: number;
  pokemon: string;
  // The pokemon, moves, item, and ability that Generations 6–9 lack
  entries: TransferLoss[];
  // The moves and ability that Generations 6–9 have but the old website's own data lacks
  rejected: TransferLoss[];
  details: OldWebsiteDetail[];
}

// The old website reads only Generations 6–9's pokemon, items, abilities, and moves
export function planOldWebsiteTeam(
  team: ReadonlyTeam,
  settings: Pick<SavedTeam, "generation" | "format" | "generationProfile">,
  data: GenerationTransferData,
): { text: string; losses: OldWebsiteLoss[] } {
  const rules = generationRules(settings.generation, teamDataFormat(settings));
  const plan = planGenerationTransfer(
    team,
    settings,
    9,
    COMBINED_GENERATIONS_FORMAT,
    data,
  );
  const details = (member: Readonly<TeamPokemon>) =>
    (
      [
        ["nickname", member.nickname?.trim()],
        [
          "level",
          member.level !== undefined &&
            member.level !== (rules.fixedLevel ?? DEFAULT_LEVEL),
        ],
        [
          "gender",
          rules.gender &&
            genderOptions(member.name).length > 1 &&
            member.gender,
        ],
        ["shiny", isShinyInGeneration(member, settings.generation)],
        [
          "happiness",
          rules.happiness &&
            (member.happiness ?? DEFAULT_HAPPINESS) !== DEFAULT_HAPPINESS,
        ],
        ["teraType", rules.tera && member.teraType],
        ["nature", rules.nature && member.nature],
        [
          rules.investment,
          [member.evs, member.statExperience, member.effortLevels].some(stats =>
            Object.values(stats ?? {}).some(value => (value ?? 0) > 0),
          ),
        ],
        [
          rules.legacy ? "dvs" : "ivs",
          rules.ivs &&
            STAT_KEYS.some(stat => getIv(member.ivs, stat) !== MAX_IV),
        ],
      ] as const
    )
      .filter(([, held]) => held)
      .map(([detail]) => detail);
  // The old website keeps only the abilities in its pokedex and the moves in its own learnsets,
  // which leave out Smeargle's sketched moves. It shows No Ability as a blank ability, except
  // that a pokemon with only one ability gets that one.
  const rejected: TransferLoss[] = [];
  const carried = plan.team.map(
    ({ name, item, ability, move1, move2, move3, move4 }, index) => {
      const member = { name, item, ability, move1, move2, move3, move4 };
      const reject = (
        field: "ability" | "move",
        value: string,
        replacement?: string,
      ) =>
        rejected.push({
          index,
          pokemon: team[index]?.name ?? name,
          field,
          value,
          ...(replacement && { replacement }),
        });
      if (!ability) {
        const only = rules.abilities && getAutoSelectedAbility(name);
        if (only) reject("ability", "No Ability", only);
      } else if (
        ability !== "No Ability" &&
        !pokemonAbilities(name).includes(ability)
      ) {
        reject("ability", ability, getAutoSelectedAbility(name));
        member.ability = "";
      }
      const learnset = oldWebsiteLearnset(name);
      for (const key of MOVE_KEYS) {
        const move = member[key];
        if (move && !learnset.includes(move)) {
          reject("move", move);
          member[key] = "";
        }
      }
      return member;
    },
  );
  const losses = team.flatMap((member, index): OldWebsiteLoss[] => {
    const entries = plan.losses.filter(
      loss =>
        loss.index === index &&
        ["pokemon", "move", "item", "ability"].includes(loss.field),
    );
    const refused = rejected.filter(loss => loss.index === index);
    // A pokemon left out loses its details with it
    const kept = !entries.some(
      loss => loss.field === "pokemon" && !loss.replacement,
    );
    const lost = member.name && kept ? details(member) : [];
    return entries.length || refused.length || lost.length ?
        [
          {
            index,
            pokemon: member.name,
            entries,
            rejected: refused,
            details: lost,
          },
        ]
      : [];
  });
  return { text: serializeTeam(carried), losses };
}
