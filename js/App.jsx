// @flow

import React, { Component } from 'react'
import Table from './Table'
import Loading from './Loading'
import Indicator from './Indicators'

class App extends Component {
	// initializing state variables
	state = {
		items: [], // initializing empty list of items
		count: 0, // setting count to 0
	}

	componentWillMount() {
		// initialising WebSocket after Component mounts
		const connection = new WebSocket('wss://stocks.mnet.website')
		connection.onmessage = evt => {
			this.handleUpdateMessage(evt.data) // call handleUpdateMessage on message.
		}
	}

	// This function is to get hour of a Date in 12hr format.
	// ===========================================================================
	hours12 = date => (date.getHours() + 24) % 12 || 12
	// ===========================================================================

	// ===========================================================================
	// function to convert time into days, hours, minute, seconds
	updateTime = (lastupdate: number) => {
		const duration = new Date(lastupdate)
		const minutes = duration.getMinutes().toString().length === 1 ? `0${duration.getMinutes()}` : duration.getMinutes()
		const hours = this.hours12(duration).toString().length === 1 ? `0${this.hours12(duration)}` : this.hours12(duration)
		const ampm = duration.getHours() >= 12 ? 'PM' : 'AM'
		const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
		let format
		if (duration.getDate() === new Date().getDate()) {
			format = `${hours}:${minutes} ${ampm}`
		} else if (duration.getFullYear() === new Date().getFullYear()) {
			format = `${duration.getDate()} ${months[duration.getMonth()]}, ${hours}:${minutes} ${ampm}`
		} else {
			format = `${duration.getDate()} ${months[
				duration.getMonth()
			]} ${duration.getFullYear()} ${hours}:${minutes} ${ampm}`
		}
		return format
	}
	// ===========================================================================

	// ===========================================================================
	// Arrange the data recieved by Websocket message and converting
	// in into the form [{name: sth, price: prc, lastUpdated: date, updateDuration: dur},...]
	/* eslint no-restricted-syntax: ["error", "WithStatement", "BinaryExpression[operator='in']"] */
	// ===========================================================================
	handleData = (data: any) => {
		const keyList = [] // list of all the keys. eg, name of item
		const result = JSON.parse(`${data}`)
		const valueList = [] // list of all the values. eg. price of item
		const finalDict = [] // arranging in forn of {name: price}
		for (let i = 0; i < result.length; i += 1) {
			const p = result[i]
			keyList.push(p[0])
			valueList.push(p[1])
			finalDict[p[0]] = p[1]
		}

		// Getting the data arranged in desired order inside a list of sictionaries.
		// =========================================================================
		const output = []
		let x
		for (const keys in finalDict) {
			if (keys != null) {
				x = {}
				x.name = keys
				x.price = finalDict[keys]
				output.push(x)
				x.lastUpdated = Date.now()
				x.updateDuration = ''
			}
		}

		// =========================================================================
		return output // returning data in desired format.
	}
	// ===========================================================================

	// This function is to check if a partcular item is already present in the firebase/item list or not.
	// ===========================================================================
	isItemPresent = (prevItemList: any, checkItem: any) => prevItemList.filter(prevList => prevList.name === checkItem)
	// ===========================================================================

	// This function is updating the data in Display.
	// Mechanism goes in 2 steps:
	// #1. If an item with new name occurs, push it to display.
	// #2. if the item already exists, compare the price of that item and
	//		update the current price to Display.
	// ===========================================================================

	updateDisplay = (currentData: any) => {
		for (let index = 0; index < currentData.length; index += 1) {
			// For each item in output

			const previousItems = this.state.items // saving state in previousItems variable.

			const itemPresent = this.isItemPresent(previousItems, currentData[index].name) // checking if item is present in the current snapshot

			// #1 step.
			// =======================================================================

			if (itemPresent.length === 0) {
				this.state.items.push(currentData[index])
			} else {
				// #2 step.
				// =====================================================================
				const indexItem = previousItems.indexOf(itemPresent[0]) // Checkinf for index of present item in the list.
				const myDiv = document.getElementById(currentData[index].name)
				if (currentData[index].price > previousItems[indexItem].price) {
					myDiv.setAttribute('style', 'background-color: darkolivegreen;')
				} else {
					myDiv.setAttribute('style', 'background-color: darkred;')
				}
				previousItems[indexItem].price = currentData[index].price // Updating price
				previousItems[indexItem].lastUpdated = currentData[index].lastUpdated // Updating lastUpdated
				// =====================================================================
				this.setState({ items: previousItems }) // setting state with updated results.
				this.setState({ count: this.state.items.length })
			}
		}
	}
	// This function is used to update the duration since recent WebSocket recieved.
	// ===========================================================================
	updateDuration = (items: any) => {
		for (let item = 0; item < items.length; item += 1) {
			/* eslint new-cap: ["error", { "newIsCapExceptionPattern": "^Date\.." }] */
			const durationDifference = Date.now() - items[item].lastUpdated
			if (durationDifference <= 5000) {
				items[item].updateDuration = `A Few Seconds Ago...`
			} else if (durationDifference > 5000 && durationDifference < 60000) {
				items[item].updateDuration = `${Math.floor(durationDifference / 1000)} Seconds Ago...`
			} else {
				items[item].updateDuration = this.updateTime(items[item].lastUpdated)
			}
		}
		this.setState({ items })
	}
	// ===========================================================================

	// Handles the data when a new message comes from WebSocket.
	// ===========================================================================
	handleUpdateMessage = (data: any) => {
		const priceDict = this.handleData(data) // modify the recieved data in correct order.
		this.updateDisplay(priceDict) // Display the data.
		this.updateDuration(this.state.items) // Show last update duration for items.
	}
	// ===========================================================================

	render() {
		let tableComponent
		if (this.state.count < 13) {
			tableComponent = <Loading />
		} else {
			tableComponent = <Indicator />
		}

		return (
			<div className="stock">
				<h1>(Live) Stock(s) App</h1>
				<Table items={this.state.items} />
				{tableComponent}
			</div>
		)
	}
}

export default App
