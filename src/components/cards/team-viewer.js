import React from 'react'
import {withStyles} from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import Paper from '@material-ui/core/Paper'
import {appStyles, teamViewerStyles} from '../../styles'
import Pokemon from './pokemon'
import Sprite from './pokemon/sprite'

class TeamViewer extends React.Component {
  constructor(props) {
    super(props)

    this.state = {value: 0}
  }

  handleChange = (e, value) => { // value is the tab index
    this.setState({value})
  }

  getTwoPokemonSprites(teamSlot) {
    const {classes, width} = this.props

    return (
      <div className={classes.twoSprites}>
        <Sprite teamSlot={2 * teamSlot - 1} width={width} />
        <Sprite teamSlot={2 * teamSlot} width={width} />
      </div>
    )
  }

  render() {
    const {classes, width} = this.props
    const {value} = this.state

    return (
      <React.Fragment>
        <Grid item xs={12}>
          <Paper>
            <Tabs value={value} onChange={this.handleChange} fullWidth>
              {
                [1, 2, 3].map(teamSlot => (
                  <Tab 
                    key={teamSlot}
                    label={`${2 * teamSlot - 1} - ${2 * teamSlot}`}
                    icon={this.getTwoPokemonSprites(teamSlot)}/>
                ))
              }
              {width === 'xs' ?
                [4, 5, 6].map(num => (
                  <Tab key={num} label={num} />
                ))
              : []}
            </Tabs>
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper className={`${classes.paper} ${classes.oneOfTwoPkmn}`}>
            <Pokemon teamSlot={2 * this.state.value + 1} />
          </Paper>
        </Grid>
        {width === 'sm' ? 
          <Grid item xs={12}>
            <Paper className={classes.paper}>
              <Pokemon teamSlot={2 * this.state.value + 2} />
            </Paper>
          </Grid>
         : []}
      </React.Fragment>
    )
  }
}

export default withStyles({...appStyles, ...teamViewerStyles})(TeamViewer)