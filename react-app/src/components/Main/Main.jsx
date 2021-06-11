// react
import React from 'react';

// component
import Title from './Title/Title';
import Home from './Home/Home';
import Login from './Login/Login';
import Join from './Join/Join';
import Information from './Information/Information';

// css
import './Main.css';

const Main = ({title, name}) => {

  return(
    <div className="main">
      <main>
        <h1 className="blind">React Example Main</h1>
        <div className="content">
          {name !== 'home' && <Title title={title} />}
          {name === 'home' && <Home />}
          {name === 'login' && <Login />}
          {name === 'join' && <Join />}
          {name === 'information' && <Information />}
        </div>
      </main>
    </div>
  )

}

export default Main;