import { useState, type KeyboardEvent, type SyntheticEvent } from "react";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import ButtonBase from "@mui/material/ButtonBase";
import Popper from "@mui/material/Popper";
import Paper from "@mui/material/Paper";
import Fade from "@mui/material/Fade";
import { observer } from "mobx-react-lite";
import store from "@/store";
import { POKEMON_TYPES, type PokemonType, type TeamStatType } from "@/types";
import { useIsLgDown } from "@/app/shared/WidthContext";
import type { TeamStatTitle } from "@/types";
import TeamStatsTooltip from "./team-aspect-stats/TeamStatsTooltip";

const TYPE_COLORS: Record<PokemonType, string> = {
  Bug: "#a8b820",
  Dark: "#6f5747",
  Dragon: "#7036fc",
  Electric: "#f9d130",
  Fairy: "#fd67d7",
  Fighting: "#c02f27",
  Fire: "#f17f2e",
  Flying: "#a990f1",
  Ghost: "#715799",
  Grass: "#78c850",
  Ground: "#e1c067",
  Ice: "#95d7d8",
  Normal: "#a9a878",
  Poison: "#a03fa1",
  Psychic: "#f95788",
  Rock: "#b89f38",
  Steel: "#b8b8d0",
  Water: "#6890f0",
};

// Shown at lg and below
const TYPE_ABBREVIATIONS: Record<PokemonType, string> = {
  Bug: "BUG",
  Dark: "DRK",
  Dragon: "DRG",
  Electric: "ELC",
  Fairy: "FRY",
  Fighting: "FGT",
  Fire: "FIR",
  Flying: "FLY",
  Ghost: "GHT",
  Grass: "GRS",
  Ground: "GRD",
  Ice: "ICE",
  Normal: "NRM",
  Poison: "PSN",
  Psychic: "PSY",
  Rock: "RCK",
  Steel: "STL",
  Water: "WTR",
};

const TeamAspectStats = observer(function TeamAspectStats({
  title,
  titleId,
}: {
  title: TeamStatTitle;
  titleId: string;
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
          component="h2"
          gutterBottom
          sx={{ mb: "0.15em", mt: "-0.2em" }}
        >
          {title}
        </Typography>
      </Grid>
      <Grid container size={12}>
        {/* grid of type scores */}
        {POKEMON_TYPES.map((type, i) => (
          <Grid key={i} size={2}>
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
