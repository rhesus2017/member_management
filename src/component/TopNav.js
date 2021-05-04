// react
import { Link } from "react-router-dom";

// css
import '../css/TopNav.css';

function TopNav() {

  const menuOpenClose = (e) => {
    let body = document.querySelector('body');
    body.getAttribute('class') === 'clo' ? body.setAttribute('class','open') : body.setAttribute('class','clo');
  };

  return(
    <div className="top_nav">

      <div className="left">

        <button onClick={menuOpenClose}>
          <span></span>
          <span></span>
          <span></span>
        </button>

        <Link to="/">
          <img src="/img/logo.png" alt="react" />
        </Link>

      </div>

      <div className="right">
        <Link to="/Login">로그인</Link>
        <span></span>
        <Link to="/Join">회원가입</Link>
      </div>

    </div>
  )

}

export default TopNav;