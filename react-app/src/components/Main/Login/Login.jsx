// react
import React, { useState, useEffect } from 'react'
import axios from 'axios';
import { Link, useHistory } from 'react-router-dom';
import { useCookies } from 'react-cookie';

// redux
import { useDispatch } from 'react-redux';
import { UserNameSetting } from '../../../action';

// css
import './Login.css';


const Login = () => {

  useEffect(() => {
    if ( getStorage('userId') !== 0 ) {
      mySwal.fire({icon: 'error', title: '실패', html: '올바른 접근 경로가 아닙니다'});
      history.push('/');
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const mySwal = require('sweetalert2');
  const history = useHistory();
  const dispatch = useDispatch();
  const userNameSetting = () => { dispatch(UserNameSetting()); };
  const getStorage = (item) => { return JSON.parse(window.localStorage.getItem(item)); };
  const setStorage = (item, value) => { window.localStorage.setItem(item, JSON.stringify(value)); };
  const [Phone, setPhone] = useState('');
  const [Password, setPassword] = useState('');
  const [Checked, setChecked] = useState(false);
  const [Cookies, setCookie, removeCookie] = useCookies(['rememberId']);

  useEffect(() => {
    if(Cookies.rememberId !== undefined) {
      setPhone(Cookies.rememberId);
      setChecked(true);
    }
  }, [Cookies]);
  
  const onPhoneHandler = (event) => {
    setPhone(event.currentTarget.value);
  }
  const onPasswordHandler = (event) => {
    setPassword(event.currentTarget.value);
  }
  const onCheckedHandler = () => {
    Checked ? setChecked(false) : setChecked(true);
  }
  const submit = (event) => {
    if ( Phone === '' ) {
      mySwal.fire({icon: 'error', title: '실패', html: '휴대폰 번호를 입력해주세요'});
    } else if (Password === '' ) {
      mySwal.fire({icon: 'error', title: '실패', html: '비밀번호를 입력해주세요'});
    } else {
      axios({
        url: '/auth/api/login',
        method:'POST',
        data:{
          phone: Phone,
          password: Password
        }
      }).then(function (response) {
        if ( response['data']['result'] === '000000' ) {
          Checked ? setCookie('rememberId', Phone, {maxAge: 2000}) : removeCookie('rememberId');
          setStorage('userId', response['data']['userId']);
          setStorage('userName', response['data']['userName']);
          setStorage('userGrade', response['data']['userGrade']);
          userNameSetting()
          history.push('/');
        } else if ( response['data']['result'] === '000010' ) { 
          mySwal.fire({icon: 'error', title: '실패', html: '휴대폰 번호 또는 비밀번호가 일치하지 않습니다'});
          setPassword('');
        } else if ( response['data']['result'] === '000303' ) {
          mySwal.fire({icon: 'error', title: '실패', html: '휴대폰 번호 또는 비밀번호가 일치하지 않습니다'});
          setPassword('');
        } else if ( response['data']['result'] === '000302' ) {
          mySwal.fire({icon: 'error', title: '실패', html: '정지 된 계정입니다. 관리자에게 문의해주세요'});
          setPassword('');
        }
      }).catch(function(error){
        mySwal.fire({icon: 'error', title: '실패', html: '알수 없는 문제로 로그인이 실패했습니다'});
        history.push('/');
      });
    }
    
  }
  const onEnterPress = (event) => {
    if (event.key === 'Enter') {
      submit();
    }
  }

  return(
    <div className='login_wrap'>
      <form method='post' autocomplete='off'>
        <div>
          <input type='tel' placeholder='휴대폰 번호' className='loginIp' value={Phone} onChange={onPhoneHandler} onKeyPress={onEnterPress} />
          <input type='password' placeholder='비밀번호' className='loginIp' value={Password} onChange={onPasswordHandler} onKeyPress={onEnterPress} autocomplete='off' />
        </div>
        <input type='button' value='로그인' className='loginButton' onClick={submit}/>
        <p>
          <input type='checkbox' id='id_Save' onClick={onCheckedHandler} checked={Checked} /><label for='id_Save'><span>아이디 저장</span></label>
        </p>
        <span></span>
        <Link to='/Join'>회원가입</Link>
      </form> 
    </div>
  )
    
}


export default Login;