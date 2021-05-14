// react
import React, { useState, useEffect } from 'react'
import axios from 'axios';
import { Link, useHistory } from "react-router-dom";
import { useCookies } from 'react-cookie';

// css
import './Login.css';

const Login = () => {
  
  const history = useHistory();
  const [Id, setId] = useState("");
  const [Password, setPassword] = useState("");
  const [Checked, setChecked] = useState(false);
  const [Cookies, setCookie, removeCookie] = useCookies(['rememberId']);

  const onIdHandler = (event) => {
    setId(event.currentTarget.value);
  }
  const onPasswordHandler = (event) => {
    setPassword(event.currentTarget.value);
  }
  const onCheckedHandler = () => {
    Checked ? setChecked(false) : setChecked(true);
  }

  useEffect(() => {
    if(Cookies.rememberId !== undefined) {
      setId(Cookies.rememberId);
      setChecked(true);
    }
  }, []);

  const onSubmitHandler = (event) => {

    if ( Id === '' ) alert('아이디를 입력해주세요');
    else if (Password === '' ) alert('비밀번호를 입력해주세요');
    else axios({
          url: 'http://127.0.0.1:5000/api/login',
          method:'POST',
          data:{
            id: {Id},
            password: {Password}
          }
        }).then(function (result) {
          if ( result['data']['result'] ) {
            if ( Checked ) {
              setCookie('rememberId', Id, {maxAge: 2000});
            } else {
              removeCookie('rememberId');
            }
            history.push('/');
          } else { 
            alert('아이디 또는 비밀전호가 일치하지 않습니다');
            setPassword('');
          }
        }).catch(function(error){
          alert('알수 없는 문제로 로그인이 실패했습니다.');
          setPassword('');
        });
  }

  return(
    <div className="login_wrap">
      <form method="post" autocomplete="off">
        <div>
          <input type="text" placeholder="아이디" className="loginIp" value={Id} onChange={onIdHandler} />
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