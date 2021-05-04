// component
import TopNav from './TopNav';
import LeftNav from './LeftNav';

// css
import '../css/Header.css';

function Header() {

  return(
    <header>
      <h1 className="blind">React Example Header</h1>
      <TopNav></TopNav>
      <LeftNav></LeftNav>
    </header>
  )

}

export default Header;