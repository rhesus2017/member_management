// react
import React from 'react';
import { BrowserRouter, Route } from "react-router-dom";

// page
import Home from './page/Home/Home';
import First from './page/First/First';
import Second from './page/Second/Second';
import Third from './page/Third/Third';
import Login from './page/Login/Login';
import Join from './page/Join/Join';

const App = () => {

  return(
    <div className="react_app open">
      <BrowserRouter>
        <Route path="/" exact={true} component={Home} />
        <Route path="/First" exact={true} component={First} />
        <Route path="/Second" exact={true} component={Second} />
        <Route path="/Third" exact={true} component={Third} />
        <Route path="/Login" exact={true} component={Login} />
        <Route path="/Join" exact={true} component={Join} />
      </BrowserRouter>
    </div>
  )
}

export default App;