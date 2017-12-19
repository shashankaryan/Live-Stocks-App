// @flow

import React from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import App from './App'

const FourOhFour = () => <h1>404</h1>

const Router = () => (
	<BrowserRouter>
		<Switch>
			<Route exact path="/" component={App} />
			<Route component={FourOhFour} />
		</Switch>
	</BrowserRouter>
)

export default Router
