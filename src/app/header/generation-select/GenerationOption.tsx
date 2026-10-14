import ListItemText from "@mui/material/ListItemText";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import GameLogos from "@/app/shared/GameLogos";
import useFittingLabel from "@/app/shared/use-fitting-label";
import type { GameLogo } from "@/images/game-logos";

export default function GenerationOption({
  label,
  short = label,
  compact,
  logos,
  nowrap = false,
  placeholders = false,
  status,
}: {
  label: string;
  short?: string;
  compact?: string;
  logos: GameLogo[];
  nowrap?: boolean;
  placeholders?: boolean;
  status?: string;
}) {
  const { ref, label: fittingLabel } = useFittingLabel<HTMLSpanElement>([
    label,
    ...(compact ? [compact] : []),
    short,
  ]);
  return (
    <ListItemText
      primary={nowrap ? label : fittingLabel}
      secondary={
        <Box
          component="span"
          sx={{ display: "flex", alignItems: "center", gap: 1 }}
        >
          {logos.length > 0 && (
            <GameLogos logos={logos} nowrap placeholders={placeholders} />
          )}
          {status && (
            <Typography
              component="span"
              variant="caption"
              // In the menu a long description wraps, in even lines, rather than run past the check mark
              sx={{
                mt: 0.5,
                whiteSpace: nowrap ? "nowrap" : "normal",
                textWrapStyle: "balance",
              }}
            >
              {status}
            </Typography>
          )}
        </Box>
      }
      slotProps={{
        primary: {
          ref: nowrap ? undefined : ref,
          sx: { whiteSpace: "nowrap" },
        },
        secondary: { component: "span" },
      }}
    />
  );
}
