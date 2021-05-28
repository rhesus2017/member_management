// react
import React from 'react';

// component
import TopNav from './TopNav/TopNav';
import LeftNav from './LeftNav/LeftNav';

// css
import './Header.css';

const Header = ({ link }) => {

  return(
    <header>
      <h1 className="blind">React Example Header</h1>
      <TopNav />
      <LeftNav link={link} />
    </header>
  )

}

export default Header;