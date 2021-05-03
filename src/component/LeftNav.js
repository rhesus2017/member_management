// react
import React, { Component } from 'react';
import { Link } from "react-router-dom";

// css
import '../css/LeftNav.css';

class LeftNav extends Component {

  render() {

    return(
      <nav className="left_nav">
        <ul>
          <li><Link to="/First"><span class="glyphicon glyphicon-folder-open"></span><span>FIRST</span></Link></li>
          <li><Link to="/Second"><span class="glyphicon glyphicon-folder-open"></span><span>SECOND</span></Link></li>
          <li><Link to="/Third"><span class="glyphicon glyphicon-folder-open"></span><span>THIRD</span></Link></li>
          <li><Link to="/Fourth"><span class="glyphicon glyphicon-folder-open"></span><span>FOURTH</span></Link></li>
          <li><Link to="/Fifth"><span class="glyphicon glyphicon-folder-open"></span><span>FIFTH</span></Link></li>
        </ul>
      </nav>
    )

  }

}

export default LeftNav;