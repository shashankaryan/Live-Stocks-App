// @flow

import React from 'react'
import { render } from 'react-dom'
import Router from './Router'

const renderApp = () => {
	render(<Router />, document.getElementById('app'))
}

renderApp()

// In Case of Developement
// if (module.hot) {
// 	module.hot.accept('./App', () => {
// 		renderApp()
// 	})
// }
