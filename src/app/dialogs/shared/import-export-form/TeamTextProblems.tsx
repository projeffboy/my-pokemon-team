import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import type { TeamTextProblem } from "@/store/team-text";
import { useTranslation } from "@/app/shared/TranslationContext";

// Each part of the edited text that an update cannot use as written, and what the
// update does in its place. It is advice: the update still applies.
export default function TeamTextProblems({
  problems,
}: {
  problems: readonly TeamTextProblem[];
}) {
  const { t, names } = useTranslation();
  if (!problems.length) return null;
  const { importDialog: text, team, advanced, statNames } = t;
  const fields = {
    gender: advanced.gender,
    item: team.item,
    ability: team.ability,
    level: advanced.level,
    shiny: advanced.shiny,
    happiness: advanced.happiness,
    teraType: advanced.teraType,
    evs: advanced.evs,
    statExperience: advanced.statExperience,
    effortLevels: advanced.effortLevels,
    ivs: advanced.ivs,
    nature: advanced.nature,
  };

  const describe = ({
    slot,
    pokemon = "",
    field,
    move = 0,
    stat,
    value,
    reason,
    range: [min, max] = [0, 0],
    replacement,
  }: TeamTextProblem) => {
    const name = names.pokemon(pokemon);
    const where =
      field === "pokemon" ? team.slot(slot)
      : field === "line" ? name
      : text.problemAt(
          name,
          field === "move" ? text.moveSlot(move) : fields[field],
        );
    const reasons = {
      unrecognized: text.unrecognized,
      unlearnable: text.unlearnable(name),
      wrongAbility: text.wrongAbility(name),
      outOfRange: text.outOfRange(min, max),
      unsupported: text.unsupported,
      tooManyPokemon: text.tooManyPokemon,
      tooManyMoves: text.tooManyMoves,
      noGigantamax: text.noGigantamax(name),
      unread: text.unread,
    };
    const result =
      replacement ?
        text.usedInstead(
          field === "item" ? names.item(replacement)
          : field === "ability" ? names.ability(replacement)
          : stat ? `${replacement} ${statNames[stat]}`
          : replacement,
        )
      : field === "pokemon" && reason === "unrecognized" ? text.slotLeftEmpty
      : field === "move" && reason !== "tooManyMoves" ? text.moveLeftEmpty
      : text.leftOut;
    return {
      title: text.problemValue(where, value),
      explanation: text.explanation(reasons[reason], result),
    };
  };

  return (
    <Alert
      severity="warning"
      role="status"
      sx={{
        mb: 2.5,
        // The icon leaves too narrow a column for the list on small phones
        "& .MuiAlert-icon": { display: { xxs: "none", xs: "flex" } },
      }}
    >
      {text.problems(problems.length)}
      <Box component="ul" sx={{ mt: 1, mb: 0, pl: 2.5 }}>
        {problems.map((problem, i) => {
          const { title, explanation } = describe(problem);
          return (
            <Box component="li" key={i} sx={{ mt: 0.5 }}>
              <Box
                component="span"
                sx={{
                  display: "block",
                  fontWeight: 500,
                  overflowWrap: "anywhere",
                }}
              >
                {title}
              </Box>
              {explanation}
            </Box>
          );
        })}
      </Box>
    </Alert>
  );
}
