import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { observer } from "mobx-react-lite";
import store from "@/store";
import { useTranslation } from "@/app/shared/TranslationContext";

// Shows or hides the team tools, filters, and advanced sets on phones and tablets
const MoreToggle = observer(function MoreToggle() {
  const { t } = useTranslation();
  const { isMoreOpen } = store;
  const Icon = isMoreOpen ? ExpandLessIcon : ExpandMoreIcon;

  return (
    <Button
      onClick={() => (store.isMoreOpen = !isMoreOpen)}
      aria-expanded={isMoreOpen}
      aria-label={isMoreOpen ? t.team.fewerTools : t.team.moreTools}
      sx={{ minWidth: 0, px: 1.5, flexDirection: "column" }}
    >
      <Icon fontSize="small" />
      <Typography variant="caption" component="span">
        {isMoreOpen ? t.team.less : t.team.more}
      </Typography>
    </Button>
  );
});

export default MoreToggle;
