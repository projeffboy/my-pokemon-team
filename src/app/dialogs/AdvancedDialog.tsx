import { useId, useLayoutEffect, useState } from "react";
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
import InputAdornment from "@mui/material/InputAdornment";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import MaleIcon from "@mui/icons-material/Male";
import FemaleIcon from "@mui/icons-material/Female";
import { observer } from "mobx-react-lite";
import store from "@/store";
import { type Gender, type TeamPokemon } from "@/types";
import natures from "@/data/natures";
import { allNatureIds } from "@/shared/names";
import { CHAMPIONS_FORMAT } from "@/shared/formats";
import { nicknameLimit, shortenNickname } from "@/shared/nickname";
import {
  DEFAULT_LEVEL,
  DEFAULT_HAPPINESS,
  genderOptions,
  MAX_LEVEL,
  MAX_HAPPINESS,
  setDetail,
  TERA_TYPES,
} from "@/shared/set-details";
import PokemonIcon from "@/app/shared/PokemonIcon";
import { useIsSmDown } from "@/app/shared/WidthContext";
import { useTranslation } from "@/app/shared/TranslationContext";
import NumberField from "./advanced-dialog/NumberField";
import TrainingFields from "./advanced-dialog/TrainingFields";
import {
  generationRules,
  gen2Dvs,
  dvGender,
  isShinyDv,
  setLegacyShiny,
} from "@/shared/generation-rules";

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
  const { t, names, locale } = useTranslation();
  const close = () => store.closeDialog();
  const name = names.pokemon(member.name);
  const genders = genderOptions(member.name);
  const { generation, format } = store.currentTeam;
  const champions = format === CHAMPIONS_FORMAT;
  const rules = generationRules(generation, format);
  const maxNicknameLength = nicknameLimit(generation, locale);
  const [nicknameLimitAttempted, setNicknameLimitAttempted] = useState(false);
  const nicknameTooLong = (member.nickname?.length ?? 0) > maxNicknameLength;
  const dvMember = generation === 2 ? gen2Dvs(member) : member;
  const gender =
    generation === 2 ?
      dvGender(dvMember)
    : (member.gender ?? (genders.length === 1 ? genders[0] : "") ?? "");
  const genderIcon =
    gender === "M" ? <MaleIcon />
    : gender === "F" ? <FemaleIcon />
    : null;
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
            {name}
          </Typography>
        </Box>
        <IconButton aria-label={t.close} onClick={close} edge="end">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ pt: 1 }}>
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 2,
              alignItems: "flex-start",
              "& > *": { minWidth: 0 },
            }}
          >
            <TextField
              sx={{
                flex: "0 1 auto",
                width: `max(128px, ${maxNicknameLength + 6}ch)`,
                maxWidth: "100%",
              }}
              label={t.advanced.nickname}
              placeholder={name}
              value={member.nickname ?? ""}
              // Trimmed when editing ends, so a space between words can be typed
              onChange={event => {
                const nickname = event.target.value.trimStart();
                setNicknameLimitAttempted(nickname.length > maxNicknameLength);
                setDetail(
                  member,
                  "nickname",
                  shortenNickname(nickname, maxNicknameLength),
                );
              }}
              onBlur={() =>
                setDetail(member, "nickname", member.nickname?.trim())
              }
              error={nicknameTooLong || nicknameLimitAttempted}
              helperText={
                nicknameTooLong ?
                  t.validation.nicknameTooLong(name, maxNicknameLength)
                : nicknameLimitAttempted ?
                  t.advanced.nicknameLimit(maxNicknameLength)
                : undefined
              }
              slotProps={{ formHelperText: { role: "status" } }}
            />
            {!champions && (
              <NumberField
                label={t.advanced.level}
                value={member.level ?? DEFAULT_LEVEL}
                onChange={(value = DEFAULT_LEVEL) => {
                  const level = clamp(value, MAX_LEVEL);
                  setDetail(
                    member,
                    "level",
                    level === DEFAULT_LEVEL || level < 1 ? undefined : level,
                  );
                }}
                slotProps={{ htmlInput: { min: 1, max: MAX_LEVEL } }}
                sx={{ flex: "0 0 80px" }}
              />
            )}
            {rules.gender && (
              <TextField
                select
                disabled={generation === 2}
                label={t.advanced.gender}
                value={gender}
                onChange={event =>
                  setDetail(member, "gender", event.target.value as Gender | "")
                }
                fullWidth
                sx={{ flex: "1 1 144px" }}
                slotProps={{
                  inputLabel: { shrink: true },
                  select: { displayEmpty: true },
                  input: {
                    startAdornment: genderIcon && (
                      <InputAdornment position="start">
                        {genderIcon}
                      </InputAdornment>
                    ),
                  },
                }}
              >
                <MenuItem value="">{t.any}</MenuItem>
                {genders.map(gender => (
                  <MenuItem key={gender} value={gender}>
                    {t.genders[gender]}
                  </MenuItem>
                ))}
              </TextField>
            )}
            {rules.happiness && (
              <NumberField
                label={t.advanced.happiness}
                value={member.happiness ?? DEFAULT_HAPPINESS}
                onChange={(value = DEFAULT_HAPPINESS) => {
                  const happiness = clamp(value, MAX_HAPPINESS);
                  setDetail(
                    member,
                    "happiness",
                    happiness === DEFAULT_HAPPINESS ? undefined : happiness,
                  );
                }}
                slotProps={{ htmlInput: { min: 0, max: MAX_HAPPINESS } }}
                sx={{ flex: "0 0 112px" }}
              />
            )}
            {rules.tera && (
              <TextField
                select
                label={t.advanced.teraType}
                value={member.teraType ?? ""}
                onChange={event =>
                  setDetail(member, "teraType", event.target.value)
                }
                fullWidth
                sx={{ flex: "1 1 120px" }}
              >
                <MenuItem value="">{t.none}</MenuItem>
                {TERA_TYPES.map(type => (
                  <MenuItem key={type} value={type}>
                    {names.type(type)}
                  </MenuItem>
                ))}
              </TextField>
            )}
            {rules.shiny && (
              <FormControlLabel
                sx={{ flexShrink: 0, alignSelf: "center", m: 0 }}
                control={
                  <Checkbox
                    checked={
                      generation === 2 ? isShinyDv(dvMember) : !!member.shiny
                    }
                    onChange={event =>
                      generation === 2 ?
                        setLegacyShiny(member, event.target.checked)
                      : setDetail(member, "shiny", event.target.checked)
                    }
                  />
                }
                label={t.advanced.shiny}
              />
            )}
            {rules.nature && (
              <TextField
                select
                sx={{
                  flex: "1 1",
                  flexBasis: { xxs: champions ? "100%" : 156, xs: 220 },
                }}
                label={champions ? t.advanced.statAlignment : t.advanced.nature}
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
            )}
          </Box>
          <TrainingFields
            member={member}
            generation={generation}
            format={format}
            teamIndex={teamIndex}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            if (store.dialog?.teamId !== store.currentTeamId) return;
            store.resetDetails(teamIndex);
            setNicknameLimitAttempted(false);
          }}
        >
          {t.reset}
        </Button>
        <Button onClick={close}>{t.done}</Button>
      </DialogActions>
    </>
  );
});

// A slot's set details: a bottom sheet on phones, a dialog elsewhere
const AdvancedDialog = observer(function AdvancedDialog() {
  const titleId = useId();
  const isSmDown = useIsSmDown();
  const { dialog, currentTeamId } = store;
  const teamIndex = dialog?.teamIndex ?? 0;
  const member = store.team[teamIndex];
  const requested = dialog?.name === "advanced";
  const isOpen = requested && dialog.teamId === currentTeamId && !!member?.name;
  useLayoutEffect(() => {
    if (requested && !isOpen) store.closeDialog();
  }, [requested, isOpen]);
  const close = () => store.closeDialog();
  const form = isOpen && member && (
    <AdvancedForm
      key={teamIndex}
      member={member}
      teamIndex={teamIndex}
      titleId={titleId}
    />
  );

  return isSmDown ?
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
        <Box
          aria-hidden="true"
          sx={{
            width: 36,
            height: 4,
            borderRadius: 2,
            bgcolor: "action.disabled",
            mx: "auto",
            mt: 1,
            flexShrink: 0,
          }}
        />
        {form}
      </Drawer>
    : <Dialog
        open={isOpen}
        onClose={close}
        aria-labelledby={titleId}
        fullWidth
        maxWidth="sm"
      >
        {form}
      </Dialog>;
});

export default AdvancedDialog;
