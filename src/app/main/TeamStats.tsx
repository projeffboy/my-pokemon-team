import { useState, type MouseEvent, type SyntheticEvent } from "react";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Typography from "@mui/material/Typography";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ShieldIcon from "@mui/icons-material/Shield";
import GpsFixedIcon from "@mui/icons-material/GpsFixed";
import ChecklistIcon from "@mui/icons-material/Checklist";
import GridOnIcon from "@mui/icons-material/GridOn";
import TeamAspectStats from "./team-stats/shared/TeamAspectStats";
import TeamChecklist from "./team-stats/TeamChecklist";
import MatrixAnalysis from "./team-stats/MatrixAnalysis";
import { useBreakpoint } from "@/app/shared/WidthContext";

type View = "defence" | "coverage" | "checklist" | "matrix";

const VIEWS: { view: View; label: string; Icon: typeof ShieldIcon }[] = [
  { view: "defence", label: "Team Defence", Icon: ShieldIcon },
  { view: "coverage", label: "Team Type Coverage", Icon: GpsFixedIcon },
  { view: "checklist", label: "Team Checklist", Icon: ChecklistIcon },
  { view: "matrix", label: "Matrix Analysis", Icon: GridOnIcon },
];

const statSection = (
  title: "Team Defence" | "Team Type Coverage",
  hideTitle = false,
) => {
  const titleId = `${title.replaceAll(" ", "-").toLowerCase()}-heading`;
  return (
    <Box
      key={title}
      role="region"
      aria-labelledby={titleId}
      sx={{ p: 1, pb: 0 }}
    >
      <TeamAspectStats title={title} titleId={titleId} hideTitle={hideTitle} />
    </Box>
  );
};

// The analysis panel. On phones it shows one analysis at a time, with Defence and Coverage
// as tabs; from tablets up it stacks the stats and checklist, or shows the matrix, and
// scrolls inside the team column's height.
export default function TeamStats() {
  const isXs = useBreakpoint() === "xs";
  const [view, setView] = useState<View>("defence");
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);
  const closeMenu = () => setMenuAnchor(null);

  const isTabbed = view === "defence" || view === "coverage";
  const title =
    view === "matrix" ? "Matrix Analysis"
    : isXs && view === "checklist" ? "Team Checklist"
    : "Team Stats";
  const menuItems =
    isXs ? VIEWS : (
      [
        {
          view: "defence" as const,
          label: "Team Stats and Checklist",
          Icon: ChecklistIcon,
        },
        VIEWS[3]!,
      ]
    );

  const body =
    view === "matrix" ?
      <Box role="region" aria-label="Matrix Analysis">
        <MatrixAnalysis />
      </Box>
    : isXs ?
      view === "checklist" ?
        <Box role="region" aria-label="Team Checklist">
          <TeamChecklist />
        </Box>
      : <>
          <Tabs
            value={view}
            onChange={(_event: SyntheticEvent, value: View) => setView(value)}
            variant="fullWidth"
            textColor="secondary"
            aria-label="Team stat"
          >
            <Tab value="defence" label="Defence" />
            <Tab value="coverage" label="Coverage" />
          </Tabs>
          {statSection(
            view === "defence" ? "Team Defence" : "Team Type Coverage",
            true,
          )}
        </>
    : <>
        {statSection("Team Defence")}
        {statSection("Team Type Coverage")}
        <Box role="region" aria-label="Team Checklist" sx={{ px: 1, pt: 1 }}>
          <Typography variant="h6" component="h3" sx={{ textAlign: "center" }}>
            Team Checklist
          </Typography>
          <TeamChecklist />
        </Box>
      </>;

  return (
    <Paper
      component="section"
      aria-label="Team analysis"
      sx={{
        position: { sm: "absolute" },
        inset: { sm: 0 },
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 0.5,
          px: 1,
          py: 0.5,
          flexShrink: 0,
        }}
      >
        {isXs && !isTabbed && (
          <IconButton
            size="small"
            aria-label="Back to Team Stats"
            onClick={() => setView("defence")}
          >
            <ArrowBackIcon />
          </IconButton>
        )}
        <Typography variant="h6" component="h2" sx={{ flexGrow: 1 }}>
          {title}
        </Typography>
        <IconButton
          size="small"
          aria-label="More analyses"
          aria-haspopup="menu"
          aria-expanded={!!menuAnchor}
          onClick={(event: MouseEvent<HTMLElement>) =>
            setMenuAnchor(event.currentTarget)
          }
        >
          <MoreVertIcon />
        </IconButton>
        <Menu anchorEl={menuAnchor} open={!!menuAnchor} onClose={closeMenu}>
          {menuItems.map(({ view: itemView, label, Icon }) => (
            <MenuItem
              key={label}
              selected={
                isXs ?
                  itemView === view
                : (itemView === "matrix") === (view === "matrix")
              }
              onClick={() => {
                setView(itemView);
                closeMenu();
              }}
            >
              <ListItemIcon>
                <Icon fontSize="small" />
              </ListItemIcon>
              <ListItemText>{label}</ListItemText>
            </MenuItem>
          ))}
        </Menu>
      </Box>
      <Box sx={{ flexGrow: 1, minHeight: 0, overflow: { sm: "auto" }, pb: 1 }}>
        {body}
      </Box>
    </Paper>
  );
}
