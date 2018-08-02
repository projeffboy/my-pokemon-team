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
        'Entry Hazards': false, 
        'Spinner': false, 
        'Recovery': false,
      },
      'Defensive': {
        'Cleric': false, 
        'Statuser': false, 
        'Phazer': false,
      },
      'Offensive': {
        'Booster': false, 
        'Volt-turn': false, 
        'Choice User': false,
      },
    }

    console.log(store.teamItems)
  
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