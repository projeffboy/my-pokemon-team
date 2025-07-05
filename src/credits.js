import React from "react";
// Material UI Core Imports
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Typography from "@material-ui/core/Typography";
import Link from "@material-ui/core/Link";
import BusinessIcon from "@material-ui/icons/Business";
import GestureIcon from "@material-ui/icons/Gesture";
import TableChart from "@material-ui/icons/TableChart";
import ListIcon from "@material-ui/icons/List";
import ColorLens from "@material-ui/icons/ColorLens";
import People from "@material-ui/icons/People";
import Code from "@material-ui/icons/Code";
import Layers from "@material-ui/icons/Layers";
import TrendingUp from "@material-ui/icons/TrendingUp";
import pokemonShowdownLogo from "./pokemon-showdown-logo.png";

function listItems(element) {
  return [
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
  ].map((pair, i) => (
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

class Credits extends React.Component {
  constructor(props) {
    super(props);

    this.state = { isDialogOpen: false };
  }

  toggleDialog = () =>
    this.setState({ isDialogOpen: !this.state.isDialogOpen });

  render() {
    return (
      <>
        <Button
          onClick={this.toggleDialog}
          style={{ fontWeight: "initial", textTransform: "initial" }}
        >
          Credits
        </Button>
        <Dialog
          open={this.state.isDialogOpen}
          onClose={this.toggleDialog}
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
              The folks at Pokemon Showdown are very generous to let me use all
              of their GIFs, sprites, and pokemon data. Absolutely
              indispensable!
            </Typography>
            <Typography variant="h6" gutterBottom>
              Other
            </Typography>
            <List>{listItems()}</List>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.toggleDialog} color="primary">
              Go Back
            </Button>
          </DialogActions>
        </Dialog>
      </>
    );
  }
}

export default Credits;
