import Button from "@mui/material/Button";
import { observer } from "mobx-react-lite";
import store from "@/store";
import useTeamToolsToggle from "./use-team-tools-toggle";

// Shows or hides the team toolbar, filters, and advanced sets on phones and tablets
const MoreToggle = observer(function MoreToggle() {
  const { isMoreOpen } = store;
  const { label, ariaLabel, Icon, iconColor, pressed } = useTeamToolsToggle();

  return (
    <Button
      onClick={() => (store.isMoreOpen = !isMoreOpen)}
      aria-expanded={isMoreOpen}
      aria-pressed={pressed}
      aria-label={ariaLabel}
      startIcon={<Icon sx={{ color: iconColor }} />}
    >
      {label}
    </Button>
  );
});

export default MoreToggle;
