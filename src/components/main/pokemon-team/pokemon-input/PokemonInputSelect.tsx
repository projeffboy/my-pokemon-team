import Autocomplete, { autocompleteClasses } from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Popper from "@mui/material/Popper";
import { styled } from "@mui/material/styles";
import { useListRef } from "react-window";
import VirtualizedListbox from "./pokemon-input-select/VirtualizedListbox";

interface SelectOption {
  value: string;
  label: string;
}

const StyledPopper = styled(Popper)({
  // Autocomplete sets an inline width matching the (often narrow) input;
  // override it so long option labels have room to wrap next to the icon
  width: "auto !important",
  minWidth: 160,
  [`& .${autocompleteClasses.listbox}`]: {
    boxSizing: "border-box",
    "& ul": {
      padding: 0,
      margin: 0,
    },
    [`& .${autocompleteClasses.option}`]: {
      padding: "4px 2px",
    },
  },
});

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

  // Which kind of icon to show in the options
  let iconProperty = placeholder.toLowerCase();
  if (iconProperty === "name") {
    iconProperty = "pokemon";
  }

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
      sx={{ minWidth: 0 }}
      options={options}
      value={selectedOption}
      disableListWrap
      onChange={(event, newValue) => onChange(newValue ? newValue.value : "")}
      onInputChange={(event, newInputValue, reason) => {
        // Clearing out the text also clears the selection
        // (matches the old react-select behavior)
        if (reason === "input" && newInputValue === "" && value) {
          onChange("");
        }
      }}
      onHighlightChange={handleHighlightChange}
      getOptionLabel={(option: SelectOption) => option.label}
      isOptionEqualToValue={(option, value) => option.value === value.value}
      noOptionsText={
        <>
          Nothing found <br /> (Or you haven't selected a Pokemon)
        </>
      }
      renderOption={(optionProps, option) =>
        // Deferred to VirtualizedListbox, which renders only the visible rows
        [optionProps, option] as unknown as React.ReactNode
      }
      slots={{
        popper: StyledPopper,
      }}
      slotProps={{
        listbox: {
          component: VirtualizedListbox,
          iconProperty,
          selectedValue: value,
          internalListRef,
        } as never,
      }}
      renderInput={params => (
        <TextField
          {...params}
          variant="standard"
          placeholder={placeholder}
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
