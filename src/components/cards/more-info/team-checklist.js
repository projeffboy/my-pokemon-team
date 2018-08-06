import React from 'react'
import Grid from '@material-ui/core/Grid'
import {withStyles} from '@material-ui/core/styles'
import {teamChecklistStyles} from '../../../styles'
import SentimentDissatisfied from '@material-ui/icons/SentimentDissatisfied'
import SentimentSatisfied from '@material-ui/icons/SentimentSatisfied'
import {observer} from 'mobx-react'
import store from '../../../store'

@observer
class TeamChecklist extends React.Component {
  render() {
    const {classes, width} = this.props

    let checklist = {
      'General': {
        'Entry Hazard': store.teamContainsTheseMoves([
          'spikes',
          'stealthrock',
          'toxicspikes',
          'stickyweb',
        ]), 
        'Spinner/Defogger': store.teamContainsTheseMoves(['rapidspin', 'defog']), 
        'Reliable Recovery': store.teamContainsTheseMoves([
          'healorder',
          'milkdrink',
          'moonlight',
          'morningsun',
          'recover',
          'roost',
          'shoreup',
          'softboiled',
          'strengthsap',
          'synthesis',
          'wish',
        ]),
      },
      'Defensive': {
        'Cleric': store.teamContainsTheseMoves(['aromatherapy', 'healbell']), 
        'Status Move': store.anyStatusMoves, 
        'Phazer': store.teamContainsTheseMoves([
          'circlethrow',
          'dragontail',
          'roar',
          'whirlwind',
        ]),
      },
      'Offensive': {
        'Boosting Move': store.anyBoostingMoves, 
        'Volt-turn': store.teamContainsTheseMoves(['voltswitch'])
          && store.teamContainsTheseMoves(['uturn']), 
        'Choice Item': store.teamContainsTheseItems([
          'Choice Scarf',
          'Choice Band',
          'Choice Specs',
        ]),
      },
    }

    let checklistAbbr = []
    if (width !== 'lg' && width !== 'xl') { // If the screen is below 1200px
      checklistAbbr = [
        'Hazard',
        'Spinner',
        'Recovery',
        '',
        'Status',
        'Phazer',
        'Setup',
        'Volt-turn',
        'Choice Item'
      ]
    }
    if (width === 'sm') {
      checklistAbbr[2] = 'Heal'
      checklistAbbr[7] = 'Volturn'
      checklistAbbr[8] = 'Choice'
    }
  
    return (
      <Grid container className={classes.root}>
        {Object.keys(checklist).map((miniHeader, i) => (
          <Grid item xs={4} key={miniHeader}>
            {/* E.g. Offensive */}
            <div className={classes.miniHeader}>{miniHeader}</div>
            {Object.keys(checklist[miniHeader]).map((check, j) => (
              <div key={check} style={{display: 'flex'}}>
                {/* Either a smile or frown face (might be subject to change) */}
                <div>
                  {checklist[miniHeader][check] ? <SentimentSatisfied /> : <SentimentDissatisfied />}
                </div>
                {/* E.g. Choice Item (Or "Choice" for smaller screens) */}
                <div style={{padding: '2px 4px'}}>{checklistAbbr[3 * i + j] || check}</div>
              </div>
            ))}
          </Grid>
        ))}
      </Grid>
    )
  }
}

export default withStyles(teamChecklistStyles)(TeamChecklist)