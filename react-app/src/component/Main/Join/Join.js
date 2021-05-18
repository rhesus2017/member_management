// react
import React, { useState }from 'react'
import axios from 'axios';
import { Link, useHistory } from "react-router-dom";

// css
import './Join.css';

const Join = () => {

  const mySwal = require('sweetalert2');
  const history = useHistory();
  const [Phone, setPhone] = useState("");
  const [Name, setName] = useState("");
  const [Certification, setCertification] = useState("");
  const [CertificationButton, setCertificationButton] = useState("인증번호 요청");
  const [CertificationState, setCertificationProgress] = useState(false);
  const [Password, setPassword] = useState("");
  const [PasswordConfirm, setPasswordConfirm] = useState("");

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

  const onSubmitClick = (event) => {
    if ( Phone === '' ) mySwal.fire({icon: 'error', title: '실패', text: '휴대폰 번호를 입력해주세요'});
    else if (Name === '' ) mySwal.fire({icon: 'error', title: '실패', text: '이름을 입력해주세요'});
    else if (Certification === '' ) mySwal.fire({icon: 'error', title: '실패', text: '본인인증 번호를 입력해주세요'});
    else if (Password === '' ) mySwal.fire({icon: 'error', title: '실패', text: '비밀번호를 입력해주세요'});
    else if (PasswordConfirm === '' ) mySwal.fire({icon: 'error', title: '실패', text: '비밀번호 확인을 입력해주세요'});
    else if (Password !== PasswordConfirm ) mySwal.fire({icon: 'error', title: '실패', text: '비밀번호가 일치하지 않습니다'});
    else 
      axios({
        url: 'http://127.0.0.1:5000/api/join',
        method:'POST',
        data:{
          phone: {Phone},
          name: {Name},
          certification: {Certification},
          password: {Password},
          passwordConfirm: {PasswordConfirm}
        }
      }).then(function (result) {
        if ( result['data']['result'] ) {
          mySwal.fire({icon: 'success', title: '성공', text: '회원가입이 완료됐습니다. 로그인해주세요'});
          history.push('/login');
        } else { 
          mySwal.fire({icon: 'error', title: '실패', text: '이미 가입 된 휴대폰 번호입니다'});
          mySwal.fire({icon: 'error', title: '실패', text: '본인 인증이 일치하지 않습니다'});
          setPassword('');
          setPasswordConfirm('');
        }
      }).catch(function(error){
        mySwal.fire({icon: 'error', title: '실패', text: '알수 없는 문제로 회원가입이 실패했습니다'});
        setPassword('');
        setPasswordConfirm('');
      });
  }
  const onCertificationClick = (event) => {
    if (!CertificationState) {
      if ( Phone === '' ) mySwal.fire({icon: 'error', title: '실패', text: '휴대폰 번호를 입력해주세요'});
      else 
        axios({
          url: 'http://127.0.0.1:5000/api/join/certification',
          method:'POST',
          data:{
            phone: {Phone} 
          }
        }).then(function (result) {
          if ( result['data']['result'] ) {
            mySwal.fire({icon: 'success', title: '성공', text: '인증번호가 발송되었습니다. 인증번호를 입력해주세요'});
            setCertificationButton('인증번호 재요청');
            setCertificationProgress(true);
          } else {
            mySwal.fire({icon: 'error', title: '실패', text: '존재하지 않는 휴대폰 번호입니다'});
          }
        }).catch(function(error){
          mySwal.fire({icon: 'error', title: '실패', text: '알수 없는 문제로 인증번호 발송이 실패했습니다'});
        });
    } else {
        if ( Phone === '' ) mySwal.fire({icon: 'error', title: '실패', text: '휴대폰 번호를 입력해주세요'});
        else 
          axios({
            url: 'http://127.0.0.1:5000/api/join/certification',
            method:'POST',
            data:{
              phone: {Phone} 
            }
          }).then(function (result) {
            if ( result['data']['result'] ) {
              mySwal.fire({icon: 'success', title: '성공', text: '인증번호가 재발송되었습니다. 인증번호를 입력해주세요'});
              setCertification('');
            } else { 
              mySwal.fire({icon: 'error', title: '실패', text: '존재하지 않는 휴대폰 번호입니다'});
            }
          }).catch(function(error){
            mySwal.fire({icon: 'error', title: '실패', text: '알수 없는 문제로 인증번호 발송이 실패했습니다'});
          });
    }
  }

  return(
    <div className="join_wrap">
      <form method="post" autocomplete="off">
        <div>
            <p><span>휴대폰번호</span><span>*</span></p>
            <input type="text" value={Phone} onChange={onPhoneHandler} />
        </div>
        <div>
          <div>
            <p> <span>성명</span><span>*</span></p>
            <input type="text" value={Name} onChange={onNameHandler} />
          </div>
          <div>
            <p><span>본인인증</span><span>*</span></p>
            <input type="text" value={Certification} onChange={onCertificationHandler} />
            <button type="button" onClick={onCertificationClick} >{CertificationButton}</button>
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
          <a onClick={onSubmitClick}>가입하기</a><Link to="/">취소</Link>
        </p>
      </form>
    </div>
  )
    
}

export default Join;