import { useState } from "react";
import GenerationValue from "./generation-select/GenerationValue";
import GenerationOption from "./generation-select/GenerationOption";
import GenerationTransferDialog from "@/app/shared/GenerationTransferDialog";
import { planGenerationTransfer } from "@/store/generation-transfer";
import { loadGenerationTransferData } from "@/shared/generation-transfer-data";
import {
  COMBINED_GENERATIONS_PROFILE,
  COMBINED_GENERATIONS_FORMAT,
} from "@/shared/generation-profile";
import type { SavedTeam, Generation, GenerationTransferData } from "@/types";
import Box from "@mui/material/Box";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import { observer } from "mobx-react-lite";
import store from "@/store";
import {
  CHAMPIONS_FORMAT,
  CHAMPIONS_GENERATION,
  formatForGeneration,
} from "@/shared/formats";
import {
  GENERATION_GAMES,
  GENERATIONS,
  isGeneration,
} from "@/shared/generations";
import { useTranslation } from "@/app/shared/TranslationContext";
import type { GameLogo } from "@/images/game-logos";
import { gameLogosFor } from "@/app/shared/game-logos";

import {
  COMING_SOON,
  GAME_VARIANTS,
  variantGeneration,
} from "@/shared/game-variants";

const CHAMPIONS = "champions";

type GenerationSelectOption = {
  value: string;
  label: string;
  short: string;
  full: string;
  compact?: string;
  logos: GameLogo[];
  disabled?: boolean;
  description?: string;
};

// The current team's generation, with the Pokemon Champions format as a generation of its own
const GenerationSelect = observer(function GenerationSelect() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [pending, setPending] = useState<{
    teamId: string;
    generation: Generation;
    format: string;
    generationProfile?: SavedTeam["generationProfile"];
    data: GenerationTransferData;
  } | null>(null);
  const { generation, format } = store.currentTeam;
  const value =
    store.currentTeam.generationProfile === COMBINED_GENERATIONS_PROFILE ?
      COMBINED_GENERATIONS_PROFILE
    : format === CHAMPIONS_FORMAT ? CHAMPIONS
    : variantGeneration(format) ? format
    : `${generation}`;

  // Combined generations first, then Champions and the individual games.
  const options: GenerationSelectOption[] = [
    {
      value: COMBINED_GENERATIONS_PROFILE,
      label: t.combinedGenerations.label,
      full: t.combinedGenerations.label,
      short: t.combinedGenerations.short,
      description: t.combinedGenerations.description,
      logos: [],
    },
    {
      value: CHAMPIONS,
      label: t.championsGeneration,
      short: t.championsGeneration,
      full: t.championsGeneration,
      logos: gameLogosFor(CHAMPIONS_GENERATION, CHAMPIONS_FORMAT),
    },
    ...GENERATIONS.flatMap(generation => [
      {
        value: `${generation}`,
        label: `${t.generation(generation)} · ${t.generationGames[generation]}`,
        short: `${t.generation(generation)} · ${GENERATION_GAMES[generation]}`,
        full: `${t.generation(generation)} · ${t.generationGames[generation]}`,
        logos: gameLogosFor(generation),
      },
      ...GAME_VARIANTS.filter(
        variant => variantGeneration(variant) === generation,
      ).map(variant => ({
        value: variant,
        disabled: COMING_SOON.includes(variant),
        compact:
          variant === "Let’s Go" ? undefined : (
            `${t.generation(generation)} · ${t.gameVariantsCompact[variant]}`
          ),
        label: `${t.generation(generation)} · ${t.gameVariants[variant]}`,
        short: `${t.generation(generation)} · ${
          variant === "Let’s Go" ? "LGPE"
          : variant === "Legends: Arceus" ? "PLA"
          : "Z-A"
        }`,
        full: `${t.generation(generation)} · ${t.gameVariants[variant]}`,
        logos: gameLogosFor(generation, variant),
      })),
    ]),
  ];

  const source = options.find(option => option.value === value);
  const handleChange = async (value: string) => {
    if (options.some(option => option.value === value && option.disabled))
      return;
    const generation =
      value === CHAMPIONS || value === COMBINED_GENERATIONS_PROFILE ?
        CHAMPIONS_GENERATION
      : (variantGeneration(value) ?? Number(value));
    if (!isGeneration(generation)) return;
    const teamId = store.currentTeamId;
    setLoading(true);
    try {
      const data = await loadGenerationTransferData();
      if (teamId !== store.currentTeamId) return;
      const team = store.currentTeam;
      const generationProfile =
        value === COMBINED_GENERATIONS_PROFILE ?
          COMBINED_GENERATIONS_PROFILE
        : undefined;
      const format =
        value === COMBINED_GENERATIONS_PROFILE ?
          formatForGeneration(
            team.format === CHAMPIONS_FORMAT || variantGeneration(team.format) ?
              ""
            : team.format,
            9,
          )
        : value === CHAMPIONS ? CHAMPIONS_FORMAT
        : variantGeneration(value) ? value
        : formatForGeneration(
            team.format === CHAMPIONS_FORMAT || variantGeneration(team.format) ?
              ""
            : team.format,
            generation,
          );
      const plan = planGenerationTransfer(
        team.team,
        team,
        generation,
        generationProfile ? COMBINED_GENERATIONS_FORMAT : format,
        data,
        store.locale,
      );
      if (plan.losses.length)
        setPending({
          teamId: team.id,
          generation,
          format,
          generationProfile,
          data,
        });
      else
        store.transferTeamGeneration(
          generation,
          format,
          plan.team,
          false,
          generationProfile,
        );
    } catch {
      store.openSnackbar(t.generationTransfer.loadFailed, false, "error");
    } finally {
      setLoading(false);
    }
  };
  const target = pending?.teamId === store.currentTeamId ? pending : null;
  const plan =
    target ?
      planGenerationTransfer(
        store.team,
        store.currentTeam,
        target.generation,
        target.generationProfile ? COMBINED_GENERATIONS_FORMAT : target.format,
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
        target.generationProfile,
      );
    setPending(null);
  };

  return (
    <>
      <Box sx={{ display: "grid", minWidth: 0, flexShrink: 1 }}>
        {/* Include room for the selected value's arrow without adding header height. */}
        {options.map(option => (
          <Box
            key={option.value}
            aria-hidden="true"
            sx={{
              gridArea: "1 / 1",
              visibility: "hidden",
              whiteSpace: "nowrap",
              height: 0,
              minWidth: 0,
              overflow: "hidden",
              pl: 2,
              pr: 4,
            }}
          >
            <GenerationOption
              label={option.label}
              logos={option.logos}
              status={option.disabled ? t.comingSoon : option.description}
              nowrap
              placeholders
            />
          </Box>
        ))}
        <TextField
          select
          disabled={loading}
          size="small"
          label={t.generationSelect}
          value={value}
          onChange={event => handleChange(event.target.value)}
          fullWidth
          // 48px tall, the touch target size
          sx={{
            gridArea: "1 / 1",
            minWidth: 0,
            "& .MuiSelect-select.MuiSelect-outlined": {
              py: "12.5px",
              overflow: "hidden",
              textOverflow: "clip",
            },
          }}
          slotProps={{
            select: {
              renderValue: selected => {
                const option = options.find(
                  option => option.value === selected,
                );
                return (
                  option && (
                    <GenerationValue
                      full={option.full}
                      compact={option.compact}
                      short={option.short}
                    />
                  )
                );
              },
              MenuProps: { slotProps: { paper: { sx: { maxHeight: 400 } } } },
            },
            htmlInput: { "aria-label": t.generationSelect },
          }}
        >
          {options.map(
            ({
              value,
              label,
              compact,
              short,
              logos,
              disabled,
              description,
            }) => (
              <MenuItem key={value} value={value} disabled={disabled}>
                <GenerationOption
                  label={label}
                  compact={compact}
                  short={short}
                  logos={logos}
                  status={disabled ? t.comingSoon : description}
                />
              </MenuItem>
            ),
          )}
        </TextField>
      </Box>
      {target && plan && (
        <GenerationTransferDialog
          team={store.team}
          fromGeneration={generation}
          fromFormat={format}
          toGeneration={target.generation}
          toFormat={target.format}
          hasCarryover={plan.team.some(member => member.name)}
          from={source?.compact ?? source?.short ?? t.generation(generation)}
          fromLogos={
            store.currentTeam.generationProfile ?
              []
            : gameLogosFor(generation, format)
          }
          toLogos={
            target.generationProfile ?
              []
            : gameLogosFor(target.generation, target.format)
          }
          where={
            target.generationProfile ? t.combinedGenerations.label
            : target.format === CHAMPIONS_FORMAT ?
              t.championsGeneration
            : variantGeneration(target.format) ?
              `${t.generation(target.generation)} · ${t.gameVariantsCompact[target.format as keyof typeof t.gameVariantsCompact] ?? t.gameVariants[target.format as keyof typeof t.gameVariants]}`
            : t.generation(target.generation)
          }
          games={
            (
              target.generationProfile ||
              target.format === CHAMPIONS_FORMAT ||
              variantGeneration(target.format)
            ) ?
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

export default GenerationSelect;
