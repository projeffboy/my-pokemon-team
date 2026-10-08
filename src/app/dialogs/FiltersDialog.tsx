import { useId, useMemo, useState } from "react";
import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import { observer } from "mobx-react-lite";
import store from "@/store";
import { isPokemonType, type SearchFilterKey } from "@/types";
import { typesIn } from "@/shared/generation-data";
import {
  CHAMPIONS_FORMAT,
  formatsForGeneration,
  formatGeneration,
} from "@/shared/formats";
import { variantGeneration } from "@/shared/game-variants";
import { GENERATION_GAMES } from "@/shared/generations";
import { REGIONS } from "@/shared/regions";
import { useTranslation } from "@/app/shared/TranslationContext";
import { loadGenerationTransferData } from "@/shared/generation-transfer-data";
import { planGenerationTransfer } from "@/store/generation-transfer";
import GenerationTransferDialog from "@/app/shared/GenerationTransferDialog";
import { gameLogosFor } from "@/app/shared/game-logos";
import type { Generation, GenerationTransferData } from "@/types";
import typeIcons from "@/images/type-icons";

// Narrows the Name dropdown of every slot. The format is the team's own setting.
const FiltersDialog = observer(function FiltersDialog() {
  const { t, names, locale } = useTranslation();
  const [pending, setPending] = useState<{
    teamId: string;
    generation: Generation;
    format: string;
    data: GenerationTransferData;
  } | null>(null);
  const changeFormat = async (format: string) => {
    const teamId = store.currentTeamId;
    if (
      format !== CHAMPIONS_FORMAT &&
      store.currentTeam.format !== CHAMPIONS_FORMAT
    ) {
      store.currentTeam.format = format;
      return;
    }
    try {
      const data = await loadGenerationTransferData();
      if (store.currentTeamId !== teamId) return;
      const team = store.currentTeam;
      const generation = formatGeneration(format, team.generation);
      const plan = planGenerationTransfer(
        team.team,
        team,
        generation,
        format,
        data,
        store.locale,
      );
      if (plan.losses.length)
        setPending({ teamId: team.id, generation, format, data });
      else store.transferTeamGeneration(generation, format, plan.team, false);
    } catch {
      store.openSnackbar(t.generationTransfer.loadFailed, false, "error");
    }
  };
  const target = pending?.teamId === store.currentTeamId ? pending : null;
  const plan =
    target ?
      planGenerationTransfer(
        store.team,
        store.currentTeam,
        target.generation,
        target.format,
        target.data,
        store.locale,
      )
    : null;
  const apply = (newTeam: boolean) => {
    if (target && plan)
      store.transferTeamGeneration(
        target.generation,
        target.format,
        plan.team,
        newTeam,
      );
    setPending(null);
  };
  const availableAbilities = store.filterAbilities;
  const abilities = useMemo(
    () =>
      [...availableAbilities].sort((a, b) =>
        names.ability(a).localeCompare(names.ability(b), locale),
      ),
    [names, locale, availableAbilities],
  );
  // Typing matches the ability in the current language or in English
  const filterAbilities = useMemo(
    () =>
      createFilterOptions<string>({
        stringify: ability => `${names.ability(ability)} ${ability}`,
      }),
    [names],
  );
  const titleId = useId();
  const isOpen = store.dialog?.name === "filters";
  const close = () => store.closeDialog();
  const formats = formatsForGeneration(store.currentTeam.generation);

  // The filter values stay English; only their labels are translated
  const selects: {
    key: SearchFilterKey;
    label: string;
    options: readonly { value: string; label: string }[];
  }[] = [
    {
      key: "type",
      label: t.filters.type,
      options: typesIn(store.currentTeam.generation).map(type => ({
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
    if (!variantGeneration(store.currentTeam.format)) void changeFormat("");
    store.filters = { type: "", region: "", ability: "", moves: "" };
  };

  const renderSelect = ({ key, label, options }: (typeof selects)[number]) => (
    <TextField
      key={key}
      select
      label={label}
      // The team's generation may no longer have the chosen type
      value={
        options.some(option => option.value === store.filters[key]) ?
          store.filters[key]
        : ""
      }
      onChange={event => (store.filters[key] = event.target.value)}
      fullWidth
    >
      <MenuItem value="">{key === "moves" ? t.all : t.any}</MenuItem>
      {options.map(({ value, label }) => (
        <MenuItem key={value} value={value}>
          {key === "type" && isPokemonType(value) ?
            <Box
              component="span"
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 1,
                verticalAlign: "middle",
              }}
            >
              <Box
                component="img"
                src={typeIcons[value]}
                alt=""
                aria-hidden="true"
                sx={{ width: 20, height: 20, flexShrink: 0 }}
              />
              {label}
            </Box>
          : label}
        </MenuItem>
      ))}
    </TextField>
  );

  return (
    <>
      <Dialog
        open={isOpen}
        onClose={close}
        aria-labelledby={titleId}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle id={titleId}>{t.team.filters}</DialogTitle>
        <DialogContent>
          <Stack spacing={2.5} sx={{ pt: 0.5 }}>
            {!variantGeneration(store.currentTeam.format) && (
              <TextField
                select
                label={t.filters.format}
                value={store.currentTeam.format}
                onChange={event => changeFormat(event.target.value)}
                fullWidth
              >
                <MenuItem value="">{t.all}</MenuItem>
                {store.currentTeam.format &&
                  !formats.includes(store.currentTeam.format) && (
                    <MenuItem value={store.currentTeam.format} disabled>
                      {store.currentTeam.format}
                    </MenuItem>
                  )}
                {formats.map(format => (
                  <MenuItem key={format} value={format}>
                    {format}
                  </MenuItem>
                ))}
              </TextField>
            )}
            {selects.slice(0, 2).map(renderSelect)}
            {store.rules.abilities && (
              <Autocomplete
                options={abilities}
                getOptionLabel={names.ability}
                filterOptions={filterAbilities}
                value={store.filters.ability || null}
                onChange={(_event, value) =>
                  (store.filters.ability = value ?? "")
                }
                renderInput={params => (
                  <TextField
                    {...params}
                    label={t.filters.ability}
                    placeholder={t.any}
                  />
                )}
              />
            )}
            {selects.slice(2).map(renderSelect)}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={clear}>{t.clear}</Button>
          <Button onClick={close}>{t.done}</Button>
        </DialogActions>
      </Dialog>
      {target && plan && (
        <GenerationTransferDialog
          team={store.team}
          fromGeneration={store.currentTeam.generation}
          fromFormat={store.currentTeam.format}
          toGeneration={target.generation}
          toFormat={target.format}
          hasCarryover={plan.team.some(member => member.name)}
          fromLogos={gameLogosFor(
            store.currentTeam.generation,
            store.currentTeam.format,
          )}
          toLogos={gameLogosFor(target.generation, target.format)}
          from={
            store.currentTeam.format === CHAMPIONS_FORMAT ?
              t.championsGeneration
            : `${t.generation(store.currentTeam.generation)} · ${
                variantGeneration(store.currentTeam.format) ?
                  t.gameVariants[
                    store.currentTeam.format as keyof typeof t.gameVariants
                  ]
                : GENERATION_GAMES[store.currentTeam.generation]
              }`
          }
          where={
            target.format === CHAMPIONS_FORMAT ?
              t.championsGeneration
            : t.generation(target.generation)
          }
          games={
            target.format === CHAMPIONS_FORMAT ?
              undefined
            : GENERATION_GAMES[target.generation]
          }
          losses={plan.losses}
          onCancel={() => setPending(null)}
          onModify={() => apply(false)}
          onNew={() => apply(true)}
        />
      )}
    </>
  );
});

export default FiltersDialog;
