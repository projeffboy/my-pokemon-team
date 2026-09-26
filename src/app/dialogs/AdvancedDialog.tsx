import { useId } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Drawer from "@mui/material/Drawer";
import FormControlLabel from "@mui/material/FormControlLabel";
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import Slider from "@mui/material/Slider";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import { observer } from "mobx-react-lite";
import store from "@/store";
import { STAT_KEYS, type Gender, type TeamPokemon } from "@/types";
import natures from "@/data/natures";
import { allNatureIds } from "@/shared/names";
import {
  DEFAULT_LEVEL,
  evTotal,
  genderOptions,
  getEv,
  getIv,
  MAX_EV,
  MAX_EV_TOTAL,
  MAX_IV,
  MAX_LEVEL,
  setDetail,
  setStat,
  TERA_TYPES,
} from "@/shared/set-details";
import PokemonIcon from "@/app/main/shared/PokemonIcon";
import { useBreakpoint } from "@/app/shared/WidthContext";
import { useTranslation } from "@/app/shared/TranslationContext";

const clamp = (value: number, max: number) =>
  Math.min(max, Math.max(0, Math.round(value)));

const AdvancedForm = observer(function AdvancedForm({
  member,
  teamIndex,
  titleId,
}: {
  member: TeamPokemon;
  teamIndex: number;
  titleId: string;
}) {
  const { t, names } = useTranslation();
  const close = () => store.closeDialog();
  const name = names.pokemon(member.name);
  const genders = genderOptions(member.name);
  const total = evTotal(member.evs);
  const natureLabel = (id: string) => {
    const { plus, minus } = natures[id] ?? {};
    return t.natureLabel(
      names.nature(id),
      plus && t.statNames[plus],
      minus && t.statNames[minus],
    );
  };

  return (
    <>
      <DialogTitle
        id={titleId}
        sx={{ display: "flex", alignItems: "center", gap: 1.5, pb: 1 }}
      >
        <PokemonIcon pokemonProperty="name" value={member.name} />
        <Box sx={{ flexGrow: 1, minWidth: 0 }}>
          {t.team.advanced}
          <Typography
            variant="body2"
            component="div"
            sx={{ color: "text.secondary" }}
          >
            {t.advanced.subtitle(name, teamIndex + 1)}
          </Typography>
        </Box>
        <IconButton aria-label={t.close} onClick={close} edge="end">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ pt: 1 }}>
          <TextField
            label={t.advanced.nickname}
            placeholder={name}
            value={member.nickname ?? ""}
            onChange={event =>
              setDetail(member, "nickname", event.target.value.trim())
            }
            slotProps={{ htmlInput: { maxLength: 18 } }}
            fullWidth
          />
          <Stack direction="row" spacing={1.5}>
            <TextField
              label={t.advanced.level}
              type="number"
              value={member.level ?? DEFAULT_LEVEL}
              onChange={event => {
                const level = clamp(Number(event.target.value), MAX_LEVEL);
                setDetail(
                  member,
                  "level",
                  level === DEFAULT_LEVEL || level < 1 ? undefined : level,
                );
              }}
              slotProps={{ htmlInput: { min: 1, max: MAX_LEVEL } }}
              sx={{ width: 90, flexShrink: 0 }}
            />
            <TextField
              select
              label={t.advanced.gender}
              value={member.gender ?? ""}
              onChange={event =>
                setDetail(member, "gender", event.target.value as Gender | "")
              }
              fullWidth
            >
              <MenuItem value="">{t.any}</MenuItem>
              {genders.map(gender => (
                <MenuItem key={gender} value={gender}>
                  {t.genders[gender]}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              select
              label={t.advanced.teraType}
              value={member.teraType ?? ""}
              onChange={event =>
                setDetail(member, "teraType", event.target.value)
              }
              fullWidth
            >
              <MenuItem value="">{t.none}</MenuItem>
              {TERA_TYPES.map(type => (
                <MenuItem key={type} value={type}>
                  {names.type(type)}
                </MenuItem>
              ))}
            </TextField>
          </Stack>
          <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
            <TextField
              select
              label={t.advanced.nature}
              value={member.nature ?? ""}
              onChange={event =>
                setDetail(member, "nature", event.target.value)
              }
              fullWidth
            >
              <MenuItem value="">{t.none}</MenuItem>
              {allNatureIds.map(nature => (
                <MenuItem key={nature} value={nature}>
                  {natureLabel(nature)}
                </MenuItem>
              ))}
            </TextField>
            <FormControlLabel
              sx={{ flexShrink: 0, mr: 0 }}
              control={
                <Checkbox
                  checked={!!member.shiny}
                  onChange={event =>
                    setDetail(member, "shiny", event.target.checked)
                  }
                />
              }
              label={t.advanced.shiny}
            />
          </Stack>
          <Box>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography variant="subtitle2" component="h3">
                {t.advanced.evs}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: total > MAX_EV_TOTAL ? "error.main" : "text.secondary",
                }}
                aria-label={t.advanced.evTotal(total, MAX_EV_TOTAL)}
              >
                {total} / {MAX_EV_TOTAL}
              </Typography>
            </Box>
            {STAT_KEYS.map(stat => {
              const id = `ev-${stat}-${teamIndex}`;
              return (
                <Box
                  key={stat}
                  sx={{ display: "flex", alignItems: "center", gap: 1.5 }}
                >
                  <Typography
                    component="label"
                    htmlFor={id}
                    variant="body2"
                    sx={{ width: 32, flexShrink: 0 }}
                  >
                    {t.statNames[stat]}
                  </Typography>
                  <Slider
                    id={id}
                    size="small"
                    min={0}
                    max={MAX_EV}
                    step={4}
                    value={getEv(member.evs, stat)}
                    onChange={(_event, value) =>
                      setStat(member, "evs", stat, clamp(value, MAX_EV))
                    }
                    aria-label={t.advanced.statEvs(t.statNames[stat])}
                  />
                  <Typography
                    variant="body2"
                    sx={{ width: 28, textAlign: "right", flexShrink: 0 }}
                  >
                    {getEv(member.evs, stat)}
                  </Typography>
                </Box>
              );
            })}
          </Box>
          <Box>
            <Typography variant="subtitle2" component="h3" sx={{ mb: 1 }}>
              {t.advanced.ivs}
            </Typography>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: 1,
              }}
            >
              {STAT_KEYS.map(stat => (
                <TextField
                  key={stat}
                  size="small"
                  type="number"
                  label={t.statNames[stat]}
                  value={getIv(member.ivs, stat)}
                  onChange={event =>
                    setStat(
                      member,
                      "ivs",
                      stat,
                      clamp(Number(event.target.value), MAX_IV),
                    )
                  }
                  slotProps={{
                    htmlInput: {
                      min: 0,
                      max: MAX_IV,
                      "aria-label": t.advanced.statIvs(t.statNames[stat]),
                    },
                  }}
                />
              ))}
            </Box>
          </Box>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => store.resetDetails(teamIndex)}>{t.reset}</Button>
        <Button onClick={close}>{t.done}</Button>
      </DialogActions>
    </>
  );
});

// A slot's set details: a bottom sheet on phones, a dialog elsewhere
const AdvancedDialog = observer(function AdvancedDialog() {
  const titleId = useId();
  const isXs = useBreakpoint() === "xs";
  const { dialog } = store;
  const teamIndex = dialog?.teamIndex ?? 0;
  const member = store.team[teamIndex];
  const isOpen = dialog?.name === "advanced" && !!member?.name;
  const close = () => store.closeDialog();
  const form = isOpen && member && (
    <AdvancedForm
      key={teamIndex}
      member={member}
      teamIndex={teamIndex}
      titleId={titleId}
    />
  );

  return isXs ?
      <Drawer
        anchor="bottom"
        open={isOpen}
        onClose={close}
        slotProps={{
          paper: {
            role: "dialog",
            "aria-labelledby": titleId,
            sx: { borderRadius: "16px 16px 0 0", maxHeight: "92dvh" },
          },
        }}
      >
        {form}
      </Drawer>
    : <Dialog
        open={isOpen}
        onClose={close}
        aria-labelledby={titleId}
        fullWidth
        maxWidth="xs"
      >
        {form}
      </Dialog>;
});

export default AdvancedDialog;
