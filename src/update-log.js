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
          Updates (Jan 17, 2023)
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
            <Typography paragraph><mark>I have school until Dec 5. I am planning some major changes, but those may take place next year.</mark></Typography>
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

            <Typography variant='subtitle2'>Jan 17, 2023</Typography>
            <Typography paragraph>Animated sprites for Hisui and Paldea.</Typography>
            <Typography paragraph>Mortal spin is treated as a spinner move (Credits: anonymous).</Typography>

            <Typography variant='subtitle2'>Jan 10, 2023</Typography>
            <Typography paragraph>The Paldea sprites now match the names in the dropdown list (Credits: anonymous).</Typography>

            <Typography variant='subtitle2'>Dec 18, 2022</Typography>
            <Typography paragraph>Items are updated for gen 9 (Credits: anonymous).</Typography>
            <Typography paragraph>Fixed a bug where selecting a pokemon whose pre-evolution has a hyphen in their name crashes, like Basculeigon (Credits: anonymous).</Typography>

            <Typography variant='subtitle2'>Nov 27, 2022</Typography>
            <Typography paragraph>Hisuain form pokemon have proper movesets (Credits: anonymous).</Typography>

            <Typography variant='subtitle2'>Nov 20, 2022</Typography>
            <Typography paragraph>Sprites weren't working for pokemon of alternate formes, e.g. mega abomasnow (Credits: Cashton Bermingham).</Typography>
            <Typography paragraph>Updated the the site for Pokemon Scarlet and Violet (generation 9). Expect bugs!</Typography>
            <Typography paragraph>Moves with a 100% of inflicting a status condition (e.g. nuzzle) are counted towards the checklist.</Typography>
            <Typography paragraph>Curse is treated as a setup move.</Typography>

            <Typography variant='subtitle2'>May 1, 2022</Typography>
            <Typography paragraph>Added floral healing and court change to team checklist. Renamed "Switch/Turn Move" to "Volt-turn Move".</Typography>

            <Typography variant='subtitle2'>Jan 4, 2022</Typography>
            <Typography paragraph>Liquid voice affects team type coverage.</Typography>
            
            <Typography variant='subtitle2'>Jan 3, 2022</Typography>
            <Typography paragraph>Fluffy and dry skin affects team defence (Anonymous x2).</Typography>
            <Typography paragraph>Dark mode (to be improved).</Typography>

            <Typography variant='subtitle2'>Nov 17, 2021</Typography>
            <Typography paragraph>Up until now, moves would not register for type coverage if you had a status or weak move of the same type on the same pokemon (Anonymous).</Typography>

            <Typography variant='subtitle2'>May 4, 2021</Typography>
            <Typography paragraph>I used the replaceAll() Javascript function which breaks on Samsung browsers (Credits: Anonymous).</Typography>

            <Typography variant='subtitle2'>Apr 29, 2021</Typography>
            <Typography paragraph>One of the offensive checklist items accepts either U-turn, Volt Switch, or Flip Turn instead of requiring both Volt Switch and U-turn.</Typography>
            <Typography paragraph>Zygarde 10% and Oricorio-Pa'u sprites load properly now.</Typography>
            <Typography paragraph>Florges and Floette don't crash anymore (Vegard Hamborg).</Typography>

            <Typography variant='subtitle2'>Apr 8, 2021</Typography>
            <Typography paragraph>The checklist is green for checked items.</Typography>

            <Typography variant='subtitle2'>Mar 31, 2021</Typography>
            <Typography paragraph>Choosing Sirfetch'd used to crash the site (dpplasma1).</Typography>
            <Typography paragraph>Further digging uncovered that the entire Mr. Mime family crashed the site.</Typography>
            <Typography paragraph>Galarian formes no longer take the base forme movesets instead.</Typography>

            <Typography variant='subtitle2'>Jan 11, 2021</Typography>
            <Typography paragraph>Fixed flying press bug. Updated how galar sprites are presented.</Typography>
            <Typography paragraph>Movesets for alola formes no longer take the base forme movesets instead (<Link style={{color: '#2196f3'}} variant='inherit' href='https://www.reddit.com/r/NintendoSwitch/comments/kuhc3d/pokemon_sword_and_shield_teambuilder/giv1p6v?utm_source=share&utm_medium=web2x&context=3'>thouartthee</Link>).</Typography>
            <Typography paragraph>Updated type defence so that what was once -2 or 2 is now -1.5 or 1.5 (<Link style={{color: '#2196f3'}} variant='inherit' href='https://www.reddit.com/r/stunfisk/comments/kuix21/updated_gen_8_teambuilder_mypokemonteamcom/gitspzk?utm_source=share&utm_medium=web2x&context=3'>GoneWithLaw</Link>).</Typography>

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