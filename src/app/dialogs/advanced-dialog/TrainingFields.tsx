import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import Typography from "@mui/material/Typography";
import { observer } from "mobx-react-lite";
import { type Generation, type TeamPokemon } from "@/types";
import {
  generationRules,
  gen2Dvs,
  getDv,
  hpDv,
  getStatExperience,
  setDv,
  setStatExperience,
} from "@/shared/generation-rules";
import {
  evTotal,
  getEv,
  getIv,
  setDetail,
  setStat,
} from "@/shared/set-details";
import { useTranslation } from "@/app/shared/TranslationContext";
import NumberField from "./NumberField";

const clamp = (value: number, max: number) =>
  Math.min(max, Math.max(0, Math.round(value)));

export default observer(function TrainingFields({
  member,
  generation,
  format,
  teamIndex,
}: {
  member: TeamPokemon;
  generation: Generation;
  format: string;
  teamIndex: number;
}) {
  const { t } = useTranslation();
  const rules = generationRules(generation, format);
  const dvMember = generation === 2 ? gen2Dvs(member) : member;
  const total = evTotal(member.evs);
  const heading = t.advanced[rules.investment];
  const statLabel = (stat: (typeof rules.statKeys)[number]) =>
    rules.legacy && stat === "spa" ? t.info.special : t.statNames[stat];
  const amount = (stat: (typeof rules.statKeys)[number]) =>
    rules.legacy ? getStatExperience(member, stat)
    : rules.investment === "effortLevels" ? (member.effortLevels?.[stat] ?? 0)
    : getEv(member.evs, stat);
  const setAmount = (stat: (typeof rules.statKeys)[number], value = 0) => {
    const n = clamp(value, rules.maxStat);
    if (rules.legacy) setStatExperience(member, stat, n);
    else if (rules.investment === "effortLevels")
      setDetail(member, "effortLevels", { ...member.effortLevels, [stat]: n });
    else
      setStat(
        member,
        "evs",
        stat,
        Math.min(
          n,
          rules.maxTotal === undefined ?
            n
          : Math.max(0, rules.maxTotal - total + getEv(member.evs, stat)),
        ),
      );
  };
  return (
    <>
      <Box>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="subtitle2" component="h3">
            {heading}
          </Typography>
          {rules.maxTotal !== undefined && (
            <Typography
              variant="body2"
              sx={{
                color: total > rules.maxTotal ? "error.main" : "text.secondary",
              }}
              aria-label={
                rules.investment === "sps" ?
                  t.advanced.spTotal(total, rules.maxTotal)
                : t.advanced.evTotal(total, rules.maxTotal)
              }
            >
              {total} / {rules.maxTotal}
            </Typography>
          )}
        </Box>
        {rules.statKeys.map(stat => {
          const id = `training-${stat}-${teamIndex}`;
          return (
            <Box
              key={stat}
              sx={{ display: "flex", alignItems: "center", gap: 1.5 }}
            >
              <Typography
                component="label"
                htmlFor={id}
                variant="body2"
                sx={{ width: rules.legacy ? 56 : 32, flexShrink: 0 }}
              >
                {statLabel(stat)}
              </Typography>
              <Slider
                id={`${id}-slider`}
                size="small"
                min={0}
                max={rules.maxStat}
                step={1}
                value={Math.min(rules.maxStat, amount(stat))}
                onChange={(_event, value) => setAmount(stat, value)}
                aria-label={`${statLabel(stat)} ${heading}`}
              />
              <NumberField
                id={id}
                size="small"
                value={amount(stat)}
                onChange={value => setAmount(stat, value)}
                slotProps={{
                  htmlInput: {
                    min: 0,
                    max: rules.maxStat,
                    step: 1,
                    inputMode: "numeric",
                    "aria-label": `${statLabel(stat)} ${heading}`,
                  },
                }}
                sx={{
                  width: rules.legacy ? 96 : 72,
                  flexShrink: 0,
                  "& input": { textAlign: "right" },
                }}
              />
            </Box>
          );
        })}
      </Box>
      {rules.ivs && (
        <Box>
          <Typography variant="subtitle2" component="h3" sx={{ mb: 1 }}>
            {rules.legacy ? t.advanced.dvs : t.advanced.ivs}
          </Typography>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 1,
            }}
          >
            {rules.statKeys.map(stat => (
              <NumberField
                key={stat}
                size="small"
                label={statLabel(stat)}
                value={
                  rules.legacy ?
                    stat === "hp" ?
                      hpDv(dvMember)
                    : getDv(dvMember, stat)
                  : getIv(member.ivs, stat)
                }
                onChange={(value = rules.legacy ? 15 : 31) =>
                  rules.legacy ?
                    setDv(member, stat, value, generation)
                  : setStat(member, "ivs", stat, clamp(value, 31))
                }
                slotProps={{
                  htmlInput: {
                    min: 0,
                    max: rules.legacy ? 15 : 31,
                    readOnly: rules.legacy && stat === "hp",
                    "aria-label": `${statLabel(stat)} ${rules.legacy ? t.advanced.dvs : t.advanced.ivs}`,
                  },
                }}
              />
            ))}
          </Box>
        </Box>
      )}
    </>
  );
});
