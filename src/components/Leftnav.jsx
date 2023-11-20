import React, { useState } from 'react'
import './header.css'
import { Link } from 'react-router-dom';
const Leftnav = () => {

  const[showMenu, setshowMenu] = useState(0);
  return (
    <>

<>
</>



<div className='left_nav_bar_container'>
<div className={showMenu ? "mobile_menu mobile_menu_non  " :"mobile_menu_non_black "} onClick={() => setshowMenu(!showMenu)}  >
                  <div className={showMenu ? "rotate_right  " :"lines Line_one"}></div>
                  <div className={showMenu ? "rotate_left  " :"lines Line_two "}></div>
                  </div>
    <div className={showMenu?"left-nav-bar left-nav-bar_":"left-nav-bar"}>
       <ul className='left-nav-bar-ul'>
      <li><Link to="/exams" >Exam Creation</Link></li>
      <li><Link to="/Coursecreation">Course Creation</Link></li>
      <li><Link to="/InstructionPage" >Instruction</Link></li>

    

        

      <li><Link to="/Testcreation">Test Creation</Link></li>     

      </ul>
    </div>
    </div>


                 
    </>
  )
}

export default Leftnav