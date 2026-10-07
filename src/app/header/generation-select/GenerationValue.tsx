import Box from "@mui/material/Box";
import useFittingLabel from "@/app/shared/use-fitting-label";

export default function GenerationValue({
  full,
  short,
  compact,
}: {
  full: string;
  short: string;
  compact?: string;
}) {
  const { ref, label } = useFittingLabel<HTMLSpanElement>([
    full,
    ...(compact ? [compact] : []),
    short,
  ]);
  return (
    <Box
      component="span"
      ref={ref}
      sx={{
        display: "block",
        width: "100%",
        overflow: "visible",
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </Box>
  );
}
