import { useState } from "react";
import { useTheme } from "@mui/material/styles";
// Material UI Core Imports
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
const Manual = () => {
  const theme = useTheme();
  const darkMode = theme.palette.mode === "dark";
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  type EffectivenessRow = [string, string, (darkMode: boolean) => string];
  const rowsOfTypeEffectivness: EffectivenessRow[] = [
    ["No effect", "+1.5", darkMode => (darkMode ? "limegreen" : "green")],
    ["0.25x effective", "+1.5", darkMode => (darkMode ? "limegreen" : "green")],
    ["0.5x effective", "+1", darkMode => (darkMode ? "limegreen" : "green")],
    ["1x effective", "0", darkMode => (darkMode ? "#e0e0e0" : "#212121")],
    ["2x super effective", "-1", () => "red"],
    ["4x super effective", "-1.5", () => "red"],
  ];

  const rowsOfTerms = [
    [
      "Defogger",
      "A pokemon that knows Defog (which blows away entry hazards).",
    ],
    [
      "Reliable Recovery",
      "Moves that are guaranteed to recover 50% or more of your HP every time you use it (under normal weather conditions). E.g. Recover, Softboiled, Milk Drink, Slack Off, Synthesis.",
    ],
    [
      "Status Moves",
      "Here, they refer to accurate moves that paralyze, burn, or poison, as well as moves that cause sleep. E.g. Toxic, Will-O-Wisp, Thunder Wave, Sing.",
    ],
    [
      "Boosting Move",
      "Moves that increase your stats (preferrably by 2+), like Swords Dance and Calm Mind.",
    ],
    [
      "Choice Item",
      "An item that increases a stat by 50% but locks you into one move. There are three of these items: Choice Band, Choice Specs, and Choice Scarf.",
    ],
  ];

  const toggleDialog = () => setIsDialogOpen(!isDialogOpen);

  return (
    <>
      <Button
        onClick={toggleDialog}
        style={{ fontWeight: "initial", textTransform: "initial" }}
      >
        Manual
      </Button>
      <Dialog
        open={isDialogOpen}
        onClose={toggleDialog}
        aria-labelledby="form-dialog-title"
        style={{ height: "calc(100% - 60px)" }}
      >
        <DialogTitle id="form-dialog-title">Manual Help Guide</DialogTitle>
        <DialogContent>
          <Typography variant="h6">Team Defence</Typography>
          <Typography variant="subtitle2" gutterBottom>
            How is your team's type defence calculated?
          </Typography>
          <Typography paragraph>
            Every pokemon in your team is weak to certain types and resistant to
            other types. If a type is not very effective against one of your
            pokemon, you gain points. But if it's super effective, you lose
            points:
          </Typography>
          <Table style={{ marginBottom: 20 }}>
            <TableHead>
              <TableRow>
                <TableCell>Type Effectiveness Against You</TableCell>
                <TableCell align="right">Points</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rowsOfTypeEffectivness.map(row => (
                <TableRow key={row[0]}>
                  <TableCell component="th" scope="row">
                    {row[0]}
                  </TableCell>
                  <TableCell align="right" style={{ color: row[2](darkMode) }}>
                    {row[1]}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Typography paragraph>
            <strong>Note:</strong> Abilities like Levitate, Thick Fat, Filter,
            and Sap Sipper are taken into account. For example, if your Bronzong
            has Levitate, you get +1.5 for Ground. And if it has Heatproof, you
            get 0 for Fire instead.
          </Typography>

          <Typography variant="h6">Team Type Coverage</Typography>
          <Typography variant="subtitle2" gutterBottom>
            How is your team's type coverage calculated?
          </Typography>
          <Typography paragraph>
            First, what is type coverage? It's about how many types your moves
            are super effective against. If one of your moves is super effective
            against a type, you gain +1. If that move also has the same type as
            the pokemon using it (STAB), then you gain another +1.
          </Typography>
          <Typography paragraph>
            <strong>Note:</strong> Abilities like Aerilate and Pixilate are
            taken into account. So are moves like Freeze Dry and Flying Press.
            For example, Freeze Dry also gives you +1 against Water.
          </Typography>
          <Typography variant="h6">Formats (aka Tiers)</Typography>
          <Typography variant="subtitle2" gutterBottom>
            What is Ubers, OU, VGC, etc.?
          </Typography>
          <Typography paragraph>
            Ubers, OU, and{" "}
            <Link
              style={{ color: "#2196f3" }}
              variant="inherit"
              href="https://play.pokemon.com/en-us/resources/rules/?category=vgc"
            >
              VGC
            </Link>{" "}
            are formats (or tiers) that ban some pokemon and enforce certain
            rules. Battle Stadium Singles/Doubles and VGC are the only ones
            endorsed by The Pokemon Company, while the other ones are maintained
            by{" "}
            <Link
              style={{ color: "#2196f3" }}
              variant="inherit"
              href="https://www.smogon.com/"
            >
              Smogon
            </Link>
            . You can check out{" "}
            <Link
              style={{ color: "#2196f3" }}
              variant="inherit"
              href="https://www.smogon.com/ingame/battle/tiering-faq"
            >
              Smogon's FAQ about tiers
            </Link>{" "}
            or{" "}
            <Link
              style={{ color: "#2196f3" }}
              variant="inherit"
              href="https://en.softonic.com/articles/competitive-pokemon-smogon"
            >
              this guide that gives a brief description about each tier
            </Link>
            .
          </Typography>
          <Typography variant="h6">Team Checklist Terms</Typography>
          <Typography variant="subtitle2" gutterBottom>
            What do things like entry hazard, phazer, and volt-turn even mean?
          </Typography>
          <Typography paragraph>
            Smogon has a{" "}
            <Link
              style={{ color: "#2196f3" }}
              variant="inherit"
              href="https://www.smogon.com/dp/articles/pokemon_dictionary"
            >
              dictionary for pokemon terms
            </Link>
            , but it's a bit outdated. Here are some of the terms it doesn't
            cover:
          </Typography>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Term</TableCell>
                <TableCell style={{ paddingLeft: 5, paddingRight: 5 }}>
                  Definition
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rowsOfTerms.map(row => (
                <TableRow key={row[0]}>
                  <TableCell component="th" scope="row">
                    {row[0]}
                  </TableCell>
                  <TableCell style={{ paddingLeft: 5, paddingRight: 5 }}>
                    {row[1]}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </DialogContent>
        <DialogActions>
          <Button onClick={toggleDialog} color="primary">
            Go Back
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Manual;
