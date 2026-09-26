import ListItemText from "@mui/material/ListItemText";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import { observer } from "mobx-react-lite";
import store from "@/store";
import { CHAMPIONS_FORMAT } from "@/shared/formats";
import {
  GENERATION_GAMES,
  GENERATIONS,
  generationLabel,
  isGeneration,
} from "@/shared/generations";

const CHAMPIONS = "champions";

// Gen 9 · Champions first, as its own generation, then Gen 9 down to Gen 1
const OPTIONS = [
  {
    value: CHAMPIONS,
    label: "Gen 9 · Champions",
    short: "Gen 9 (Champions)",
    games: "Pokemon Champions",
  },
  ...GENERATIONS.map(generation => ({
    value: `${generation}`,
    label: generationLabel(generation),
    short: `${generationLabel(generation)} (${GENERATION_GAMES[generation].short})`,
    games: GENERATION_GAMES[generation].games,
  })),
];

// The current team's generation, with the Pokemon Champions format as a generation of its own
const GenerationSelect = observer(function GenerationSelect() {
  const { generation, format } = store.currentTeam;
  const value = format === CHAMPIONS_FORMAT ? CHAMPIONS : `${generation}`;

  const handleChange = (value: string) => {
    const team = store.currentTeam;
    if (value === CHAMPIONS) {
      team.generation = 9;
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
      label="Generation"
      value={value}
      onChange={event => handleChange(event.target.value)}
      fullWidth
      slotProps={{
        select: {
          renderValue: selected =>
            OPTIONS.find(option => option.value === selected)?.short,
          MenuProps: { slotProps: { paper: { sx: { maxHeight: 400 } } } },
        },
        htmlInput: { "aria-label": "Generation" },
      }}
    >
      {OPTIONS.map(({ value, label, games }) => (
        <MenuItem key={value} value={value}>
          <ListItemText primary={label} secondary={games} />
        </MenuItem>
      ))}
    </TextField>
  );
});

export default GenerationSelect;
