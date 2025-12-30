import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import PokemonIcon from "./pokemon-input-select/PokemonIcon";

function PokemonInputSelect(props: {
  optionValues: string[];
  optionLabels: string[];
  placeholder: string;
  teamIndex: number;
  pokemonProp: string;
  value: string;
  onChange: (val: string | null) => void;
}) {
  const {
    optionValues,
    optionLabels,
    placeholder,
    teamIndex,
    pokemonProp,
    value,
    onChange,
  } = props;

  const options = optionValues.map((optionValue, i) => ({
    value: optionValue,
    label: optionLabels[i],
  }));

  const id = "react-select-single-" + teamIndex + "-" + pokemonProp;

  let pkmnProp = placeholder ? placeholder.toLowerCase() : "";
  if (pkmnProp === "name") {
    pkmnProp = "pkmn";
  }

  return (
    <Autocomplete
      id={id}
      options={options}
      getOptionLabel={option => option.label}
      value={options.find(o => o.value === value) || null}
      onChange={(_event, newValue) => {
        onChange(newValue ? newValue.value : null);
      }}
      noOptionsText={
        <Typography>
          Nothing found <br /> (Or you haven't selected a Pokemon)
        </Typography>
      }
      renderInput={params => (
        <TextField
          {...params}
          placeholder={placeholder}
          variant="standard"
          fullWidth
          inputProps={{
            ...params.inputProps,
            "aria-label": `Pokemon ${teamIndex + 1}'s ${pokemonProp}`,
          }}
        />
      )}
      renderOption={(props, option) => {
        const { key, ...otherProps } = props;
        return (
          <li key={key} {...otherProps}>
            <div
              style={{ display: "flex", alignItems: "center", width: "100%" }}
            >
              <PokemonIcon pkmnProp={pkmnProp} value={option.value} />
              <span style={{ marginLeft: 8 }}>{option.label}</span>
            </div>
          </li>
        );
      }}
    />
  );
}

export default PokemonInputSelect;
