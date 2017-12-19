import React from 'react'
import { shallow } from 'enzyme' // render, static is also available. but they are slower.
import TableItem from '../TableItem'

test('TableItem should render correctly based on item', () => {
	const item = { name: 'link', price: 127.9, updateDuration: 'A Few Seconds Ago...' }
	const component = shallow(<TableItem key={item.name} {...item} />)
	expect(component).toMatchSnapshot()
})
