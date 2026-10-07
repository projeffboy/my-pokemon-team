import Box from "@mui/material/Box";
import type { GameLogo } from "@/images/game-logos";

export default function GameLogos({
  logos,
  nowrap = false,
  end = false,
}: {
  logos: GameLogo[];
  nowrap?: boolean;
  end?: boolean;
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
      {logos.map(({ src, name, isBoxFront }) => (
        <Box
          key={src}
          component="img"
          src={src}
          alt={name}
          sx={{
            height: { xxs: isBoxFront ? 56 : 28, sm: isBoxFront ? 80 : 40 },
            width: "auto",
            maxWidth: nowrap ? undefined : "100%",
            objectFit: "contain",
          }}
        />
      ))}
    </Box>
  );
}
