import Box from "@mui/material/Box";
import Tooltip from "@mui/material/Tooltip";
import WarningIcon from "@mui/icons-material/Warning";
import { observer } from "mobx-react-lite";
import store from "@/store";
import { useTranslation } from "@/app/shared/TranslationContext";

// A marker on a slot whose pokemon breaks a rule. Hovering, focusing, or tapping
// it lists the rules.
const SlotProblems = observer(function SlotProblems({
  teamIndex,
  pokemon,
}: {
  teamIndex: number;
  pokemon: string;
}) {
  const { t } = useTranslation();
  const problems = store.slotProblems(teamIndex);
  if (!problems.length) return null;

  return (
    <Tooltip
      describeChild
      enterTouchDelay={0}
      title={problems.map(({ message }) => (
        <div key={message}>{message}</div>
      ))}
    >
      <Box
        role="img"
        tabIndex={0}
        aria-label={t.validation.pokemonProblems(pokemon)}
        sx={{
          display: "flex",
          alignSelf: "center",
          color: "warning.main",
          pointerEvents: "auto",
        }}
      >
        <WarningIcon sx={{ fontSize: 20 }} />
      </Box>
    </Tooltip>
  );
});

export default SlotProblems;
