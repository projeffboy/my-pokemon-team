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
          Updated Jan 10, 2021
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
            <Typography paragraph><strong><mark>Updating the site for gen 8 took me 10 hours. Had I known it would be that quick, I would have updated it 2 years ago...</mark></strong></Typography>
            <div style={{display: 'flex', justifyContent: 'center'}}>
              <Button
                variant='outlined'
                color='primary'
                href='https://github.com/projeffboy/my-pokemon-team'
                style={{margin: '40px 0'}}
              >
                <Folder style={{marginRight: 5}} />
                GitHub Repo
              </Button>
            </div>
            <Typography variant='subtitle2'>Jan 11, 2021</Typography>
            <Typography paragraph>Fixed flying press bug. Update to how galar sprites are presentedc.</Typography>

            <Typography variant='subtitle2'>Jan 10, 2021</Typography>
            <Typography paragraph>Updated the site to accomodate generation 8 pokemon! Slight design tweaks.</Typography>

            <Typography variant='subtitle2'>Mar 26, 2019</Typography>
            <Typography paragraph>Importing Pokemon Showdown teams with gender specified works now (<Link style={{color: '#2196f3'}} variant='inherit' href='https://www.reddit.com/r/stunfisk/comments/az2f34/behold_the_ultimate_teambuilder/ejehmud?utm_source=share&utm_medium=web2x'>jkelligan</Link>).</Typography>

            <Typography variant='subtitle2'>Mar 10, 2019</Typography>
            <Typography paragraph>Fixed a bug where changing search filters caused some of the selected pokemon names to disappear. </Typography>
            <Typography paragraph>Water Bubble gives you +1 for Fire (<Link style={{color: '#2196f3'}} variant='inherit' href='https://www.reddit.com/r/stunfisk/comments/az2f34/behold_the_ultimate_teambuilder/ei6m1q0'>beyardo</Link>). </Typography>
            <Typography paragraph>You can now pick Primal Kyogre and Primal Groudon through the Uber search filter.</Typography>
            <Typography paragraph>Was missing Fairy and Normal in the search filters. They're included now.</Typography>
            
            <Typography variant='subtitle2'>Mar 9, 2019</Typography>
            <Typography paragraph>You can now click (as well as hover) over the types for more information. Good for phones.</Typography>
            <Typography paragraph>There's now a type chart button!</Typography>
            <Typography paragraph>Fixed a bug where alolan-form pokemon had the movesets of their non-alolan forms (<Link style={{color: '#2196f3'}} variant='inherit' href='https://www.reddit.com/r/stunfisk/comments/az2f34/behold_the_ultimate_teambuilder/ei4t5g6'>DJdeMaster</Link>).</Typography>
            <Typography paragraph>The search filter VGC 2018 is updated to VGC 2019 (<Link style={{color: '#2196f3'}} variant='inherit' href='https://www.reddit.com/r/stunfisk/comments/az2f34/behold_the_ultimate_teambuilder/ei4xcwx'>Elmodipus</Link>).</Typography>
            <Typography paragraph>Added the "superior" type chart (<Link style={{color: '#2196f3'}} variant='inherit' href='http://i.imgur.com/fylyCdC.png'>Bardock_RD</Link>).</Typography>
            <Typography paragraph>The code is now open sourced (<Link style={{color: '#2196f3'}} variant='inherit' href='https://www.reddit.com/r/stunfisk/comments/az2f34/behold_the_ultimate_teambuilder/ei4yxo3'>Crescive_Delta</Link>)! </Typography>
            
            <Typography variant='subtitle2'>Mar 8, 2019</Typography>
            <Typography paragraph>Updated the Smogon formats/tiers (for the search filters).</Typography>
            <Typography paragraph>Included a manual page clarifying how to use this site.</Typography>
            
            <Typography variant='subtitle2'>Mar 6, 2019</Typography>
            <Typography paragraph>Super effective STAB moves now count for +2 instead of +1.</Typography>
           
            <Typography variant='subtitle2'>Feb 25, 2019</Typography>
            <Typography paragraph>Fixed a bug where alternate formes had the moveset of their base forme. For example, White Kyurem couldn't learn Fusion Flare (<Link style={{color: '#2196f3'}} variant='inherit' href='https://www.reddit.com/r/pokemon/comments/aumnvh/brand_new_ultra_sun_and_moon_team_builder/eh95wr3'>DMSivally</Link>).</Typography>
            <Typography paragraph>Fixing the above bug caused selecting Megas to break the app. This is fixed too now (<Link style={{color: '#2196f3'}} variant='inherit' href='https://www.reddit.com/r/pokemon/comments/aumnvh/brand_new_ultra_sun_and_moon_team_builder/eha3o9p'>kwiszat</Link>).</Typography>
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