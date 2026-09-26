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
import { useTranslation } from "@/app/shared/TranslationContext";
import type { TeamStatType } from "@/types";

type View = "defence" | "coverage" | "checklist" | "matrix";

const statSection = (stat: TeamStatType, hideTitle = false) => {
  const titleId = `${stat}-heading`;
  return (
    <Box
      key={stat}
      role="region"
      aria-labelledby={titleId}
      sx={{ p: 1, pb: 0 }}
    >
      <TeamAspectStats stat={stat} titleId={titleId} hideTitle={hideTitle} />
    </Box>
  );
};

// The analysis panel. On phones it shows one analysis at a time, with Defence and Coverage
// as tabs; from tablets up it stacks the stats and checklist, or shows the matrix, and
// scrolls inside the team column's height.
export default function TeamStats() {
  const { t } = useTranslation();
  const isXs = useBreakpoint() === "xs";
  const [view, setView] = useState<View>("defence");
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);
  const closeMenu = () => setMenuAnchor(null);

  const views: { view: View; label: string; Icon: typeof ShieldIcon }[] = [
    { view: "defence", label: t.stats.teamDefence, Icon: ShieldIcon },
    { view: "coverage", label: t.stats.teamTypeCoverage, Icon: GpsFixedIcon },
    { view: "checklist", label: t.stats.teamChecklist, Icon: ChecklistIcon },
    { view: "matrix", label: t.stats.matrixAnalysis, Icon: GridOnIcon },
  ];
  const isTabbed = view === "defence" || view === "coverage";
  const title =
    view === "matrix" ? t.stats.matrixAnalysis
    : isXs && view === "checklist" ? t.stats.teamChecklist
    : t.stats.teamStats;
  const menuItems =
    isXs ? views : (
      [
        {
          view: "defence" as const,
          label: t.stats.teamStatsAndChecklist,
          Icon: ChecklistIcon,
        },
        views[3]!,
      ]
    );

  const body =
    view === "matrix" ?
      <Box role="region" aria-label={t.stats.matrixAnalysis}>
        <MatrixAnalysis />
      </Box>
    : isXs ?
      view === "checklist" ?
        <Box role="region" aria-label={t.stats.teamChecklist}>
          <TeamChecklist />
        </Box>
      : <>
          <Tabs
            value={view}
            onChange={(_event: SyntheticEvent, value: View) => setView(value)}
            variant="fullWidth"
            textColor="secondary"
            aria-label={t.stats.teamStat}
          >
            <Tab value="defence" label={t.stats.defence} />
            <Tab value="coverage" label={t.stats.coverage} />
          </Tabs>
          {statSection(
            view === "defence" ? "typeDefence" : "typeCoverage",
            true,
          )}
        </>
    : <>
        {statSection("typeDefence")}
        {statSection("typeCoverage")}
        <Box
          role="region"
          aria-label={t.stats.teamChecklist}
          sx={{ px: 1, pt: 1 }}
        >
          <Typography variant="h6" component="h3" sx={{ textAlign: "center" }}>
            {t.stats.teamChecklist}
          </Typography>
          <TeamChecklist />
        </Box>
      </>;

  return (
    <Paper
      component="section"
      aria-label={t.stats.teamAnalysis}
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
            aria-label={t.stats.backToTeamStats}
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
          aria-label={t.stats.moreAnalyses}
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
