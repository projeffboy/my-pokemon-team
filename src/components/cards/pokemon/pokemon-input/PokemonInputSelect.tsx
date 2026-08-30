// Material UI Imports
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
// Custom Imports
import PokemonIcon from "./pokemon-input-select/PokemonIcon";

interface SelectOption {
  value: string;
  label: string;
}

interface PokemonInputSelectProps {
  optionValues: string[];
  optionLabels: string[];
  placeholder: string;
  pokemonProp: string;
  teamIndex: number;
  value: string;
  onChange: (value: string) => void;
}

// Returns an autocomplete input (replaces the old react-virtualized-select)
// In charge of communicating with the store (store.js)
export default function PokemonInputSelect(props: PokemonInputSelectProps) {
  const { optionValues, optionLabels, placeholder, pokemonProp, teamIndex } =
    props;

  const options: SelectOption[] = optionValues.map((optionValue, i) => ({
    value: optionValue,
    label: optionLabels[i] || "",
  }));
  const selectedOption =
    options.find(option => option.value === props.value) || null;
  const id = "react-select-single-" + teamIndex + "-" + pokemonProp;

  // Which kind of icon to show in the options
  let iconProp = placeholder.toLowerCase();
  if (iconProp === "name") {
    iconProp = "pkmn";
  }

  return (
    <Autocomplete
      id={id}
      sx={{ minWidth: 0 }}
      options={options}
      value={selectedOption}
      onChange={(event, newValue) =>
        props.onChange(newValue ? newValue.value : "")
      }
      onInputChange={(event, newInputValue, reason) => {
        // Clearing out the text also clears the selection
        // (matches the old react-select behavior)
        if (reason === "input" && newInputValue === "" && props.value) {
          props.onChange("");
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
            <PokemonIcon pkmnProp={iconProp} value={option.value} />
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
              "aria-label": `Pokemon ${teamIndex + 1}'s ${pokemonProp}`,
            },
          }}
        />
      )}
    />
  );
}
