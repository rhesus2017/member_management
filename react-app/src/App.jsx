// react
import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

// redux
import { useSelector } from 'react-redux';

// page
import Home from './pages/Home/Home';
import MemberManagement from './pages/MemberManagement/MemberManagement';
import Login from './pages/Login/Login';
import Join from './pages/Join/Join';
import Information from './pages/Information/Information';
import Message from './pages/Message/Message';
import NotFound from './pages/NotFound/NotFound';

// css
import './css/reset.css';
import './css/class.css';


const App = () => {

  const MenuOpenClose = useSelector(state => state.MenuOpenClose);
  const getStorage = (item) => { return JSON.parse(window.localStorage.getItem(item)) }
  const setStorage = (item, value) => { window.localStorage.setItem(item, JSON.stringify(value)) }

  if ( getStorage('userId') === null ) {
    setStorage('userId', 0);
    setStorage('userName', '');
    setStorage('userGrade', '');
  } 
  
  return(
    <div className={MenuOpenClose.open ? 'react_app open' : 'react_app close_'}>
      <BrowserRouter>
        <Switch>
          <Route path='/' exact={true} render={() => <Home title='Home' name='home' link='/' />} />
          <Route path='/MemberManagement' exact={true} render={() => <MemberManagement title='회원관리' name='member management' link='/MemberManagement' />} />
          <Route path='/Login' exact={true} render={() => <Login title='LOGIN' name='로그인' link='/Login' />} />
          <Route path='/Join' exact={true} render={() => <Join title='JOIN' name='회원가입' link='/Join' />} />
          <Route path='/Information' exact={true} render={() => <Information title='내정보' name='information' link='/Information' />} />
          <Route path='/Message' exact={true} render={() => <Message title='메세지' name='message' link='/Message' />} />
          <Route component={NotFound} />
        </Switch>
      </BrowserRouter>
    </div>
  )
}


export default App;