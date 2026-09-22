import type { ReactElement } from "react";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import BusinessIcon from "@mui/icons-material/Business";
import TableChart from "@mui/icons-material/TableChart";
import ListIcon from "@mui/icons-material/List";
import ImageIcon from "@mui/icons-material/Image";
import ColorLens from "@mui/icons-material/ColorLens";
import People from "@mui/icons-material/People";
import Code from "@mui/icons-material/Code";
import Layers from "@mui/icons-material/Layers";
import CloudIcon from "@mui/icons-material/Cloud";
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
    secondary:
      "Pokemon itself, the Pokemon Shuffle art beside the title, and the Legends: Z-A mega sprites",
  },
  {
    icon: <TableChart />,
    label: "Type chart table",
    href: "https://bulbapedia.bulbagarden.net/wiki/Type",
    secondary: "From Bulbapedia",
  },
  {
    icon: <ListIcon />,
    label: "Type chart list",
    href: "https://pinterest.ca/pin/307159637067301004/",
  },
  {
    icon: <ImageIcon />,
    label: "Type chart infographic",
    href: "https://www.reddit.com/r/pokemon/comments/1oq3rg/was_getting_frustrated_finding_an_easytoread_type/",
    secondary: "From r/pokemon",
  },
  {
    icon: <ColorLens />,
    label: "Type colours",
    href: "https://guiguilegui.wordpress.com/2016/05/23/pokemon-type-classifier-using-their-colors",
    secondary: "The colour of each type in the team stats",
  },
  {
    icon: <People />,
    label: "r/stunfisk",
    href: "https://reddit.com/r/stunfisk",
    secondary: "It's a good community",
  },
  { icon: <Code />, label: "React", href: "https://react.dev/" },
  { icon: <Code />, label: "MobX", href: "https://mobx.js.org/" },
  {
    icon: <Layers />,
    label: "Material UI",
    href: "https://mui.com/material-ui/",
  },
  { icon: <CloudIcon />, label: "Vercel", href: "https://vercel.com/" },
];

export default function Credits() {
  return (
    <>
      <Link href="https://pokemonshowdown.com">
        <Box
          component="img"
          src={pokemonShowdownLogo}
          alt="Pokemon Showdown"
          sx={{ width: "50%", minWidth: 200 }}
        />
      </Link>
      <Typography sx={{ mb: 2 }}>
        The folks at Pokemon Showdown are very generous to let me use all of
        their sprites, icons, and pokemon data. Absolutely indispensable!
      </Typography>
      <Typography variant="h6" gutterBottom>
        Also thanks to
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
