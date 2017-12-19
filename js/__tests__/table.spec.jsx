import React from 'react'
import { shallow } from 'enzyme' // render, static is also available. but they are slower.
import Table from '../Table'

test('Table should render correctly based on items', () => {
	const items = [{}, {}, {}, {}, {}]
	const component = shallow(<Table items={items} />)
	expect(component).toMatchSnapshot()
})
