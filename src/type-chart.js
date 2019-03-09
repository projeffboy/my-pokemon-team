import Fab from '@material-ui/core/Fab'
import TableChart from '@material-ui/icons/TableChart'

import React from 'react'
// Material UI Core Imports
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import Typography from '@material-ui/core/Typography'
import TypeChartPng from './type-chart.png'

export default class TypeChart extends React.Component {
  constructor(props) {
    super(props)

    this.state = {isDialogOpen: false}
  }

  fab() {
    if (this.props.width === 'xs') {
      return (
        <Fab onClick={this.toggleDialog} color='primary' variant='rounded' size='small' style={{position: 'fixed', bottom: 16, right: 16}}>
          <TableChart />
        </Fab>
      )
    } else if (this.props.width === 'sm') {
      return (
        <Fab onClick={this.toggleDialog} color='primary' variant='rounded' size='large' style={{position: 'fixed', bottom: 16, right: 16}}>
          <TableChart />
        </Fab>
      )
    } else {
      return (
        <Fab onClick={this.toggleDialog} color='primary' variant='extended' size='large' style={{position: 'fixed', bottom: 16, right: 16}}>
          <TableChart style={{marginRight: 5}} />
          Type Chart
        </Fab>
      )
    }
  }

  toggleDialog = () => this.setState({isDialogOpen: !this.state.isDialogOpen})

  typoVariant() {
    if (this.props.width === 'xs') {
      return 'caption'
    } else {
      return 'h5'
    }
  }

  render() {
    return (
      <>
        {this.fab()}
        <Dialog
          open={this.state.isDialogOpen}
          onClose={this.toggleDialog}
          aria-labelledby='form-dialog-title'
          maxWidth='md'
        >
          <DialogContent style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            <img src={TypeChartPng} style={{maxWidth: '100%'}} />
            <Typography variant={this.typoVariant()} style={{paddingTop: 20}}>Strong against → Type → Strong against</Typography>
            <img src='https://i.pinimg.com/originals/7b/c6/58/7bc65872baa79ac690e9e4ae1aa8cb64.png' style={{maxWidth: '100%'}} />
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