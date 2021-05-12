// react
import React, { useState, useEffect } from 'react'
import axios from 'axios';
import { Link, useHistory } from "react-router-dom";
import { useCookies } from 'react-cookie';

// css
import './Login.css';

const Login = () => {

  const history = useHistory();
  const [Phone, setEmail] = useState("");
  const [Password, setPassword] = useState("");
  const [isRemember, setIsRemember] = useState(false);
  const [cookies, setCookie, removeCookie] = useCookies(['rememberEmail']);

  const onPhoneHandler = (event) => {
    setEmail(event.currentTarget.value);
  }
  const onPasswordHandler = (event) => {
      setPassword(event.currentTarget.value);
  }

  const LoginSubmit = (event) => {

    if ( Phone === '' ) alert('아이디를 입력해주세요');
    else if (Password === '' ) alert('비밀번호를 입력해주세요');
    else axios({
          url: 'http://127.0.0.1:5000/api/login',
          method:'POST',
          data:{
            phone: {Phone},
            password: {Password}
          }
        }).then(function (result) {
          if ( result['data']['result'] ) history.push('/');
          else alert('아이디 또는 비밀전호가 일치하지 않습니다'); setPassword('');
        }).catch(function(error){
          alert('알수 없는 문제로 로그인이 실패했습니다.');
          setPassword('');
        });
  }

  useEffect(() => {
    if(cookies.rememberEmail !== undefined) {
      setEmail(cookies.rememberEmail);
      setIsRemember(true);
    }
  }, []);

  const handleOnChange = (e) => {
    setIsRemember(e.target.check);
    if(e.target.check){
      setCookie('rememberEmail', Phone, {maxAge: 2000});
    } else {
    removeCookie('rememberEmail');
    }
  }

  return(
    <div className="login_wrap">
      <form method="post" autocomplete="off">
        <div>
          <input type="text" placeholder="아이디" className="loginIp" value={Phone} onChange={onPhoneHandler}/>
          <input type="password" placeholder="비밀번호" className="loginIp" value={Password} onChange={onPasswordHandler}/>
        </div>
        <input type="button" value="로그인" className="loginButton" onClick={LoginSubmit}/>
        <p>
          <input type="checkbox" id="id_Save" onChange={handleOnChange} checked={isRemember} /><label for="id_Save"><span>아이디 저장</span></label>
        </p>
        <span></span>
        <Link to="/Join">회원가입</Link>
      </form>
    </div>
  )
    
}

export default Login;