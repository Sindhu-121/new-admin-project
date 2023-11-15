import React from 'react'
import logo2 from './logo2.jpeg'
import './header.css'
const Header = () => {
  return (
  <header>
    <div className='header'>
    <div>
    <img src={logo2} alt="Egrad logo" className='img' />
    </div>
    </div>
  </header>
  )
}

export default Header