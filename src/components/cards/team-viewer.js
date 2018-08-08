import React from 'react'
// Material UI Imports
import {withStyles} from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import Paper from '@material-ui/core/Paper'
// My Component Imports
import {paperStyles, teamViewerStyles} from '../../styles'
import Pokemon from './pokemon'
import Sprite from './pokemon/sprite'

/*
 * NOTE!!!
 * This component can only be viewed below a viewport width of 960px
 */
class TeamViewer extends React.Component {
  constructor(props) {
    super(props)

    /*
     * Depending on your viewport, either 3 or 6 tabs are shown.
     * smTabIndex stores which of the 3 tabs are clicked/focused on.
     * xsTabIndex stores which of the 6 tabs are clicked/focused on.
     */
    this.state = {
      smTabIndex: 0,
      xsTabIndex: 0,
    }
  }

  // Changge smTabIndex betwen 600px and 959px
  // Change xsTabIndex below 600px
  handleChange = (e, val) => {
    if (this.props.width === 'sm') {
      this.setState({smTabIndex: val})
    } else {
      this.setState({xsTabIndex: val})
    }
  }

  /*
   * Returns two mini sprites
   * Of either the pokemon in team slot 1 and 2,
   * 3 and 4,
   * or 5 and 6.
   */
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
    const {smTabIndex, xsTabIndex} = this.state

    return (
      <React.Fragment>
        <Grid item xs={12}>
          <Paper>
            <Tabs 
              value={width === 'sm' ? smTabIndex : xsTabIndex} 
              onChange={this.handleChange} 
              fullWidth
            >
              { // Either displays 3 or 6 tabs
                width === 'sm'
                  ? [1, 2, 3].map(teamSlot => (
                    <Tab 
                      key={teamSlot}
                      label={`${2 * teamSlot - 1} - ${2 * teamSlot}`}
                      icon={this.getTwoPokemonSprites(teamSlot)}
                    />
                  ))
                  : [1, 2, 3, 4, 5, 6].map(teamSlot => (
                      <Tab 
                        key={teamSlot}
                        label={teamSlot}
                        className={classes.xsTab}
                        icon={<Sprite teamSlot={teamSlot} width={width} />}
                      />
                    ))
              }
            </Tabs>
          </Paper>
        </Grid>
        { // Either displays 2 or 1 pokemon at a time
          width === 'sm'
            ? [1, 2].map(num => (
                <Grid key={num} item xs={12}>
                  <Paper className={`${classes.paper} ${classes.oneOfTwoPkmn}`}>
                    <Pokemon teamSlot={2 * smTabIndex + num} />
                  </Paper>
                </Grid>
              ))
            : <Grid item xs={12}>
                <Paper className={`${classes.paper} ${classes.oneOfTwoPkmn}`}>
                  <Pokemon teamSlot={xsTabIndex + 1} />
                </Paper>
              </Grid>
        }
      </React.Fragment>
    )
  }
}

export default withStyles({...paperStyles, ...teamViewerStyles})(TeamViewer)