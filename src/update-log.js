import React from 'react'
// Material UI Core Imports
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import Typography from '@material-ui/core/Typography'
import Link from '@material-ui/core/Link'
import Folder from '@material-ui/icons/Folder'

class UpdateLog extends React.Component {
  constructor(props) {
    super(props)

    this.state = {isDialogOpen: false}
  }

  toggleDialog = () => this.setState({isDialogOpen: !this.state.isDialogOpen})

  render() {
    return (
      <>
        <Button onClick={this.toggleDialog} style={{fontWeight: 'initial', textTransform: 'initial'}}>
          Updated Mar 9, 2019
        </Button>
        <Dialog
          open={this.state.isDialogOpen}
          onClose={this.toggleDialog}
          aria-labelledby='form-dialog-title'
        >
          <DialogTitle id='form-dialog-title'>
            Update Log
          </DialogTitle>
          <DialogContent>
            <div style={{display: 'flex', justifyContent: 'center'}}>
              <Button
                variant='outlined'
                color='primary'
                href='https://github.com/projeffboy/my-pokemon-team'
                style={{margin: '10px 0 30px'}}
              >
                <Folder style={{marginRight: 5}} />
                GitHub Repo
              </Button>
            </div>
            <Typography variant='subtitle2'>Feb 25, 2019</Typography>
            <Typography paragraph>Fixed a bug where alternate formes had the moveset of their base forme. For example, White Kyurem couldn't learn Fusion Flare (<Link style={{color: '#2196f3'}} variant='inherit' href='https://www.reddit.com/r/pokemon/comments/aumnvh/brand_new_ultra_sun_and_moon_team_builder/eh95wr3'>DMSivally</Link>).</Typography>
            <Typography paragraph>Fixing the above bug caused selecting Megas to break the app. This is fixed too now (<Link style={{color: '#2196f3'}} variant='inherit' href='https://www.reddit.com/r/pokemon/comments/aumnvh/brand_new_ultra_sun_and_moon_team_builder/eha3o9p'>kwiszat</Link>).</Typography>
            <Typography variant='subtitle2'>Mar 6, 2019</Typography>
            <Typography paragraph>Super effective STAB moves now count for +2 instead of +1.</Typography>
            <Typography variant='subtitle2'>Mar 8, 2019</Typography>
            <Typography paragraph>Updated the Smogon formats/tiers (for the search filters).</Typography>
            <Typography paragraph>Included a manual page clarifying how to use this site.</Typography>
            <Typography variant='subtitle2'>Mar 9, 2019</Typography>
            <Typography paragraph>You can now click (as well as hover) over the types for more information. Good for phones.</Typography>
            <Typography paragraph>There's now a type chart button!</Typography>
            <Typography paragraph>Fixed a bug where alolan-form pokemon had the movesets of their non-alolan forms (<Link style={{color: '#2196f3'}} variant='inherit' href='https://www.reddit.com/r/stunfisk/comments/az2f34/behold_the_ultimate_teambuilder/ei4t5g6'>DJdeMaster</Link>).</Typography>
            <Typography paragraph>The search filter VGC 2018 is updated to VGC 2019 (<Link style={{color: '#2196f3'}} variant='inherit' href='https://www.reddit.com/r/stunfisk/comments/az2f34/behold_the_ultimate_teambuilder/ei4xcwx'>Elmodipus</Link>).</Typography>
            <Typography paragraph>Added the "superior" type chart (<Link style={{color: '#2196f3'}} variant='inherit' href='http://i.imgur.com/fylyCdC.png'>Bardock_RD</Link>).</Typography>
            <Typography paragraph>The code is now open sourced (<Link style={{color: '#2196f3'}} variant='inherit' href='https://www.reddit.com/r/stunfisk/comments/az2f34/behold_the_ultimate_teambuilder/ei4yxo3'>Crescive_Delta</Link>)! </Typography>
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

export default UpdateLog