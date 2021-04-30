// react
import React, { Component } from 'react';

// css
import '../css/TopNav.css';

class TopNav extends Component {

  state = { 
    menuOpenClose : 'open' 
  };

  render() {

    return(
      <div className="top_nav">

        <div className="left">

          <button className={this.state.menuOpenClose === 'open' ? "open" : "close"}>
            <span></span>
            <span></span>
            <span></span>
          </button>

          <a href="/">
            <img src="/img/logo.png" alt="react" />
          </a>

        </div>

        <div className="right">
          <a href="/">로그인</a>
          <span></span>
          <a href="/">회원가입</a>
        </div>

      </div>
    )

  }

}

export default TopNav;