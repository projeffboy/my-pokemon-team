import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ToggleOnOutlinedIcon from "@mui/icons-material/ToggleOnOutlined";
import ToggleOffOutlinedIcon from "@mui/icons-material/ToggleOffOutlined";
import store from "@/store";
import { useIsMdDown } from "@/app/shared/WidthContext";
import { useTranslation } from "@/app/shared/TranslationContext";

export default function useTeamToolsToggle() {
  const { t } = useTranslation();
  const isMdDown = useIsMdDown();
  const { isMoreOpen } = store;
  const label =
    isMdDown ?
      isMoreOpen ? t.team.less
      : t.team.more
    : t.team.advancedMode;
  return {
    label,
    ariaLabel:
      isMdDown ?
        isMoreOpen ? t.team.fewerTools
        : t.team.moreTools
      : label,
    Icon:
      isMdDown ?
        isMoreOpen ? ExpandLessIcon
        : ExpandMoreIcon
      : isMoreOpen ? ToggleOnOutlinedIcon
      : ToggleOffOutlinedIcon,
    iconColor: !isMdDown && isMoreOpen ? "success.main" : "inherit",
    pressed: isMdDown ? undefined : isMoreOpen,
  };
}
