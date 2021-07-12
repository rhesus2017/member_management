// react
import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import socketio from 'socket.io-client';
import Select from "react-select";

// redux
import { useDispatch } from 'react-redux';
import { UserNameSetting } from '../../../../action';


const MemberTable = ({ Member }) => {
  
  const mySwal = require('sweetalert2');
  const socket = socketio.connect('http://192.168.0.22:5050/');
  const history = useHistory();
  const dispatch = useDispatch();
  const userNameSetting = () => { dispatch(UserNameSetting()); }
  const getStorage = (item) => { return JSON.parse(window.localStorage.getItem(item)) }
  const setStorage = (item, value) => { window.localStorage.setItem(item, JSON.stringify(value)) }
  const [Name, setName] = useState(Member['name']);
  const [Password, setPassword] = useState('');
  const [PasswordConfirm, setPasswordConfirm] = useState('');
  const [Grade, setGrade] = useState(Member['grade']);
  const [DefaultGrade, setDefaultGrade] = useState({ value: Grade, label: Grade });
  const [State, setState] = useState(Member['state']);
  const [DefaultState, setDefaultState] = useState({ value: State, label: State });
  const grades = [{ value: 'admin', label: 'admin' }, { value: 'guest', label: 'guest' }]
  const masterGrades = [{ value: 'master', label: 'master'}]
  const states = [{ value: 'J', label: 'J'}, { value: 'O', label: 'O'}, { value: 'S', label: 'S'}]
  const password_regExp = /^[a-zA-Z0-9]{10,15}$/;

  useEffect(() => {
    setName(Member['name']);
    setGrade(Member['grade']);
    setState(Member['state']);
    setDefaultGrade({ value: Member['grade'], label: Member['grade'] })
    setDefaultState({ value: Member['state'], label: Member['state'] })
  }, [Member])

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
  const changeMemberInformation = () => {
    mySwal.fire({icon: 'question', title: '질문', html: '회원정보를 변경하시겠습니까?', showCancelButton: true}).then((result) => {
      if (result.isConfirmed) {
        if (Password !== '' || PasswordConfirm !== '') {
          if ( !password_regExp.test(Password) ) {
            mySwal.fire({icon: 'error', title: '실패', html: '비밀번호를 숫자와 영문자 조합으로 10~15자리로 입력해주세요'});
            setPassword('');
            setPasswordConfirm('');
            return false;
          }else if (Password !== PasswordConfirm ) {
            mySwal.fire({icon: 'error', title: '실패', html: '비밀번호가 일치하지 않습니다'});
            setPassword('');
            setPasswordConfirm('');
            return false;
          }
        }
        axios({
          url: '/api/change_member_information',
          method:'POST',
          data:{
            userId: getStorage('userId'),
            memberId: Member['id'],
            name: Name,
            password: Password,
            grade: Grade,
            state: State
          }
        }).then(function (response) {
          if ( response['data']['result'] === '000000' ) {
            mySwal.fire({icon: 'success', title: '성공', html: '회원정보 변경이 완료됐습니다'});
            setPassword('');
            setPasswordConfirm('');
            if ( Member['id'] === getStorage('userId') ) {
              setStorage('userName', Name);
              setStorage('userGrade', Grade);
              userNameSetting()
            }
          } else if ( response['data']['result'] === '000010' ) {
            mySwal.fire({icon: 'error', title: '실패', html: '회원정보를 수정할 수 있는 등급이 아닙니다'});
            history.push('/');
          } else if ( response['data']['result'] === '000020' ) {
            mySwal.fire({icon: 'error', title: '실패', html: '마스터 계정은 정보를 수정할 수 없습니다'});
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
          mySwal.fire({icon: 'error', title: '실패', html: '알수 없는 문제로 회원정보 변경이 실패했습니다'});
          storageClear('/');
        });
      }
    })
  }
  const alarm = () => {
    mySwal.fire({icon: 'question', title: '질문', html: '해당 유저에게 보낼 메세지를 입력해주세요', input: 'text', showCancelButton: true}).then((result) => {
      if (result.isConfirmed) {
        axios({
          url: '/api/alarm',
          method:'POST',
          data:{
            userId: getStorage('userId'),
            memberId: Member['id'],
            sender: getStorage('userName'),
            message: result.value
          }
        }).then(function (response) {
          if ( response['data']['result'] === '000000' ) {
            socket.emit('sendMessage', {'message': result.value, 'memberId': Member['id'], 'sender': getStorage('userName')})
            socket.on('confirmResult', (data) => {
              if ( data.result === '000000') { mySwal.fire({icon: 'success', title: '성공', html: '메세지가 성공적으로 전송되었습니다'}); }
            });
          } else if ( response['data']['result'] === '000020' ) {
            mySwal.fire({icon: 'success', title: '성공', html: '메세지가 성공적으로 전송되었습니다'});
          } else if ( response['data']['result'] === '000010' ) {
            mySwal.fire({icon: 'error', title: '실패', html: '메세지를 보낼 수 있는 등급이 아닙니다'});
            history.push('/');
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
          mySwal.fire({icon: 'error', title: '실패', html: '알수 없는 문제로 메세지 전송을 실패했습니다'});
          storageClear('/');
        });
      }
    })
  }
  const logOutMember = () => {
    mySwal.fire({icon: 'question', title: '질문', html: '해당 유저를 로그아웃 시키시겠습니까?', showCancelButton: true}).then((result) => {
      if (result.isConfirmed) {
        axios({
          url: '/api/logout_member',
          method:'POST',
          data:{
            userId: getStorage('userId'),
            memberId: Member['id']
          }
        }).then(function (response) {
          console.log(response)
          if ( response['data']['result'] === '000000' ) {
            mySwal.fire({icon: 'success', title: '성공', html: '해당 유저가 로그아웃 되었습니다'});
            if ( Member['id'] === getStorage('userId') ) {
              storageClear('/');
            }
          } else if ( response['data']['result'] === '000010' ) {
            mySwal.fire({icon: 'error', title: '실패', html: '계정을 로그아웃 시킬 수 있는 등급이 아닙니다'});
            history.push('/');
          } else if ( response['data']['result'] === '000020' ) {
            mySwal.fire({icon: 'error', title: '실패', html: '마스터 계정은 로그아웃 시킬 수 없습니다'});
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
          mySwal.fire({icon: 'error', title: '실패', html: '알수 없는 문제로 로그아웃이 실패했습니다'});
          storageClear('/');
        });
      }
    })
  }

  return(
    <form method='post' autocomplete='off' className='tr'>
      <div className='td'><input type='tel' value={Member['phone']} readOnly className='memberInput' /></div>
      <div className='td'><input type='text' value={Name} onChange={onNameHandler} className='memberInput' /></div>
      <div className='td'><input type='password' autocomplete='off' value={Password} onChange={onPasswordHandler} className='memberInput' /></div>
      <div className='td'><input type='password' autocomplete='off' value={PasswordConfirm} onChange={onPasswordConfirmHandler} className='memberInput' /></div>
      <div className='td'>
        {
          Member['grade'] === 'master'
          ? <Select options={masterGrades} defaultValue={DefaultGrade} value={{ value: Grade, label: Grade }} isSearchable={false} onChange={(e) => setGrade(e['value'])} />
          : <Select options={grades} defaultValue={DefaultGrade} value={{ value: Grade, label: Grade }} isSearchable={false} onChange={(e) => setGrade(e['value'])} />
        }
      </div>
      <div className='td'>
        <Select options={states} defaultValue={DefaultState} value={{ value: State, label: State }} isSearchable={false} onChange={(e) => setState(e['value'])} />
      </div>
      <div className='td'><div className='button' onClick={changeMemberInformation}>변경</div></div>
      <div className='td'><div className='button' onClick={alarm}>알림</div></div>
      <div className='td'><div className='button' onClick={logOutMember}>로그아웃</div></div>
    </form>
  )
    
}

export default MemberTable;