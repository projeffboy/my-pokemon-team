import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import SettingsBrightnessIcon from "@mui/icons-material/SettingsBrightness";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import { useColorScheme } from "@mui/material/styles";
import Manual from "./footer/Manual";
import Credits from "./footer/Credits";
import UpdateLog from "./footer/UpdateLog";
import PrivacyPolicy from "./footer/PrivacyPolicy";

const Footer = () => {
  const { mode, setMode } = useColorScheme();

  const handleModeChange = (
    _event: React.MouseEvent<HTMLElement>,
    newMode: "system" | "light" | "dark" | null
  ) => {
    if (newMode !== null) {
      setMode(newMode);
    }
  };

  return (
    <Grid
      container
      size={{ xs: 12 }}
      justifyContent="center"
      alignItems="center"
      spacing={2}
      style={{ paddingBottom: 230 }}
    >
      <Grid size="auto">
        <Manual />
      </Grid>
      <Grid size="auto">
        <Button
          href="https://jefferytang.com"
          role="button"
          style={{ fontWeight: "initial", textTransform: "initial" }}
        >
          Jeffery Tang
        </Button>
      </Grid>
      <Grid size="auto">
        <Credits />
      </Grid>
      <Grid size="auto">
        <UpdateLog />
      </Grid>
      <Grid size="auto">
        <PrivacyPolicy />
      </Grid>
      <Grid size="auto">
        <ToggleButtonGroup
          value={mode}
          exclusive
          onChange={handleModeChange}
          aria-label="dark mode toggle"
          size="small"
        >
          <ToggleButton value="system" aria-label="system">
            <SettingsBrightnessIcon />
          </ToggleButton>
          <ToggleButton value="light" aria-label="light">
            <Brightness7Icon />
          </ToggleButton>
          <ToggleButton value="dark" aria-label="dark">
            <Brightness4Icon />
          </ToggleButton>
        </ToggleButtonGroup>
      </Grid>
    </Grid>
  );
};

export default Footer;
