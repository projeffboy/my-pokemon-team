import React from 'react'
import Grid from '@material-ui/core/Grid'
import {withStyles} from '@material-ui/core/styles'
import {teamChecklistStyles} from '../../styles'
import SentimentDissatisfied from '@material-ui/icons/SentimentDissatisfied'
import SentimentSatisfied from '@material-ui/icons/SentimentSatisfied'
import {observer} from 'mobx-react'
import store from '../../store'

@observer
class TeamChecklist extends React.Component {
  render() {
    const {classes} = this.props
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
        'Choice User': store.teamContainsTheseItems([
          'Choice Scarf',
          'Choice Band',
          'Choice Specs',
        ]),
      },
    }
  
    return (
      <Grid container className={classes.root}>
        {Object.keys(checklist).map(miniHeader => (
          <Grid item xs={4} key={miniHeader}>
            <div className={classes.miniHeader}>{miniHeader}</div>
            {Object.keys(checklist[miniHeader]).map(check => (
              <div key={check} style={{display: 'flex'}}>
                <div>
                  {checklist[miniHeader][check] ? <SentimentSatisfied /> : <SentimentDissatisfied />}
                </div>
                <div style={{padding: '2px 4px'}}>{check}</div>
              </div>
            ))}
          </Grid>
        ))}
      </Grid>
    )
  }
}

export default withStyles(teamChecklistStyles)(TeamChecklist)