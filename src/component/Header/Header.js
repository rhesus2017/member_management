// component
import TopNav from './TopNav/TopNav';
import LeftNav from './LeftNav/LeftNav';

// css
import './Header.css';

const Header = () => {

  return(
    <header>
      <h1 className="blind">React Example Header</h1>
      <TopNav></TopNav>
      <LeftNav></LeftNav>
    </header>
  )

}

export default Header;