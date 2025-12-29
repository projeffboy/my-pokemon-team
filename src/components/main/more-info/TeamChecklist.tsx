import Grid from "@mui/material/Grid";
const GridAny = Grid as any;
import CheckCircle from "@mui/icons-material/CheckCircle";
import Cancel from "@mui/icons-material/Cancel";
import { Observer } from "mobx-react";
import store from "store";
import Typography from "@mui/material/Typography";

// wish + protect-like move counts as reliable recovery
const hasWishAndProtect = () => {
  return store.doesTeamPokemonHaveTheseMoves([
    "wish",
    ["protect", "detect", "banefulbunker", "spikyshield", "kingsshield"],
  ]);
};

const TeamChecklist = ({ width }: { width: string }) => {
  return (
    <Observer>
      {() => {
        let checklist = {
          General: {
            "Entry Hazard": store.doesTeamHaveMoves([
              "spikes",
              "stealthrock",
              "toxicspikes",
              "stickyweb",
              "stoneaxe",
            ]),
            "Reliable Recovery":
              store.doesTeamHaveMoves([
                "recover",
                "roost",
                "softboiled",
                "slackoff",
                "milkdrink",
                "shoreup",
                "moonlight",
                "morningsun",
                "synthesis",
                "strengthsap",
                "lifedew",
                "wish",
              ]) || hasWishAndProtect(),
            "Spinner/Defogger": store.doesTeamHaveMoves([
              "rapidspin",
              "defog",
              "mortalspin",
              "tidyup",
            ]),
            Phazer: store.doesTeamHaveMoves([
              "roar",
              "whirlwind",
              "dragontail",
              "circlethrow",
            ]),
            Cleric: store.doesTeamHaveMoves([
              "healbell",
              "aromatherapy",
              "junglehealing",
            ]),
            "Wish Passer": store.doesTeamHaveMoves(["wish"]),
            "Volt-turn Move": store.doesTeamHaveMoves([
              "voltswitch",
              "uturn",
              "flipturn",
              "partingshot",
              "batonpass",
              "chillyreception",
              "shedtail",
              "teleport",
            ]),
            "Status Absorber": store.doesTeamHaveAbilities([
              "naturalcure",
              "poisonheal",
              "magicguard",
              "comatose",
              "purifyingsalt",
            ]),
            "Stallbreaker (Taunt)": store.doesTeamHaveMoves(["taunt"]),
            "Status Move": store.anyStatusMoves,
            "Boosting Move": store.anyBoostingMoves,
            "Choice Item": store.doesTeamHaveItems([
              "choiceband",
              "choicescarf",
              "choicespecs",
            ]),
          },
          "Wall Breaking": {
            "Physical Wallbreaker": store.doesTeamHaveStats("atk", 110),
            "Special Wallbreaker": store.doesTeamHaveStats("spa", 110),
            "Mixed Wallbreaker":
              store.doesTeamHaveStats("atk", 100) &&
              store.doesTeamHaveStats("spa", 100),
            "Physical Sweeper":
              store.doesTeamHaveStats("atk", 100) &&
              store.doesTeamHaveStats("spe", 100),
            "Special Sweeper":
              store.doesTeamHaveStats("spa", 100) &&
              store.doesTeamHaveStats("spe", 100),
          },
          "Damage Mitigation": {
            "Physical Wall":
              store.doesTeamHaveStats("def", 100) &&
              store.doesTeamHaveStats("hp", 80),
            "Special Wall":
              store.doesTeamHaveStats("spd", 100) &&
              store.doesTeamHaveStats("hp", 80),
          },
        };

        const abbreviations = {
          "Entry Hazard": { medium: "Hazard", small: "Hazard" },
          "Spinner/Defogger": { medium: "Spinner", small: "Spin" },
          "Reliable Recovery": { medium: "Recovery", small: "Heal" },
          Cleric: { medium: "Cleric", small: "Cleric" },
          "Status Move": { medium: "Status", small: "Status" },
          Phazer: { medium: "Phazer", small: "Phazer" },
          "Boosting Move": { medium: "Setup", small: "Setup" },
          "Volt-turn Move": { medium: "Volt-turn", small: "Volturn" },
          "Choice Item": { medium: "Choice", small: "Choice" },
        };

        return (
          <>
            {Object.keys(checklist).map((category, i) => (
              <GridAny
                key={i}
                item
                xs={12}
                sm={6}
                md={4}
                lg={3}
                xl={3}
                style={{ padding: "10px" }}
              >
                <Typography variant="h6">{category}</Typography>
                {Object.keys(checklist[category as keyof typeof checklist]).map(
                  (check, j) => (
                    <div
                      key={j}
                      style={{
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <div style={{ display: "flex" }}>
                        {(checklist as any)[category][check] ? (
                          <CheckCircle style={{ color: "#16a085" }} />
                        ) : (
                          <Typography
                            variant="body1"
                            component="div"
                            style={{ lineHeight: "initial" }}
                          >
                            <Cancel />
                          </Typography>
                        )}
                      </div>
                      {/* E.g. Choice Item (Or "Choice" for smaller screens) */}
                      <Typography
                        style={{ padding: "0px 4px" }}
                        variant="body1"
                        component="div"
                      >
                        {(() => {
                          const abbr = (abbreviations as any)[check];
                          if (abbr) {
                            if (width === "xs" || width === "sm") {
                              return abbr.small;
                            } else if (width !== "lg" && width !== "xl") {
                              return abbr.medium;
                            }
                          }
                          return check;
                        })()}
                      </Typography>
                    </div>
                  )
                )}
              </GridAny>
            ))}
          </>
        );
      }}
    </Observer>
  );
};

export default TeamChecklist;
