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
import NotFound from './pages/NotFound/NotFound';

// css
import './css/reset.css';
import './css/class.css';


const App = () => {

  const MenuOpenClose = useSelector(state => state.MenuOpenClose);

  return(
    <div className={MenuOpenClose.open ? 'react_app open' : 'react_app close_'}>
      <BrowserRouter>
        <Switch>
          <Route path='/' exact={true} render={() => <Home title='Home' name='home' link='/' />} />
          <Route path='/MemberManagement' exact={true} render={() => <MemberManagement title='Member Management' name='member management' link='/MemberManagement' />} />
          <Route path='/Login' exact={true} render={() => <Login title='LOGIN' name='login' link='/Login' />} />
          <Route path='/Join' exact={true} render={() => <Join title='JOIN' name='join' link='/Join' />} />
          <Route path='/Information' exact={true} render={() => <Information title='INFORMATION' name='information' link='/Information' />} />
          <Route component={NotFound} />
        </Switch>
      </BrowserRouter>
    </div>
  )
}


export default App;