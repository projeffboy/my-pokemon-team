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
import { REGIONS } from "@/shared/regions";
import { useTranslation } from "@/app/shared/TranslationContext";

// Narrows the Name dropdown of every slot. The format is the team's own setting.
const FiltersDialog = observer(function FiltersDialog() {
  const { t, names } = useTranslation();
  const titleId = useId();
  const isOpen = store.dialog?.name === "filters";
  const close = () => store.closeDialog();

  // The filter values stay English; only their labels are translated
  const selects: {
    key: SearchFilterKey;
    label: string;
    options: readonly { value: string; label: string }[];
  }[] = [
    {
      key: "type",
      label: t.filters.type,
      options: POKEMON_TYPES.map(type => ({
        value: type,
        label: names.type(type),
      })),
    },
    {
      key: "region",
      label: t.filters.region,
      options: REGIONS.map(region => ({
        value: region,
        label: names.region(region),
      })),
    },
    {
      key: "moves",
      label: t.filters.moves,
      options: [{ value: "Viable", label: t.filters.viable }],
    },
  ];

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
      <DialogTitle id={titleId}>{t.team.filters}</DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ mb: 2 }}>
          {t.filters.description}
        </DialogContentText>
        <Stack spacing={2.5} sx={{ pt: 0.5 }}>
          <TextField
            select
            label={t.filters.format}
            value={store.currentTeam.format}
            onChange={event => (store.currentTeam.format = event.target.value)}
            fullWidth
          >
            <MenuItem value="">{t.all}</MenuItem>
            {FORMATS.map(format => (
              <MenuItem key={format} value={format}>
                {format}
              </MenuItem>
            ))}
          </TextField>
          {selects.map(({ key, label, options }) => (
            <TextField
              key={key}
              select
              label={label}
              value={store.filters[key]}
              onChange={event => (store.filters[key] = event.target.value)}
              fullWidth
            >
              <MenuItem value="">{t.all}</MenuItem>
              {options.map(({ value, label }) => (
                <MenuItem key={value} value={value}>
                  {label}
                </MenuItem>
              ))}
            </TextField>
          ))}
          <Autocomplete
            options={allAbilities}
            getOptionLabel={names.ability}
            value={store.filters.ability || null}
            onChange={(_event, value) => (store.filters.ability = value ?? "")}
            renderInput={params => (
              <TextField
                {...params}
                label={t.filters.ability}
                placeholder={t.any}
              />
            )}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={clear}>{t.clear}</Button>
        <Button onClick={close}>{t.done}</Button>
      </DialogActions>
    </Dialog>
  );
});

export default FiltersDialog;
