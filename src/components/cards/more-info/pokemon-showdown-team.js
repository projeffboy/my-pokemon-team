import React from 'react'
// Material UI Core Imports
import {withStyles} from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
// Material UI Icons Imports
import ImportExport from '@material-ui/icons/ImportExport'
import FileCopy from '@material-ui/icons/FileCopy'
// Custom Imports
import {observer} from 'mobx-react'
import store from '../../../store'
import {pokemonShowdownTeamStyles} from '../../../styles'

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

  handleClick = (event, text) => {
    this.setState({
      isDialogOpen: true,
      textArea: text,
    })
  }

  handleClose = () => this.setState({isDialogOpen: false})

  handleImport = initialText => {
    if (this.state.textArea !== initialText) {
      let teamPkmnRawData = this.state.textArea.split('\n\n') // split team into each pokemon
      let numberOfTeamPkmn = 0

      teamPkmnRawData = teamPkmnRawData.filter(eachPkmnData => eachPkmnData) // get rid of empty lines
      teamPkmnRawData.forEach((eachPkmnData, teamIndex) => {
        numberOfTeamPkmn++

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
                abilityChanged = true
              }

            } else if (line[0] === '-' && moveNum <= 4) { // if property has to do with moves
              const moveName = line
                .slice(1)
                .trim()
                .replace('[', '') // Smogon accepts, for instance, 'Hidden Power [Fire]' as a move
                .replace(']', '')

              // If legit, set move
              // Otherwise, set it blank
              const move = store.moveNameInverse(moveName)

              let validMove = store.canItLearn(move, pkmn) ? move : ''

              store.team[teamIndex]['move' + moveNum] = validMove

              moveNum++
            }
          })

          // If team raw data does not mention ability, leave it blank
          if (!abilityChanged) {
            store.team[teamIndex].ability = ''
            store.autoSelectAbility()
          }
        }
      })

      /*
       * Clears unwanted duplicate pokemon
       * Happens when the user for example...
       *  -adds pikachu to the 3rd team slot (`teamIndex` of 2)
       *  -presses import/export button
       *  -modifies that pikachu's raw data
       *  -presses OK
       * Without this code, there will be two pikachus, at slot 1 and slot 3
       */
      for (let i = numberOfTeamPkmn; i < 6; i++) {
        store.clearTeamPkmnProps(i)
      }

    } else {
      store.openSnackbar('No changes made.')
    }

    this.handleClose()
  }

  handleCopy = text => {
    if (text !== '') {
      // Copied this code from https://hackernoon.com/copying-text-to-clipboard-with-javascript-df4d4988697f

      let textArea = document.createElement('textarea')

      textArea.value = text
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      textArea.remove()

      //

      store.openSnackbar('Team copied.')
    } else {
      store.openSnackbar('Empty team, nothing to copy.')
    }
  }

  render() {
    const {classes/*, width*/} = this.props

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

    /*
    let buttonLabels = ['Import/Export Team', 'Copy Team']
    if (width === 'xs' || width === 'sm') {
      buttonLabels = ['Import/Export', 'Copy']
    }
    */

    return (
      <React.Fragment>
        <Button onClick={e => this.handleClick(e, pokemonShowdownTeamInfo)}>
          Import/Export Team <ImportExport />
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
            <Button onClick={() => this.handleImport(pokemonShowdownTeamInfo)} color='primary'>
              OK
            </Button>
          </DialogActions>
        </Dialog>
        <Button onClick={() => this.handleCopy(pokemonShowdownTeamInfo)} className={classes.button}>
          Copy Team <FileCopy />
        </Button>
      </React.Fragment>
    )
  }
}

export default withStyles(pokemonShowdownTeamStyles)(PokemonShowdownTeam)