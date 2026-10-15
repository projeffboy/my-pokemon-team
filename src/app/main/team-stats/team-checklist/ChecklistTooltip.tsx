import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { observer } from "mobx-react-lite";
import store from "@/store";
import PokemonIcon from "@/app/shared/PokemonIcon";
import { useTranslation } from "@/app/shared/TranslationContext";
import {
  checklistHint,
  describeFiller,
  type ChecklistFiller,
  type ChecklistItem,
  type ChecklistItemKey,
} from "@/store/checklist";

// Each pokemon that fills a role and how, such as "Gigalith: Stealth Rock", or else what
// would fill it. A role that depends on the battle format also says why.
const ChecklistTooltip = observer(function ChecklistTooltip({
  item,
}: {
  item: ChecklistItem & {
    fillers: ChecklistFiller[];
    dependsOnBattleFormat: boolean;
  };
}) {
  const translation = useTranslation();
  const reasons: Partial<Record<ChecklistItemKey, string>> =
    translation.t.checklist.battleFormat.reasons;
  return (
    <Typography component="div" variant="body2">
      {item.fillers.length ?
        <Box component="ul" sx={{ listStyle: "none", m: 0, p: 0 }}>
          {item.fillers.map((filler, i) => (
            <Box
              component="li"
              key={`${filler.pokemon}-${i}`}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.5,
                // Keep the icon whole when a long line wraps
                "& > span": { flexShrink: 0 },
              }}
            >
              <PokemonIcon pokemonProperty="name" value={filler.pokemon} />
              {describeFiller(item, filler, translation)}
            </Box>
          ))}
        </Box>
      : checklistHint(
          item,
          translation,
          store.currentTeam.generation,
          store.dataFormat,
          store.currentTeam.battleFormat,
          store.currentTeam.format,
        )
      }
      {item.dependsOnBattleFormat && (
        <Box component="p" sx={{ m: 0, mt: 0.5 }}>
          {reasons[item.key]}
        </Box>
      )}
    </Typography>
  );
});

export default ChecklistTooltip;
