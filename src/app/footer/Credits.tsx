import type { ReactElement } from "react";
import Box from "@mui/material/Box";
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
import pokemonShowdownLogo from "@/images/pokemon-showdown-logo.png";

interface Credit {
  icon: ReactElement;
  label: string;
  href?: string;
  secondary?: string;
}

const credits: Credit[] = [
  {
    icon: <BusinessIcon />,
    label: "Nintendo, The Pokemon Company, Game Freak",
  },
  {
    icon: <GestureIcon />,
    label: "Dragapult Pokemon Shuffle Fanart (By Shagapult)",
    href: "https://twitter.com/Shagapult",
  },
  {
    icon: <TableChart />,
    label: "Bulbapedia's Type Chart",
    href: "https://bulbapedia.bulbagarden.net/wiki/Type",
  },
  {
    icon: <ListIcon />,
    label: "Non-table Type Chart",
    href: "https://pinterest.ca/pin/307159637067301004/",
  },
  {
    icon: <ColorLens />,
    label: "Assigning each type a color",
    href: "https://guiguilegui.wordpress.com/2016/05/23/pokemon-type-classifier-using-their-colors",
  },
  {
    icon: <People />,
    label: "r/stunfisk",
    href: "https://reddit.com/r/stunfisk",
    secondary: "It's a good community",
  },
  {
    icon: <Code />,
    label: "Javascript React framework",
    href: "https://reactjs.org/",
  },
  {
    icon: <Code />,
    label: "MobX state management",
    href: "https://mobx.js.org/",
  },
  { icon: <Layers />, label: "Material UI", href: "https://material-ui.com/" },
  {
    icon: <TrendingUp />,
    label: "Google Analytics",
    href: "https://support.google.com/analytics/answer/1008015?hl=en",
    secondary:
      "For checking the viewcount and finding out where everyone is from (I didn't enable gender and age)",
  },
];

export default function Credits() {
  return (
    <>
      <Link href="https://pokemonshowdown.com">
        <Box
          component="img"
          src={pokemonShowdownLogo}
          alt="Pokemon Showdown Logo"
          sx={{ width: "50%", minWidth: 200 }}
        />
      </Link>
      <Typography sx={{ mb: 2 }}>
        The folks at Pokemon Showdown are very generous to let me use all of
        their GIFs, sprites, and pokemon data. Absolutely indispensable!
      </Typography>
      <Typography variant="h6" gutterBottom>
        Other
      </Typography>
      <List>
        {credits.map(({ icon, label, href, secondary }) => (
          <ListItem key={label}>
            <ListItemIcon>{icon}</ListItemIcon>
            <ListItemText
              primary={href ? <Link href={href}>{label}</Link> : label}
              secondary={secondary}
            />
          </ListItem>
        ))}
      </List>
    </>
  );
}
