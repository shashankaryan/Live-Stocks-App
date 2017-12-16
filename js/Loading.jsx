// @flow

import React from 'react'
import styled, { keyframes } from 'styled-components'

const spin = keyframes`
  from{
    transform: rotate(0deg);
  }
  to{
    transform: rotate(360deg);
  }
`

const Image = styled.img`
	animation: ${spin} 2s infinite linear;
	margin-top: 10px;
	height: 30px;
	width: 30px;
`

const Loading = () => <Image src="/public/img/loading.png" alt="loading indicator" />

export default Loading
