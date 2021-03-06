// react
import React, { useState, useEffect } from 'react'
import axios from 'axios';
import { Link, useHistory } from 'react-router-dom';

// css
import './Join.css';


const Join = () => {

  useEffect(() => {
    if ( getStorage('userId') !== 0 ) {
      mySwal.fire({icon: 'error', title: '실패', html: '올바른 접근 경로가 아닙니다'});
      history.push('/');
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const mySwal = require('sweetalert2');
  const history = useHistory();
  const getStorage = (item) => { return JSON.parse(window.localStorage.getItem(item)) }
  const [Phone, setPhone] = useState('');
  const [Name, setName] = useState('');
  const [Certification, setCertification] = useState('');
  const [CertificationButton, setCertificationButton] = useState('인증번호 요청');
  const [CertificationProgress, setCertificationProgress] = useState(false);
  const [Password, setPassword] = useState('');
  const [PasswordConfirm, setPasswordConfirm] = useState('');
  const phone_regExp = /^(?:(010\d{4})|(01[1|6|7|8|9]\d{3,4}))(\d{4})$/;
  const password_regExp = /^[a-zA-Z0-9]{10,15}$/;

  const onPhoneHandler = (event) => {
    setPhone(event.currentTarget.value);
  }
  const onNameHandler = (event) => {
    setName(event.currentTarget.value);
  }
  const onCertificationHandler = (event) => {
    setCertification(event.currentTarget.value);
  }
  const onPasswordHandler = (event) => {
    setPassword(event.currentTarget.value);
  }
  const onPasswordConfirmHandler = (event) => {
    setPasswordConfirm(event.currentTarget.value);
  }
  const submit = () => {
    if ( Phone === '' ) mySwal.fire({icon: 'error', title: '실패', html: '휴대폰 번호를 입력해주세요'});
    else if ( !phone_regExp.test(Phone) ) {
      mySwal.fire({icon: 'error', title: '실패', html: '휴대폰 번호를 정확히 입력해주세요'});
      setPhone('');
    }
    else if ( Name === '' ) mySwal.fire({icon: 'error', title: '실패', html: '이름을 입력해주세요'});
    else if ( Certification === '' ) mySwal.fire({icon: 'error', title: '실패', html: '본인인증 번호를 입력해주세요'});
    else if ( Password === '' ) mySwal.fire({icon: 'error', title: '실패', html: '비밀번호를 입력해주세요'});
    else if ( !password_regExp.test(Password) ) {
      mySwal.fire({icon: 'error', title: '실패', html: '비밀번호를 숫자와 영문자 조합으로 10~15자리로 입력해주세요'});
      setPassword('');
      setPasswordConfirm('');
    }
    else if ( PasswordConfirm === '' ) mySwal.fire({icon: 'error', title: '실패', html: '비밀번호 확인을 입력해주세요'});
    else if ( Password !== PasswordConfirm ) {
      mySwal.fire({icon: 'error', title: '실패', html: '비밀번호가 일치하지 않습니다'});
      setPassword('');
      setPasswordConfirm('');
    }
    else 
      axios({
        url: '/api/join',
        method:'POST',
        data:{
          phone: Phone,
          name: Name,
          certification: Certification,
          password: Password,
        }
      }).then(function (response) {
        if ( response['data']['result'] === '000000' ) {
          mySwal.fire({icon: 'success', title: '성공', html: '회원가입이 완료됐습니다. 로그인해주세요'});
          history.push('/Login');
        } else if ( response['data']['result'] === '000010' ) { 
          mySwal.fire({icon: 'error', title: '실패', html: '이미 가입 된 휴대폰 번호입니다'});
          setPhone('');
        } else if ( response['data']['result'] === '000020' ) { 
          mySwal.fire({icon: 'error', title: '실패', html: '본인 인증이 일치하지 않습니다'});
          setCertification('');
        }
      }).catch(function(error){
        mySwal.fire({icon: 'error', title: '실패', html: '알수 없는 문제로 회원가입이 실패했습니다'});
        history.push('/');
      });
  }
  const getCertification = () => {
    if ( Phone === '' ) mySwal.fire({icon: 'error', title: '실패', html: '휴대폰 번호를 입력해주세요'});
    else 
      axios({
        url: '/api/join/get_certification',
        method:'POST',
        data:{
          phone: Phone
        }
      }).then(function (response) {
        if (!CertificationProgress) {
          mySwal.fire({icon: 'success', title: '성공', html: '인증번호가 발송되었습니다. 인증번호는 ' + response['data']['certification_number'] + ' 입니다'});
          setCertificationButton('인증번호 재요청');
          setCertificationProgress(true);
        } else {
          mySwal.fire({icon: 'success', title: '성공', html: '인증번호가 재발송되었습니다. 인증번호는 ' + response['data']['certification_number'] + ' 입니다'});
          setCertification('');
        }
      }).catch(function(error){
        mySwal.fire({icon: 'error', title: '실패', html: '알수 없는 문제로 인증번호 발송이 실패했습니다'});
        history.push('/');
      });
  }
  const onEnterPress = (event) => {
    if (event.key === 'Enter') {
      submit();
    }
  }


  return(
    <div className='join_wrap'>
      <form method='post' autocomplete='off'>
        <div>
          <div className='front'>
            <p><span>휴대폰번호</span><span>*</span></p>
            <input type='text' value={Phone} onChange={onPhoneHandler} onKeyPress={onEnterPress} />
          </div>
          <div className='end'>
            <p><span>본인인증</span><span>*</span></p>
            <input type='text' value={Certification} onChange={onCertificationHandler} onKeyPress={onEnterPress} />
            <button type='button' onClick={getCertification} >{CertificationButton}</button>
          </div>
        </div>
        <div>
          <div className='front'>
            <p> <span>성명</span><span>*</span></p>
            <input type='text' value={Name} onChange={onNameHandler} onKeyPress={onEnterPress} />
          </div>
        </div>
        <div>
          <div className='front'>
            <p><span>비밀번호</span><span>*</span></p>
            <input type='password' autocomplete='off' value={Password} onChange={onPasswordHandler} onKeyPress={onEnterPress} />
          </div>
          <div className='end'>
            <p><span>비밀번호 확인</span><span>*</span></p>       
            <input type='password' autocomplete='off' value={PasswordConfirm} onChange={onPasswordConfirmHandler} onKeyPress={onEnterPress} />
          </div>
        </div>
        <p>
          <span onClick={submit}>가입하기</span><Link to='/'>취소</Link>
        </p>
      </form>
    </div>
  )
    
}


export default Join;