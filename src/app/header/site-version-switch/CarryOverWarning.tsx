import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import { useTranslation } from "@/app/shared/TranslationContext";
import type { TransferLoss } from "@/store/generation-transfer";
import type { OldWebsiteLoss } from "@/store/old-website";

// Names each pokemon and set detail that the old website cannot hold
export default function CarryOverWarning({
  losses,
}: {
  losses: OldWebsiteLoss[];
}) {
  const { t, names, locale } = useTranslation();
  const list = new Intl.ListFormat(locale, { type: "conjunction" });
  const name = (loss: TransferLoss, value = loss.value ?? "") =>
    loss.field === "move" ? names.move(value)
    : loss.field === "item" ? names.item(value)
    : loss.field === "ability" ? names.ability(value)
    : names.pokemon(value);
  const change = (loss: TransferLoss) =>
    loss.replacement ?
      `${name(loss)} → ${name(loss, loss.replacement)}`
    : name(loss);
  const line = ({ pokemon, entries, rejected, details }: OldWebsiteLoss) => {
    const species = entries.find(loss => loss.field === "pokemon");
    if (species && !species.replacement) return names.pokemon(pokemon);
    const heading = species ? change(species) : names.pokemon(pokemon);
    const lost = [
      ...[...entries.filter(loss => loss !== species), ...rejected].map(change),
      ...details.map(detail => t.advanced[detail]),
    ];
    return lost.length ?
        t.generationTransfer.entryLabel(heading, list.format(lost))
      : heading;
  };
  return (
    <Alert severity="warning" sx={{ mt: 2 }}>
      {losses.some(loss => loss.entries.length > 0) && (
        <Box component="p" sx={{ mt: 0, mb: 1 }}>
          {t.siteVersion.generationsOnly(t.combinedGenerations.label)}
        </Box>
      )}
      <Box component="p" sx={{ m: 0 }}>
        {t.siteVersion.leftOut}
      </Box>
      <Box component="ul" sx={{ m: 0, pl: 2.5, overflowWrap: "anywhere" }}>
        {losses.map(loss => (
          <li key={loss.index}>{line(loss)}</li>
        ))}
      </Box>
    </Alert>
  );
}
