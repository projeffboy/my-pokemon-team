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

const styles = theme => ({
  root: {display: 'none'},
  button: {
    margin: theme.spacing.unit,

  },
  input: {display: 'none'},
  textField: {margin: '20px 0'},
})

@observer
class PokemonShowdownTeams extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      open: false,
      textArea: '',
    }
  }

  handleTextArea = event => {
    this.setState({textArea: event.target.value})
  }

  handleClickOpen = () => this.setState({open: true})

  handleClose = () => this.setState({open: false})

  handleChange = () => {
    const textAreaLines = this.state.textArea.split('\n')

    let teamIndex = 0
    let moveNum = 1
    let attrOrder = 0

    textAreaLines.forEach(line => {
      if (line.includes('@')) {
        teamIndex++
        moveNum = 1
        attrOrder = 1

        // set name and item
        const [name, item] = line.split('@').trim()
      } else if (attrOrder <= 1 && line.includes('Ability: ')) {
        attrOrder = 2

        // set ability
        const ability = line.replace('Ability: ', '').trim()
      } else if (attrOrder <= 2 && line[0] === '-') {
        // set move
        const move = line.slice(1).trim()
        /*
        if (store.moves[move] && store.pokemon[teamIndex]) {

        }
        */

        moveNum++
      }
    })

    this.handleClose()

    // display snackbar for success for failure
  }

  render() {
    const {classes, width} = this.props
    const pokemonShowdownTeamInfo = [0, 1, 2, 3, 4, 5].map(teamIndex => {
      const {name, item, ability} = store.pokemon[teamIndex]

      if (name) {
        return (
`
${store.speciesName(name)} @ ${item}
Ability: ${ability}
${[1, 2, 3, 4].map(num => {
  const move = store.pokemon[teamIndex]['move' + num]

  if (move) {
    return '-' + store.moveName(move)
  } else {
    return '-'
  }
}).join('\n')}

`
        )
      }
    })

    let buttonLabels = ['Import/Export Team', 'Copy Team']
    if (width === 'xs' || width === 'sm') {
      buttonLabels = ['Import/Export', 'Copy']
    }

    return (
      <React.Fragment>
        <Button onClick={this.handleClickOpen}>
          Import/Export Team <SwapVert />
        </Button>
        <Dialog
          open={this.state.open}
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
              defaultValue={pokemonShowdownTeamInfo.join('')}
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
            <Button onClick={this.handleChange} color='primary'>
              OK
            </Button>
          </DialogActions>
        </Dialog>
        <Button className={classes.button}>Copy Team <Save /></Button>
      </React.Fragment>
    )

  }
}

export default withStyles(styles)(PokemonShowdownTeams)