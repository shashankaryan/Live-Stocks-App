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
		// initialising WebSocket after Component mounts
		const connection = new WebSocket('ws://stocks.mnet.website')
		connection.onmessage = evt => {
			this.handleUpdateMessage(evt.data) // call handleUpdateMessage on message.
		}
	}

	// Get the current snapshot after update as
	// per the latest WebSocket message to firebase.
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
			this.setState({ items }) // state varibale items is used to display the results.
		})
	}

	// Firebase Initiialised

	appFirebase = firebase.initializeApp(DB_CONFIG)
	database = this.appFirebase
		.database()
		.ref()
		.child('items')

	// handle the data recieved by Websocket message and converting
	// in into the form [{name: sth, price: prc, lastUpdated: date},...]
	/* eslint no-restricted-syntax: ["error", "WithStatement", "BinaryExpression[operator='in']"] */
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

	// to chech if a partcular item is already present in the firebase or not.
	isItemPresent = (prevItemList, checkItem) =>
		// console.log(checkItem)
		prevItemList.filter(prevList => prevList.name === checkItem)

	// this function is manipulating the data in the firebase
	// 1. push if an item with new name occurs.  --> completed.
	// 2. if the item already exists, compare the price of that item and
	//		update the current price. --> not completed.
	updateDatabase = currentData => {
		for (let index = 0; index < currentData.length; index += 1) {
			// for each item in output
			const items = []
			this.database.once('value', snapshot => {
				// getting current snapshot to compare
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
				const itemPresent = this.isItemPresent(items, currentData[index].name) // checking if item is present in the current snapshot
				if (itemPresent.length === 0) {
					// pushing an item with new name.
					currentData[index].lastUpdated = Date()
					this.database.push(currentData[index])
				} else {
					// updating price --> this needs to be completed.
					console.log('item already present, so update required.')
					currentData[index].lastUpdated = Date()

					// This is ill code for the update, not completed.

					// const query = this.database.orderByChild('name').equalTo(currentData[index].name)
					// query.on('value', snap => {
					// 	const changeItem = snap.val()
					// 	const key = Object.keys(changeItem)
					// 	const updateKey = this.database.child(key[0])
					// 	updateKey.update(currentData[index])
					// })
				}
			})
		}
	}

	// handlee when a new message comes from WebSocket.
	handleUpdateMessage = data => {
		const priceDict = this.handleData(data) // modify the recieved data in correct order.
		this.updateDatabase(priceDict) // modified data/ latest data from WebSocket is passed for the firbase update/push.
		this.getCurrentData() // get the currentData from firebase and update the state varibale "itens"
		// console.log(this.state.items)
		// for testing the message from WebSocket
		const finalList = JSON.stringify(priceDict)
		this.setState({ priceList: finalList })
	}

	render() {
		return (
			<div className="stock">
				<h1>(Live) Stock(s) App</h1>
				<pre>
					<code>{this.state.priceList}</code>
				</pre>
				<hr />
				<Table items={this.state.items} />
				<h3 className="foot">Last Updated: A few seconds ago...</h3>
			</div>
		)
	}
}

export default App
