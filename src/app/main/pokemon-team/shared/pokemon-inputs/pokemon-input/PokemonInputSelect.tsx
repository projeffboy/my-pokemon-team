import { useEffect, useMemo, useRef, useState } from "react";
import Autocomplete, {
  autocompleteClasses,
  createFilterOptions,
} from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useListRef } from "react-window";
import { observer } from "mobx-react-lite";
import store from "@/store";
import VirtualizedListbox, {
  gridColumns,
  VirtualizedListboxContext,
} from "./pokemon-input-select/VirtualizedListbox";
import PokemonIcon from "@/app/shared/PokemonIcon";
import HiddenAbilityLabel from "./pokemon-input-select/HiddenAbilityLabel";
import { isHiddenAbility } from "@/shared/pokedex";
import { moveTypeIn } from "@/shared/generation-data";
import { englishNames, type Names } from "@/i18n/names";
import { useTranslation } from "@/app/shared/TranslationContext";
import typeIcons from "@/images/type-icons";
import { TYPE_COLORS, TYPE_TEXT_COLORS } from "@/app/shared/type-colors";
import { useTypeIcons } from "@/app/main/shared/TypeIconContext";
import { isPokemonType } from "@/types";

const ITEM_ICON_CLASS = "item-icon";
// The Name list fits Venusaur-Gmax on one line: 4px of padding, a 40px icon,
// 2px, the name at 16px Roboto (114px), 4px, and 4px of slack for font
// rendering; longer names wrap
// Space kept between the popup and the edge of the screen
const POPUP_MARGIN = 8;
const NAME_LIST_WIDTH = 168;
// At a 400px viewport: 32px page padding, 16px card padding, and an 8px column gap.
const SMALL_PHONE_LIST_WIDTH = (400 - 32 - 16 - 8) / 2;
const MIN_TEXT_LIST_WIDTH = (360 - 32 - 16 - 8) / 2;

interface SelectOption {
  value: string;
  label: string;
}

// Typing matches the label in the current language or the English name
const optionName = (names: Names, pokemonProperty: string, value: string) =>
  pokemonProperty === "name" ? names.pokemon(value)
  : pokemonProperty === "item" ? names.item(value)
  : pokemonProperty === "ability" ? names.ability(value)
  : names.move(value);

const PokemonInputSelect = observer(function PokemonInputSelect({
  optionValues,
  optionLabels,
  placeholder,
  pokemonProperty,
  teamIndex,
  value,
  onChange,
  leadingIcon = false,
}: {
  optionValues: readonly string[];
  optionLabels: readonly string[];
  placeholder: string;
  pokemonProperty: string;
  teamIndex: number;
  value: string;
  onChange: (value: string) => void;
  // Shows a move's type or the item's icon before the text, instead of the
  // item's icon after it
  leadingIcon?: boolean;
}) {
  const { t, names } = useTranslation();
  const hasTypeIcons = useTypeIcons();
  const rootRef = useRef<HTMLDivElement>(null);
  const [rootWidth, setRootWidth] = useState<number>();
  const [popupMaxHeight, setPopupMaxHeight] = useState<number>();
  const [isOpen, setIsOpen] = useState(false);
  // The popup opens above or below the input, whichever has more room, and
  // keeps to it rather than running off the screen
  const measure = () => {
    const root = rootRef.current;
    if (!root) return;
    const { top, bottom } = root.getBoundingClientRect();
    const viewport = window.visualViewport;
    const viewportTop = viewport?.offsetTop ?? 0;
    const viewportBottom =
      viewportTop + (viewport?.height ?? window.innerHeight);
    setRootWidth(root.clientWidth);
    setPopupMaxHeight(
      Math.max(top - viewportTop, viewportBottom - bottom) - POPUP_MARGIN,
    );
  };
  // The on-screen keyboard shrinks the viewport once the input has focus
  useEffect(() => {
    if (!isOpen) return;
    const viewport = window.visualViewport;
    viewport?.addEventListener("resize", measure);
    window.addEventListener("resize", measure);
    return () => {
      viewport?.removeEventListener("resize", measure);
      window.removeEventListener("resize", measure);
    };
  }, [isOpen]);
  const filterOptions = useMemo(
    () =>
      createFilterOptions<SelectOption>({
        stringify: option =>
          `${option.label} ${optionName(englishNames, pokemonProperty, option.value)}`,
      }),
    [pokemonProperty],
  );
  // Stable while the options and value are, since a new value object makes the
  // Autocomplete reset the text being typed (e.g. when the list view changes)
  const options: SelectOption[] = useMemo(
    () =>
      optionValues.map((optionValue, i) => ({
        value: optionValue,
        label: optionLabels[i] || "",
      })),
    [optionValues, optionLabels],
  );
  const selectedOption = useMemo(
    () =>
      value ?
        (options.find(option => option.value === value) ?? {
          value,
          label: optionName(names, pokemonProperty, value),
        })
      : null,
    [options, value, names, pokemonProperty],
  );
  const id = `react-select-single-${teamIndex}-${pokemonProperty}`;
  const isMove = pokemonProperty.startsWith("move");
  const missingPokemon =
    (isMove || pokemonProperty === "ability") && !store.team[teamIndex]?.name;
  const noOtherMoves = isMove && !missingPokemon && options.length === 0;
  const internalListRef = useListRef(null);
  const isGrid = pokemonProperty === "name" && store.nameView !== "list";
  const columns = isGrid ? gridColumns(store.nameView) : 1;
  // The grid of icons spans both of the card's columns, which are 8px apart
  const popperWidth =
    pokemonProperty !== "name" ? undefined
    : isGrid ? rootWidth && 2 * rootWidth + 8
    : NAME_LIST_WIDTH;

  // Scrolls the virtualized list to keep the keyboard-highlighted option in view
  // (guarded because the list may be closed/stale, e.g. after an auto-selected value)
  const handleHighlightChange = (
    event: React.SyntheticEvent,
    option: SelectOption | null,
  ) => {
    if (option && internalListRef.current) {
      const index = optionValues.indexOf(option.value);
      if (index !== -1) {
        try {
          internalListRef.current.scrollToRow({
            index: Math.floor(index / columns),
            align: "auto",
          });
        } catch {
          // Ignore: list wasn't mounted with this many rows (e.g. already closed)
        }
      }
    }
  };

  return (
    <VirtualizedListboxContext
      value={{
        pokemonProperty,
        showMoveTypes: leadingIcon && pokemonProperty.startsWith("move"),
        selectedValue: value,
        internalListRef,
        popupMaxHeight,
        nameListWidth: NAME_LIST_WIDTH,
      }}
    >
      <Autocomplete
        id={id}
        ref={rootRef}
        onOpen={() => {
          measure();
          setIsOpen(true);
        }}
        onClose={() => setIsOpen(false)}
        options={options}
        value={selectedOption}
        disableListWrap
        sx={{
          // Stops a wide item icon row from widening its grid column
          ...(pokemonProperty === "item" && { minWidth: 0 }),
          [`&.${autocompleteClasses.hasPopupIcon}.${autocompleteClasses.hasClearIcon} .${autocompleteClasses.inputRoot}`]:
            {
              pr: 0,
            },
          [`& .${autocompleteClasses.input}`]: {
            textOverflow: "clip",
          },
          // Sizes the input to its text so the item icon follows it, never clipping the name
          // (browsers without field-sizing keep the full-width input, icon at the far right)
          "@supports (field-sizing: content)": {
            [`& .${autocompleteClasses.inputRoot}:has(.${ITEM_ICON_CLASS}) .${autocompleteClasses.input}`]:
              { fieldSizing: "content", flex: "none", width: "auto" },
          },
        }}
        onChange={(event, newValue) => onChange(newValue?.value ?? "")}
        onHighlightChange={handleHighlightChange}
        getOptionLabel={(option: SelectOption) => option.label}
        filterOptions={filterOptions}
        isOptionEqualToValue={(option, value) => option.value === value.value}
        noOptionsText={
          <Typography variant="body2" sx={{ textAlign: "center" }}>
            {noOtherMoves ? t.team.noOtherMoves : t.team.nothingFound}
            {missingPokemon && (
              <>
                {" "}
                <br />
                {t.team.selectPokemonFirst}
              </>
            )}
          </Typography>
        }
        // Hands each option to VirtualizedListbox as a [props, option] tuple, which
        // renders only the visible rows. MUI types the return as a ReactNode, so
        // the tuple has to be cast; this is MUI's own virtualization pattern.
        renderOption={(optionProps, option) =>
          [optionProps, option] as unknown as React.ReactNode
        }
        slotProps={{
          popper: {
            ...(popperWidth && {
              placement: "bottom-start" as const,
              // Inline, because it has to replace the width MUI sets inline from the input
              style: { width: popperWidth },
            }),
            sx: {
              // Assuming 4px inline padding (defined in VirtualizedListbox)
              // and 2px left padding on non-icon part of the dropdown row:
              // Minimum width to fit Aerodactylite row in one line
              ...(pokemonProperty !== "name" && {
                minWidth: {
                  xxs:
                    store.isMoreOpen || pokemonProperty === "item" ?
                      SMALL_PHONE_LIST_WIDTH
                    : MIN_TEXT_LIST_WIDTH,
                  xs: pokemonProperty === "item" ? 130 : MIN_TEXT_LIST_WIDTH,
                },
              }),
              [`& .${autocompleteClasses.noOptions}`]: {
                py: 1.5,
                px: 1,
              },
              [`& .${autocompleteClasses.listbox}`]: {
                [`& .${autocompleteClasses.option}`]: {
                  py: 0.5,
                  px: ["name", "item"].includes(pokemonProperty) ? 0.5 : 1,
                },
              },
            },
          },
          listbox: { component: VirtualizedListbox },
        }}
        renderInput={params => {
          // Icons hide while the typed text differs from the selected name
          const isSelectionShown =
            !!selectedOption &&
            params.slotProps.htmlInput.value === selectedOption.label;
          const itemIcon =
            isSelectionShown && pokemonProperty === "item" ?
              <Box
                component="span"
                className={leadingIcon ? undefined : ITEM_ICON_CLASS}
                role="img"
                aria-label={t.team.itemIcon(selectedOption.label)}
                // Right margin keeps a trailing icon left of the 28px dropdown arrow
                sx={{
                  display: "flex",
                  flexShrink: 0,
                  mr: leadingIcon ? 0.5 : 3.5,
                }}
              >
                <PokemonIcon pokemonProperty="item" value={value} />
              </Box>
            : undefined;
          const moveType =
            (
              isSelectionShown &&
              leadingIcon &&
              pokemonProperty.startsWith("move")
            ) ?
              moveTypeIn(value, store.currentTeam.generation)
            : undefined;
          // Match the team stats' measured icon layout
          const typeIcon =
            moveType && isPokemonType(moveType) ?
              !hasTypeIcons ?
                <Box
                  component="span"
                  role="img"
                  aria-label={names.type(moveType)}
                  sx={{
                    flexShrink: 0,
                    mr: 0.75,
                    px: 0.5,
                    borderRadius: 0.5,
                    fontSize: 10,
                    fontWeight: 500,
                    lineHeight: "16px",
                    bgcolor: TYPE_COLORS[moveType],
                    color: TYPE_TEXT_COLORS[moveType],
                  }}
                >
                  {t.typeAbbreviations[moveType]}
                </Box>
              : <Box
                  component="img"
                  src={typeIcons[moveType]}
                  alt={names.type(moveType)}
                  sx={{ width: 20, height: 20, mr: 0.75, flexShrink: 0 }}
                />
            : undefined;
          const hiddenAbility =
            isSelectionShown &&
            pokemonProperty === "ability" &&
            store.isMoreOpen &&
            isHiddenAbility(
              store.team[teamIndex]?.name ?? "",
              value,
              store.currentTeam.generation,
            );

          return (
            <TextField
              {...params}
              variant="standard"
              placeholder={placeholder}
              sx={{
                "& .MuiInputBase-input::placeholder": {
                  opacity: 0.6,
                },
              }}
              slotProps={{
                ...params.slotProps,
                input: {
                  ...params.slotProps.input,
                  startAdornment:
                    leadingIcon ? (typeIcon ?? itemIcon) : undefined,
                  endAdornment:
                    hiddenAbility ?
                      <>
                        <HiddenAbilityLabel ability={selectedOption.label} />
                        {params.slotProps.input.endAdornment}
                      </>
                    : itemIcon && !leadingIcon ?
                      <>
                        {itemIcon}
                        {params.slotProps.input.endAdornment}
                      </>
                    : params.slotProps.input.endAdornment,
                },
                htmlInput: {
                  ...params.slotProps.htmlInput,
                  name: id,
                  "aria-label": t.team.input(teamIndex + 1, pokemonProperty),
                },
              }}
            />
          );
        }}
      />
    </VirtualizedListboxContext>
  );
});

export default PokemonInputSelect;
