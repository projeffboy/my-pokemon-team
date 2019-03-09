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
import Whatshot from '@material-ui/icons/Whatshot'
import ColorLens from '@material-ui/icons/ColorLens'
import Code from '@material-ui/icons/Code'
import Layers from '@material-ui/icons/Layers'
import pokemonShowdownLogo from './pokemon-showdown-logo.png'

function listItems(element) {
  return [
    [<Terrain />, 'Landorus-T Face', 'https://archive.nyafuu.org/vp/last/50/34683395/'],
    [<Whatshot />, 'Incineroar Face', 'https://thegamehaus.com/wolfe-glick-wins-sixth-regional-title-vgc-2018-charlotte-regional-championships-recap/2018/03/20/'],
    [<ColorLens />, 'Assigning each type a color', 'https://guiguilegui.wordpress.com/2016/05/23/pokemon-type-classifier-using-their-colors'],
    [<Code />, 'Javascript React framework', 'https://reactjs.org/'],
    [<Layers />, 'Material UI', 'https://material-ui.com/'],
  ].map((pair, i) => (
    <ListItem key={i}>
        <ListItemIcon>
          {pair[0]}
        </ListItemIcon>
        <ListItemText primary={
          <Link
            color='secondary'
            variant='inherit'
            href={pair[2]}
          >
            {pair[1]}
          </Link>
        } />
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
              <img src={pokemonShowdownLogo} alt='Pokemon Showdown Logo' style={{width: '50%'}} />
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