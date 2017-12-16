import React from 'react'
import styled from 'styled-components'

const Heading = styled.h3`
	color: black;
	margin-top: 15px;
	float: left;
`
const Greenp = styled.p`
	float: left;
	margin-left: 12px;
	margin-top: 12px;
	width: 150px;
	padding: 3px;
	background-color: #4e7134;
`

const Redp = styled.p`
	margin-top: 12px;
	float: left;
	margin-left: 12px;
	width: 150px;
	padding: 3px;
	background-color: #960000;
`
const Indicator = () => (
	<div style={{ marginLeft: `${10}%` }}>
		<Heading>INDICATORS: </Heading>
		<Greenp>Price Increased</Greenp>
		<Redp>Price Decreased</Redp>
	</div>
)
export default Indicator
