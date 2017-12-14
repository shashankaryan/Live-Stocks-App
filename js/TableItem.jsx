// @flow

import React, { Component } from 'react'

class TableItem extends Component {
	state = {}
	props: Item
	render() {
		// const { name, price, lastUpdated } = this.props.item
		return (
			<tr>
				<td>{this.props.name.toUpperCase()}</td>
				<td>{this.props.price}</td>
				<td>{this.props.lastUpdated}</td>
			</tr>
		)
	}
}
export default TableItem
