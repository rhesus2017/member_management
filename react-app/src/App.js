// react
import React from 'react';
import { BrowserRouter, Route } from "react-router-dom";
import { useSelector } from 'react-redux';
import { MenuClickApp } from './reducer';

// page
import Home from './page/Home/Home';
import First from './page/First/First';
import Second from './page/Second/Second';
import Third from './page/Third/Third';
import Login from './page/Login/Login';
import Join from './page/Join/Join';

const App = (state) => {

  console.log(useSelector(state => state.MenuClick));

  return(
    <div className={useSelector(state => state.MenuClick) ? 'react_app open' : 'react_app close_'}>
      <BrowserRouter>
        <Route path="/" exact={true} component={() => <Home title="홈" name="home" />} />
        <Route path="/First" exact={true} component={() => <First title="첫 번째 메뉴" name="first" />} />
        <Route path="/Second" exact={true} component={() => <Second title="두 번째 메뉴" name="second" />} />
        <Route path="/Third" exact={true} component={() => <Third title="세 번째 메뉴" name="third" />} />
        <Route path="/Login" exact={true} component={() => <Login title="로그인" name="login" />} />
        <Route path="/Join" exact={true} component={() => <Join title="회원가입" name="join" />} />
      </BrowserRouter>
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
      value: state.counter.value
  }
}

export default App;