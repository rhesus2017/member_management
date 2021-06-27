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
    sessionCheck();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const mySwal = require('sweetalert2');
  const history = useHistory();
  const dispatch = useDispatch();
  const userNameSetting = () => { dispatch(UserNameSetting()); };
  const getStorage = (item) => { return JSON.parse(window.localStorage.getItem(item)); };
  const setStorage = (item, value) => { window.localStorage.setItem(item, JSON.stringify(value)); };
  const [Phone, setPhone] = useState('');
  const [Name, setName] = useState('');
  const [Password, setPassword] = useState('');
  const [PasswordConfirm, setPasswordConfirm] = useState('');

  const onNameHandler = (event) => {
    setName(event.currentTarget.value);
  }
  const onPasswordHandler = (event) => {
    setPassword(event.currentTarget.value);
  }
  const onPasswordConfirmHandler = (event) => {
    setPasswordConfirm(event.currentTarget.value);
  }
  const sessionCheck = (event) => {
    axios({
      url: '/auth/api/session_check',
      method:'POST',
      data:{
        userId: getStorage('userId'),
      }
    }).then(function (response) {
      if ( getStorage('userId') !== 0 && !response['data']['session'] ) {
        mySwal.fire({icon: 'error', title: '실패', text: '세션이 만료되었습니다. 로그인 페이지로 이동합니다'});
        setStorage('userId', 0);
        setStorage('userName', '');
        setStorage('userGrade', '');
        history.push('/Login');
      } else if ( getStorage('userId') === 0 && !response['data']['session'] ) {
        mySwal.fire({icon: 'error', title: '실패', text: '로그인이 필요한 페이지입니다. 로그인 페이지로 이동합니다'});
        setStorage('userId', 0);
        setStorage('userName', '');
        setStorage('userGrade', '');
        history.push('/Login');
      } else {
        getMemberInformation();
      }
    }).catch(function(error){
      mySwal.fire({icon: 'error', title: '실패', text: '알수 없는 문제로 새션 확인을 실패했습니다'});
    });
  }
  const getMemberInformation = (event) => {
    axios({
      url: '/auth/api/get_information',
      method:'POST',
      data:{
        userId: getStorage('userId'),
      }
    }).then(function (response) {
      if ( response['data']['result'] === '000000' ) {
        setPhone(response['data']['userPhone']);
        setName(response['data']['userName']);
      } else if ( response['data']['result'] === '000080' ) {
        mySwal.fire({icon: 'error', title: '실패', text: '탈퇴 된 계정입니다. 관리자에게 문의해주세요'});
        setStorage('userId', 0);
        setStorage('userName', '');
        setStorage('userGrade', '');
        history.push('/');
      } else if ( response['data']['result'] === '000090' ) {
        mySwal.fire({icon: 'error', title: '실패', text: '정지 된 계정입니다. 관리자에게 문의해주세요'});
        setStorage('userId', 0);
        setStorage('userName', '');
        setStorage('userGrade', '');
        history.push('/');
      } else if ( response['data']['result'] === '000100' ) {
        mySwal.fire({icon: 'error', title: '실패', text: '관리자에 의해 로그아웃 된 계정입니다. 다시 로그인 해주세요'});
        setStorage('userId', 0);
        setStorage('userName', '');
        setStorage('userGrade', '');
        history.push('/');
      }
    }).catch(function(error){
      mySwal.fire({icon: 'error', title: '실패', text: '알수 없는 문제로 회원정보 가져오기를 실패했습니다'});
      history.push('/');
    });
  }
  const onChangeClick = () => {
    let password_regExp = /^[a-zA-Z0-9]{10,15}$/;

    if (Name === '' ) mySwal.fire({icon: 'error', title: '실패', text: '이름을 입력해주세요'});
    else if (Password === '' ) mySwal.fire({icon: 'error', title: '실패', text: '비밀번호를 입력해주세요'});
    else if ( !password_regExp.test(Password) ) {
      mySwal.fire({icon: 'error', title: '실패', text: '비밀번호를 숫자와 영문자 조합으로 10~15자리로 입력해주세요'});
      setPassword('');
      setPasswordConfirm('');
    }
    else if (PasswordConfirm === '' ) mySwal.fire({icon: 'error', title: '실패', text: '비밀번호 확인을 입력해주세요'});
    else if (Password !== PasswordConfirm ) mySwal.fire({icon: 'error', title: '실패', text: '비밀번호가 일치하지 않습니다'});
    else 
      axios({
        url: '/auth/api/change_information',
        method:'POST',
        data:{
          userId: getStorage('userId'),
          name: Name,
          password: Password,
        }
      }).then(function (response) {
        if ( response['data']['result'] === '000000' ) {
          mySwal.fire({icon: 'success', title: '성공', text: '회원정보 변경이 완료됐습니다'});
          setStorage('userName', Name)
          setPassword('');
          setPasswordConfirm('');
          userNameSetting()
        } else if ( response['data']['result'] === '000080' ) {
          mySwal.fire({icon: 'error', title: '실패', text: '탈퇴 된 계정입니다. 관리자에게 문의해주세요'});
          setStorage('userId', 0);
          setStorage('userName', '');
          setStorage('userGrade', '');
          history.push('/');
        } else if ( response['data']['result'] === '000090' ) {
          mySwal.fire({icon: 'error', title: '실패', text: '정지 된 계정입니다. 관리자에게 문의해주세요'});
          setStorage('userId', 0);
          setStorage('userName', '');
          setStorage('userGrade', '');
          history.push('/');
        } else if ( response['data']['result'] === '000100' ) {
          mySwal.fire({icon: 'error', title: '실패', text: '관리자에 의해 로그아웃 된 계정입니다. 다시 로그인 해주세요'});
          setStorage('userId', 0);
          setStorage('userName', '');
          setStorage('userGrade', '');
          history.push('/');
        }
      }).catch(function(error){
        mySwal.fire({icon: 'error', title: '실패', text: '알수 없는 문제로 회원정보 변경이 실패했습니다'});
        setPassword('');
        setPasswordConfirm('');
      });
  }
  const outUser = () => {
    mySwal.fire({icon: 'question', title: '질문', text: '정말 회원탈퇴 하시겠습니까?', showCancelButton: true}).then((result) => {
      if (result.isConfirmed) {
        let password_regExp = /^[a-zA-Z0-9]{10,15}$/;

        if (Name === '' ) mySwal.fire({icon: 'error', title: '실패', text: '이름을 입력해주세요'});
        else if (Password === '' ) mySwal.fire({icon: 'error', title: '실패', text: '비밀번호를 입력해주세요'});
        else if ( !password_regExp.test(Password) ) {
          mySwal.fire({icon: 'error', title: '실패', text: '비밀번호를 숫자와 영문자 조합으로 10~15자리로 입력해주세요'});
          setPassword('');
          setPasswordConfirm('');
        }
        else if (PasswordConfirm === '' ) mySwal.fire({icon: 'error', title: '실패', text: '비밀번호 확인을 입력해주세요'});
        else if (Password !== PasswordConfirm ) mySwal.fire({icon: 'error', title: '실패', text: '비밀번호가 일치하지 않습니다'});
        else 
          axios({
            url: '/auth/api/out_user',
            method:'POST',
            data:{
              password: Password,
            }
          }).then(function (response) {
            if ( response['data']['result'] === '000000' ) {
              mySwal.fire({icon: 'success', title: '성공', text: '회원탈퇴가 완료되었습니다'}).then((result) => {
                setStorage('userId', 0);
                setStorage('userName', '');
                setStorage('userGrade', '');
                history.push('/');
              });
            } else if ( response['data']['result'] === '000010' ) {
              mySwal.fire({icon: 'error', title: '실패', text: '비밀번호가 일치하지 않습니다'});
              setPassword('');
              setPasswordConfirm('');
            } else if ( response['data']['result'] === '000080' ) {
              mySwal.fire({icon: 'error', title: '실패', text: '이미 탈퇴 된 계정입니다. 관리자에게 문의해주세요'});
              setStorage('userId', 0);
              setStorage('userName', '');
              setStorage('userGrade', '');
              history.push('/');
            } else if ( response['data']['result'] === '000090' ) {
              mySwal.fire({icon: 'error', title: '실패', text: '정지 된 계정입니다. 관리자에게 문의해주세요'});
              setStorage('userId', 0);
              setStorage('userName', '');
              setStorage('userGrade', '');
              history.push('/');
            }
          }).catch(function(error){
            mySwal.fire({icon: 'error', title: '실패', text: '알수 없는 문제로 로그아웃이 실패했습니다'});
          });
      }
    })
  }
  const onEnterPress = (e) => {
    if (e.key === 'Enter') {
      onChangeClick();
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
          <span onClick={onChangeClick}>변경하기</span><span onClick={outUser}>회원탈퇴</span><Link to='/'>취소</Link>
        </p>
      </form>
    </div>
  )
    
}


export default Information;