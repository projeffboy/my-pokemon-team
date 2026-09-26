import { useId } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import { observer } from "mobx-react-lite";
import store from "@/store";
import { POKEMON_TYPES, type SearchFilterKey } from "@/types";
import { FORMATS } from "@/shared/formats";
import { allAbilities } from "@/shared/names";

const REGIONS = [
  "Kanto",
  "Johto",
  "Hoenn",
  "Sinnoh",
  "Unova",
  "Kalos",
  "Alola",
  "Galar",
  "Hisui",
  "Paldea",
];

const SELECTS: {
  key: SearchFilterKey;
  label: string;
  options: readonly string[];
}[] = [
  { key: "type", label: "Type", options: POKEMON_TYPES },
  { key: "region", label: "Region", options: REGIONS },
  { key: "moves", label: "Moves", options: ["Viable"] },
];

// Narrows the Name dropdown of every slot. The format is the team's own setting.
const FiltersDialog = observer(function FiltersDialog() {
  const titleId = useId();
  const isOpen = store.dialog?.name === "filters";
  const close = () => store.closeDialog();

  const clear = () => {
    store.currentTeam.format = "";
    store.filters = { type: "", region: "", ability: "", moves: "" };
  };

  return (
    <Dialog
      open={isOpen}
      onClose={close}
      aria-labelledby={titleId}
      fullWidth
      maxWidth="xs"
    >
      <DialogTitle id={titleId}>Filters</DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ mb: 2 }}>
          Narrows the Name dropdown for every slot.
        </DialogContentText>
        <Stack spacing={2.5} sx={{ pt: 0.5 }}>
          <TextField
            select
            label="Format"
            value={store.currentTeam.format}
            onChange={event => (store.currentTeam.format = event.target.value)}
            fullWidth
          >
            <MenuItem value="">All</MenuItem>
            {FORMATS.map(format => (
              <MenuItem key={format} value={format}>
                {format}
              </MenuItem>
            ))}
          </TextField>
          {SELECTS.map(({ key, label, options }) => (
            <TextField
              key={key}
              select
              label={label}
              value={store.filters[key]}
              onChange={event => (store.filters[key] = event.target.value)}
              fullWidth
            >
              <MenuItem value="">All</MenuItem>
              {options.map(option => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
          ))}
          <Autocomplete
            options={allAbilities}
            value={store.filters.ability || null}
            onChange={(_event, value) => (store.filters.ability = value ?? "")}
            renderInput={params => (
              <TextField {...params} label="Ability" placeholder="Any" />
            )}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={clear}>Clear</Button>
        <Button onClick={close}>Done</Button>
      </DialogActions>
    </Dialog>
  );
});

export default FiltersDialog;
