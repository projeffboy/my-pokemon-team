import { useState, Fragment } from "react";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Popper from "@mui/material/Popper";
import Paper from "@mui/material/Paper";
import { Observer } from "mobx-react";
import store, { type TeamMember } from "store";
import Fade from "@mui/material/Fade";
import PokemonIcon from "./pokemon/pokemon-input/pokemon-input-select/PokemonIcon";
import Box from "@mui/material/Box";
import { useTheme } from "@mui/material/styles";
import useWidth from "useWidth";

const TeamStats = ({ title }: { title: string }) => {
  const width = useWidth();
  const theme = useTheme();
  const darkMode = theme.palette.mode === "dark";
  // E.g. Turn 'Type Coverage' to 'typeCoverage'
  /*
    let titleArr = title.split(' ')
    titleArr[0] = titleArr[0].toLowerCase()
    const teamStatType = titleArr.join('')
    */

  // let teamStatType = "typeDefence";
  // if (title === "Team Type Coverage") {
  //   teamStatType = "typeCoverage";
  // }

  // For popover (anchorEl means the element that the popover should be anchored to)
  // Why 18? There are 18 types
  const [anchorEl, setAnchorEl] = useState(Array(18).fill(null));

  const formatPositiveScore = (value: number) => {
    return value > 0 ? `+${value}` : value;
  };

  const returnTypeValue = (type: number) => {
    let color = "inherit";

    if (type < 0) {
      // weak to type
      color = "red";
    } else if (type > 0) {
      // resist type
      color = darkMode ? "limegreen" : "green";
    }

    return <div style={{ color }}>{formatPositiveScore(type)}</div>;
  };

  const handlePopoverOpen = (e: React.MouseEvent<HTMLElement>, i: number) => {
    const newAnchorEl = Array(18).fill(null);
    newAnchorEl[i] = e.currentTarget;
    setAnchorEl(newAnchorEl);
  };

  const handlePopoverClose = () => setAnchorEl(Array(18).fill(null));

  const handleClick = (e: React.MouseEvent<HTMLElement>, i: number) => {
    // handlePopoverOpen(e, i)
    if (anchorEl.every(x => x === null)) {
      handlePopoverOpen(e, i);
    } else {
      handlePopoverClose();
    }
  };

  const types: Record<string, string> = {
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

  return (
    <Observer>
      {() => {
        // Grid Items of Pokemon Types
        const gridItems = (title: string) => {
          const stats =
            title === "Team Type Coverage"
              ? store.typeCoverage
              : store.typeDefence;

          return Object.keys(types).map((type, i) => (
            <Grid key={i} size={{ xs: 2 }}>
              <Box sx={{ p: { xs: "3px 1px", md: 3 } }}>
                {/* Activates Popover */}
                <Box
                  component="div"
                  sx={{
                    backgroundColor: `#${types[type]}`,
                    color: "white",
                    borderRadius: "5px",
                    display: "block",
                    width: { xs: "100%", md: "75%" },
                    m: "auto",
                    p: "1px 0",
                  }}
                  aria-owns={
                    anchorEl[i] ? "mouse-over-popover-" + i : undefined
                  }
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
                  sx={{ pointerEvents: "none" }}
                  open={!!anchorEl[i]}
                  anchorEl={anchorEl[i]}
                  /*
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              */
                  transition
                >
                  {/* Popover Message */}
                  {({ TransitionProps }) => (
                    <Fade {...TransitionProps} timeout={150}>
                      <Paper style={{ padding: 10 }}>
                        <TeamStatsTooltip
                          type={type}
                          typeColor={types[type]}
                          teamStatType={title}
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
                  (stats as any)[type]
                )}`}
              >
                {returnTypeValue((stats as any)[type])}
              </Typography>
            </Grid>
          ));
        };

        return (
          <Grid container style={{ textAlign: "center" }}>
            <Grid size={{ xs: 12 }}>
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
      }}
    </Observer>
  );
};

// Type Defence/Coverage Tooltip
const TeamStatsTooltip = (props: {
  teamStatType: string;
  typeColor: string;
  type: string;
}) => {
  const { teamStatType, ...otherProps } = props;

  const content = () => {
    if (teamStatType === "Team Defence") {
      return <TypeDefenceTooltipInfo {...otherProps} />;
    } else if (teamStatType === "Team Type Coverage") {
      return <TypeCoverageTooltipInfo {...otherProps} />;
    }
  };

  return (
    <Observer>
      {() => (
        <Typography component="div">
          {store.isTeamEmpty ? "First Select a Pokemon" : content()}
        </Typography>
      )}
    </Observer>
  );
};

// Type Defence Tooltip Info
const TypeDefenceTooltipInfo = ({
  typeColor,
  type,
}: {
  typeColor: string;
  type: string;
}) => (
  <Observer>
    {() => (
      <>
        <p>
          <span style={{ color: `#${typeColor}` }}>{type}</span> does...
        </p>
        <Box component="ul" sx={{ listStyle: "none", p: 0 }}>
          {store.team.map((teamPkmnProps, i) => {
            // for each pokemon
            const { name: pkmn, ability, item } = teamPkmnProps;

            if (pkmn) {
              const effectiveness = store.typeAgainstPkmn(
                type,
                pkmn,
                ability,
                item
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
                <Box
                  component="li"
                  key={teamPkmnProps.name + i}
                  sx={{ display: "flex", alignItems: "center" }}
                >
                  <Box
                    component="span"
                    style={{ color }}
                    sx={{ width: 40, textAlign: "right", pr: "4px" }}
                  >
                    {multiplier}x
                  </Box>
                  <span style={{ paddingRight: 2 }}>
                    to {store.pkmnName(pkmn)}
                  </span>
                  <PokemonIcon pkmnProp="pkmn" value={pkmn} />
                </Box>
              );
            }

            return null;
          })}
        </Box>
      </>
    )}
  </Observer>
);

// Type Coverage Tooltip Info
const TypeCoverageTooltipInfo = ({
  typeColor,
  type,
}: {
  typeColor: string;
  type: string;
}) => {
  return (
    <Observer>
      {() => {
        let hasSuperEffectiveMove = false;
        return (
          <>
            <p>
              Super effective against{" "}
              <span style={{ color: `#${typeColor}` }}>{type}</span>:
            </p>
            <Box component="ul" sx={{ listStyle: "none", p: 0 }}>
              {store.team.map((teamPkmnProps, i) => {
                // For each team pokmeon
                const { name: pkmn, ability } = teamPkmnProps;

                return (
                  <Fragment key={pkmn + i}>
                    {[1, 2, 3, 4].map(num => {
                      // For each move number
                      const move =
                        teamPkmnProps[("move" + num) as keyof TeamMember];

                      if (
                        move &&
                        store.moveAgainstType(move, type, pkmn, ability) === -1
                      ) {
                        hasSuperEffectiveMove = true;

                        return (
                          // move name, pkmn name, then pkmn icon
                          <Box
                            component="li"
                            key={move + num}
                            sx={{ display: "flex", alignItems: "center" }}
                            style={{
                              fontWeight: store
                                .pkmnType(pkmn)
                                .includes(store.moveType(move, pkmn, ability))
                                ? 500
                                : 400,
                            }}
                          >
                            <span style={{ width: 150 }}>
                              {store.moveName(move)}
                            </span>
                            <span>{store.pkmnName(pkmn) + " "}</span>
                            <PokemonIcon pkmnProp="pkmn" value={pkmn} />
                          </Box>
                        );
                      } else if (
                        num === 4 &&
                        i === 5 &&
                        !hasSuperEffectiveMove
                      ) {
                        return (
                          <li key={pkmn + i} style={{ textAlign: "center" }}>
                            Nothing
                          </li>
                        );
                      }

                      return null;
                    })}
                  </Fragment>
                );
              })}
            </Box>
          </>
        );
      }}
    </Observer>
  );
};

export default TeamStats;
