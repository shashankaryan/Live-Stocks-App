// @flow

import React from 'react'
import { render } from 'react-dom'
import App from './App'

const renderApp = () => {
	render(<App />, document.getElementById('app'))
}

renderApp()

// In Case of Developement
// if (module.hot) {
// 	module.hot.accept('./App', () => {
// 		renderApp()
// 	})
// }
