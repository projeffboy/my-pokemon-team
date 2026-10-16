import type { ReactElement } from "react";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardHeader from "@mui/material/CardHeader";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import BusinessIcon from "@mui/icons-material/Business";
import Backpack from "@mui/icons-material/Backpack";
import TableChart from "@mui/icons-material/TableChart";
import ListIcon from "@mui/icons-material/List";
import ImageIcon from "@mui/icons-material/Image";
import ColorLens from "@mui/icons-material/ColorLens";
import People from "@mui/icons-material/People";
import Code from "@mui/icons-material/Code";
import Layers from "@mui/icons-material/Layers";
import CloudIcon from "@mui/icons-material/Cloud";
import GitHubIcon from "@mui/icons-material/GitHub";
import LanguageIcon from "@mui/icons-material/Language";
import indeedeeFace from "@/images/pokemon-shuffle-faces/indeedee-masters-face.png";
import pokemonShowdownLogo from "@/images/pokemon-showdown-logo.png";
import { useTranslation } from "@/app/shared/TranslationContext";
import fill from "@/app/shared/fill";

interface Credit {
  icon: ReactElement;
  label: string;
  href?: string;
  secondary?: string;
}

export default function Credits() {
  const { t } = useTranslation();
  const credits: Credit[] = [
    {
      icon: <BusinessIcon />,
      label: t.credits.companies,
      secondary: t.credits.companiesFor,
    },
    {
      icon: <Backpack />,
      label: "Serebii",
      href: "https://www.serebii.net/legendsz-a/items.shtml",
      secondary: t.credits.serebiiFor,
    },
    {
      icon: <TableChart />,
      label: t.credits.typeChartTable,
      href: "https://bulbapedia.bulbagarden.net/wiki/Type",
      secondary: t.credits.fromBulbapedia,
    },
    {
      icon: <ListIcon />,
      label: t.credits.typeChartList,
      href: "https://pinterest.ca/pin/307159637067301004/",
    },
    {
      icon: <ImageIcon />,
      label: t.credits.typeChartInfographic,
      href: "https://www.reddit.com/r/pokemon/comments/1oq3rg/was_getting_frustrated_finding_an_easytoread_type/",
      secondary: t.credits.fromRPokemon,
    },
    {
      icon: <ColorLens />,
      label: t.credits.typeColours,
      href: "https://guiguilegui.wordpress.com/2016/05/23/pokemon-type-classifier-using-their-colors",
      secondary: t.credits.typeColoursFor,
    },
    {
      icon: <People />,
      label: "r/stunfisk",
      href: "https://reddit.com/r/stunfisk",
      secondary: t.credits.stunfiskFor,
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

  return (
    <>
      {/* The author's card, apart from the thanks under it */}
      {/* Transparent, as a paper card would be darker than the dialog in the dark scheme */}
      <Card variant="outlined" sx={{ mb: 3, bgcolor: "transparent" }}>
        <CardHeader
          avatar={
            <Avatar
              src={indeedeeFace}
              alt=""
              sx={{ width: 56, height: 56, bgcolor: "action.hover" }}
            />
          }
          title={fill(t.credits.madeBy, {
            name: (
              <Box component="span" sx={{ fontWeight: "medium" }}>
                Jeffery Tang
              </Box>
            ),
          })}
          slotProps={{ title: { variant: "h6", component: "p" } }}
          sx={{ pb: 0 }}
        />
        {/* Spaced by the gap, so a wrapped button lines up under the first */}
        <CardActions
          disableSpacing
          sx={{ flexWrap: "wrap", gap: 1, px: 2, pb: 2 }}
        >
          <Button
            size="small"
            variant="outlined"
            startIcon={<LanguageIcon />}
            href="https://jefferytang.com"
            target="_blank"
            rel="noopener"
          >
            {t.credits.website}
          </Button>
          <Button
            size="small"
            variant="outlined"
            startIcon={<GitHubIcon />}
            href="https://github.com/projeffboy/my-pokemon-team"
            target="_blank"
            rel="noopener"
          >
            {t.footer.githubRepo}
          </Button>
        </CardActions>
      </Card>
      <Link href="https://pokemonshowdown.com">
        <Box
          component="img"
          src={pokemonShowdownLogo}
          alt="Pokemon Showdown"
          sx={{ width: "50%", minWidth: 200 }}
        />
      </Link>
      <Typography sx={{ mb: 2 }}>{t.credits.showdown}</Typography>
      <Typography variant="h6" gutterBottom>
        {t.credits.alsoThanks}
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
