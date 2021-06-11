// react
import React, { useState } from 'react';
import { Link } from "react-router-dom";

// css
import './LeftNav.css';

const LeftNav = ({ link }) => {

  const [menus] = useState([
    {id: 1, path: "/MemberManagement", name: "Member Management", icon: "fas fa-bezier-curve awesome-icon"},
    {id: 2, path: "/HabitTracker", name: "Habit Tracker", icon: "fas fa-id-card awesome-icon"},
  ]);

  return(
    <nav className="left_nav">
      <ul>
        {
          menus.map((menu) => {
            return <li><Link to={menu.path} className={link === menu.path && "on"}><i className={menu.icon}></i><span>{menu.name}</span></Link></li>
          })
        }
      </ul>
    </nav>
  )

}

export default LeftNav;