import React, { useState } from "react";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Popper from "@mui/material/Popper";
import Paper from "@mui/material/Paper";
import Fade from "@mui/material/Fade";
import { observer } from "mobx-react";
import store from "../../store";
import PokemonIcon from "./pokemon/pokemon-input/pokemon-input-select/pokemon-icon";
import { PokemonType } from "../../types";
import { useBreakpoint } from "../../width-context";

type TeamStatTitle = "Team Defence" | "Team Type Coverage";
type TeamStatType = "typeDefence" | "typeCoverage";

interface TeamStatsProps {
  title: TeamStatTitle;
}

const TeamStats = observer(function TeamStats({ title }: TeamStatsProps) {
  const width = useBreakpoint();
  const teamStatType: TeamStatType =
    title === "Team Defence" ? "typeDefence" : "typeCoverage";

  // For popover (anchorEl means the element that the popover should be anchored to)
  // Why 18? There are 18 types
  const [anchorEl, setAnchorEl] = useState<Array<HTMLElement | null>>(() =>
    Array(18).fill(null),
  );

  const formatPositiveScore = (value: number) =>
    value > 0 ? `+${value}` : value;

  const returnTypeValue = (value: number) => {
    const formattedValue = formatPositiveScore(value);

    if (value < 0) {
      return <Box sx={{ color: "red" }}>{formattedValue}</Box>;
    }

    if (value > 0) {
      return (
        <Box
          sx={[
            { color: "green" },
            theme => theme.applyStyles("dark", { color: "limegreen" }),
          ]}
        >
          {formattedValue}
        </Box>
      );
    }

    return <Box>{formattedValue}</Box>;
  };

  const handlePopoverOpen = (e: React.MouseEvent<HTMLElement>, i: number) => {
    const nextAnchorEl = Array<HTMLElement | null>(18).fill(null);
    nextAnchorEl[i] = e.currentTarget;
    setAnchorEl(nextAnchorEl);
  };

  const handlePopoverClose = () => setAnchorEl(Array(18).fill(null));

  const handleClick = (e: React.MouseEvent<HTMLElement>, i: number) => {
    if (anchorEl.every(x => x === null)) {
      handlePopoverOpen(e, i);
    } else {
      handlePopoverClose();
    }
  };

  const teamStatValues =
    teamStatType === "typeDefence" ? store.typeDefence : store.typeCoverage;

  const types: Record<PokemonType, string> = {
    Bug: "a8b820", // the type's hex color
    Dark: "6f5747",
    Dragon: "7036fc",
    Electric: "f9d130",
    Fairy: "fd67d7",
    Fighting: "c02f27",
    Fire: "f17f2e",
    Flying: "a990f1",
    Ghost: "715799",
    Grass: "78c850",
    Ground: "e1c067",
    Ice: "95d7d8",
    Normal: "a9a878",
    Poison: "a03fa1",
    Psychic: "f95788",
    Rock: "b89f38",
    Steel: "b8b8d0",
    Water: "6890f0",
  };

  let typeAbbr: string[] = [];
  if (width !== "lg" && width !== "xl") {
    // If the screen is below 1200px
    typeAbbr = [
      "BUG",
      "DRK",
      "DRG",
      "ELC",
      "FRY",
      "FGT",
      "FIR",
      "FLY",
      "GHT",
      "GRS",
      "GRD",
      "ICE",
      "NRM",
      "PSN",
      "PSY",
      "RCK",
      "STL",
      "WTR",
    ];
  }

  // Grid Items of Pokemon Types
  const gridItems = (currentTitle: TeamStatTitle) =>
    (Object.keys(types) as PokemonType[]).map((type, i) => (
      <Grid key={i} size={2}>
        <Box sx={{ padding: { xs: "3px 1px", md: "3px" } }}>
          {/* Activates Popover */}
          <Box
            sx={{
              color: "white",
              borderRadius: "5px",
              display: "block",
              width: { xs: "100%", md: "75%" },
              margin: "auto",
              padding: "1px 0",
            }}
            style={{ backgroundColor: `#${types[type]}` }}
            aria-owns={anchorEl[i] ? "mouse-over-popover-" + i : undefined}
            aria-haspopup="true"
            aria-label={type}
            onMouseEnter={e => handlePopoverOpen(e, i)}
            onMouseLeave={handlePopoverClose}
            onClick={e => handleClick(e, i)}
          >
            {typeAbbr[i] || type}
          </Box>
          {/* The Popover Itself */}
          <Popper
            id={"mouse-over-popover-" + i}
            role="tooltip"
            sx={{ pointerEvents: "none" }}
            open={!!anchorEl[i]}
            anchorEl={anchorEl[i]}
            transition
          >
            {/* Popover Message */}
            {({ TransitionProps }) => (
              <Fade {...TransitionProps} timeout={150}>
                <Paper style={{ padding: 10 }}>
                  <TeamStatsTooltip
                    type={type}
                    typeColor={types[type]}
                    teamStatType={currentTitle}
                  />
                </Paper>
              </Fade>
            )}
          </Popper>
        </Box>
        {/* E.g. +2 or -1 */}
        <Typography
          variant="body1"
          component="div"
          style={{ lineHeight: "initial" }}
          aria-label={`${type} score: ${formatPositiveScore(
            teamStatValues[type],
          )}`}
        >
          {returnTypeValue(teamStatValues[type])}
        </Typography>
      </Grid>
    ));

  return (
    <Grid container style={{ textAlign: "center" }}>
      <Grid size={12}>
        {/* Either "Type Defence" or "Type Coverage"  */}
        <Typography
          variant="h6"
          gutterBottom
          style={{ marginBottom: "0.15em", marginTop: "-0.2em" }}
        >
          {title}
        </Typography>
      </Grid>
      {gridItems(title)}
    </Grid>
  );
});

// Type Defence/Coverage Tooltip
const TeamStatsTooltip = observer(function TeamStatsTooltip(
  props: TeamStatsTooltipProps,
) {
  const { teamStatType, ...otherProps } = props;

  const content = () => {
    if (teamStatType === "Team Defence") {
      return <TypeDefenceTooltipInfo {...otherProps} />;
    } else if (teamStatType === "Team Type Coverage") {
      return <TypeCoverageTooltipInfo {...otherProps} />;
    }

    return null;
  };

  return (
    <Typography component="div">
      {store.isTeamEmpty ? "First select a pokemon." : content()}
    </Typography>
  );
});

interface TeamStatsTooltipProps {
  teamStatType: TeamStatTitle;
  typeColor: string;
  type: PokemonType;
}

interface TeamStatsTypeTooltipProps {
  typeColor: string;
  type: PokemonType;
}

// Type Defence Tooltip Info
const TypeDefenceTooltipInfo = ({
  typeColor,
  type,
}: TeamStatsTypeTooltipProps) => (
  <>
    <p>
      <span style={{ color: `#${typeColor}` }}>{type}</span> does...
    </p>
    <ul style={{ listStyle: "none", padding: 0 }}>
      {store.team.map((teamPkmnProps, i) => {
        // for each pokemon
        const { name: pkmn, ability, item } = teamPkmnProps;

        if (pkmn) {
          const effectiveness = store.typeAgainstPkmn(
            type,
            pkmn,
            ability,
            item,
          );

          // convert effectiveness to multiplier
          // e.g. -1 becomes 2
          let multiplier = 1;
          let color = "initial";
          switch (effectiveness) {
            case -2:
              multiplier = 4;
              color = "red";
              break;
            case -1.5:
              multiplier = 3;
              color = "red";
              break;
            case -1:
              multiplier = 2;
              color = "#f9d130";
              break;
            case -0.5:
              multiplier = 1.5;
              color = "#f9d130";
              break;
            case 0:
              multiplier = 1;
              break;
            case 1:
              multiplier = 0.5;
              color = "yellowgreen";
              break;
            case 2:
              multiplier = 0.25;
              color = "forestgreen";
              break;
            case 3:
              multiplier = 0;
              color = "grey";
              break;
            default:
          }

          return (
            // multiplier, pkmn name, then pkmn icon
            <li
              key={teamPkmnProps.name + i}
              style={{ display: "flex", alignItems: "center" }}
            >
              <span
                style={{
                  color,
                  width: 40,
                  textAlign: "right",
                  paddingRight: 4,
                }}
              >
                {multiplier}x
              </span>
              <span style={{ paddingRight: 2 }}>to {store.pkmnName(pkmn)}</span>
              <PokemonIcon pkmnProp="pkmn" value={pkmn} />
            </li>
          );
        }

        return null;
      })}
    </ul>
  </>
);

// Type Coverage Tooltip Info
function TypeCoverageTooltipInfo({
  typeColor,
  type,
}: TeamStatsTypeTooltipProps) {
  let hasSuperEffectiveMove = false;

  return (
    <>
      <p>
        Super effective against{" "}
        <span style={{ color: `#${typeColor}` }}>{type}</span>:
      </p>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {store.team.map((teamPkmnProps, i) => {
          // For each team pokmeon
          const { name: pkmn, ability } = teamPkmnProps;

          return (
            <React.Fragment key={pkmn + i}>
              {[1, 2, 3, 4].map(num => {
                // For each move number
                const move = teamPkmnProps["move" + num];

                if (
                  move &&
                  store.moveAgainstType(move, type, pkmn, ability) === -1
                ) {
                  hasSuperEffectiveMove = true;
                  const moveType = store.moveType(move, pkmn, ability);

                  return (
                    // move name, pkmn name, then pkmn icon
                    <li
                      key={move + num}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        fontWeight:
                          moveType && store.pkmnType(pkmn).includes(moveType) ?
                            500
                          : 400,
                      }}
                    >
                      <span style={{ width: 150 }}>{store.moveName(move)}</span>
                      <span>{store.pkmnName(pkmn) + " "}</span>
                      <PokemonIcon pkmnProp="pkmn" value={pkmn} />
                    </li>
                  );
                } else if (num === 4 && i === 5 && !hasSuperEffectiveMove) {
                  return (
                    <li key={pkmn + i} style={{ textAlign: "center" }}>
                      Nothing
                    </li>
                  );
                }

                return null;
              })}
            </React.Fragment>
          );
        })}
      </ul>
    </>
  );
}

export default TeamStats;
