// @flow

import React, { Component } from 'react'
import TableItem from './TableItem'

class Table extends Component {
	state = {}
	props: {
		items: Array<Item>,
	}

	render() {
		return (
			<div>
				<table className="container">
					<thead>
						<tr>
							<th>
								<h1>Item</h1>
							</th>
							<th>
								<h1>Price</h1>
							</th>
							<th>
								<h1>Last Updated</h1>
							</th>
						</tr>
					</thead>
					<tbody>{this.props.items.map(item => <TableItem key={item.name} {...item} />)}</tbody>
				</table>
			</div>
		)
	}
}
export default Table
