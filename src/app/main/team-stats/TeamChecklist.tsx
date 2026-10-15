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

const NOT_SET = "notSet";

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
      <Box sx={{ display: "flex", justifyContent: "center", pt: 1 }}>
        <ToggleButtonGroup
          exclusive
          size="small"
          value={store.currentTeam.battleFormat ?? NOT_SET}
          onChange={(_event, value: BattleFormat | typeof NOT_SET | null) => {
            if (value === NOT_SET) delete store.currentTeam.battleFormat;
            else if (value) store.currentTeam.battleFormat = value;
          }}
          aria-label={battleFormat.label}
        >
          <ToggleButton value="singles">{battleFormat.singles}</ToggleButton>
          <ToggleButton value="doubles">{battleFormat.doubles}</ToggleButton>
          <ToggleButton value={NOT_SET}>{battleFormat.notSet}</ToggleButton>
        </ToggleButtonGroup>
      </Box>
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
                      borderRadius: 1,
                      "&.Mui-focusVisible": { bgcolor: "action.focus" },
                    }}
                  >
                    {/* A checkmark, a cross, or a question mark when it depends on the battle format */}
                    <div>
                      {item.dependsOnBattleFormat ?
                        <Help color="info" titleAccess={battleFormat.depends} />
                      : item.isChecked ?
                        <CheckCircle
                          color="success"
                          titleAccess={t.stats.checked}
                        />
                      : <Typography
                          component="div"
                          sx={{ lineHeight: "initial" }}
                        >
                          <Cancel titleAccess={t.stats.unchecked} />
                        </Typography>
                      }
                    </div>
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
    </>
  );
});

export default TeamChecklist;
