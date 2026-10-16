import { useState, type RefObject, type SyntheticEvent } from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Typography from "@mui/material/Typography";
import ShieldIcon from "@mui/icons-material/Shield";
import GpsFixedIcon from "@mui/icons-material/GpsFixed";
import ChecklistIcon from "@mui/icons-material/Checklist";
import GridOnIcon from "@mui/icons-material/GridOn";
import BarChartIcon from "@mui/icons-material/BarChart";
import TeamAspectStats from "./team-stats/shared/TeamAspectStats";
import TeamChecklist from "./team-stats/TeamChecklist";
import TeamProblems from "./team-stats/TeamProblems";
import MatrixAnalysis, { type MatrixKind } from "./team-stats/MatrixAnalysis";
import useChecklistTab from "./team-stats/use-checklist-tab";
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
// each; from tablets up the stats share a view, with a switch for the matrix.
// The checklist joins the stats while that leaves the panel about as tall as
// the team beside it, and otherwise has a view of its own. Each view grows to
// its full height. The team's problems head every view.
export default function TeamStats({
  teamColumn,
}: {
  teamColumn: RefObject<HTMLElement | null>;
}) {
  const { t } = useTranslation();
  const isSmDown = useIsSmDown();
  const [view, setView] = useState<View>("defence");
  const checklistTab = useChecklistTab(teamColumn, !isSmDown);
  // From tablets up, the views there are a switch for
  const shown =
    view === "matrix" ? "matrix"
    : view === "checklist" && checklistTab.ownTab ? "checklist"
    : "defence";
  // Kept here so that the matrix returns to the view it was left on
  const [matrixKind, setMatrixKind] = useState<MatrixKind>("defence");

  const tabs: { view: View; label: string; Icon: typeof ShieldIcon }[] = [
    { view: "defence", label: t.stats.defence, Icon: ShieldIcon },
    { view: "coverage", label: t.stats.coverage, Icon: GpsFixedIcon },
    { view: "matrix", label: t.stats.matrix, Icon: GridOnIcon },
    { view: "checklist", label: t.stats.checklist, Icon: ChecklistIcon },
  ];
  // Each switch shows a short name, and keeps the view's full title as its label
  const switches: {
    view: View;
    label: string;
    caption: string;
    Icon: typeof ShieldIcon;
  }[] = [
    {
      view: "defence",
      label: t.stats.teamStats,
      caption: t.stats.stats,
      Icon: BarChartIcon,
    },
    {
      view: "matrix",
      label: t.stats.matrixAnalysis,
      caption: t.stats.matrix,
      Icon: GridOnIcon,
    },
    ...(checklistTab.ownTab ?
      [
        {
          view: "checklist" as const,
          label: t.stats.teamChecklist,
          caption: t.stats.checklist,
          Icon: ChecklistIcon,
        },
      ]
    : []),
  ];
  const title =
    isSmDown || shown === "defence" ? t.stats.teamStats
    : shown === "matrix" ? t.stats.matrixAnalysis
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
        // A long title on a tablet's narrow column goes above the switch
        flexWrap: "wrap",
        justifyContent: "center",
        alignItems: "center",
        columnGap: 1.5,
        px: 1,
        py: 0.5,
        flexShrink: 0,
        // No taller than its title, so it sits close to the cards under it
        mb: { sm: 1 },
      }}
    >
      {/* A size above the analyses' own headings, where they show under it */}
      <Typography variant={isSmDown ? "h6" : "h5"} component="h2">
        {title}
      </Typography>
      {!isSmDown && (
        <ToggleButtonGroup
          exclusive
          size="small"
          value={shown}
          onChange={(_event, value: View | null) => {
            if (value) setView(value);
          }}
          aria-label={t.stats.teamAnalysis}
        >
          {switches.map(({ view: switchView, label, caption, Icon }) => (
            <ToggleButton
              key={switchView}
              value={switchView}
              aria-label={label}
              // Captions alone on portrait tablets, whose narrow column fits no more in
              // every language, and the icon beside them from landscape tablets up
              sx={{
                gap: 0.5,
                px: 1,
                textTransform: "none",
                "& svg": { display: { xxs: "none", md: "block" } },
              }}
            >
              <Icon fontSize="small" />
              {caption}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      )}
    </Box>
  );

  if (isSmDown) {
    return (
      <Paper component="section" aria-label={t.stats.teamAnalysis}>
        {header}
        <TeamProblems sx={{ mx: 1, mb: 1 }} />
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
      ref={checklistTab.panel}
      component="section"
      aria-label={t.stats.teamAnalysis}
      sx={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      {header}
      <TeamProblems sx={{ mb: 3 }} />
      <Box
        sx={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          gap: 3,
        }}
      >
        {shown === "matrix" && <Paper>{matrix}</Paper>}
        {shown === "checklist" && <Paper sx={{ p: 1 }}>{checklist}</Paper>}
        {/* On the other views the stats stay laid out, unseen, where they would be: their
            height decides whether the checklist has a view of its own */}
        <Box
          ref={checklistTab.stats}
          sx={[
            { display: "flex", flexDirection: "column", gap: 3 },
            shown !== "defence" && {
              position: "absolute",
              top: 0,
              insetInline: 0,
              visibility: "hidden",
            },
          ]}
        >
          <Paper sx={{ pb: 1 }}>{statSection("typeDefence")}</Paper>
          <Paper sx={{ pb: 1 }}>{statSection("typeCoverage")}</Paper>
        </Box>
        {shown === "defence" && !checklistTab.ownTab && (
          <Paper sx={{ p: 1 }}>
            <Typography
              variant="h6"
              component="h3"
              sx={{ textAlign: "center" }}
            >
              {t.stats.teamChecklist}
            </Typography>
            {checklist}
          </Paper>
        )}
      </Box>
    </Box>
  );
}
