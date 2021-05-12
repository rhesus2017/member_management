// react
import React from 'react';

// component
import Title from './Title/Title';
import Login from './Login/Login';

// css
import './Main.css';

const Main = (props) => {

  return(
    <div className="main">
      <main>
        <h1 className="blind">React Example Main</h1>
        <div className="content">
          <Title title={props.title} name={props.name}></Title>
          {
            props.name === 'login' && <Login></Login>
          }
        </div>
      </main>
    </div>
  )
    
}

export default Main;