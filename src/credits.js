import React from 'react'
// Material UI Core Imports
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'

class Credits extends React.Component {
  constructor(props) {
    super(props)

    this.state = {isDialogOpen: false}
  }

  toggleDialog = () => this.setState({isDialogOpen: !this.state.isDialogOpen})

  render() {
    return (
      <React.Fragment>
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
            <h3>Pokemon Showdown</h3>
            <p>All the GIFs, sprites, and pokemon data. Thank you so much for letting me use them, they're absolutely indispensable!</p>
            <h3>Other</h3>
            <ul>
              <li>
                <a href='https://archive.nyafuu.org/vp/last/50/34683395/'>
                  Landorus-T Face
                </a>
              </li>
              <li>
                <a href='https://thegamehaus.com/wolfe-glick-wins-sixth-regional-title-vgc-2018-charlotte-regional-championships-recap/2018/03/20/'>
                  Incineroar Face
                </a>
              </li>
              <li>
                <a href='https://guiguilegui.wordpress.com/2016/05/23/pokemon-type-classifier-using-their-colors/'>
                  Assigning each type a color
                </a>
              </li>
              <li>
                <a href='https://reactjs.org/'>
                  Javascript React framework
                </a>
              </li>
              <li>
                <a href='https://material-ui.com/'>
                  Material UI
                </a>
              </li>
            </ul>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.toggleDialog} color='primary'>
              Go Back
            </Button>
          </DialogActions>
        </Dialog>
      </React.Fragment>
    )
  }
}

export default Credits