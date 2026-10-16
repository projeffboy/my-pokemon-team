import { Fragment, useId, useRef } from "react";
import Box from "@mui/material/Box";
import ButtonBase from "@mui/material/ButtonBase";
import Fade from "@mui/material/Fade";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Popper from "@mui/material/Popper";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import CheckCircle from "@mui/icons-material/CheckCircle";
import Cancel from "@mui/icons-material/Cancel";
import Help from "@mui/icons-material/Help";
import { observer } from "mobx-react-lite";
import store from "@/store";
import Typography from "@mui/material/Typography";
import { useIsMdDown, useIsLgDown } from "@/app/shared/WidthContext";
import { useTranslation } from "@/app/shared/TranslationContext";
import { checklistLabel, type ChecklistItemKey } from "@/store/checklist";
import type { BattleFormat } from "@/types";
import useToggleTooltip from "./shared/use-toggle-tooltip";
import ChecklistTooltip from "./team-checklist/ChecklistTooltip";

const TeamChecklist = observer(function TeamChecklist() {
  const { t } = useTranslation();
  const isMdDown = useIsMdDown();
  const isLgDown = useIsLgDown();
  const tooltipId = useId();
  const { open, triggerProps } = useToggleTooltip<ChecklistItemKey>();
  const anchors = useRef<Partial<Record<ChecklistItemKey, HTMLElement | null>>>(
    {},
  );
  const { battleFormat } = t.checklist;
  const reasons: Partial<Record<ChecklistItemKey, string>> =
    battleFormat.reasons;
  const depending = store.checklist
    .flatMap(group => group.items)
    .filter(item => item.dependsOnBattleFormat);

  return (
    <>
      <Grid container>
        {store.checklist.map(({ key, items }) => (
          <Grid key={key} size={4} sx={{ px: { xxs: 0.5, md: 1 }, py: 1 }}>
            {/* E.g. Offensive */}
            <Typography
              sx={{ fontWeight: "bold", pb: 1, lineHeight: "initial" }}
              component="h4"
            >
              {t.checklist.groups[key]}
            </Typography>
            {items.map(item => {
              // An unfilled role's hint names the game's moves, which come with the learnsets
              const isOpen =
                open === item.key &&
                (item.fillers.length > 0 || store.learnsetsLoaded);
              return (
                <Fragment key={item.key}>
                  <ButtonBase
                    component="div"
                    ref={(element: HTMLElement | null) => {
                      anchors.current[item.key] = element;
                    }}
                    aria-describedby={
                      isOpen ? `${tooltipId}-${item.key}` : undefined
                    }
                    {...triggerProps(item.key)}
                    sx={{
                      display: "flex",
                      alignItems: "stretch",
                      justifyContent: "flex-start",
                      py: 0.25,
                      borderRadius: 1,
                      "&.Mui-focusVisible": { bgcolor: "action.focus" },
                    }}
                  >
                    {/* A checkmark, a cross, or a question mark when it depends on the battle format */}
                    {/* As a flex item the icon takes its own height, so every row is level */}
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      {item.dependsOnBattleFormat ?
                        <Help color="info" titleAccess={battleFormat.depends} />
                      : item.isChecked ?
                        <CheckCircle
                          color="success"
                          titleAccess={t.stats.checked}
                        />
                      : <Cancel titleAccess={t.stats.unchecked} />}
                    </Box>
                    {/* E.g. Choice Item (Or "Choice" for smaller screens) */}
                    <Typography sx={{ px: 0.5 }} component="div">
                      {checklistLabel(t.checklist.items[item.key], {
                        isMdDown,
                        isLgDown,
                      })}
                    </Typography>
                  </ButtonBase>
                  <Popper
                    id={`${tooltipId}-${item.key}`}
                    role="tooltip"
                    sx={{ pointerEvents: "none", zIndex: "tooltip" }}
                    open={isOpen}
                    anchorEl={anchors.current[item.key]}
                    transition
                  >
                    {({ TransitionProps }) => (
                      <Fade {...TransitionProps} timeout={150}>
                        <Paper sx={{ p: 1.25, maxWidth: 300 }}>
                          <ChecklistTooltip item={item} />
                        </Paper>
                      </Fade>
                    )}
                  </Popper>
                </Fragment>
              );
            })}
          </Grid>
        ))}
      </Grid>
      {depending.map(({ key }) => (
        <Typography
          key={key}
          variant="body2"
          sx={{ color: "text.secondary", px: { xxs: 0.5, md: 1 }, pb: 1 }}
        >
          {reasons[key]}
        </Typography>
      ))}
      {/* Only where it changes a role, or once picked so that it can be changed */}
      {(depending.length > 0 || store.currentTeam.battleFormat) && (
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            gap: 1,
            px: { xxs: 0.5, md: 1 },
            pb: 1,
          }}
        >
          <Typography
            id={`${tooltipId}-battle-format`}
            variant="body2"
            sx={{ color: "text.secondary" }}
          >
            {battleFormat.label}
          </Typography>
          {/* Pressing the picked format again leaves it not set */}
          <ToggleButtonGroup
            exclusive
            size="small"
            value={store.currentTeam.battleFormat ?? null}
            onChange={(_event, value: BattleFormat | null) => {
              if (value) store.currentTeam.battleFormat = value;
              else delete store.currentTeam.battleFormat;
            }}
            aria-labelledby={`${tooltipId}-battle-format`}
          >
            <ToggleButton value="singles">{battleFormat.singles}</ToggleButton>
            <ToggleButton value="doubles">{battleFormat.doubles}</ToggleButton>
          </ToggleButtonGroup>
        </Box>
      )}
    </>
  );
});

export default TeamChecklist;
