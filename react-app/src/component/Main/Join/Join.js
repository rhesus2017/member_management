// react
import React, { useState }from 'react'
import axios from 'axios';
import { Link, useHistory } from "react-router-dom";

// css
import './Join.css';

const Join = () => {

  const history = useHistory();
  const [Id, setId] = useState("");
  const [Name, setName] = useState("");
  const [Certification, setCertification] = useState("");
  const [Password, setPassword] = useState("");
  const [PasswordConfirm, setPasswordConfirm] = useState("");

  const onIdHandler = (event) => {
    setId(event.currentTarget.value);
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

  const onSubmitHandler = (event) => {

    if ( Id === '' ) alert('아이디를 입력해주세요');
    else if (Name === '' ) alert('이름을 입력해주세요');
    else if (Certification === '' ) alert('본인인증 번호를 입력해주세요');
    else if (Password === '' ) alert('비밀번호를 입력해주세요');
    else if (PasswordConfirm === '' ) alert('비밀번호 확인을 입력해주세요');
    else if (Password !== PasswordConfirm ) alert('비밀번호가 일치하지 않습니다');
    else axios({
      url: 'http://127.0.0.1:5000/api/join',
      method:'POST',
      data:{
        id: {Id},
        name: {Name},
        certification: {Certification},
        password: {Password},
        passwordConfirm: {PasswordConfirm}
      }
    }).then(function (result) {
      if ( result['data']['result'] ) {
        alert('회원가입이 완료됐습니다. 로그인해주세요.')
        history.push('/login');
      } else { 
        alert('이미 존재하는 아이디입니다.');
        alert('본인 인증이 일치하지 않습니다.');
        setPassword('');
        setPasswordConfirm('');
      }
    }).catch(function(error){
      alert('알수 없는 문제로 회원가입이 실패했습니다.');
      setPassword('');
      setPasswordConfirm('');
    });
  }

  const onSubmitHandler = (event) => {

    if ( Id === '' ) alert('아이디를 입력해주세요');
    else axios({
      url: 'http://127.0.0.1:5000/api/join',
      method:'POST',
      data:{
        id: {Id},
        name: {Name},
        certification: {Certification},
        password: {Password},
        passwordConfirm: {PasswordConfirm}
      }
    }).then(function (result) {
      if ( result['data']['result'] ) {
        alert('회원가입이 완료됐습니다. 로그인해주세요.')
        history.push('/login');
      } else { 
        alert('이미 존재하는 아이디입니다.');
        alert('본인 인증이 일치하지 않습니다.');
        setPassword('');
        setPasswordConfirm('');
      }
    }).catch(function(error){
      alert('알수 없는 문제로 회원가입이 실패했습니다.');
      setPassword('');
      setPasswordConfirm('');
    });
  }

  return(
    <div className="join_wrap">
      <form method="post" autocomplete="off">
        <div>
            <p><span>아이디</span><span>*</span></p>
            <input type="text" value={Id} onChange={onIdHandler} />
        </div>
        <div>
          <div>
            <p> <span>성명</span><span>*</span></p>
            <input type="text" value={Name} onChange={onNameHandler} />
          </div>
          <div>
            <p><span>본인인증</span><span>*</span></p>
            <input type="text" value={Certification} onChange={onCertificationHandler} />
            <button type="button">인증번호 요청</button>
          </div>
        </div>
        <div>
          <p><span>비밀번호</span><span>*</span></p>
          <input type="password" autocomplete="off" value={Password} onChange={onPasswordHandler} />
        </div>
        <div>
          <p><span>비밀번호 확인</span><span>*</span></p>       
          <input type="password" autocomplete="off" value={PasswordConfirm} onChange={onPasswordConfirmHandler} />
        </div>
        <p>
          <a onClick={onSubmitHandler}>가입하기</a><Link to="/">취소</Link>
        </p>
      </form>
    </div>
  )
    
}

export default Join;