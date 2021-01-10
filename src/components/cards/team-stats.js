import React from 'react'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import {withStyles} from '@material-ui/core/styles'
import Popper from '@material-ui/core/Popper'
import Paper from '@material-ui/core/Paper'
import {observer} from 'mobx-react'
import store from '../../store'
import {teamStatsStyles} from '../../styles'
import Fade from '@material-ui/core/Fade'
import PokemonIcon from './pokemon/pokemon-input/pokemon-input-select/pokemon-icon'

@observer
class TeamStats extends React.Component {
  constructor(props) {
    super(props)

    // E.g. Turn 'Type Coverage' to 'typeCoverage'
    /*
    let titleArr = this.props.title.split(' ')
    titleArr[0] = titleArr[0].toLowerCase()
    this.teamStatType = titleArr.join('')
    */

    if (this.props.title === 'Team Defence') {
      this.teamStatType = 'typeDefence'
    } else if (this.props.title === 'Team Type Coverage') {
      this.teamStatType = 'typeCoverage'
    }

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

  handleClick = (e, i) => {
    // this.handlePopoverOpen(e, i)
    if (this.state.anchorEl.every(x => x === null)) {
      this.handlePopoverOpen(e, i)
    } else {
      this.handlePopoverClose()
    }
  }

  render() {
    const {classes, width, title} = this.props

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
    const gridItems = title => (
      Object.keys(types).map((type, i) => (
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
              onClick={e => this.handleClick(e, i)}
            >
              {typeAbbr[i] || type}
            </div>
            {/* The Popover Itself */}
            <Popper
              id={'mouse-over-popover-' + i}
              className={classes.popover}
              classes={{
                paper: classes.paper,
              }}
              open={!!this.state.anchorEl[i]}
              onClose={this.handlePopoverClose}
              anchorEl={this.state.anchorEl[i]}
              /*
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              */
              transition
            >
              {/* Popover Message */}
              {({TransitionProps}) => (
                <Fade {...TransitionProps} timeout={150}>
              <Paper style={{padding: 10}}>
                <TeamStatsTooltip type={type} typeColor={types[type]} classes={classes} teamStatType={title} />
              </Paper>
                </Fade>
              )}
            </Popper>
          </div>
          {/* E.g. +2 or -1 */}
          {this.returnTypeValue(store[this.teamStatType][type])}
        </Grid>
      ), this)
    )
  
    return (
      <Grid container style={{textAlign: 'center'}}>
        <Grid item xs={12}>
          {/* Either "Type Defence" or "Type Coverage"  */}
          <Typography variant='h6' gutterBottom style={{marginBottom: '0.15em', marginTop: '-0.2em'}}>
            {title}
          </Typography>
        </Grid>
        {gridItems(title)}
      </Grid>
    )
  }
}

// Type Defence/Coverage Tooltip
function TeamStatsTooltip(props) {
  const {teamStatType, ...otherProps} = props

  const content = () => {
    if (teamStatType === 'Team Defence') {
      return <TypeDefenceTooltipInfo {...otherProps} />
    } else if (teamStatType === 'Team Type Coverage') {
      return <TypeCoverageTooltipInfo {...otherProps} />
    }
  }

  return (
    <Typography component='div'>
      {store.isTeamEmpty ? 'First select a pokemon.' : content()}
    </Typography>
  )
}

// Type Defence Tooltip Info
const TypeDefenceTooltipInfo = ({typeColor, type, classes}) => (
  <>
    <p>
      <span style={{color: `#${typeColor}`}}>{type}</span> does...
    </p>
    <ul className={classes.list}>
      {store.team.map((teamPkmnProps, i) => { // for each pokemon
        const {name: pkmn, ability, item} = teamPkmnProps

        if (pkmn) {
          const effectiveness = store.typeAgainstPkmn(type, pkmn, ability, item)

          // convert effectiveness to multiplier
          // e.g. -1 becomes 2
          let multiplier = 1
          let color = 'initial'
          switch (effectiveness) {
            case -2:
              multiplier = 4
              color = 'red'
              break
            case -1.5:
              multiplier = 3
              color = 'red'
              break
            case -1:
              multiplier = 2
              color = '#f9d130'
              break
            case -0.5:
              multiplier = 1.5
              color = '#f9d130'
              break
            case 0:
              multiplier = 1
              break
            case 1:
              multiplier = 0.5
              color = 'yellowgreen'
              break
            case 2:
              multiplier = 0.25
              color = 'green'
              break
            case 3:
              multiplier = 0
              color = 'grey'
              break
            default:
          }

          return ( // multiplier, pkmn name, then pkmn icon
            <li key={teamPkmnProps.name + i} className={classes.listItem}>
              <span style={{color}} className={classes.multiplier}>{multiplier}x</span>
              <span style={{paddingRight: 2}}>to {store.pkmnName(pkmn)}</span>
              <PokemonIcon pkmnProp='pkmn' value={pkmn} />
            </li>
          )
        }

        return null
      })}
    </ul>
  </>
)

// Type Coverage Tooltip Info
function TypeCoverageTooltipInfo({typeColor, type, classes}) {
  let hasSuperEffectiveMove = false

  return (
    <>
      <p>
        Super effective against <span style={{color: `#${typeColor}`}}>{type}</span>:
      </p>
      <ul className={classes.list}>
        {store.team.map((teamPkmnProps, i) => { // For each team pokmeon
          const {name: pkmn, ability} = teamPkmnProps

          return (
            <React.Fragment key={pkmn + i}>
              {[1, 2, 3, 4].map(num => { // For each move number
                const move = teamPkmnProps['move' + num]

                if (move && store.moveAgainstType(move, type, pkmn, ability) === -1) {
                  hasSuperEffectiveMove = true

                  return ( // move name, pkmn name, then pkmn icon
                    <li
                      key={move + num}
                      className={classes.listItem}
                      style={{fontWeight: store.pkmnType(pkmn).includes(store.moveType(move, pkmn, ability)) ? 500 : 400}}
                    >
                      <span style={{width: 150}}>{store.moveName(move)}</span>
                      <span>{store.pkmnName(pkmn) + " "}</span>
                      <PokemonIcon pkmnProp='pkmn' value={pkmn} />
                    </li>
                  )
                } else if (num === 4 && i === 5 && !hasSuperEffectiveMove) {
                  return <li key={pkmn + i} style={{textAlign: 'center'}}>Nothing</li>
                }

                return null
              })}
            </React.Fragment>
          )
        })}
      </ul>
    </>
  )
}

export default withStyles(teamStatsStyles)(TeamStats)