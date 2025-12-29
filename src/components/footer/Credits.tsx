import { useState } from "react";
// Material UI Core Imports
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import BusinessIcon from "@mui/icons-material/Business";
import GestureIcon from "@mui/icons-material/Gesture";
import TableChart from "@mui/icons-material/TableChart";
import ListIcon from "@mui/icons-material/List";
import ColorLens from "@mui/icons-material/ColorLens";
import People from "@mui/icons-material/People";
import Code from "@mui/icons-material/Code";
import Layers from "@mui/icons-material/Layers";
import TrendingUp from "@mui/icons-material/TrendingUp";
import pokemonShowdownLogo from "assets/pokemon-showdown-logo.png";

function listItems() {
  type CreditItem = [React.ReactNode, string, string?, string?];
  const items: CreditItem[] = [
    [<BusinessIcon />, "Nintendo, The Pokemon Company, Game Freak"],
    [
      <GestureIcon />,
      "Dragapult Pokemon Shuffle Fanart (By Shagapult)",
      "https://twitter.com/Shagapult",
    ],
    [
      <TableChart />,
      "Bulbapedia's Type Chart",
      "https://bulbapedia.bulbagarden.net/wiki/Type",
    ],
    [
      <ListIcon />,
      "Non-table Type Chart",
      "https://pinterest.ca/pin/307159637067301004/",
    ],
    [
      <ColorLens />,
      "Assigning each type a color",
      "https://guiguilegui.wordpress.com/2016/05/23/pokemon-type-classifier-using-their-colors",
    ],
    [
      <People />,
      "r/stunfisk",
      "https://reddit.com/r/stunfisk",
      "It's a good community",
    ],
    [<Code />, "Javascript React framework", "https://reactjs.org/"],
    [<Code />, "MobX state management", "https://mobx.js.org/"],
    [<Layers />, "Material UI", "https://material-ui.com/"],
    [
      <TrendingUp />,
      "Google Analytics",
      "https://support.google.com/analytics/answer/1008015?hl=en",
      "For checking the viewcount and finding out where everyone is from (I didn't enable gender and age)",
    ],
  ];

  return items.map((pair, i) => (
    <ListItem key={i}>
      <ListItemIcon>{pair[0]}</ListItemIcon>
      <ListItemText
        primary={
          <Link style={{ color: "#2196f3" }} variant="inherit" href={pair[2]}>
            {pair[1]}
          </Link>
        }
        secondary={pair[3] ? pair[3] : ""}
      />
    </ListItem>
  ));
}

const Credits = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const toggleDialog = () => setIsDialogOpen(!isDialogOpen);

  return (
    <>
      <Button
        onClick={toggleDialog}
        style={{ fontWeight: "initial", textTransform: "initial" }}
      >
        Credits
      </Button>
      <Dialog
        open={isDialogOpen}
        onClose={toggleDialog}
        aria-labelledby="form-dialog-title"
        style={{ height: "calc(100% - 60px)" }}
      >
        <DialogTitle id="form-dialog-title">Credits</DialogTitle>
        <DialogContent>
          <Link href="https://pokemonshowdown.com">
            <img
              src={pokemonShowdownLogo}
              alt="Pokemon Showdown Logo"
              style={{ width: "50%", minWidth: 200 }}
            />
          </Link>
          <Typography variant="body1" paragraph>
            The folks at Pokemon Showdown are very generous to let me use all of
            their GIFs, sprites, and pokemon data. Absolutely indispensable!
          </Typography>
          <Typography variant="h6" gutterBottom>
            Other
          </Typography>
          <List>{listItems()}</List>
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

export default Credits;
