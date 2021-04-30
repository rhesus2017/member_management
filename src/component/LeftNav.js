// react
import React, { Component } from 'react';

// css
import '../css/LeftNav.css';

class LeftNav extends Component {

  state = { 
    menuOpenClose : 'open' 
  };

  render() {

    return(
      <nav className={this.state.menuOpenClose === 'open' ? "left_nav open" : "left_nav close"}>
        <ul>
          <li><a href="/">FIRST</a></li>
          <li><a href="/">SECOND</a></li>
          <li><a href="/">THIRD</a></li>
          <li><a href="/">FOURTH</a></li>
          <li><a href="/">FIFTH</a></li>
        </ul>
      </nav>
    )

  }

}

export default LeftNav;