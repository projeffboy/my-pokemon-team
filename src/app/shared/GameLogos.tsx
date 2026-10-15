import Box from "@mui/material/Box";
import { logoAspectRatio, type GameLogo } from "@/images/game-logos";

export default function GameLogos({
  logos,
  nowrap = false,
  end = false,
  placeholders = false,
}: {
  logos: GameLogo[];
  nowrap?: boolean;
  end?: boolean;
  // Takes up the logos' room without loading them, to measure a layout
  placeholders?: boolean;
}) {
  return (
    <Box
      component="span"
      sx={{
        display: "flex",
        flexWrap: nowrap ? "nowrap" : "wrap",
        justifyContent: end ? "flex-end" : "flex-start",
        alignItems: "center",
        gap: 0.75,
        mt: 0.5,
        // On one line, the logos shrink to fit rather than overflow
        minWidth: nowrap ? 0 : undefined,
      }}
    >
      {logos.map(logo => {
        const { src, name, isBoxFront } = logo;
        // A box front is twice a wordmark's height
        const scale = isBoxFront ? 2 : 1;
        const sx = {
          height: {
            xxs: 28 * scale,
            // On one line the logos shrink to fit, so they can take the larger size sooner
            ...(nowrap && { xs: 40 * scale }),
            sm: 40 * scale,
          },
          aspectRatio: logoAspectRatio(logo),
          flexShrink: 0,
        };
        return placeholders ?
            <Box key={src} component="span" sx={sx} />
          : <Box
              key={src}
              component="img"
              src={src}
              alt={name}
              sx={{
                ...sx,
                width: "auto",
                maxWidth: nowrap ? undefined : "100%",
                minWidth: nowrap ? 0 : undefined,
                flexShrink: undefined,
                objectFit: "contain",
              }}
            />;
      })}
    </Box>
  );
}
