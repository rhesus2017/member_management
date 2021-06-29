// react
import React, { useState, useEffect } from 'react'
import axios from 'axios';
import { Link, useHistory } from 'react-router-dom';

// redux
import { useDispatch } from 'react-redux';
import { UserNameSetting } from '../../../action';

// css
import './Information.css';


const Information = () => {

  useEffect(() => {
    getUserInformation();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const mySwal = require('sweetalert2');
  const history = useHistory();
  const dispatch = useDispatch();
  const userNameSetting = () => { dispatch(UserNameSetting()); };
  const getStorage = (item) => { return JSON.parse(window.localStorage.getItem(item)) }
  const setStorage = (item, value) => { window.localStorage.setItem(item, JSON.stringify(value)); };
  const [Phone, setPhone] = useState('');
  const [Name, setName] = useState('');
  const [Password, setPassword] = useState('');
  const [PasswordConfirm, setPasswordConfirm] = useState('');
  const password_regExp = /^[a-zA-Z0-9]{10,15}$/;

  const storageClear = (route) => {
    setStorage('userId', 0);
    setStorage('userName', '');
    setStorage('userGrade', '');
    history.push(route);
  }
  const onNameHandler = (event) => {
    setName(event.currentTarget.value);
  }
  const onPasswordHandler = (event) => {
    setPassword(event.currentTarget.value);
  }
  const onPasswordConfirmHandler = (event) => {
    setPasswordConfirm(event.currentTarget.value);
  }
  const getUserInformation = () => {
    axios({
      url: '/auth/api/get_user_information',
      method:'POST',
      data: {
        userId: getStorage('userId')
      }
    }).then(function (response) {
      if ( response['data']['result'] === '000000' ) {
        setPhone(response['data']['userPhone']);
        setName(response['data']['userName']);
      } else if ( response['data']['result'] === '000300' ) {
        mySwal.fire({icon: 'error', title: '실패', html: '세션이 만료되었습니다. 로그인 페이지로 이동합니다'});
        storageClear('/Login');
      } else if ( response['data']['result'] === '000301' ) {
        mySwal.fire({icon: 'error', title: '실패', html: '관리자에 의해 로그아웃 됐습니다.<br>로그인 페이지로 이동합니다'});
        storageClear('/Login');
      } else if ( response['data']['result'] === '000302' ) {
        mySwal.fire({icon: 'error', title: '실패', html: '정지 된 계정입니다. 관리자에게 문의해주세요'});
        storageClear('/');
      } else if ( response['data']['result'] === '000303' ) {
        mySwal.fire({icon: 'error', title: '실패', html: '탈퇴 된 계정입니다. 관리자에게 문의해주세요'});
        storageClear('/');
      } else if ( response['data']['result'] === '000304' ) {
        mySwal.fire({icon: 'error', title: '실패', html: '로그인이 필요합니다. 로그인 페이지로 이동합니다'});
        storageClear('/Login');
      }
    }).catch(function(error){
      mySwal.fire({icon: 'error', title: '실패', html: '알수 없는 문제로 회원정보 가져오기를 실패했습니다'});
      storageClear('/');
    });
  }
  const changeUserInformation = () => {
    if (Name === '' ) mySwal.fire({icon: 'error', title: '실패', html: '이름을 입력해주세요'});
    else if (Password === '' ) mySwal.fire({icon: 'error', title: '실패', html: '비밀번호를 입력해주세요'});
    else if ( !password_regExp.test(Password) ) {
      mySwal.fire({icon: 'error', title: '실패', html: '비밀번호를 숫자와 영문자 조합으로 10~15자리로 입력해주세요'});
      setPassword('');
      setPasswordConfirm('');
    }
    else if (PasswordConfirm === '' ) mySwal.fire({icon: 'error', title: '실패', html: '비밀번호 확인을 입력해주세요'});
    else if (Password !== PasswordConfirm ) { 
      mySwal.fire({icon: 'error', title: '실패', html: '비밀번호가 일치하지 않습니다'});
      setPassword('');
      setPasswordConfirm('');
    }
    else 
      axios({
        url: '/auth/api/change_user_information',
        method: 'POST',
        data: {
          name: Name,
          password: Password,
          userId: getStorage('userId')
        }
      }).then(function (response) {
        if ( response['data']['result'] === '000000' ) {
          mySwal.fire({icon: 'success', title: '성공', html: '회원정보 변경이 완료됐습니다'});
          setPassword('');
          setPasswordConfirm('');
          setStorage('userName', Name)
          userNameSetting()
        } else if ( response['data']['result'] === '000300' ) {
          mySwal.fire({icon: 'error', title: '실패', html: '세션이 만료되었습니다. 로그인 페이지로 이동합니다'});
          storageClear('/Login');
        } else if ( response['data']['result'] === '000301' ) {
          mySwal.fire({icon: 'error', title: '실패', html: '관리자에 의해 로그아웃 됐습니다.<br>로그인 페이지로 이동합니다'});
          storageClear('/Login');
        } else if ( response['data']['result'] === '000302' ) {
          mySwal.fire({icon: 'error', title: '실패', html: '정지 된 계정입니다. 관리자에게 문의해주세요'});
          storageClear('/');
        } else if ( response['data']['result'] === '000303' ) {
          mySwal.fire({icon: 'error', title: '실패', html: '탈퇴 된 계정입니다. 관리자에게 문의해주세요'});
          storageClear('/');
        } else if ( response['data']['result'] === '000304' ) {
          mySwal.fire({icon: 'error', title: '실패', html: '로그인이 필요합니다. 로그인 페이지로 이동합니다'});
          storageClear('/Login');
        }
      }).catch(function(error){
        mySwal.fire({icon: 'error', title: '실패', html: '알수 없는 문제로 회원정보 변경을 실패했습니다'});
        storageClear('/');
      });
  }
  const outUser = () => {
    mySwal.fire({icon: 'question', title: '질문', html: '정말 회원탈퇴 하시겠습니까?', showCancelButton: true}).then((result) => {
      if (result.isConfirmed) {
        if (Name === '' ) mySwal.fire({icon: 'error', title: '실패', html: '이름을 입력해주세요'});
        else if (Password === '' ) mySwal.fire({icon: 'error', title: '실패', html: '비밀번호를 입력해주세요'});
        else if ( !password_regExp.test(Password) ) {
          mySwal.fire({icon: 'error', title: '실패', html: '비밀번호를 숫자와 영문자 조합으로 10~15자리로 입력해주세요'});
          setPassword('');
          setPasswordConfirm('');
        }
        else if (PasswordConfirm === '' ) mySwal.fire({icon: 'error', title: '실패', html: '비밀번호 확인을 입력해주세요'});
        else if (Password !== PasswordConfirm ) {
          mySwal.fire({icon: 'error', title: '실패', html: '비밀번호가 일치하지 않습니다'});
          setPassword('');
          setPasswordConfirm('');
        }
        else 
          axios({
            url: '/auth/api/out_user',
            method:'POST',
            data:{
              password: Password,
              userId: getStorage('userId')
            }
          }).then(function (response) {
            if ( response['data']['result'] === '000000' ) {
              mySwal.fire({icon: 'success', title: '성공', html: '회원탈퇴가 완료되었습니다'});
              storageClear('/');
            } else if ( response['data']['result'] === '000010' ) {
              mySwal.fire({icon: 'error', title: '실패', html: '비밀번호가 일치하지 않습니다'});
              setPassword('');
              setPasswordConfirm('');
            } else if ( response['data']['result'] === '000300' ) {
              mySwal.fire({icon: 'error', title: '실패', html: '세션이 만료되었습니다. 로그인 페이지로 이동합니다'});
              storageClear('/Login');
            } else if ( response['data']['result'] === '000301' ) {
              mySwal.fire({icon: 'error', title: '실패', html: '관리자에 의해 로그아웃 됐습니다.<br>로그인 페이지로 이동합니다'});
              storageClear('/Login');
            } else if ( response['data']['result'] === '000302' ) {
              mySwal.fire({icon: 'error', title: '실패', html: '정지 된 계정입니다. 관리자에게 문의해주세요'});
              storageClear('/');
            } else if ( response['data']['result'] === '000303' ) {
              mySwal.fire({icon: 'error', title: '실패', html: '탈퇴 된 계정입니다. 관리자에게 문의해주세요'});
              storageClear('/');
            } else if ( response['data']['result'] === '000304' ) {
              mySwal.fire({icon: 'error', title: '실패', html: '로그인이 필요합니다. 로그인 페이지로 이동합니다'});
              storageClear('/Login');
            }
          }).catch(function(error){
            mySwal.fire({icon: 'error', title: '실패', html: '알수 없는 문제로 회원탈퇴를 실패했습니다'});
            storageClear('/');
          });
      }
    })
  }
  const onEnterPress = (event) => {
    if (event.key === 'Enter') {
      changeUserInformation();
    }
  }
  

  return(
    <div className='information_wrap'>
      <form method='post' autocomplete='off'>
        <div>
          <div className='front'>
            <p><span>휴대폰번호</span><span>*</span></p>
            <input type='text' value={Phone} readOnly />
          </div>
          <div className='end'>
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
          <span onClick={changeUserInformation}>변경하기</span><span onClick={outUser}>회원탈퇴</span><Link to='/'>취소</Link>
        </p>
      </form>
    </div>
  )
    
}


export default Information;