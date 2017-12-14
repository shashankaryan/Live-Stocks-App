// @flow

import React, { Component } from 'react'
import firebase from 'firebase'
import DB_CONFIG from '../Config/config'
import Table from './Table'

class App extends Component {
	state = {
		items: [],
		itemsList: [],
	}
	componentDidMount() {
		const connection = new WebSocket('ws://stocks.mnet.website')
		connection.onmessage = evt => {
			this.handleUpdateMessage(evt.data)
		}
	}

	getCurrentData = () => {
		this.database.once('value', snapshot => {
			const items = []
			snapshot.forEach(data => {
				// console.log(data.val())
				const item = {
					name: data.val().name,
					price: data.val().price,
					lastUpdated: data.val().lastUpdated,
				}
				items.push(item)
			})
			// console.log(items)
			this.setState({ items })
		})
	}
	// Firebase Initiialised

	appFirebase = firebase.initializeApp(DB_CONFIG)
	database = this.appFirebase
		.database()
		.ref()
		.child('items')

	handleData = data => {
		const keyList = []
		const result = JSON.parse(`${data}`)
		const valueList = []
		const finalDict = []
		for (let i = 0; i < result.length; i += 1) {
			const p = result[i]
			keyList.push(p[0])
			valueList.push(p[1])
			finalDict[p[0]] = p[1]
		}
		const output = []
		/* eslint no-restricted-syntax: ["error", "WithStatement", "BinaryExpression[operator='in']"] */
		let x
		for (const keys in finalDict) {
			if (keys != null) {
				x = {}
				x.name = keys
				x.price = finalDict[keys]
				output.push(x)
				x.lastUpdated = Date()
			}
		}

		return output
	}

	isItemPresent = (prevItemList, checkItem) =>
		// console.log(checkItem)
		prevItemList.filter(prevList => prevList.name === checkItem)

	updateDatabase = currentData => {
		for (let index = 0; index < currentData.length; index += 1) {
			const items = []
			this.database.once('value', snapshot => {
				snapshot.forEach(data => {
					// console.log(data.val())
					const item = {
						name: data.val().name,
						price: data.val().price,
						lastUpdated: data.val().lastUpdated,
					}
					items.push(item)
				})
				// this.setState({ itemsList })
				const itemPresent = this.isItemPresent(items, currentData[index].name)
				if (itemPresent.length === 0) {
					currentData[index].lastUpdated = Date()
					this.database.push(currentData[index])
				} else {
					// console.log('item already present, so updating')
					currentData[index].lastUpdated = Date()
					const query = this.database.orderByChild('name').equalTo(currentData[index].name)
					query.on('value', snap => {
						const changeItem = snap.val()
						const key = Object.keys(changeItem)
						const updateKey = this.database.child(key[0])
						updateKey.update(currentData[index])
					})
				}
			})
		}
	}

	handleUpdateMessage = data => {
		const priceDict = this.handleData(data)
		this.updateDatabase(priceDict)
		this.getCurrentData()
		// console.log(this.state.items)
		const finalList = JSON.stringify(priceDict)
		this.setState({ priceList: finalList })
	}

	render() {
		return (
			<div className="stock">
				<h1>(Live) Stock(s) App</h1>
				{/* <pre>
					<code>{this.state.priceList}</code>
				</pre> */}
				<hr />
				<Table items={this.state.items} />
				<h3 className="foot">Last Updated: A few seconds ago...</h3>
			</div>
		)
	}
}

export default App
