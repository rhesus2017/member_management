// react
import React from 'react';
import axios from 'axios'

// css
import './Main.css';

const Main = (props) => {

  axios.post('/test', {
    ph_num: '01039345623',
  }).then(function (response) {
    alert('성공!');
  });

  return(
    <div className="main">
      <main>
        <h1 className="blind">React Example Main</h1>
        <div className="content">
          <p className="main_title"></p>
        </div>
      </main>
    </div>
  )
    
}

export default Main;