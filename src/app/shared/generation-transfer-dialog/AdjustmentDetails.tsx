import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useTranslation } from "@/app/shared/TranslationContext";
import type { TransferLoss } from "@/store/generation-transfer";
import { STAT_KEYS } from "@/types";

export default function AdjustmentDetails({
  change,
  destination,
  label,
}: {
  change: TransferLoss;
  destination: string;
  label: string;
}) {
  const { t, names } = useTranslation();
  const text = t.generationTransfer;
  const conversion = change.conversion;
  return (
    <Box sx={{ mt: 0.5, color: "text.secondary" }}>
      <Typography variant="body2">
        {change.field === "pokemon" && change.replacement ?
          `${names.pokemon(change.value ?? change.pokemon)} → ${names.pokemon(change.replacement)}`
        : change.field === "ability" && change.replacement ?
          text.entryLabel(
            t.team.ability,
            `${names.ability(change.value ?? "")} → ${names.ability(change.replacement)}`,
          )
        : conversion?.from === "ivs" && conversion.to === "dvs" ?
          text.ivsConvertedToDvs
        : conversion ?
          STAT_KEYS.filter(
            stat =>
              (conversion.before[stat] ?? 0) !== 0 ||
              (conversion.after[stat] ?? 0) !== 0,
          )
            .map(stat =>
              text.entryLabel(
                t.statNames[stat],
                `${conversion.before[stat] ?? 0} ${t.advanced[conversion.from]} → ${conversion.after[stat] ?? 0} ${t.advanced[conversion.to]}`,
              ),
            )
            .join(" · ")
        : change.field === "ivs" ?
          text.ivsUnused(destination)
        : text.entryLabel(label, `${change.value} → ${change.replacement}`)}
      </Typography>
      {conversion && conversion.to !== "dvs" && (
        <>
          {conversion.limited && (
            <Typography variant="body2">{text.trainingLimited}</Typography>
          )}
          {conversion.approximate && (
            <Typography variant="body2">{text.trainingApproximate}</Typography>
          )}
        </>
      )}
    </Box>
  );
}
