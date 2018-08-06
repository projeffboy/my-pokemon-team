// Source code initially take from here: https://material-ui.com/demos/autocomplete/

import React from 'react'
// Material UI Core Imports
import Typography from '@material-ui/core/Typography'
import MenuItem from '@material-ui/core/MenuItem'
import Input from '@material-ui/core/Input'
import {withStyles} from '@material-ui/core/styles'
// Material UI Icon Imports
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown'
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp'
import ClearIcon from '@material-ui/icons/Clear'
// React Select
// import Select from 'react-select' // We are using react-virtualized-select instead
import 'react-select/dist/react-select.css'
// React Virtualized
import 'react-virtualized-select/styles.css'
import Select from 'react-virtualized-select'

class IntegrationReactSelect extends React.Component {
  constructor(props) {
    super(props)
    // we use the input's placeholder to determine what pokemon property to update
    this.pokemonProp = this.props.placeholder.toLowerCase()
  }

  render() {
    const {classes, optionValues, optionLabels} = this.props
    const optionsWithLabels = optionValues.map((optionValue, i) => ({
      value: optionValue,
      label: optionLabels[i],
    }))

    return (
      <Input
        fullWidth
        inputComponent={SelectWrapped}
        value={this.props.value}
        onChange={this.props.onChange}
        placeholder={this.props.placeholder}
        id='react-select-single'
        inputProps={{
          classes,
          name: 'react-select-single',
          instanceId: 'react-select-single',
          simpleValue: true,
          options: optionsWithLabels,
        }}
      />
    )
  }
}

/* 
 * The code below should be left as is.
 * And is not worth looking at.
 * Unless you absolutely need to make some changes.
 * The most important thing is that it works.
 */

function SelectWrapped(props) {
  const {classes, ...other} = props

  return (
    <Select
      optionComponent={Option}
      noResultsText={<Typography>{'Nothing found'}</Typography>}
      arrowRenderer={arrowProps => {
        return arrowProps.isOpen ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />
      }}
      clearRenderer={() => <ClearIcon />}
      valueComponent={valueProps => {
        const {children} = valueProps

        return <div className='Select-value'>{children}</div>
      }}
      {...other}
    />
  )
}

class Option extends React.Component {
  handleClick = event => {
    this.props.onSelect(this.props.option, event)
  }

  render() {
    const {children, isFocused, isSelected, onFocus} = this.props

    return (
      <MenuItem
        onFocus={onFocus}
        selected={isFocused}
        onClick={this.handleClick}
        component='div'
        style={{
          fontWeight: isSelected ? 500 : 400,
        }}
      >
        {children}
      </MenuItem>
    )
  }
}

const ITEM_HEIGHT = 48

const styles = theme => ({
  // We had to use a lot of global selectors in order to style react-select.
  // We are waiting on https://github.com/JedWatson/react-select/issues/1679
  // to provide a much better implementation.
  // Also, we had to reset the default style injected by the library.
  '@global': {
    '.Select-control': {
      display: 'flex',
      alignItems: 'center',
      border: 0,
      height: 'auto',
      background: 'transparent',
      '&:hover': {
        boxShadow: 'none',
      },
    },
    '.Select-multi-value-wrapper': {
      flexGrow: 1,
      display: 'flex',
      flexWrap: 'wrap',
    },
    '.Select--multi .Select-input': {
      margin: 0,
    },
    '.Select.has-value.is-clearable.Select--single > .Select-control .Select-value': {
      padding: 0,
    },
    '.Select-noresults': {
      padding: theme.spacing.unit * 2,
    },
    '.Select-input': {
      display: 'inline-flex !important',
      padding: 0,
      height: 'auto',
    },
    '.Select-input input': {
      background: 'transparent',
      border: 0,
      padding: 0,
      cursor: 'default',
      display: 'inline-block',
      fontFamily: 'inherit',
      fontSize: 'inherit',
      margin: 0,
      outline: 0,
    },
    '.Select-placeholder, .Select--single .Select-value': {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      display: 'flex',
      alignItems: 'center',
      fontFamily: theme.typography.fontFamily,
      fontSize: theme.typography.pxToRem(16),
      padding: 0,
    },
    '.Select-placeholder': {
      opacity: 0.42,
      color: theme.palette.common.black,
    },
    '.Select-menu-outer': {
      backgroundColor: theme.palette.background.paper,
      boxShadow: theme.shadows[2],
      position: 'absolute',
      left: 0,
      top: `calc(100% + ${theme.spacing.unit}px)`,
      width: '100%',
      zIndex: 2,
      maxHeight: ITEM_HEIGHT * 4.5,
    },
    '.Select.is-focused:not(.is-open) > .Select-control': {
      boxShadow: 'none',
    },
    '.Select-menu': {
      maxHeight: ITEM_HEIGHT * 4.5,
      overflowY: 'auto',
    },
    '.Select-menu div': {
      boxSizing: 'content-box',
    },
    '.Select-arrow-zone, .Select-clear-zone': {
      color: theme.palette.action.active,
      cursor: 'pointer',
      height: 21,
      width: 21,
      zIndex: 1,
    },
    // Only for screen readers. We can't use display none.
    '.Select-aria-only': {
      position: 'absolute',
      overflow: 'hidden',
      clip: 'rect(0 0 0 0)',
      height: 1,
      width: 1,
      margin: -1,
    },
  },
})

/* */

export default withStyles(styles)(IntegrationReactSelect)
