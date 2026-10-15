import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { flushSync } from "react-dom";
import Autocomplete, { autocompleteClasses } from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
import { useListRef } from "react-window";
import { observer } from "mobx-react-lite";
import store from "@/store";
import VirtualizedListbox, {
  gridColumns,
  VirtualizedListboxContext,
} from "./pokemon-input-select/VirtualizedListbox";
import PokemonIcon from "@/app/shared/PokemonIcon";
import HiddenAbilityLabel from "./pokemon-input-select/HiddenAbilityLabel";
import twoLineWidth, {
  scrollbarWidth,
} from "./pokemon-input-select/two-line-width";
import ListTools from "./pokemon-input-select/shared/ListTools";
import { isHiddenAbility } from "@/shared/pokedex";
import { moveType } from "@/store/shared/effectiveness";
import { gameFormat } from "@/shared/formats";
import { englishNames, type Names } from "@/i18n/names";
import { useTranslation } from "@/app/shared/TranslationContext";
import { searchFilter } from "@/app/shared/search-filter";
import { closeKeyboard, verbatim } from "@/app/shared/text-entry";
import typeIcons from "@/images/type-icons";
import { isPokemonType } from "@/types";

const ITEM_ICON_CLASS = "item-icon";
// Space kept between the popup and the edge of the screen
const POPUP_MARGIN = 8;
// The Name list fits Venusaur-Gmax on one line: 4px of padding, a 40px icon,
// 2px, the name at 16px Roboto (114px), 4px, and 4px of slack for font
// rendering. It widens until every name in the language and game fits in two lines
// without splitting a word.
const MIN_NAME_LIST_WIDTH = 168;
// What a row holds beside its text: the Name list's padding (4px each side), 40px icon,
// and 2px; an item's padding, 24px icon, and 2px; an ability's or move's padding (8px
// each side) and 2px, or, with the move's type, the 20px icon and the 6px after it
const NAME_ROW_CHROME = 50;
const ITEM_ROW_CHROME = 34;
const TEXT_ROW_CHROME = 16;
const MOVE_TYPE_ICON = 26;
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
  const { t, names, locale } = useTranslation();
  const { typography } = useTheme();
  const rootRef = useRef<HTMLDivElement>(null);
  const [rootWidth, setRootWidth] = useState<number>();
  // The narrowest list in which no name, move, item, or ability of the language and
  // game takes more than two lines or splits a word
  const [fitWidth, setFitWidth] = useState(0);
  const [popupMaxHeight, setPopupMaxHeight] = useState<number>();
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
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
  const { generation } = store.currentTeam;
  const format = store.dataFormat;
  const analysisMember = store.analysisTeam[teamIndex];
  const isMove = pokemonProperty.startsWith("move");
  const showMoveTypes = leadingIcon && isMove;
  const measureList = useCallback(() => {
    const game = `${locale}|${generation}|${gameFormat(format)}|${store.currentTeam.generationProfile ?? ""}`;
    const [kind, labels, chrome] =
      pokemonProperty === "name" ?
        ([
          "name",
          () => store.gamePokemon.map(names.pokemon),
          NAME_ROW_CHROME,
        ] as const)
      : pokemonProperty === "item" ?
        ([
          "item",
          () => store.gameItems.map(names.item),
          ITEM_ROW_CHROME,
        ] as const)
      : pokemonProperty === "ability" ?
        ([
          "ability",
          () => store.gameAbilities.map(names.ability),
          TEXT_ROW_CHROME + 2,
        ] as const)
      : ([
          "move",
          () => store.gameMoves.map(names.move),
          TEXT_ROW_CHROME + (showMoveTypes ? MOVE_TYPE_ICON : 2),
        ] as const);
    setFitWidth(
      twoLineWidth(`${kind}|${game}`, labels, typography.body1, 80) +
        chrome +
        // A pokemon has at most four abilities, too few for the list to scroll
        (kind === "ability" ? 0 : scrollbarWidth()),
    );
  }, [
    pokemonProperty,
    locale,
    names,
    typography,
    generation,
    format,
    showMoveTypes,
  ]);
  // A list opened before Roboto loaded is measured again once it has
  useEffect(() => {
    if (!isOpen) return;
    let active = true;
    document.fonts.ready.then(() => active && measureList());
    return () => {
      active = false;
    };
  }, [isOpen, measureList]);
  const filterOptions = useMemo(
    () =>
      searchFilter<SelectOption>(
        option =>
          `${option.label} ${optionName(englishNames, pokemonProperty, option.value)}`,
      ),
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
  const selectedLabel = optionName(names, pokemonProperty, value);
  const selectedOption = useMemo(
    () => (value ? { value, label: selectedLabel } : null),
    [value, selectedLabel],
  );
  const id = `react-select-single-${teamIndex}-${pokemonProperty}`;
  const restorePopupFocus = useRef(false);
  const dialog = store.dialog;
  useEffect(() => {
    if (!dialog && restorePopupFocus.current) {
      restorePopupFocus.current = false;
      document.getElementById(id)?.focus();
    }
  }, [dialog, id]);
  const missingPokemon =
    (isMove || pokemonProperty === "ability") && !store.team[teamIndex]?.name;
  const noOtherMoves = isMove && !missingPokemon && options.length === 0;
  const internalListRef = useListRef(null);
  // The options the popup lists, which typing narrows down
  const listedValuesRef = useRef<readonly string[]>([]);
  const pendingNavigation = useRef<{
    input: HTMLInputElement;
    key: string;
    index: number;
  } | null>(null);
  const replayingNavigation = useRef(false);
  const finishNavigation = () => {
    const pending = pendingNavigation.current;
    if (!pending || !document.getElementById(`${id}-option-${pending.index}`))
      return;
    pendingNavigation.current = null;
    if (document.activeElement !== pending.input) return;
    replayingNavigation.current = true;
    pending.input.dispatchEvent(
      new KeyboardEvent("keydown", { key: pending.key, bubbles: true }),
    );
    replayingNavigation.current = false;
  };
  const popupElement = () => document.getElementById(`${id}-popup`);
  const focusInPopup = (event: React.SyntheticEvent | null) =>
    !!event &&
    "relatedTarget" in event &&
    event.relatedTarget instanceof Node &&
    !!popupElement()?.contains(event.relatedTarget);
  const popupButtons = () =>
    [
      ...(popupElement()?.querySelectorAll<HTMLButtonElement>("button") ?? []),
    ].filter(button => !button.disabled && button.tabIndex >= 0);
  const focusOutsidePopup = () => {
    const input = document.getElementById(id);
    const popup = popupElement();
    const controls = [
      ...document.querySelectorAll<HTMLElement>(
        "input, button, select, textarea, a[href], [tabindex]",
      ),
    ].filter(
      element =>
        element.tabIndex >= 0 &&
        !element.matches(":disabled") &&
        element.getClientRects().length > 0 &&
        !popup?.contains(element),
    );
    const index = controls.indexOf(input as HTMLElement);
    setIsOpen(false);
    if (index !== -1) controls[index + 1]?.focus();
  };
  const handlePopupKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    const buttons = popupButtons();
    if (event.key === "Escape") {
      event.preventDefault();
      event.stopPropagation();
      setIsOpen(false);
      document.getElementById(id)?.focus();
    } else if (event.key === "Tab") {
      if (event.shiftKey && event.target === buttons[0]) {
        event.preventDefault();
        document.getElementById(id)?.focus();
      } else if (!event.shiftKey && event.target === buttons.at(-1)) {
        event.preventDefault();
        focusOutsidePopup();
      }
    }
  };
  const isGrid = pokemonProperty === "name" && store.nameView !== "list";
  const columns = isGrid ? gridColumns(store.nameView) : 1;
  // The grid of icons spans both of the card's columns, which are 8px apart
  const popperWidth =
    pokemonProperty !== "name" ? undefined
    : isGrid ? rootWidth && 2 * rootWidth + 8
    : Math.max(MIN_NAME_LIST_WIDTH, fitWidth);

  const scrollForNavigation = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const list = internalListRef.current;
    const element = list?.element;
    const lastIndex = listedValuesRef.current.length - 1;
    if (!isOpen || !list || !element || lastIndex < 0) return;
    // eslint-disable-next-line @typescript-eslint/no-deprecated -- Match MUI's legacy IME guard.
    if (event.which === 229 || event.nativeEvent.isComposing) return;
    const activeId = rootRef.current
      ?.querySelector("input")
      ?.getAttribute("aria-activedescendant");
    const prefix = `${id}-option-`;
    const index =
      activeId?.startsWith(prefix) ? Number(activeId.slice(prefix.length)) : -1;
    const target =
      event.key === "Home" ? 0
      : event.key === "End" ? lastIndex
      : event.key === "ArrowDown" ? index + 1
      : event.key === "ArrowUp" ?
        index === -1 ?
          lastIndex
        : index - 1
      : event.key === "PageDown" ? index + 5
      : event.key === "PageUp" ? index - 5
      : undefined;
    if (target === undefined) return;
    const nextIndex = Math.min(lastIndex, Math.max(0, target));
    if (element.querySelector(`[data-option-index="${nextIndex}"]`)) return;
    try {
      // MUI skips unmounted options. Publish react-window's scroll range before
      // MUI handles this key, rather than waiting for the browser's scroll event.
      flushSync(() => {
        list.scrollToRow({
          index: Math.floor(nextIndex / columns),
          align: "auto",
          behavior: "instant",
        });
        list.element?.dispatchEvent(new Event("scroll"));
      });
    } catch {
      // The options may have changed before the virtualized list remounts.
    }
  };

  // Scrolls the virtualized list to keep the keyboard-highlighted option in view
  // (guarded because the list may be closed/stale, e.g. after an auto-selected value)
  const handleHighlightChange = (
    event: React.SyntheticEvent,
    option: SelectOption | null,
  ) => {
    if (option && internalListRef.current) {
      const index = listedValuesRef.current.indexOf(option.value);
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

  // Enter picks the top match of the typed text when no option is highlighted
  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLDivElement> & {
      defaultMuiPrevented?: boolean;
    },
  ) => {
    if (replayingNavigation.current) return;
    scrollForNavigation(event);
    if (
      isOpen &&
      event.key === "Tab" &&
      !event.shiftKey &&
      event.target instanceof HTMLInputElement
    ) {
      const button = popupButtons()[0];
      if (button) {
        event.preventDefault();
        event.defaultMuiPrevented = true;
        button.focus();
        return;
      }
    }
    pendingNavigation.current = null;
    if (
      isOpen &&
      (event.key === "Home" || event.key === "End") &&
      event.target instanceof HTMLInputElement
    ) {
      const index =
        event.key === "Home" ? 0 : listedValuesRef.current.length - 1;
      if (
        index >= 0 &&
        !document.getElementById(`${id}-option-${index}`) &&
        internalListRef.current
      ) {
        event.preventDefault();
        event.defaultMuiPrevented = true;
        pendingNavigation.current = {
          input: event.target,
          key: event.key,
          index,
        };
        internalListRef.current.scrollToRow({
          index: Math.floor(index / columns),
          align: event.key === "Home" ? "start" : "end",
        });
        return;
      }
    }
    if (event.key !== "Enter" || !isOpen || event.nativeEvent.isComposing)
      return;
    const input = event.target;
    if (
      !(input instanceof HTMLInputElement) ||
      !input.value ||
      input.getAttribute("aria-activedescendant")
    )
      return;
    const [topMatch] = listedValuesRef.current;
    if (!topMatch) return;
    event.preventDefault();
    event.defaultMuiPrevented = true;
    onChange(topMatch);
    setIsOpen(false);
    closeKeyboard();
  };

  return (
    <VirtualizedListboxContext
      value={{
        pokemonProperty,
        teamIndex,
        showMoveTypes,
        selectedValue: value,
        internalListRef,
        listedValuesRef,
        onRowsRendered: finishNavigation,
        popupMaxHeight,
        nameListWidth: Math.max(MIN_NAME_LIST_WIDTH, fitWidth),
      }}
    >
      <Autocomplete
        id={id}
        ref={rootRef}
        open={isOpen}
        onKeyDown={handleKeyDown}
        onOpen={() => {
          measure();
          measureList();
          setIsOpen(true);
        }}
        inputValue={inputValue}
        onInputChange={(event, text, reason) => {
          if (
            (reason === "blur" && focusInPopup(event)) ||
            (reason === "reset" &&
              popupElement()?.contains(document.activeElement))
          )
            return;
          setInputValue(text);
        }}
        onClose={(event, reason) => {
          if (reason === "blur" && focusInPopup(event)) return;
          pendingNavigation.current = null;
          setIsOpen(false);
          closeKeyboard(event, reason);
        }}
        options={options}
        value={selectedOption}
        disableListWrap
        clearText={t.clear}
        openText={t.teams.open}
        closeText={t.close}
        sx={{
          // Stops a wide item icon row from widening its grid column
          ...(pokemonProperty === "item" && { minWidth: 0 }),
          [`&.${autocompleteClasses.hasPopupIcon}.${autocompleteClasses.hasClearIcon} .${autocompleteClasses.inputRoot}`]:
            {
              pr: 0,
            },
          // The text runs under the buttons, so a tap beside them, or where touch
          // screens hide the clear button, reaches the input and opens the list
          [`& .${autocompleteClasses.endAdornment}`]: {
            pointerEvents: "none",
            "& > *": { pointerEvents: "auto" },
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
          <>
            {/* Filters that leave no pokemon can still be changed from here */}
            {pokemonProperty === "name" && (
              <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                <ListTools />
              </Box>
            )}
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
          </>
        }
        // Hands each option to VirtualizedListbox as a [props, option] tuple, which
        // renders only the visible rows. MUI types the return as a ReactNode, so
        // the tuple has to be cast; this is MUI's own virtualization pattern.
        renderOption={(optionProps, option) =>
          [optionProps, option] as unknown as React.ReactNode
        }
        slotProps={{
          popper: {
            id: `${id}-popup`,
            onKeyDown: handlePopupKeyDown,
            onBlur: event => {
              const next = event.relatedTarget;
              if (
                !(next instanceof Node) ||
                (!event.currentTarget.contains(next) &&
                  !rootRef.current?.contains(next))
              ) {
                restorePopupFocus.current =
                  store.dialog?.name === "filters" ||
                  store.dialog?.name === "sort";
                setIsOpen(false);
              }
            },
            ...(popperWidth && {
              placement: "bottom-start" as const,
              // Inline, because it has to replace the width MUI sets inline from the input
              style: { width: popperWidth },
            }),
            sx: {
              maxWidth: `calc(100vw - ${2 * POPUP_MARGIN}px)`,
              // Assuming 4px inline padding (defined in VirtualizedListbox)
              // and 2px left padding on non-icon part of the dropdown row:
              // Minimum width to fit Aerodactylite row in one line
              ...(pokemonProperty !== "name" && {
                minWidth: {
                  xxs: Math.max(fitWidth, SMALL_PHONE_LIST_WIDTH),
                  xs: Math.max(
                    fitWidth,
                    pokemonProperty === "item" ? 130 : MIN_TEXT_LIST_WIDTH,
                  ),
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
          const selectedMoveType =
            (
              isSelectionShown &&
              leadingIcon &&
              pokemonProperty.startsWith("move")
            ) ?
              moveType(
                value,
                analysisMember?.name ?? "",
                analysisMember?.ability,
                generation,
                analysisMember?.item,
                format,
                analysisMember,
              )
            : undefined;
          // Always the icon: an abbreviation would take more of the move's room
          const typeIcon =
            selectedMoveType && isPokemonType(selectedMoveType) ?
              <Box
                component="img"
                src={typeIcons[selectedMoveType]}
                alt={names.type(selectedMoveType)}
                sx={{ width: 20, height: 20, mr: 0.75, flexShrink: 0 }}
              />
            : undefined;
          const hiddenAbility =
            isSelectionShown &&
            pokemonProperty === "ability" &&
            isHiddenAbility(
              store.team[teamIndex]?.name ?? "",
              value,
              store.currentTeam.generation,
              store.dataFormat,
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
                  ...verbatim(id),
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
