import React from 'react'
import { shallow } from 'enzyme' // render, static is also available. but they are slower.
import App from '../App'

test('Table Item renders correctly', () => {
	const component = shallow(<App />)
	expect(component).toMatchSnapshot()
})
