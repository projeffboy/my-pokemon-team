import React from 'react'
import {withStyles} from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import SwapVert from '@material-ui/icons/SwapVert'
import Save from '@material-ui/icons/Save' // change this to FileCopy you get the chance
import TextField from '@material-ui/core/TextField'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import {observer} from 'mobx-react'
import store from '../../../store'
import Snackbar from '@material-ui/core/Snackbar'

const styles = theme => ({
  root: {display: 'none'},
  button: {
    margin: theme.spacing.unit,

  },
  input: {display: 'none'},
  textField: {margin: '20px 0'},
})

@observer
class PokemonShowdownTeam extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      isDialogOpen: false,
      textArea: '',
    }
  }

  handleTextArea = event => {
    this.setState({textArea: event.target.value})
  }

  handleClick = (e, text) => {
    this.setState({
      isDialogOpen: true,
      textArea: text,
    })
  }

  handleClose = () => this.setState({isDialogOpen: false})

  handleImport = () => {
    let teamPkmnRawData = this.state.textArea.split('\n\n') // split team into each pokemon

    teamPkmnRawData = teamPkmnRawData.filter(eachPkmnData => eachPkmnData) // get rid of empty lines
    teamPkmnRawData.forEach((eachPkmnData, teamIndex) => {
      const lines = eachPkmnData.split('\n') // split pokemon into its properties
      
      // Get pokemon and item names
      const pkmnAndItemNames = lines[0].split('@').map(str => str.trim())
      const [pkmnName, itemName] = pkmnAndItemNames

      // Check if the pokemon the user typed is legit
      const pkmn = store.pkmnNameInverse(pkmnName)
      if (pkmn) {
        store.team[teamIndex].name = pkmn // if legit, set pokemon ID/name

        // If team raw data does not mention item, leave it blank
        if (itemName) {
          // Check if item is legit
          const item = store.itemNameInverse(itemName)
          if (item) {
            store.team[teamIndex].item = item // if legit, set item ID/name
          } else {
            store.autoSelectItem()
          }
        } else {
          store.team[teamIndex].item = ''
        }

        let moveNum = 1
        let abilityChanged = false

        lines.slice(1).forEach((line, i) => {
          if (line.includes('Ability:')) { // if property has to do with abilities
            const ability = line.replace('Ability:', '').trim()

            // If legit, set ability
            if (Object.values(store.abilities(pkmn)).includes(ability)) {
              store.team[teamIndex].ability = ability
            } else {
              store.autoSelectAbility()
            }

            abilityChanged = true
          } else if (line[0] === '-' && moveNum <= 4) { // if property has to do with moves
            const moveName = line
              .slice(1)
              .trim()
              .replace('[', '') // Smogon accepts, for instance, 'Hidden Power [Fire]' as a move
              .replace(']', '')

            // If legit, set move
            if (store.moveNameInverse(moveName)) {
              const move = store.moveNameInverse(moveName)

              store.team[teamIndex]['move' + moveNum] = move

              moveNum++
            }
          }
        })

        // If team raw data does not mention ability, leave it blank
        if (!abilityChanged) {
          store.team[teamIndex].ability = ''
        }
      }
    })

    this.handleClose()

    // display snackbar for success for failure
  }

  handleCopy = text => {
    let textArea = document.createElement('textarea')

    textArea.value = text
    document.body.appendChild(textArea)
    textArea.select()
    document.execCommand('copy')
    textArea.remove()
  }

  render() {
    const {classes, width} = this.props

    const pokemonShowdownTeamInfo = [0, 1, 2, 3, 4, 5].map(teamIndex => {
      const {name, item, ability} = store.team[teamIndex]

      if (name) {
        return (
`${store.pkmnName(name)} @ ${store.itemName(item)}
Ability: ${ability}
${[1, 2, 3, 4].map(num => {
  const move = store.team[teamIndex]['move' + num]

  if (move) {
    return '-' + store.moveName(move)
  } else {
    return '-'
  }
}).join('\n')}\n\n`
        )
      }
    }).join('')

    let buttonLabels = ['Import/Export Team', 'Copy Team']
    if (width === 'xs' || width === 'sm') {
      buttonLabels = ['Import/Export', 'Copy']
    }

    return (
      <React.Fragment>
        <Button onClick={e => this.handleClick(e, pokemonShowdownTeamInfo)}>
          Import/Export Team <SwapVert />
        </Button>
        <Dialog
          open={this.state.isDialogOpen}
          onClose={this.handleClose}
          aria-labelledby='form-dialog-title'
        >
          <DialogTitle id='form-dialog-title'>
            Import/Export
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              You can take a look at and change the raw data of your pokemon team.
              <br />
              If you use <a href='https://play.pokemonshowdown.com/teambuilder'>Pokemon Showdown</a>, you can paste your team here.
              <br />
              Likewise, you can copy your team here and paste it to Pokemon Showdown.
            </DialogContentText>
            <TextField
              autoFocus
              id='name'
              placeholder='Your team is empty'
              label='Pokemon Showdown Team Raw Text'
              multiline
              fullWidth
              className={classes.textField}
              defaultValue={pokemonShowdownTeamInfo}
              onChange={this.handleTextArea}
            />
            <DialogContentText>
              Note: The above raw text ignores nicknames, EVs, IVs, natures, level, gender, happiness, and shiny.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color='primary'>
              Cancel
            </Button>
            <Button onClick={this.handleImport} color='primary'>
              OK
            </Button>
          </DialogActions>
        </Dialog>
        <Button onClick={() => this.handleCopy(pokemonShowdownTeamInfo)} className={classes.button}>
          Copy Team <Save />
        </Button>
      </React.Fragment>
    )
  }
}

class PositionedSnackbar extends React.Component {
  state = {
    open: false,
    vertical: 'top',
    horizontal: 'center',
  };

  handleClick = state => () => {
    this.setState({ open: true, ...state });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  render() {
    const { vertical, horizontal, open } = this.state;
    return (
      <div>
        <Button onClick={this.handleClick({ vertical: 'bottom', horizontal: 'center' })}>
          Bottom-Center
        </Button>
        <Snackbar
          anchorOrigin={{ vertical, horizontal }}
          open={open}
          onClose={this.handleClose}
          ContentProps={{
            'aria-describedby': 'message-id',
          }}
          message={<span id="message-id">I love snacks</span>}
        />
      </div>
    );
  }
}

export default withStyles(styles)(PokemonShowdownTeam)