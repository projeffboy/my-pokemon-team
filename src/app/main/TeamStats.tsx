import { useState, type SyntheticEvent } from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import ShieldIcon from "@mui/icons-material/Shield";
import GpsFixedIcon from "@mui/icons-material/GpsFixed";
import ChecklistIcon from "@mui/icons-material/Checklist";
import GridOnIcon from "@mui/icons-material/GridOn";
import BarChartIcon from "@mui/icons-material/BarChart";
import TeamAspectStats from "./team-stats/shared/TeamAspectStats";
import TeamChecklist from "./team-stats/TeamChecklist";
import MatrixAnalysis, { type MatrixKind } from "./team-stats/MatrixAnalysis";
import { useIsSmDown } from "@/app/shared/WidthContext";
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

// The analysis panel. On phones it shows one analysis at a time, with a tab for
// each; from tablets up a switch in its header shows the two stats, the matrix,
// or the checklist as cards, and it scrolls inside the team column's height.
export default function TeamStats() {
  const { t } = useTranslation();
  const isSmDown = useIsSmDown();
  const [view, setView] = useState<View>("defence");
  // Kept here so that the matrix returns to the view it was left on
  const [matrixKind, setMatrixKind] = useState<MatrixKind>("defence");

  const tabs: { view: View; label: string; Icon: typeof ShieldIcon }[] = [
    { view: "defence", label: t.stats.defence, Icon: ShieldIcon },
    { view: "coverage", label: t.stats.coverage, Icon: GpsFixedIcon },
    { view: "matrix", label: t.stats.matrix, Icon: GridOnIcon },
    { view: "checklist", label: t.stats.checklist, Icon: ChecklistIcon },
  ];
  const switches: { view: View; label: string; Icon: typeof ShieldIcon }[] = [
    { view: "defence", label: t.stats.teamStats, Icon: BarChartIcon },
    { view: "matrix", label: t.stats.matrixAnalysis, Icon: GridOnIcon },
    { view: "checklist", label: t.stats.teamChecklist, Icon: ChecklistIcon },
  ];
  const title =
    isSmDown || view === "defence" || view === "coverage" ? t.stats.teamStats
    : view === "matrix" ? t.stats.matrixAnalysis
    : t.stats.teamChecklist;

  const matrix = (
    <Box role="region" aria-label={t.stats.matrixAnalysis}>
      <MatrixAnalysis kind={matrixKind} onKindChange={setMatrixKind} />
    </Box>
  );
  const checklist = (
    <Box role="region" aria-label={t.stats.teamChecklist}>
      <TeamChecklist />
    </Box>
  );

  const header = (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: 1.5,
        px: 1,
        py: 0.5,
        flexShrink: 0,
      }}
    >
      <Typography variant="h6" component="h2">
        {title}
      </Typography>
      {!isSmDown && (
        <ToggleButtonGroup
          exclusive
          size="small"
          value={view === "coverage" ? "defence" : view}
          onChange={(_event, value: View | null) => {
            if (value) setView(value);
          }}
          aria-label={t.stats.teamAnalysis}
        >
          {switches.map(({ view: switchView, label, Icon }) => (
            <Tooltip key={switchView} title={label}>
              <ToggleButton value={switchView} aria-label={label}>
                <Icon fontSize="small" />
              </ToggleButton>
            </Tooltip>
          ))}
        </ToggleButtonGroup>
      )}
    </Box>
  );

  if (isSmDown) {
    return (
      <Paper component="section" aria-label={t.stats.teamAnalysis}>
        {header}
        <Tabs
          value={view}
          onChange={(_event: SyntheticEvent, value: View) => setView(value)}
          variant="fullWidth"
          textColor="secondary"
          aria-label={t.stats.teamAnalysis}
        >
          {tabs.map(({ view: tabView, label, Icon }) => (
            <Tab
              key={tabView}
              value={tabView}
              label={label}
              icon={<Icon fontSize="small" />}
              iconPosition="top"
              // Four fit side by side from 320px
              sx={{
                minWidth: 0,
                minHeight: 56,
                px: 0.5,
                fontSize: 12,
                textTransform: "none",
              }}
            />
          ))}
        </Tabs>
        <Box sx={{ pb: 1 }}>
          {view === "matrix" ?
            matrix
          : view === "checklist" ?
            checklist
          : statSection(
              view === "defence" ? "typeDefence" : "typeCoverage",
              true,
            )
          }
        </Box>
      </Paper>
    );
  }

  return (
    <Box
      component="section"
      aria-label={t.stats.teamAnalysis}
      sx={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {header}
      {/* Each analysis is a card; the 4px margin keeps their shadows from being clipped */}
      <Box
        sx={{
          flexGrow: 1,
          minHeight: 0,
          overflow: "auto",
          display: "flex",
          flexDirection: "column",
          gap: 3,
          p: "4px",
          m: "-4px",
        }}
      >
        {view === "matrix" ?
          <Paper>{matrix}</Paper>
        : view === "checklist" ?
          <Paper sx={{ p: 1 }}>{checklist}</Paper>
        : <>
            <Paper sx={{ pb: 1 }}>{statSection("typeDefence")}</Paper>
            <Paper sx={{ pb: 1 }}>{statSection("typeCoverage")}</Paper>
          </>
        }
      </Box>
    </Box>
  );
}
