// react
import React from 'react';
import { Link } from "react-router-dom";

// css
import './LeftNav.css';

const LeftNav = () => {

  return(
    <nav className="left_nav">
      <ul>
        <li>
          <Link to="/First">
            <span className="glyphicon glyphicon-folder-close"></span><span>FIRST</span>
          </Link>
        </li>
        <li>
          <Link to="/Second">
            <span className="glyphicon glyphicon-folder-close"></span><span>SECOND</span>
          </Link>
        </li>
        <li>
          <Link to="/Third">
            <span className="glyphicon glyphicon-folder-close"></span><span>THIRD</span>
          </Link>
        </li>
      </ul>
    </nav>
  )

}

export default LeftNav;