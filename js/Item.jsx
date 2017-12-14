// @flow

import React, { Component } from 'react'
import Websocket from 'react-websocket'

class Echo extends Component {
	state = {
		priceData: [],
		priceList: [],
	}
	// converting the string data from ws to a key ,value pair.
	handleData = data => {
		const keyList = []
		const result = JSON.parse(`${data}`)
		const valueList = []
		const finalDict = {}
		for (let i = 0; i < result.length; i += 1) {
			const p = result[i]
			keyList.push(p[0])
			valueList.push(p[1])
			finalDict[p[0]] = p[1]
		}
		return finalDict
	}

	handleUpdateMessage = data => {
		const priceDict = this.handleData(data)
		const finalList = JSON.stringify(priceDict)
		this.setState({ priceList: finalList })
	}
	render() {
		return (
			<div>
				<pre>
					<code>{this.state.priceData}</code>
					<code>{this.state.priceList}</code>
				</pre>
				<Websocket url="ws://stocks.mnet.website" onMessage={this.handleUpdateMessage} />
			</div>
		)
	}
}

export default Echo
