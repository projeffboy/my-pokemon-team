import { useId, useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import Stack from "@mui/material/Stack";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import { observer } from "mobx-react-lite";
import store from "@/store";
import {
  STAT_KEYS,
  type MoveSortOrder,
  type SortKey,
  type StatKey,
} from "@/types";
import { SORT_KEYS } from "@/store/sorting";
import { useTranslation } from "@/app/shared/TranslationContext";

const isStat = (key: SortKey): key is StatKey =>
  STAT_KEYS.includes(key as StatKey);

// Independent sorting for the Pokemon and Move dropdowns
const SortDialog = observer(function SortDialog() {
  const { t } = useTranslation();
  const titleId = useId();
  const [tab, setTab] = useState<"pokemon" | "moves">("pokemon");
  const sort = tab === "moves" ? store.moveSort : store.sort;
  const label = (key: SortKey) =>
    isStat(key) ?
      store.currentTeam.generation === 1 && key === "spa" ?
        t.info.special
      : t.statFullNames[key]
    : t.sort[key];
  const isOpen = store.dialog?.name === "sort";
  const close = () => store.closeDialog();

  return (
    <Dialog
      open={isOpen}
      onClose={close}
      aria-labelledby={titleId}
      fullWidth
      maxWidth="xs"
    >
      <DialogTitle id={titleId}>{t.team.sort}</DialogTitle>
      <DialogContent>
        <Tabs
          value={tab}
          onChange={(_event, value: "pokemon" | "moves") => setTab(value)}
          aria-label={t.team.sort}
          variant="fullWidth"
          sx={{ mb: 2 }}
        >
          <Tab
            value="pokemon"
            label={t.sort.pokemon}
            id={`${titleId}-pokemon`}
            aria-controls={`${titleId}-panel`}
          />
          <Tab
            value="moves"
            label={t.filters.moves}
            id={`${titleId}-moves`}
            aria-controls={`${titleId}-panel`}
          />
        </Tabs>
        <Stack
          spacing={2}
          role="tabpanel"
          id={`${titleId}-panel`}
          aria-labelledby={`${titleId}-${tab}`}
        >
          <FormControl>
            <FormLabel id={`${titleId}-by`}>{t.sort.sortBy}</FormLabel>
            <RadioGroup
              aria-labelledby={`${titleId}-by`}
              value={sort.by}
              onChange={event => {
                if (tab === "moves")
                  store.moveSort.by = event.target.value as MoveSortOrder["by"];
                else store.sort.by = event.target.value as SortKey;
              }}
              sx={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                ...(tab === "pokemon" && {
                  "& > :nth-of-type(-n + 4)": { gridColumn: "1 / -1" },
                }),
              }}
            >
              {tab === "moves" ?
                ["name", "type"].map(key => (
                  <FormControlLabel
                    key={key}
                    value={key}
                    control={<Radio size="small" />}
                    label={key === "type" ? t.filters.type : t.sort.name}
                  />
                ))
              : SORT_KEYS.filter(
                  key => store.currentTeam.generation !== 1 || key !== "spd",
                ).map(key => (
                  <FormControlLabel
                    key={key}
                    value={key}
                    control={<Radio size="small" />}
                    label={label(key)}
                  />
                ))
              }
            </RadioGroup>
          </FormControl>
          <FormControl>
            <FormLabel id={`${titleId}-order`} sx={{ mb: 1 }}>
              {t.sort.order}
            </FormLabel>
            <ToggleButtonGroup
              exclusive
              size="small"
              value={sort.descending ? "descending" : "ascending"}
              onChange={(_event, value: string | null) => {
                if (value) sort.descending = value === "descending";
              }}
              aria-labelledby={`${titleId}-order`}
            >
              <ToggleButton value="ascending">{t.sort.ascending}</ToggleButton>
              <ToggleButton value="descending">
                {t.sort.descending}
              </ToggleButton>
            </ToggleButtonGroup>
          </FormControl>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={close}>{t.done}</Button>
      </DialogActions>
    </Dialog>
  );
});

export default SortDialog;
