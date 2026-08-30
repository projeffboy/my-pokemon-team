import React from "react";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import Manual from "./footer/manual";
import Credits from "./footer/credits";
import PrivacyPolicy from "./footer/privacy-policy";
import UpdateLog from "./footer/update-log";

interface FooterProps {
  darkMode: boolean;
  setDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Footer({ darkMode, setDarkMode }: FooterProps) {
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
        <Manual darkMode={darkMode} />
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
        <FormControlLabel
          control={
            <Switch
              checked={darkMode}
              onChange={() => setDarkMode(current => !current)}
              value="darkMode"
            />
          }
          label="Dark Mode"
        />
      </Grid>
    </Grid>
  );
}
