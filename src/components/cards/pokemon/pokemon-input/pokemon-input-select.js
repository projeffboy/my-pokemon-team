// Source code initially take from here: https://material-ui.com/demos/autocomplete/

import React from "react";
// Material UI Imports
import Typography from "@material-ui/core/Typography";
import Input from "@material-ui/core/Input";
import { withStyles } from "@material-ui/core/styles";
import ClearIcon from "@material-ui/icons/Clear";
// React Select
// import Select from 'react-select' (We are using react-virtualized-select instead)
// Might want to retry it some day
import "./react-select.css";
// React Virtualized
import "react-virtualized-select/styles.css";
import VirtualizedSelect from "react-virtualized-select";
// Custom Imports
import { pokemonInputSelectStyles } from "../../../../styles";
import PokemonIcon from "./pokemon-input-select/pokemon-icon";

// Returns an Input containing the <select>
// In charge of communicating with the store (store.js)
function PokemonInputSelect(props) {
  const { classes, optionValues, optionLabels } = props;
  const optionsWithLabels = optionValues.map((optionValue, i) => ({
    value: optionValue,
    label: optionLabels[i],
  }));
  const id = "react-select-single-" + props.teamIndex + "-" + props.pokemonProp;

  return (
    <Input
      fullWidth
      inputComponent={CustomSelect}
      value={props.value}
      onChange={props.onChange}
      placeholder={props.placeholder}
      id={id}
      inputProps={{
        classes,
        name: id,
        instanceId: id,
        simpleValue: true,
        options: optionsWithLabels,
        "aria-label": `Pokemon ${props.teamIndex + 1}'s ${props.pokemonProp}`,
      }}
    />
  );
}

// Returns the actual <select>
function CustomSelect(props) {
  const { classes, ...otherProps } = props;

  return (
    <VirtualizedSelect
      optionRenderer={virtualizedSelectProps =>
        Option(virtualizedSelectProps, otherProps)
      }
      clearRenderer={() => <ClearIcon />}
      noResultsText={
        <Typography>
          Nothing found <br /> (Or you haven't selected a Pokemon)
        </Typography>
      }
      {...otherProps}
    />
  );
}

// Returns an <option> in <select>
// Containing both icon and option value
function Option(props, parentProps) {
  const { style, option, onSelect } = props;
  const { placeholder } = parentProps;

  let pkmnProp = placeholder.toLowerCase();
  if (pkmnProp === "name") {
    pkmnProp = "pkmn";
  }

  // Set the styles for certain options
  let horizontalPadding = 0;
  let width = 0;
  if (placeholder === "Name") {
    width = 40;
  } else if (placeholder === "Item") {
    width = 24;
  } else {
    horizontalPadding = 10;
    width = 0;
  }

  function handleClick(event) {
    onSelect(option, event);
  }

  return (
    <div
      key={option.value}
      style={{ ...style, padding: `0 ${horizontalPadding}px` }}
      className="VirtualizedSelectOption"
      onClick={handleClick}
    >
      <PokemonIcon pkmnProp={pkmnProp} value={option.value} />
      <span style={{ width: `calc(100% - ${width}px)`, paddingLeft: 4 }}>
        {option.label}
      </span>
    </div>
  );
}

export default withStyles(pokemonInputSelectStyles)(PokemonInputSelect);
