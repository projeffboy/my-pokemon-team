import React from 'react'
import ReactDOM from 'react-dom'
import App from './app'
import registerServiceWorker from './registerServiceWorker'
import CssBaseline from '@material-ui/core/CssBaseline'
import {theme} from './styles'
import {MuiThemeProvider} from '@material-ui/core/styles'

ReactDOM.render(
    <MuiThemeProvider theme={theme}>
        <CssBaseline />
        <App />
    </MuiThemeProvider>, 
    document.getElementById('root')
)

registerServiceWorker()
