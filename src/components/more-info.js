import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import SwipeableViews from 'react-swipeable-views'
import AppBar from '@material-ui/core/AppBar'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import Typography from '@material-ui/core/Typography'
// 
import TeamChecklist from './more-info/team-checklist'
import SearchFilters from './more-info/search-filters'
import PokemonShowdownTeam from './more-info/pokemon-showdown-team'

function TabContainer({ children, dir }) {
  return (
    <Typography component='div' dir={dir} style={{ padding: 18 }}>
      {children}
    </Typography>
  )
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
  dir: PropTypes.string.isRequired,
}

const styles = theme => ({
  root: {
    backgroundColor: theme.palette.background.paper,
  },
})

class MoreInfo extends React.Component {
  state = {
    value: 0,
  }

  handleChange = (event, value) => {
    this.setState({ value })
  }

  handleChangeIndex = index => {
    this.setState({ value: index })
  }

  render() {
    const { classes, theme } = this.props

    return (
      <div className={classes.root}>
        <AppBar position='static' color='default'>
          <Tabs
            value={this.state.value}
            onChange={this.handleChange}
            indicatorColor='primary'
            textColor='primary'
            fullWidth
          >
            {
              [
                'Search Filters', 
                'Team Checklist', 
                'Pokemon Showdown Team',
              ].map(title => <Tab label={title} key={title} />)
            }
          </Tabs>
        </AppBar>
        <SwipeableViews
          axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
          index={this.state.value}
          onChangeIndex={this.handleChangeIndex}
        >
          {
            [
              <SearchFilters />, 
              <TeamChecklist />, 
              <PokemonShowdownTeam />,
            ].map((component, i) => <TabContainer dir={theme.direction} key={i}>{component}</TabContainer>)
          }
        </SwipeableViews>
      </div>
    )
  }
}

MoreInfo.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
}

export default withStyles(styles, { withTheme: true })(MoreInfo)