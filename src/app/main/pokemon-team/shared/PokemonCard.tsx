import Paper from "@mui/material/Paper";
import { observer } from "mobx-react-lite";
import store from "@/store";
import { useIsMdDown } from "@/app/shared/WidthContext";
import PokemonInputs from "./PokemonInputs";

const PokemonCard = observer(function PokemonCard({
  teamIndex,
  isDragOverlay = false,
}: {
  teamIndex: number;
  isDragOverlay?: boolean;
}) {
  const isMdDown = useIsMdDown();
  const hasHandle = !isMdDown && Boolean(store.team[teamIndex]?.name);

  return (
    <Paper
      elevation={isDragOverlay ? 6 : 1}
      sx={[
        { p: 1 },
        isDragOverlay && { m: -1, cursor: "grabbing" },
        hasHandle && {
          position: "relative",
          boxShadow: "none",
          bgcolor: "transparent",
          backgroundImage: "none",
        },
      ]}
    >
      {hasHandle && (
        <Paper
          aria-hidden
          elevation={isDragOverlay ? 6 : 1}
          sx={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            boxShadow: "none",
            filter:
              isDragOverlay ?
                "drop-shadow(0 6px 10px rgb(0 0 0 / 14%)) drop-shadow(0 1px 18px rgb(0 0 0 / 12%))"
              : "drop-shadow(0 1px 1px rgb(0 0 0 / 22%)) drop-shadow(0 1px 1.5px rgb(0 0 0 / 12%))",
            "&::before, &::after": {
              content: '""',
              position: "absolute",
              bgcolor: "inherit",
              backgroundImage: "inherit",
              pointerEvents: "none",
            },
            "&::before": {
              top: 0,
              left: -18,
              width: 22,
              height: 28,
              borderRadius: "4px 0 0 4px",
            },
            "&::after": {
              top: 28,
              left: -4,
              width: 4,
              height: 4,
              maskImage:
                "radial-gradient(circle at 0 100%, transparent 3.5px, #000 4px)",
            },
          }}
        />
      )}
      <PokemonInputs teamIndex={teamIndex} isDragOverlay={isDragOverlay} />
    </Paper>
  );
});

export default PokemonCard;
