// react
import React from 'react';
import { Link } from "react-router-dom";

// img
import logo from './logo.png';

// css
import './TopNav.css';

const TopNav = () => {

  return(
    <div className="top_nav">

      <div className="left">

        <button>
          <span></span>
          <span></span>
          <span></span>
        </button>

        <Link to="/">
          <img src={logo} alt="react" />
        </Link>

      </div>

      <div className="right">
        <Link to="/Login/">로그인</Link>
        <span></span>
        <Link to="/Join/">회원가입</Link>
      </div>

    </div>
  )

}

export default TopNav;