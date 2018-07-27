import React from 'react'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import {observer} from 'mobx-react'
import store from '../store'

@observer
export default class TeamStats extends React.Component {
  constructor(props) {
    super(props)

    
    let titleArr = this.props.title.split(' ')
    titleArr[0] = titleArr[0].toLowerCase()
    this.teamStatType = titleArr.join('')
  }

  render() {
    const types = [
      'Bug',
      'Dark',
      'Dragon',
      'Electric',
      'Fairy',
      'Fighting',
      'Fire',
      'Flying',
      'Ghost',
      'Grass',
      'Ground',
      'Ice',
      'Normal',
      'Poison',
      'Psychic',
      'Rock',
      'Steel',
      'Water',
    ]
  
  // Grid Items of Pokemon Types
    const gridItems = types.map((type, i) => (
      <Grid key={i} item xs={2}>
        <div>{type}</div>
        <div>{store[this.teamStatType][type]}</div>
      </Grid>
    ))
  
    return (
      <Grid container spacing={0}>
        <Grid item xs={12}>
          <Typography variant='title'>
            {this.props.title}
          </Typography>
        </Grid>
        {gridItems}
      </Grid>
    )
  }
}
