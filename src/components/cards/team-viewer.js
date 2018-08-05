import React from 'react'
import {withStyles} from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import Paper from '@material-ui/core/Paper'
import {appStyles} from '../../styles'
import Pokemon from './pokemon'

class TeamViewer extends React.Component {
  constructor(props) {
    super(props)

    this.state = {value: 0}
  }

  handleChange = (e, value) => {
    this.setState({value})
  }

  render() {
    const {classes, width} = this.props
    const {value} = this.state

    return (
      <React.Fragment>
        <Grid item xs={12}>
          <Paper className={classes.paper}>
            <Tabs value={value} onChange={this.handleChange}>
              <Tab label='1' />
              <Tab label='2' />
              <Tab label='3' />
              {width === 'sm' ?
                [4, 5, 6].map(num => (
                  <Tab key={num} label={num} />
                ))
              : []}
            </Tabs>
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper className={classes.paper}>
            <Pokemon teamSlot={this.state.value + 1} />
          </Paper>
        </Grid>
        {width === 'sm' ? 
          <Grid item xs={12}>
            <Paper className={classes.paper}>
              <Pokemon teamSlot={this.state.value + 2} />
            </Paper>
          </Grid>
         : []}
      </React.Fragment>
    )
  }
}

export default withStyles(appStyles)(TeamViewer)