import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import PokemonIcon from "./pokemon-input-select/PokemonIcon";

interface SelectOption {
  value: string;
  label: string;
}

// Returns an autocomplete input (replaces the old react-virtualized-select)
// In charge of communicating with the store (store.js)
export default function PokemonInputSelect({
  optionValues,
  optionLabels,
  placeholder,
  pokemonProperties,
  teamIndex,
  value,
  onChange,
}: {
  optionValues: string[];
  optionLabels: string[];
  placeholder: string;
  pokemonProperties: string;
  teamIndex: number;
  value: string;
  onChange: (value: string) => void;
}) {
  const options: SelectOption[] = optionValues.map((optionValue, i) => ({
    value: optionValue,
    label: optionLabels[i] || "",
  }));
  const selectedOption = options.find(option => option.value === value) || null;
  const id = "react-select-single-" + teamIndex + "-" + pokemonProperties;

  // Which kind of icon to show in the options
  let iconProperties = placeholder.toLowerCase();
  if (iconProperties === "name") {
    iconProperties = "pokemon";
  }

  return (
    <Autocomplete
      id={id}
      sx={{ minWidth: 0 }}
      options={options}
      value={selectedOption}
      onChange={(event, newValue) => onChange(newValue ? newValue.value : "")}
      onInputChange={(event, newInputValue, reason) => {
        // Clearing out the text also clears the selection
        // (matches the old react-select behavior)
        if (reason === "input" && newInputValue === "" && value) {
          onChange("");
        }
      }}
      getOptionLabel={(option: SelectOption) => option.label}
      isOptionEqualToValue={(option, value) => option.value === value.value}
      noOptionsText={
        <>
          Nothing found <br /> (Or you haven't selected a Pokemon)
        </>
      }
      renderOption={(optionProps, option) => {
        const { key, ...otherOptionProps } = optionProps;
        return (
          <li key={option.value} {...otherOptionProps}>
            <PokemonIcon
              pokemonProperties={iconProperties}
              value={option.value}
            />
            <span style={{ paddingLeft: 4 }}>{option.label}</span>
          </li>
        );
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
              "aria-label": `Pokemon ${teamIndex + 1}'s ${pokemonProperties}`,
            },
          }}
        />
      )}
    />
  );
}
