import React from 'react'
import PropTypes from 'prop-types'
import {withStyles} from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import Typography from '@material-ui/core/Typography'
import Paper from '@material-ui/core/Paper'
import {appStyles} from '../styles'
import Pokemon from './pokemon'

function TabContainer(props) {
  return (
    <Typography component='div' style={{padding: 8 * 3}}>
      {props.children}
    </Typography>
  )
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
}

class SimpleTabs extends React.Component {
  state = {
    value: 0,
  }

  handleChange = (event, value) => {
    this.setState({value})
  }

  render() {
    const {classes} = this.props
    const {value} = this.state

    return (
      <React.Fragment>
        <Grid item xs={12}>
          <Paper className={classes.paper}>
            <Tabs value={value} onChange={this.handleChange}>
              <Tab label='1' />
              <Tab label='2' />
              <Tab label='3' />
              <Tab label='4' />
              <Tab label='5' />
              <Tab label='6' />
            </Tabs>
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper className={classes.paper}>
            {/*value === 0 && 'Item One'*/}
            {/*value === 1 && 'Item Two'*/}
            {/*value === 2 && 'Item Three'*/}
            <Pokemon teamSlot={1} />
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper className={classes.paper}>
            {/*value === 0 && 'Item One'*/}
            {/*value === 1 && 'Item Two'*/}
            {/*value === 2 && 'Item Three'*/}
            <Pokemon teamSlot={1} />
          </Paper>
        </Grid>
      </React.Fragment>
    )
  }
}

SimpleTabs.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withStyles(appStyles)(SimpleTabs)