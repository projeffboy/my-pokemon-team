import Typography from "@mui/material/Typography";
import { observer } from "mobx-react-lite";
import store from "@/store";
import type { PokemonType, TeamStatType } from "@/types";
import { useTranslation } from "@/app/shared/TranslationContext";
import TypeDefenceTooltipInfo from "./team-stats-tooltip/TypeDefenceTooltipInfo";
import TypeCoverageTooltipInfo from "./team-stats-tooltip/TypeCoverageTooltipInfo";

const TeamStatsTooltip = observer(function TeamStatsTooltip({
  teamStatType,
  ...otherProps
}: {
  teamStatType: TeamStatType;
  typeColor: string;
  type: PokemonType;
}) {
  const { t } = useTranslation();
  const content = () =>
    teamStatType === "typeDefence" ?
      <TypeDefenceTooltipInfo {...otherProps} />
    : <TypeCoverageTooltipInfo {...otherProps} />;

  return (
    <Typography component="div" variant="body2">
      {store.isTeamEmpty ? t.stats.selectPokemonFirst : content()}
    </Typography>
  );
});

export default TeamStatsTooltip;
