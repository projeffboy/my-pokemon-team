import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Tooltip from "@mui/material/Tooltip";
import ComputerIcon from "@mui/icons-material/Computer";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import { useColorScheme } from "@mui/material/styles";
import Manual from "./footer/manual";
import Credits from "./footer/credits";
import PrivacyPolicy from "./footer/privacy-policy";
import UpdateLog from "./footer/update-log";

type ColorMode = "system" | "light" | "dark";

export default function Footer() {
  const { mode, setMode } = useColorScheme();
  const selectedMode = mode ?? "system";

  const handleModeChange = (
    _event: React.MouseEvent<HTMLElement>,
    newMode: ColorMode | null
  ) => {
    if (newMode) setMode(newMode);
  };

  return (
    <Grid
      component="footer"
      container
      size={12}
      justifyContent="center"
      alignItems="center"
      spacing={2}
      style={{
        paddingBottom: process.env.NODE_ENV === "production" ? 230 : 0,
      }}
    >
      <Grid>
        <Manual />
      </Grid>
      <Grid>
        <Button
          href="https://jefferytang.com"
          style={{ fontWeight: "initial", textTransform: "initial" }}
        >
          Jeffery Tang
        </Button>
      </Grid>
      <Grid>
        <Credits />
      </Grid>
      <Grid>
        <UpdateLog />
      </Grid>
      <Grid>
        <PrivacyPolicy />
      </Grid>
      <Grid>
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
      </Grid>
    </Grid>
  );
}
