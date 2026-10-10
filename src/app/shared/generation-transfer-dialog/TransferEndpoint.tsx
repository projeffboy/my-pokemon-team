import Typography from "@mui/material/Typography";
import { CHAMPIONS_FORMAT } from "@/shared/formats";
import { variantGeneration } from "@/shared/game-variants";
import type { Generation } from "@/types";
import { useTranslation } from "../TranslationContext";
import useFittingLabel from "../use-fitting-label";

export default function TransferEndpoint({
  value,
  label,
  games,
  generation,
  format,
}: {
  value: string;
  label: string;
  games?: string;
  generation: Generation;
  format: string;
}) {
  const { t } = useTranslation();
  const [generationLabel, ...parts] = value.split(" · ");
  const short = games ?? parts.join(" · ");
  const full =
    format === CHAMPIONS_FORMAT ? short
    : variantGeneration(format) ?
      t.gameVariants[format as keyof typeof t.gameVariants]
    : t.generationGames[generation];
  const { ref, label: gameNames } = useFittingLabel<HTMLParagraphElement>([
    full,
    full.replaceAll(" / ", " /\n"),
    short,
  ]);

  return (
    <>
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="body2" sx={{ fontWeight: 500 }}>
        {generationLabel}
      </Typography>
      {short && (
        <Typography
          ref={ref}
          variant="body2"
          color="text.secondary"
          title={full}
          sx={{ whiteSpace: "pre-line" }}
        >
          {gameNames}
        </Typography>
      )}
    </>
  );
}
