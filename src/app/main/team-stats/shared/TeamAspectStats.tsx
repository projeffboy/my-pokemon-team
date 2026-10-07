import {
  useRef,
  useState,
  type KeyboardEvent,
  type SyntheticEvent,
} from "react";
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
import type { TeamStatType } from "@/types";
import { typesIn } from "@/shared/generation-data";
import { useTranslation } from "@/app/shared/TranslationContext";
import TeamStatsTooltip from "./team-aspect-stats/TeamStatsTooltip";
import { TYPE_COLORS, TYPE_TEXT_COLORS } from "@/app/shared/type-colors";
import TypeLabel from "./TypeLabel";
import useTypeLabelLayout from "./team-aspect-stats/use-type-label-layout";

// The 18 type scores of one team stat. The heading can be hidden when a tab names the stat.
const TeamAspectStats = observer(function TeamAspectStats({
  stat: teamStatType,
  titleId,
  hideTitle = false,
}: {
  stat: TeamStatType;
  titleId: string;
  hideTitle?: boolean;
}) {
  const { t, names } = useTranslation();
  const types = typesIn(store.currentTeam.generation);
  const { gridRef, hasIcon, showFullName, chipWidth } = useTypeLabelLayout(
    JSON.stringify(
      types.map(type => [names.type(type), t.typeAbbreviations[type]]),
    ),
  );
  const title =
    teamStatType === "typeDefence" ?
      t.stats.teamDefence
    : t.stats.teamTypeCoverage;

  // The type tile whose popover is open, if any
  const [popover, setPopover] = useState<{
    index: number;
    anchorEl: HTMLElement;
  } | null>(null);
  const typeAnchors = useRef<(HTMLDivElement | null)[]>([]);

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
      <Grid container size={12} ref={gridRef}>
        {/* grid of type scores */}
        {types.map((type, i) => (
          <Grid
            key={type}
            size={2}
            ref={element => {
              typeAnchors.current[i] = element;
            }}
          >
            <Box
              data-type-label-space
              sx={{ px: { xxs: 0.125, md: 0.375 }, py: 0.375 }}
            >
              <ButtonBase
                sx={{
                  display: "block",
                  color: TYPE_TEXT_COLORS[type],
                  borderRadius: "5px",
                  width: {
                    xxs: "100%",
                    lg: hasIcon && showFullName ? `${chipWidth}px` : "100%",
                  },
                  mx: "auto",
                  font: "inherit",
                  lineHeight: 1.25,
                  bgcolor: TYPE_COLORS[type],
                  // The score below is part of the touch target
                  "&::after": {
                    content: '""',
                    position: "absolute",
                    inset: "-3px 0 -24px",
                  },
                }}
                aria-describedby={
                  popover?.index === i ? `mouse-over-popover-${i}` : undefined
                }
                aria-label={names.type(type)}
                onMouseEnter={e => handlePopoverOpen(e, i)}
                onMouseLeave={handlePopoverClose}
                onFocus={e => handlePopoverOpen(e, i)}
                onBlur={handlePopoverClose}
                onKeyDown={handleKeyDown}
                onClick={e => handleClick(e, i)}
              >
                <TypeLabel
                  hasIcon={hasIcon}
                  showFullName={showFullName}
                  type={type}
                  name={names.type(type)}
                  abbreviation={t.typeAbbreviations[type] ?? names.type(type)}
                />
              </ButtonBase>
              <Popper
                id={`mouse-over-popover-${i}`}
                role="tooltip"
                sx={{ pointerEvents: "none" }}
                open={popover?.index === i}
                anchorEl={popover ? typeAnchors.current[popover.index] : null}
                transition
              >
                {({ TransitionProps }) => (
                  <Fade {...TransitionProps} timeout={150}>
                    <Paper sx={{ p: 1.25 }}>
                      <TeamStatsTooltip
                        type={type}
                        typeColor={TYPE_COLORS[type]}
                        teamStatType={teamStatType}
                      />
                    </Paper>
                  </Fade>
                )}
              </Popper>
            </Box>
            <Typography
              component="div"
              sx={{ lineHeight: "initial" }}
              aria-label={t.stats.score(
                names.type(type),
                `${formatPositiveScore(teamStatValues[type])}`,
              )}
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
