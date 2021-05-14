// react
import React from 'react';
import { BrowserRouter, Route } from "react-router-dom";
import { useSelector } from 'react-redux';

// page
import Home from './page/Home/Home';
import First from './page/First/First';
import Second from './page/Second/Second';
import Third from './page/Third/Third';
import Login from './page/Login/Login';
import Join from './page/Join/Join';

const App = () => {

  const MenuOpenClose = useSelector(state => state.MenuOpenClose);

  return(
    <div className={MenuOpenClose.open ? 'react_app open' : 'react_app close_'}>
      <BrowserRouter>
        <Route path="/" exact={true} render={() => <Home title="홈" name="home" />} />
        <Route path="/First" exact={true} render={() => <First title="첫 번째 메뉴" name="first" />} />
        <Route path="/Second" exact={true} render={() => <Second title="두 번째 메뉴" name="second" />} />
        <Route path="/Third" exact={true} render={() => <Third title="세 번째 메뉴" name="third" />} />
        <Route path="/Login" exact={true} render={() => <Login title="로그인" name="login" />} />
        <Route path="/Join" exact={true} render={() => <Join title="회원가입" name="join" />} />
      </BrowserRouter>
    </div>
  )
}

export default App;