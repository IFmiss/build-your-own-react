import React from 'react'

import Hello from '@components/Hello'
import './home.less'

const Home = (props) => {
  return (
    <div className="home">
      <div>this is home</div>
      <Hello/>
    </div>
  )
}

export default Home
