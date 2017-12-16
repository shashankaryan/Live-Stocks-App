// @flow

import React, { Component } from 'react'

class TableItem extends Component {
	state = {}
	props: Item
	render() {
		return (
			<tr>
				<td>{this.props.name.toUpperCase()}</td>
				<td id={this.props.name}>{this.props.price}</td>
				<td>{this.props.updateDuration}</td>
			</tr>
		)
	}
}
export default TableItem
