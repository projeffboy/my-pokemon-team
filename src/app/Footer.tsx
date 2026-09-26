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

const Manual = lazy(() => import("./footer/Manual"));
const Credits = lazy(() => import("./footer/Credits"));
const PrivacyPolicy = lazy(() => import("./footer/PrivacyPolicy"));
const UpdateLog = lazy(() => import("./footer/UpdateLog"));

type ColorMode = "system" | "light" | "dark";

export default function Footer() {
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
        button="Manual"
        title="Manual Help Guide"
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
      <FooterDialog button="Credits" title="Credits" content={Credits} />
      <FooterDialog
        button={`Updates (${__LATEST_COMMIT_DATE__})`}
        title="Update Log"
        content={UpdateLog}
      />
      <FooterDialog
        button="Privacy Policy"
        title="Privacy Policy"
        content={PrivacyPolicy}
      />
      <ToggleButtonGroup
        exclusive
        size="small"
        value={selectedMode}
        onChange={handleModeChange}
        aria-label="Color scheme"
      >
        <Tooltip title="Use system theme">
          <ToggleButton value="system" aria-label="Use system theme">
            <ComputerIcon />
          </ToggleButton>
        </Tooltip>
        <Tooltip title="Use light theme">
          <ToggleButton value="light" aria-label="Use light theme">
            <LightModeIcon />
          </ToggleButton>
        </Tooltip>
        <Tooltip title="Use dark theme">
          <ToggleButton value="dark" aria-label="Use dark theme">
            <DarkModeIcon />
          </ToggleButton>
        </Tooltip>
      </ToggleButtonGroup>
    </Stack>
  );
}
