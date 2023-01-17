import React from 'react'
import Grid from '@material-ui/core/Grid'
import {withStyles} from '@material-ui/core/styles'
import {teamChecklistStyles} from '../../../styles'
import CheckCircle from '@material-ui/icons/CheckCircle'
import Cancel from '@material-ui/icons/Cancel'
import {observer} from 'mobx-react'
import store from '../../../store'
import Typography from '@material-ui/core/Typography'

@observer
class TeamChecklist extends React.Component {
  render() {
    const {classes, width} = this.props

    let checklist = {
      'General': {
        'Entry Hazard': store.doesTeamHaveMoves([
          'spikes',
          'stealthrock',
          'toxicspikes',
          'stickyweb',
          'stoneaxe',
        ]), 
        'Spinner/Defogger': store.doesTeamHaveMoves([
          'rapidspin',
          'defog',
          'courtchange',
          'tidyup',
          'mortalspin',
        ]), 
        'Reliable Recovery': store.doesTeamHaveMoves([
          'healorder',
          'floralhealing',
          'milkdrink',
          'moonlight',
          'morningsun',
          'recover',
          'roost',
          'shoreup',
          'softboiled',
          'strengthsap',
          'synthesis',
        ]) || this.hasWishAndProtect(),
      },
      'Defensive': {
        'Cleric': store.doesTeamHaveMoves(['aromatherapy', 'healbell']), 
        'Status Move': store.anyStatusMoves, 
        'Phazer': store.doesTeamHaveMoves([
          'circlethrow',
          'dragontail',
          'roar',
          'whirlwind',
        ]),
      },
      'Offensive': {
        'Boosting Move': store.anyBoostingMoves, 
        'Volt-turn Move': store.doesTeamHaveMove('voltswitch')
          || store.doesTeamHaveMove('uturn')
          || store.doesTeamHaveMove('flipturn'), 
        'Choice Item': store.doesTeamHaveItems([
          'choicescarf',
          'choiceband',
          'choicespecs',
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
        'Choice'
      ]
    }
    if (width === 'sm' || width === 'xs') {
      checklistAbbr[1] = 'Spin'
      checklistAbbr[2] = 'Heal'
      checklistAbbr[7] = 'Volturn'
    }
  
    return (
        Object.keys(checklist).map((miniHeader, i) => (
          <Grid key={miniHeader} item xs={4}>
            {/* E.g. Offensive */}
            <Typography
              className={classes.miniHeader}
              variant='body1'
              component='div'
              style={{lineHeight: 'initial'}}
            >
              {miniHeader}
            </Typography>
            {Object.keys(checklist[miniHeader]).map((check, j) => (
              <div key={check} style={{display: 'flex'}}>
                {/* Either a checkmark or a cross */}
                <div>
                  {
                    checklist[miniHeader][check]
                    ? <CheckCircle style={{color: '#16a085'}} />
                    : <Typography
                        variant='body1'
                        component='div'
                        style={{lineHeight: 'initial'}}
                      >
                        <Cancel />
                      </Typography>
                  }
                </div>
                {/* E.g. Choice Item (Or "Choice" for smaller screens) */}
                <Typography
                  style={{padding: '0px 4px'}}
                  variant='body1'
                  component='div'
                >
                  {checklistAbbr[3 * i + j] || check}
                </Typography>
              </div>
            ))}
          </Grid>
        ))

    )
  }

  // wish + protect-like move counts as reliable recovery
  hasWishAndProtect() {
    return store.doesTeamPokemonHaveTheseMoves(['wish', [
      'protect',
      'detect',
      'banefulbunker',
      'spikyshield',
      'kingsshield',
    ]])
  }
}

export default withStyles(teamChecklistStyles)(TeamChecklist)