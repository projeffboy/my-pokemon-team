import Autocomplete, { autocompleteClasses } from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useListRef } from "react-window";
import VirtualizedListbox from "./pokemon-input-select/VirtualizedListbox";

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
  optionValues: string[];
  optionLabels: string[];
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
  const id = "react-select-single-" + teamIndex + "-" + pokemonProperty;
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
    <Autocomplete
      id={id}
      options={options}
      value={selectedOption}
      disableListWrap
      sx={{
        [`&.${autocompleteClasses.hasPopupIcon}.${autocompleteClasses.hasClearIcon} .${autocompleteClasses.inputRoot}`]:
          {
            pr: 0,
          },
        [`& .${autocompleteClasses.input}`]: {
          textOverflow: "clip",
        },
      }}
      onChange={(event, newValue) => onChange(newValue?.value ?? "")}
      onHighlightChange={handleHighlightChange}
      getOptionLabel={(option: SelectOption) => option.label}
      isOptionEqualToValue={(option, value) => option.value === value.value}
      noOptionsText={
        <Typography variant="body2" textAlign="center">
          Nothing found <br /> (Or you haven't selected a Pokemon)
        </Typography>
      }
      renderOption={(optionProps, option) =>
        // Deferred to VirtualizedListbox, which renders only the visible rows
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
              "& ul": {
                p: 0,
                m: 0,
              },
              [`& .${autocompleteClasses.option}`]: {
                py: 0.5,
              },
            },
          },
        },
        listbox: {
          component: VirtualizedListbox,
          pokemonProperty,
          selectedValue: value,
          internalListRef,
        } as never,
      }}
      renderInput={params => (
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
            htmlInput: {
              ...params.inputProps,
              name: id,
              "aria-label": `Pokemon ${teamIndex + 1}'s ${pokemonProperty}`,
            },
          }}
        />
      )}
    />
  );
}
