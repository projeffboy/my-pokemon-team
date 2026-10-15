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
} from "@/store/checklist";

// Each pokemon that fills a role and how, such as "Gigalith: Stealth Rock", or else what
// would fill it
const ChecklistTooltip = observer(function ChecklistTooltip({
  item,
}: {
  item: ChecklistItem & { fillers: ChecklistFiller[] };
}) {
  const translation = useTranslation();
  return (
    <Typography component="div" variant="body2">
      {item.fillers.length ?
        <Box component="ul" sx={{ listStyle: "none", m: 0, p: 0 }}>
          {item.fillers.map((filler, i) => (
            <Box
              component="li"
              key={`${filler.pokemon}-${i}`}
              sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
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
        )
      }
    </Typography>
  );
});

export default ChecklistTooltip;
