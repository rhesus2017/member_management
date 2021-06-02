// react
import React, { useState, useEffect } from 'react'
import axios from 'axios';
import { Link, useHistory } from "react-router-dom";
import { useCookies } from 'react-cookie';
import socketio from 'socket.io-client';

// hoc
import useLocalStorage from "../../../hoc/useLocalStorage";

// css
import './Login.css';

const Login = () => {

  useEffect(() => {
    UserId !== "0" &&
      mySwal.fire({icon: 'error', title: '실패', text: '올바른 접근 경로가 아닙니다'}).then((result) => {
        history.push('/');
      });
  }, []);
  
  const mySwal = require('sweetalert2');
  const history = useHistory();
  const [Phone, setPhone] = useState("");
  const [Password, setPassword] = useState("");
  const [Checked, setChecked] = useState(false);
  const [Cookies, setCookie, removeCookie] = useCookies(['rememberId']);
  const [UserId, setUserId] = useLocalStorage("userId", "0");
  const [UserName, setUserName] = useLocalStorage("userName", "");

  const onPhoneHandler = (event) => {
    setPhone(event.currentTarget.value);
  }
  const onPasswordHandler = (event) => {
    setPassword(event.currentTarget.value);
  }
  const onCheckedHandler = () => {
    Checked ? setChecked(false) : setChecked(true);
  }

  useEffect(() => {
    if(Cookies.rememberId !== undefined) {
      setPhone(Cookies.rememberId);
      setChecked(true);
    }
  }, [Cookies]);

  const onSubmitHandler = (event) => {

    if ( Phone === '' ) {
      mySwal.fire({icon: 'error', title: '실패', text: '휴대폰 번호를 입력해주세요'});
    } else if (Password === '' ) {
      mySwal.fire({icon: 'error', title: '실패', text: '비밀번호를 입력해주세요'});
    } else {
      axios({
        url: 'http://127.0.0.1:5000/auth/api/login',
        method:'POST',
        data:{
          phone: {Phone},
          password: {Password}
        }
      }).then(function (response) {
        if ( response['data']['result'] === '000000' ) {
          if ( Checked ) {
            setCookie('rememberId', Phone, {maxAge: 2000});
          } else {
            removeCookie('rememberId');
          }
          setUserId(response['data']['userId']);
          setUserName(response['data']['userName']);

          const socket = socketio.connect('http://localhost:5050');
          (() => {
            socket.emit('init', { name: 'bella' });
          
            socket.on('welcome', (msg) => {
              console.log(msg);
            });
            
        })();

          history.push('/');
        } else if ( response['data']['result'] === '000010' ) { 
          mySwal.fire({icon: 'error', title: '실패', text: '휴대폰 번호 또는 비밀전호가 일치하지 않습니다'});
          setPassword('');
        }
      }).catch(function(error){
        mySwal.fire({icon: 'error', title: '실패', text: '알수 없는 문제로 로그인이 실패했습니다'});
        setPassword('');
      });
    }
    
  }

  return(
    <div className="login_wrap">
      <form method="post" autocomplete="off">
        <div>
          <input type="tel" placeholder="휴대폰 번호" className="loginIp" value={Phone} onChange={onPhoneHandler} />
          <input type="password" placeholder="비밀번호" className="loginIp" value={Password} onChange={onPasswordHandler}  autocomplete="on" />
        </div>
        <input type="button" value="로그인" className="loginButton" onClick={onSubmitHandler}/>
        <p>
          <input type="checkbox" id="id_Save" onClick={onCheckedHandler} checked={Checked} /><label for="id_Save"><span>아이디 저장</span></label>
        </p>
        <span></span>
        <Link to="/Join">회원가입</Link>
      </form> 
    </div>
  )
    
}

export default Login;