import Box from "@mui/material/Box";
import ListItemText from "@mui/material/ListItemText";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import { observer } from "mobx-react-lite";
import store from "@/store";
import { CHAMPIONS_FORMAT, CHAMPIONS_GENERATION } from "@/shared/formats";
import {
  GENERATION_GAMES,
  GENERATIONS,
  isGeneration,
} from "@/shared/generations";
import { useTranslation } from "@/app/shared/TranslationContext";
import { CHAMPIONS_LOGO, GAME_LOGOS } from "@/images/game-logos";

const CHAMPIONS = "champions";

// The current team's generation, with the Pokemon Champions format as a generation of its own
const GenerationSelect = observer(function GenerationSelect() {
  const { t } = useTranslation();
  const { generation, format } = store.currentTeam;
  const value = format === CHAMPIONS_FORMAT ? CHAMPIONS : `${generation}`;

  // Gen 9 · Champions first, as its own generation, then Gen 9 down to Gen 1
  const options = [
    {
      value: CHAMPIONS,
      label: t.championsGeneration,
      short: t.championsGenerationShort,
      logos: [CHAMPIONS_LOGO],
    },
    ...GENERATIONS.map(generation => ({
      value: `${generation}`,
      label: t.generation(generation),
      short: `${t.generation(generation)} (${GENERATION_GAMES[generation]})`,
      logos: GAME_LOGOS[generation],
    })),
  ];

  const handleChange = (value: string) => {
    const team = store.currentTeam;
    if (value === CHAMPIONS) {
      team.generation = CHAMPIONS_GENERATION;
      team.format = CHAMPIONS_FORMAT;
      return;
    }
    const generation = Number(value);
    if (isGeneration(generation)) team.generation = generation;
    if (team.format === CHAMPIONS_FORMAT) team.format = "";
  };

  return (
    <TextField
      select
      size="small"
      label={t.generationSelect}
      value={value}
      onChange={event => handleChange(event.target.value)}
      fullWidth
      // 48px tall, the touch target size
      sx={{ "& .MuiSelect-select": { py: "12.5px" } }}
      slotProps={{
        select: {
          renderValue: selected =>
            options.find(option => option.value === selected)?.short,
          MenuProps: { slotProps: { paper: { sx: { maxHeight: 400 } } } },
        },
        htmlInput: { "aria-label": t.generationSelect },
      }}
    >
      {options.map(({ value, label, logos }) => (
        <MenuItem key={value} value={value}>
          <ListItemText
            primary={label}
            // The generation's games, as their logos; they wrap on phones
            secondary={
              <Box
                component="span"
                sx={{ display: "flex", flexWrap: "wrap", gap: 0.75, mt: 0.5 }}
              >
                {logos.map(({ src, name, isBoxFront }) => (
                  <Box
                    key={src}
                    component="img"
                    src={src}
                    alt={name}
                    sx={{ height: isBoxFront ? 56 : 28, width: "auto" }}
                  />
                ))}
              </Box>
            }
            slotProps={{ secondary: { component: "span" } }}
          />
        </MenuItem>
      ))}
    </TextField>
  );
});

export default GenerationSelect;
