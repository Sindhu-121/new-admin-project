import React from 'react'
import './header.css'
import { Link } from 'react-router-dom';
const Leftnav = () => {
  return (
    <>
    <div className="left-nav-bar">
      <ul className='left-nav-bar-ul'>
      <li><Link to="/exams" >Exam Creation</Link></li>
      <li><Link to="/Coursecreation">Course Creation</Link></li>
      <li><Link to="/InstructionPage" >Instruction</Link></li>
      <li><Link to="/">Test Creation</Link></li>

        
      </ul>
    </div>
    </>
  )
}

export default Leftnav