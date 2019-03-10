import React from 'react'
// Material UI Core Imports
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import Typography from '@material-ui/core/Typography'
import Link from '@material-ui/core/Link'
import Terrain from '@material-ui/icons/Terrain'
import TableChart from '@material-ui/icons/TableChart'
import ListIcon from '@material-ui/icons/List'
import Whatshot from '@material-ui/icons/Whatshot'
import ColorLens from '@material-ui/icons/ColorLens'
import Code from '@material-ui/icons/Code'
import Layers from '@material-ui/icons/Layers'
import TrendingUp from '@material-ui/icons/TrendingUp'
import pokemonShowdownLogo from './pokemon-showdown-logo.png'

function listItems(element) {
  return [
    [<Terrain />, 'Landorus-T Face', 'https://archive.nyafuu.org/vp/last/50/34683395/'],
    [<Whatshot />, 'Incineroar Face', 'https://thegamehaus.com/wolfe-glick-wins-sixth-regional-title-vgc-2018-charlotte-regional-championships-recap/2018/03/20/'],
    [<TableChart />, 'Bulbapedia\'s Type Chart', 'https://bulbapedia.bulbagarden.net/wiki/Type'],
    [<ListIcon />, 'Non-table Type Chart', 'https://www.pinterest.ca/pin/307159637067301004/'],
    [<ColorLens />, 'Assigning each type a color', 'https://guiguilegui.wordpress.com/2016/05/23/pokemon-type-classifier-using-their-colors'],
    [<Code />, 'Javascript React framework', 'https://reactjs.org/'],
    [<Code />, 'MobX state management', 'https://mobx.js.org/'],
    [<Layers />, 'Material UI', 'https://material-ui.com/'],
    [<TrendingUp />, 'Google Analytics', 'https://support.google.com/analytics/answer/1008015?hl=en', 'For checking the viewcount and finding out where everyone is from'],
  ].map((pair, i) => (
    <ListItem key={i}>
        <ListItemIcon>
          {pair[0]}
        </ListItemIcon>
        <ListItemText primary={
          <Link
            style={{color: '#2196f3'}}
            variant='inherit'
            href={pair[2]}
          >
            {pair[1]}
          </Link>
        } secondary={pair[3] ? pair[3] : ''} />
    </ListItem>
  ))
}

class Credits extends React.Component {
  constructor(props) {
    super(props)

    this.state = {isDialogOpen: false}
  }

  toggleDialog = () => this.setState({isDialogOpen: !this.state.isDialogOpen})

  render() {
    return (
      <>
        <Button onClick={this.toggleDialog} style={{fontWeight: 'initial', textTransform: 'initial'}}>
          Credits
        </Button>
        <Dialog
          open={this.state.isDialogOpen}
          onClose={this.toggleDialog}
          aria-labelledby='form-dialog-title'
        >
          <DialogTitle id='form-dialog-title'>
            Credits
          </DialogTitle>
          <DialogContent>
            <Link href='https://pokemonshowdown.com'>
              <img src={pokemonShowdownLogo} alt='Pokemon Showdown Logo' style={{width: '50%', minWidth: 200}} />
            </Link>
            <Typography variant='body1' paragraph>The folks at Pokemon Showdown are very generous to let me use all of their GIFs, sprites, and pokemon data. Absolutely indispensable!</Typography>
            <Typography variant='h6' gutterBottom>Other</Typography>
            <List>
              {listItems()}
            </List>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.toggleDialog} color='primary'>
              Go Back
            </Button>
          </DialogActions>
        </Dialog>
      </>
    )
  }
}

export default Credits