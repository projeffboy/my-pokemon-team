import React from 'react'
import PropTypes from 'prop-types'
import {withStyles} from '@material-ui/core/styles'
import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'
import {observer} from 'mobx-react'
import store from '../../../store'

const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  formControl: {
    minWidth: 120,
    [theme.breakpoints.down('sm')]: {minWidth: 90},
    margin: 10,
    [theme.breakpoints.down('md')]: {margin: '0 10px 10px'},
  },
  selectEmpty: {
    marginTop: theme.spacing.unit * 2,
  },
})

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
      <form className={classes.root} autoComplete='off'>
        {Object.keys(inputLabels).map((inputLabel, i) => (
          <FormControl className={classes.formControl} key={inputLabel}>
            <InputLabel htmlFor={inputLabel}>{inputLabel}</InputLabel>
            <Select
              value={store[inputLabel.toLowerCase()]}
              onChange={e => this.handleChange(inputLabel, e)}
              inputProps={{id: inputLabel}}
            >
              <MenuItem value=''>All</MenuItem>
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

SearchFilters.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(SearchFilters)