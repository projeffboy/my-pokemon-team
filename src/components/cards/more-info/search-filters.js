import React from 'react'
import {withStyles} from '@material-ui/core/styles'
import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'
import {observer} from 'mobx-react'
import store from '../../../store'
import {searchFiltersStyles} from '../../../styles'

@observer
class SearchFilters extends React.Component {
  handleChange = (inputLabel, e) => {
    store[inputLabel.toLowerCase()] = e.target.value
  }

  render() {
    const {classes} = this.props

    const inputLabels = {
      Format: [
        'Battle Spot Singles',
        'Battle Spot Doubles',
        'VGC 2018',
        'Uber', 
        'OU: Over Used', 
        'UU: Under Used', 
        'RU: Rarely Used', 
        'NU: Never Used', 
        'PU', 
        'Little Cup (LC)',
        'Doubles Uber',
        'Doubles OU',
        'Doubles UU'
      ], 
      Region: ['Kanto', 'Johto', 'Hoenn', 'Sinnoh', 'Unova', 'Kalos', 'Alola'], 
      Type: [
        'Bug',
        'Dark',
        'Dragon',
        'Electric',
        'Fighting',
        'Fire',
        'Flying',
        'Ghost',
        'Grass',
        'Ground',
        'Ice',
        'Poison',
        'Psychic',
        'Rock',
        'Steel',
        'Water',
      ], 
      Moves: ['Viable'],
    }

    return (
      <form className={classes.root}>
        {Object.keys(inputLabels).map((inputLabel, i) => (
          <FormControl className={classes.formControl} key={inputLabel}>
            {/* E.g. Format */}
            <InputLabel htmlFor={inputLabel}>{inputLabel}</InputLabel>
            <Select
              value={store[inputLabel.toLowerCase()]}
              onChange={e => this.handleChange(inputLabel, e)}
              inputProps={{id: inputLabel}}
            >
              <MenuItem value=''>All</MenuItem>
              {/* OU: OverUsed */}
              {inputLabels[inputLabel].map(inputValue => (
                <MenuItem key={inputValue} value={inputValue}>{inputValue}</MenuItem>)
              )}
            </Select>
          </FormControl>  
        ))}
      </form>
    )
  }
}

export default withStyles(searchFiltersStyles)(SearchFilters)