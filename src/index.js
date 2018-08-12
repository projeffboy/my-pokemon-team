import React from 'react'
import ReactDOM from 'react-dom'
import App from './app'
import registerServiceWorker from './registerServiceWorker'
import CssBaseline from '@material-ui/core/CssBaseline' // like CSS Reset
import {MuiThemeProvider} from '@material-ui/core/styles' // provide your custom theme
import {theme} from './styles'

ReactDOM.render(
    <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {/* Everything below is affected by CSS Baseline */}
        <App />
    </MuiThemeProvider>, 
    document.getElementById('root')
)

window.theme = theme

registerServiceWorker()
