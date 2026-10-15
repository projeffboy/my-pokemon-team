import { Fragment, useId, useRef } from "react";
import ButtonBase from "@mui/material/ButtonBase";
import Fade from "@mui/material/Fade";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Popper from "@mui/material/Popper";
import CheckCircle from "@mui/icons-material/CheckCircle";
import Cancel from "@mui/icons-material/Cancel";
import { observer } from "mobx-react-lite";
import store from "@/store";
import Typography from "@mui/material/Typography";
import { useIsMdDown, useIsLgDown } from "@/app/shared/WidthContext";
import { useTranslation } from "@/app/shared/TranslationContext";
import { checklistLabel, type ChecklistItemKey } from "@/store/checklist";
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

  return (
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
              open === item.key && (item.isChecked || store.learnsetsLoaded);
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
                  {/* Either a checkmark or a cross */}
                  <div>
                    {item.isChecked ?
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
  );
});

export default TeamChecklist;
