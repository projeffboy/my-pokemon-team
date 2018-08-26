import React from 'react'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import {withStyles} from '@material-ui/core/styles'
import Popover from '@material-ui/core/Popover'
import {observer} from 'mobx-react'
import store from '../../store'
import {teamStatsStyles} from '../../styles'

@observer
class TeamStats extends React.Component {
  constructor(props) {
    super(props)

    // E.g. Turn 'Type Coverage' to 'typeCoverage'
    let titleArr = this.props.title.split(' ')
    titleArr[0] = titleArr[0].toLowerCase()
    this.teamStatType = titleArr.join('')

    // For popover (anchorEl means the element that the popover should be anchored to)
    // Why 18? There are 18 types
    this.state = {anchorEl: Array(18).fill(null)}
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

  handlePopoverOpen = (e, i) => {
    let anchorEl = this.state.anchorEl.slice()

    anchorEl = Array(18).fill(null)
    anchorEl[i] = e.currentTarget
    this.setState({anchorEl})
  }

  handlePopoverClose = () => this.setState({anchorEl: Array(18).fill(null)})

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
          {/* Activates Popover */}
          <div
            className={classes.pokemonType}
            style={{backgroundColor: `#${types[type]}`}}
            aria-owns={this.state.anchorEl[i] ? 'mouse-over-popover-' + i : null}
            aria-haspopup='true'
            onMouseEnter={e => this.handlePopoverOpen(e, i)}
            onMouseLeave={this.handlePopoverClose}  
          >
            {typeAbbr[i] || type}
          </div>
          {/* The Popover Itself */}
          <Popover
            id={'mouse-over-popover-' + i}
            className={classes.popover}
            classes={{
              paper: classes.paper,
            }}
            open={!!this.state.anchorEl[i]}
            anchorEl={this.state.anchorEl[i]}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
          >
            {/* Popover Message */}
            <TeamStatsTooltip type={type} typeColor={types[type]} classes={classes} />
          </Popover>
        </div>
        {/* E.g. +2 or -1 */}
        {this.returnTypeValue(store[this.teamStatType][type])}
      </Grid>
    ), this)
  
    return (
      <Grid container style={{textAlign: 'center'}}>
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

// Popover Message
function TeamStatsTooltip(props) {
  const {typeColor, type, classes} = props

  const content = () => (
    <React.Fragment>
      <p>
        <span style={{color: `#${typeColor}`}}>{type}</span> does...
      </p>
      <ul className={classes.list}>
        {store.team.map((teamPkmnProps, i) => {
          if (teamPkmnProps.name) {
            const pkmn = store.team[i].name
            const effectiveness = store.effectiveness()

            let multiplier
            let color = 'initial'
            switch (effectiveness) {
              case -2:
                multiplier = '   4'
                color = 'maroon'
                break
              case -1:
                multiplier = '   2'
                color = 'red'
                break
              case 0:
                multiplier = '   1'
                color = 'yellow'
                break
              case 1:
                multiplier = ' 0.5'
                color = 'yellowgreen'
                break
              case 2:
                multiplier = '0.25'
                color = 'green'
                break
              case 3:
                multiplier = '   0'
                color = 'darkgreen'
                break
              default:
            }

            return (
              <li key={teamPkmnProps.name + i}>
                <span style={{color}}>{multiplier}x</span>
                 to {store.pkmnName(pkmn)}
              {/* add icon */}
              </li>
            )
          }
        })}
      </ul>
    </React.Fragment>
  )

  return (
    <Typography component={'div'}>
      {store.isTeamEmpty ? 'First select a pokemon.' : content()}
    </Typography>
  )
}

export default withStyles(teamStatsStyles)(TeamStats)