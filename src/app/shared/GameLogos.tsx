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
      }}
    >
      {logos.map(logo => {
        const { src, name, isBoxFront } = logo;
        const sx = {
          height: { xxs: isBoxFront ? 56 : 28, sm: isBoxFront ? 80 : 40 },
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
                flexShrink: undefined,
                objectFit: "contain",
              }}
            />;
      })}
    </Box>
  );
}
