import React from 'react'
import { shallow } from 'enzyme' // render, static is also available. but they are slower.
import Indicator from '../Indicators'

test('Table Item renders correctly', () => {
	const component = shallow(<Indicator />)
	expect(component).toMatchSnapshot()
})
