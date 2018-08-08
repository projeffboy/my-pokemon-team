import React from 'react'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import {withStyles} from '@material-ui/core/styles'
import {observer} from 'mobx-react'
import store from '../../store'
import {teamStatsStyles} from '../../styles'

@observer
class TeamStats extends React.Component {
  constructor(props) {
    super(props)

    // E.g. Turn "Type Coverage" to "typeCoverage"
    let titleArr = this.props.title.split(' ')
    titleArr[0] = titleArr[0].toLowerCase()
    this.teamStatType = titleArr.join('')
  }

  returnTypeValue(type) {
    let color = 'inherit'

    if (type < 0) { // weak to type
      color = 'red'
    } else if (type > 0) { // resist type
      color = 'green'
    }

    return <div style={{color}}>{type > 0 ? `+${type}` : type}</div>
  }

  render() {
    const {classes, width} = this.props

    const types = {
      Bug: 'a8b820', // the type's hex color
      Dark: '6f5747',
      Dragon: '7036fc',
      Electric: 'f9d130',
      Fairy: 'fd67d7',
      Fighting: 'c02f27',
      Fire: 'f17f2e',
      Flying: 'a990f1',
      Ghost: '715799',
      Grass: '78c850',
      Ground: 'e1c067',
      Ice: '95d7d8',
      Normal: 'a9a878',
      Poison: 'a03fa1',
      Psychic: 'f95788',
      Rock: 'b89f38',
      Steel: 'b8b8d0',
      Water: '6890f0',
    }
  
    let typeAbbr = []
    if (width !== 'lg' && width !== 'xl') { // If the screen is below 1200px
      typeAbbr = [
        'BUG',
        'DRK',
        'DRG',
        'ELC',
        'FRY',
        'FGT',
        'FIR',
        'FLY',
        'GHT',
        'GRS',
        'GRD',
        'ICE',
        'NRM',
        'PSN',
        'PSY',
        'RCK',
        'STL',
        'WTR',
      ]
    }

    // Grid Items of Pokemon Types
    const gridItems = Object.keys(types).map((type, i) => (
      <Grid key={i} item xs={2}>
        <div className={classes.typeContainer}>
          {/* E.g. Psychic (Or PSY on a smaller screen) */}
          <div className={classes.pokemonType} style={{backgroundColor: `#${types[type]}`}}>
            {typeAbbr[i] || type}
          </div>
        </div>
        {/* E.g. +2 or -1 */}
        {this.returnTypeValue(store[this.teamStatType][type])}
      </Grid>
    ), this)
  
    return (
      <Grid container>
        <Grid item xs={12}>
          {/* Either "Type Defence" or "Type Coverage"  */}
          <Typography variant='title' gutterBottom>
            {this.props.title}
          </Typography>
        </Grid>
        {gridItems}
      </Grid>
    )
  }
}

export default withStyles(teamStatsStyles)(TeamStats)