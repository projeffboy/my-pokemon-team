import Grid from "@mui/material/Grid";
import CheckCircle from "@mui/icons-material/CheckCircle";
import Cancel from "@mui/icons-material/Cancel";
import { observer } from "mobx-react";
import store from "@/store";
import Typography from "@mui/material/Typography";
import { useIsMdDown, useIsLgDown } from "@/WidthContext";

const TeamChecklist = observer(function TeamChecklist() {
  const isMdDown = useIsMdDown();
  const isLgDown = useIsLgDown();

  // wish + protect-like move counts as reliable recovery
  const hasWishAndProtect = () =>
    store.doesTeamPokemonHaveTheseMoves([
      "wish",
      ["protect", "detect", "banefulbunker", "spikyshield", "kingsshield"],
    ]);

  const checklist: Record<string, Record<string, boolean>> = {
    General: {
      "Entry Hazard": store.doesTeamHaveMoves([
        "spikes",
        "stealthrock",
        "toxicspikes",
        "stickyweb",
        "stoneaxe",
      ]),
      "Spinner/Defogger": store.doesTeamHaveMoves([
        "rapidspin",
        "defog",
        "courtchange",
        "tidyup",
        "mortalspin",
      ]),
      "Reliable Recovery":
        store.doesTeamHaveMoves([
          "healorder",
          "floralhealing",
          "milkdrink",
          "moonlight",
          "morningsun",
          "recover",
          "roost",
          "slackoff",
          "shoreup",
          "softboiled",
          "strengthsap",
          "synthesis",
        ]) || hasWishAndProtect(),
    },
    Defensive: {
      Cleric: store.doesTeamHaveMoves(["aromatherapy", "healbell"]),
      "Status Move": store.anyStatusMoves,
      Phazer: store.doesTeamHaveMoves([
        "circlethrow",
        "dragontail",
        "roar",
        "whirlwind",
      ]),
    },
    Offensive: {
      "Boosting Move": store.anyBoostingMoves,
      "Volt-turn Move":
        store.doesTeamHaveMove("voltswitch") ||
        store.doesTeamHaveMove("uturn") ||
        store.doesTeamHaveMove("flipturn"),
      "Choice Item": store.doesTeamHaveItems([
        "choicescarf",
        "choiceband",
        "choicespecs",
      ]),
    },
  };

  let checklistAbbr: string[] = [];
  if (isLgDown) {
    // If the screen is below 1200px
    checklistAbbr = [
      "Hazard",
      "Spinner",
      "Recovery",
      "",
      "Status",
      "Phazer",
      "Setup",
      "Volt-turn",
      "Choice",
    ];
  }
  if (isMdDown) {
    checklistAbbr[1] = "Spin";
    checklistAbbr[2] = "Heal";
    checklistAbbr[7] = "Volturn";
  }

  return Object.keys(checklist).map((miniHeader, i) => (
    <Grid key={miniHeader} size={4} sx={{ p: 1 }}>
      {/* E.g. Offensive */}
      <Typography
        sx={{ fontWeight: "bold", pb: 1 }}
        component="h3"
        style={{ lineHeight: "initial" }}
      >
        {miniHeader}
      </Typography>
      {Object.keys(checklist[miniHeader]).map((check, j) => (
        <div key={check} style={{ display: "flex" }}>
          {/* Either a checkmark or a cross */}
          <div>
            {checklist[miniHeader][check] ?
              <CheckCircle style={{ color: "#16a085" }} />
            : <Typography component="div" style={{ lineHeight: "initial" }}>
                <Cancel />
              </Typography>
            }
          </div>
          {/* E.g. Choice Item (Or "Choice" for smaller screens) */}
          <Typography sx={{ px: 0.5 }} component="div">
            {checklistAbbr[3 * i + j] || check}
          </Typography>
        </div>
      ))}
    </Grid>
  ));
});

export default TeamChecklist;
