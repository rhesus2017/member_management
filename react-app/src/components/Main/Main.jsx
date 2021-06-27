// react
import React from 'react';
import socketio from 'socket.io-client';

// component
import Title from './Title/Title';
import Home from './Home/Home';
import Login from './Login/Login';
import Join from './Join/Join';
import Information from './Information/Information';
import MemberManagement from './MemberManagement/MemberManagement';

// css
import './Main.css';


const Main = ({title, name}) => {

  const socket = socketio.connect('http://192.168.1.166:5050/');
  const mySwal = require('sweetalert2');
  const getStorage = (item) => { return JSON.parse(window.localStorage.getItem(item)); };

  socket.on('receiveMessage', (data) => {
    if (data.memberId === getStorage('userId')) {
      mySwal.fire({icon: 'success', title: '성공', text: data.message}).then((result) => {
        socket.emit('confirmResult', {'result': '000000'})
      });
    }
  });

  return(
    <div className='main'>
      <main>
        <h1 className='blind'>React Example Main</h1>
        <div className='content'>
          {name !== 'home' && <Title title={title} />}
          {name === 'home' && <Home />}
          {name === 'login' && <Login />}
          {name === 'join' && <Join />}
          {name === 'information' && <Information />}
          {name === 'member management' && <MemberManagement />}
        </div>
      </main>
    </div>
  )

}


export default Main;