import { useState, type KeyboardEvent, type SyntheticEvent } from "react";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import ButtonBase from "@mui/material/ButtonBase";
import Popper from "@mui/material/Popper";
import Paper from "@mui/material/Paper";
import Fade from "@mui/material/Fade";
import { visuallyHidden } from "@mui/utils";
import { observer } from "mobx-react-lite";
import store from "@/store";
import { POKEMON_TYPES, type TeamStatType } from "@/types";
import { useIsLgDown } from "@/app/shared/WidthContext";
import type { TeamStatTitle } from "@/types";
import TeamStatsTooltip from "./team-aspect-stats/TeamStatsTooltip";
import { TYPE_ABBREVIATIONS, TYPE_COLORS } from "./type-colors";

// The 18 type scores of one team stat. The heading can be hidden when a tab names the stat.
const TeamAspectStats = observer(function TeamAspectStats({
  title,
  titleId,
  hideTitle = false,
}: {
  title: TeamStatTitle;
  titleId: string;
  hideTitle?: boolean;
}) {
  const isLgDown = useIsLgDown();
  const teamStatType: TeamStatType =
    title === "Team Defence" ? "typeDefence" : "typeCoverage";

  // The type tile whose popover is open, if any
  const [popover, setPopover] = useState<{
    index: number;
    anchorEl: HTMLElement;
  } | null>(null);

  const formatPositiveScore = (value: number) =>
    value > 0 ? `+${value}` : value;

  const getTypeScore = (value: number) => {
    const formattedValue = formatPositiveScore(value);

    if (value < 0) {
      return <Box sx={{ color: "error.main" }}>{formattedValue}</Box>;
    } else if (value > 0) {
      return <Box sx={{ color: "success.main" }}>{formattedValue}</Box>;
    } else {
      return <Box>{formattedValue}</Box>;
    }
  };

  const handlePopoverOpen = (e: SyntheticEvent<HTMLElement>, i: number) => {
    if (popover?.anchorEl !== e.currentTarget)
      setPopover({ index: i, anchorEl: e.currentTarget });
  };

  const handlePopoverClose = () => setPopover(null);

  const handleClick = (e: SyntheticEvent<HTMLElement>, i: number) => {
    if (popover) handlePopoverClose();
    else handlePopoverOpen(e, i);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLElement>) => {
    if (e.key === "Escape") handlePopoverClose();
  };

  const teamStatValues =
    teamStatType === "typeDefence" ? store.typeDefence : store.typeCoverage;

  return (
    <Grid container sx={{ textAlign: "center" }}>
      <Grid size={12}>
        <Typography
          id={titleId}
          variant="h6"
          component="h3"
          sx={hideTitle ? visuallyHidden : { mb: "0.15em", mt: "-0.2em" }}
        >
          {title}
        </Typography>
      </Grid>
      <Grid container size={12}>
        {/* grid of type scores */}
        {POKEMON_TYPES.map((type, i) => (
          <Grid key={type} size={2}>
            <Box sx={{ px: { xs: 0.125, md: 0.375 }, py: 0.375 }}>
              <ButtonBase
                sx={{
                  display: "block",
                  color: "common.white",
                  borderRadius: "5px",
                  width: { xs: "100%", md: "75%" },
                  mx: "auto",
                  font: "inherit",
                  lineHeight: 1.25,
                  bgcolor: TYPE_COLORS[type],
                }}
                aria-describedby={
                  popover?.index === i ? `mouse-over-popover-${i}` : undefined
                }
                aria-label={type}
                onMouseEnter={e => handlePopoverOpen(e, i)}
                onMouseLeave={handlePopoverClose}
                onFocus={e => handlePopoverOpen(e, i)}
                onBlur={handlePopoverClose}
                onKeyDown={handleKeyDown}
                onClick={e => handleClick(e, i)}
              >
                {isLgDown ? TYPE_ABBREVIATIONS[type] : type}
              </ButtonBase>
              <Popper
                id={`mouse-over-popover-${i}`}
                role="tooltip"
                sx={{ pointerEvents: "none" }}
                open={popover?.index === i}
                anchorEl={popover?.anchorEl}
                transition
              >
                {({ TransitionProps }) => (
                  <Fade {...TransitionProps} timeout={150}>
                    <Paper sx={{ p: 1.25 }}>
                      <TeamStatsTooltip
                        type={type}
                        typeColor={TYPE_COLORS[type]}
                        teamStatType={title}
                      />
                    </Paper>
                  </Fade>
                )}
              </Popper>
            </Box>
            <Typography
              component="div"
              sx={{ lineHeight: "initial" }}
              aria-label={`${type} score: ${formatPositiveScore(teamStatValues[type])}`}
            >
              {getTypeScore(teamStatValues[type])}
            </Typography>
          </Grid>
        ))}
      </Grid>
    </Grid>
  );
});

export default TeamAspectStats;
