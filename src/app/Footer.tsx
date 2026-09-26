import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Tooltip from "@mui/material/Tooltip";
import ComputerIcon from "@mui/icons-material/Computer";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import { useColorScheme } from "@mui/material/styles";
import FooterDialog from "./footer/FooterDialog";
import TypeChartDialog from "./footer/TypeChartDialog";
import { lazy, type MouseEvent } from "react";
import { useTranslation } from "./shared/TranslationContext";

const Manual = lazy(() => import("./footer/Manual"));
const Credits = lazy(() => import("./footer/Credits"));
const PrivacyPolicy = lazy(() => import("./footer/PrivacyPolicy"));
const UpdateLog = lazy(() => import("./footer/UpdateLog"));

type ColorMode = "system" | "light" | "dark";

export default function Footer() {
  const { t } = useTranslation();
  const { mode, setMode } = useColorScheme();
  const selectedMode = mode ?? "system";

  const handleModeChange = (
    _event: MouseEvent<HTMLElement>,
    newMode: ColorMode | null,
  ) => {
    if (newMode) setMode(newMode);
  };

  return (
    <Stack
      component="footer"
      direction="row"
      useFlexGap
      spacing={2}
      sx={{
        width: "100%",
        flexWrap: "wrap",
        justifyContent: "center",
        alignItems: "center",
        pb: process.env.NODE_ENV === "production" ? "230px" : 0,
      }}
    >
      <TypeChartDialog />
      <FooterDialog
        button={t.footer.manual}
        title={t.footer.manualTitle}
        content={Manual}
      />
      <Button
        variant="footer"
        href="https://jefferytang.com"
        target="_blank"
        rel="noopener"
      >
        Jeffery Tang
      </Button>
      <FooterDialog
        button={t.footer.credits}
        title={t.footer.credits}
        content={Credits}
      />
      <FooterDialog
        button={t.footer.updates(__LATEST_COMMIT_DATE__)}
        title={t.footer.updateLog}
        content={UpdateLog}
      />
      <FooterDialog
        button={t.footer.privacyPolicy}
        title={t.footer.privacyPolicy}
        content={PrivacyPolicy}
      />
      <ToggleButtonGroup
        exclusive
        size="small"
        value={selectedMode}
        onChange={handleModeChange}
        aria-label={t.footer.colorScheme}
      >
        <Tooltip title={t.footer.systemTheme}>
          <ToggleButton value="system" aria-label={t.footer.systemTheme}>
            <ComputerIcon />
          </ToggleButton>
        </Tooltip>
        <Tooltip title={t.footer.lightTheme}>
          <ToggleButton value="light" aria-label={t.footer.lightTheme}>
            <LightModeIcon />
          </ToggleButton>
        </Tooltip>
        <Tooltip title={t.footer.darkTheme}>
          <ToggleButton value="dark" aria-label={t.footer.darkTheme}>
            <DarkModeIcon />
          </ToggleButton>
        </Tooltip>
      </ToggleButtonGroup>
    </Stack>
  );
}
