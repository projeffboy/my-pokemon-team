import React from 'react'
import SwipeableViews from 'react-swipeable-views'
// Material UI Imports
import {withStyles} from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import Typography from '@material-ui/core/Typography'
// My Component Imports
import TeamChecklist from './more-info/team-checklist'
import SearchFilters from './more-info/search-filters'
import PokemonShowdownTeam from './more-info/pokemon-showdown-team'
import {moreInfoStyles} from '../../styles'

class MoreInfo extends React.Component {
  constructor(props) {
    super(props)
    this.state = {tabIndex: 0}
  }

  // Click to change tab
  handleChange = (event, value) => {
    this.setState({tabIndex: value})
  }

  // Swipe to change tab
  handleChangeIndex = index => {
    this.setState({tabIndex: index})
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
          {/* E.g.  | Search Filters | Team Checklist | Pokemon Showdown Team | */}
          <Tabs
            value={this.state.tabIndex}
            onChange={this.handleChange}
            indicatorColor='primary'
            textColor='primary'
            fullWidth
          >
            {tabTitles.map(title => <Tab label={title} key={title} className={classes.tab} />)}
          </Tabs>
        </AppBar>
        {/* The stuff below the tabs */}
        <SwipeableViews
          axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
          index={this.state.tabIndex}
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

// The stuff below each tab
const TabContainer = ({children, dir}) => (
  <Typography component='div' dir={dir} style={{padding: '12px 18px'}}>
    {children}
  </Typography>
)

export default withStyles(moreInfoStyles, {withTheme: true})(MoreInfo)