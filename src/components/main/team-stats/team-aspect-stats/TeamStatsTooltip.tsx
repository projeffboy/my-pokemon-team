import Typography from "@mui/material/Typography";
import { observer } from "mobx-react";
import store from "@/store";
import { PokemonType } from "@/types";
import type { TeamStatTitle } from "../../TeamStats";
import TypeDefenceTooltipInfo from "./team-stats-tooltip/TypeDefenceTooltipInfo";
import TypeCoverageTooltipInfo from "./team-stats-tooltip/TypeCoverageTooltipInfo";

const TeamStatsTooltip = observer(function TeamStatsTooltip({
  teamStatType,
  ...otherProps
}: {
  teamStatType: TeamStatTitle;
  typeColor: string;
  type: PokemonType;
}) {
  const content = () => {
    if (teamStatType === "Team Defence")
      return <TypeDefenceTooltipInfo {...otherProps} />;
    if (teamStatType === "Team Type Coverage")
      return <TypeCoverageTooltipInfo {...otherProps} />;
    return null;
  };

  return (
    <Typography component="div" variant="body2">
      {store.isTeamEmpty ? "First select a pokemon." : content()}
    </Typography>
  );
});

export default TeamStatsTooltip;
