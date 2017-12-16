import React from 'react'
import { shallow } from 'enzyme' // render, static is also available. but they are slower.
import Loading from '../Loading'

test('Table Item renders correctly', () => {
	const component = shallow(<Loading />)
	expect(component).toMatchSnapshot()
})
