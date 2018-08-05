import React from 'react'
import PropTypes from 'prop-types'
import {withStyles} from '@material-ui/core/styles'
import SwipeableViews from 'react-swipeable-views'
import AppBar from '@material-ui/core/AppBar'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import Typography from '@material-ui/core/Typography'
// 
import TeamChecklist from './more-info/team-checklist'
import SearchFilters from './more-info/search-filters'
import PokemonShowdownTeam from './more-info/pokemon-showdown-team'

function TabContainer({children, dir}) {
  return (
    <Typography component='div' dir={dir} style={{padding: '12px 18px'}}>
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
    borderRadius: 4,
  },
  appBar: {borderRadius: '4px 4px 0 0'},
  tab: {minWidth: 'initial'},
})

class MoreInfo extends React.Component {
  state = {
    value: 0,
  }

  handleChange = (event, value) => {
    this.setState({value})
  }

  handleChangeIndex = index => {
    this.setState({value: index})
  }

  render() {
    const {classes, theme, width} = this.props

    let tabTitles = [
      'Search Filters', 
      'Team Checklist', 
      'Pokemon Showdown Team',
    ]

    if (width !== 'lg' && width !== 'xl') { // If the screen is below 1200px
      tabTitles = [
        'Filters',
        'Checklist',
        'Showdown',
      ]
    }

    return (
      <div className={classes.root}>
        <AppBar position='static' color='default' className={classes.appBar}>
          <Tabs
            value={this.state.value}
            onChange={this.handleChange}
            indicatorColor='primary'
            textColor='primary'
            fullWidth
          >
            {tabTitles.map(title => <Tab label={title} key={title} className={classes.tab} />)}
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
              <TeamChecklist width={width} />, 
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

export default withStyles(styles, {withTheme: true})(MoreInfo)