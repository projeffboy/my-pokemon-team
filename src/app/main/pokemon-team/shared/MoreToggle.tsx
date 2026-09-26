import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { observer } from "mobx-react-lite";
import store from "@/store";

// Shows or hides the team tools, filters, and advanced sets on phones and tablets
const MoreToggle = observer(function MoreToggle() {
  const { isMoreOpen } = store;
  const Icon = isMoreOpen ? ExpandLessIcon : ExpandMoreIcon;

  return (
    <Button
      onClick={() => (store.isMoreOpen = !isMoreOpen)}
      aria-expanded={isMoreOpen}
      aria-label={isMoreOpen ? "Fewer team tools" : "More team tools"}
      sx={{ minWidth: 0, px: 1.5, flexDirection: "column" }}
    >
      <Icon fontSize="small" />
      <Typography variant="caption" component="span">
        {isMoreOpen ? "Less" : "More"}
      </Typography>
    </Button>
  );
});

export default MoreToggle;
