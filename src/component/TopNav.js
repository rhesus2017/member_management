// react
import React, { Component } from 'react';
import { Link } from "react-router-dom";

// css
import '../css/TopNav.css';

class TopNav extends Component {

  menuOpenClose = (e) => {
    let body = document.querySelector('body');
    body.getAttribute('class') === 'clo' ? body.setAttribute('class','open') : body.setAttribute('class','clo');
  };

  render() {

    return(
      <div className="top_nav">

        <div className="left">

          <button onClick={this.menuOpenClose}>
            <span></span>
            <span></span>
            <span></span>
          </button>

          <Link to="/">
            <img src="/img/logo.png" alt="react" />
          </Link>

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