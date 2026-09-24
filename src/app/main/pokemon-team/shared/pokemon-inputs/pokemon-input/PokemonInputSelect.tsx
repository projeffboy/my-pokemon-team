import Autocomplete, { autocompleteClasses } from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useListRef } from "react-window";
import VirtualizedListbox, {
  VirtualizedListboxContext,
} from "./pokemon-input-select/VirtualizedListbox";
import PokemonIcon from "@/app/main/shared/PokemonIcon";

const ITEM_ICON_CLASS = "item-icon";

interface SelectOption {
  value: string;
  label: string;
}

export default function PokemonInputSelect({
  optionValues,
  optionLabels,
  placeholder,
  pokemonProperty,
  teamIndex,
  value,
  onChange,
}: {
  optionValues: readonly string[];
  optionLabels: readonly string[];
  placeholder: string;
  pokemonProperty: string;
  teamIndex: number;
  value: string;
  onChange: (value: string) => void;
}) {
  const options: SelectOption[] = optionValues.map((optionValue, i) => ({
    value: optionValue,
    label: optionLabels[i] || "",
  }));
  const selectedOption = options.find(option => option.value === value) || null;
  const id = `react-select-single-${teamIndex}-${pokemonProperty}`;
  const internalListRef = useListRef(null);

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
          internalListRef.current.scrollToRow({ index, align: "auto" });
        } catch {
          // Ignore: list wasn't mounted with this many rows (e.g. already closed)
        }
      }
    }
  };

  return (
    <VirtualizedListboxContext
      value={{ pokemonProperty, selectedValue: value, internalListRef }}
    >
      <Autocomplete
        id={id}
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
        isOptionEqualToValue={(option, value) => option.value === value.value}
        noOptionsText={
          <Typography variant="body2" sx={{ textAlign: "center" }}>
            Nothing found <br /> (you haven't selected a pokemon)
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
            sx: {
              // Asuming 4px inline padding (defined in VirtualizedListbox)
              // and 2px left padding on non-icon part of the dropdown row:
              // Minimum width to fit Dudunsparce-Three-Segment row in two lines
              ...(pokemonProperty === "name" && { minWidth: 161 }),
              // Minimum width to fit Aerodactylite row in one line
              ...(pokemonProperty === "item" && { minWidth: 130 }),
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
          // Hidden while the typed text differs from the selected item's name
          const itemIcon =
            (
              pokemonProperty === "item" &&
              selectedOption &&
              params.inputProps.value === selectedOption.label
            ) ?
              <Box
                component="span"
                className={ITEM_ICON_CLASS}
                role="img"
                aria-label={`${selectedOption.label} icon`}
                // Right margin keeps the icon left of the 28px dropdown arrow
                sx={{ display: "flex", flexShrink: 0, mr: 3.5 }}
              >
                <PokemonIcon pokemonProperty="item" value={value} />
              </Box>
            : undefined;

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
                input: {
                  ...params.InputProps,
                  endAdornment:
                    itemIcon ?
                      <>
                        {itemIcon}
                        {params.InputProps.endAdornment}
                      </>
                    : params.InputProps.endAdornment,
                },
                htmlInput: {
                  ...params.inputProps,
                  name: id,
                  "aria-label": `Pokemon ${teamIndex + 1}'s ${pokemonProperty}`,
                },
              }}
            />
          );
        }}
      />
    </VirtualizedListboxContext>
  );
}
