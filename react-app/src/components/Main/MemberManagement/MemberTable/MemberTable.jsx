// react
import React, { useState } from 'react'
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { UserNameSetting } from '../../../../action';
import socketio from 'socket.io-client';

// hoc
import useLocalStorage from '../../../../hoc/useLocalStorage';


const MemberTable = ({ Member }) => { 

  const grades = ['admin', 'guest']
  const states = ['J', 'O', 'S']
  const mySwal = require('sweetalert2');
  const socket = socketio.connect('http://192.168.0.22:5050/');
  const dispatch = useDispatch();
  const history = useHistory();
  const MemberId = Member['id'];

  const [Name, setName] = useState(Member['name']);
  const [Password, setPassword] = useState('');
  const [PasswordConfirm, setPasswordConfirm] = useState('');
  const [Grade, setGrade] = useState(Member['grade']);
  const [State, setState] = useState(Member['state']);

  const [UserId, setUserId] = useLocalStorage('userId', 0); // eslint-disable-line no-unused-vars
  const [UserName, setUserName] = useLocalStorage('userName', ''); // eslint-disable-line no-unused-vars
  const [UserGrade, setUserGrade] = useLocalStorage('userGrade', ''); // eslint-disable-line no-unused-vars


  const onNameHandler = (event) => {
    setName(event.currentTarget.value);
  }
  const onPasswordHandler = (event) => {
    setPassword(event.currentTarget.value);
  }
  const onPasswordConfirmHandler = (event) => {
    setPasswordConfirm(event.currentTarget.value);
  }
  const onGradeHandler = (event) => {
    setGrade(event.currentTarget.value);
  }
  const onStateHandler = (event) => {
    setState(event.currentTarget.value);
  }

  const userNameSetting = () => {
    dispatch(UserNameSetting());
  }

  const onChangeClick = (event) => {

    mySwal.fire({icon: 'question', title: '질문', text: '회원정보를 변경하시겠습니까?', showCancelButton: true}).then((result) => {
      if (result.isConfirmed) {
        let password_regExp = /^[a-zA-Z0-9]{10,15}$/;

        if (Password !== '' || PasswordConfirm !== '') {
          if ( !password_regExp.test(Password) ) {
            mySwal.fire({icon: 'error', title: '실패', text: '비밀번호를 숫자와 영문자 조합으로 10~15자리로 입력해주세요'});
            setPassword('');
            setPasswordConfirm('');
            return false;
          }else if (Password !== PasswordConfirm ) {
            mySwal.fire({icon: 'error', title: '실패', text: '비밀번호가 일치하지 않습니다'});
            setPassword('');
            setPasswordConfirm('');
            return false;
          }
        }
        
        axios({
          url: '/auth/api/change_member_information',
          method:'POST',
          data:{
            userId: {UserId},
            memberId: {MemberId},
            name: {Name},
            password: {Password},
            grade: {Grade},
            state: {State}
          }
        }).then(function (response) {
          if ( response['data']['result'] === '000000' ) {
            mySwal.fire({icon: 'success', title: '성공', text: '회원정보 변경이 완료됐습니다'});
            setPassword('');
            setPasswordConfirm('');
            if ( MemberId === UserId ) {
              setUserName(Name);
              setUserGrade(Grade);
              userNameSetting();
            }
          } else if ( response['data']['result'] === '000010' ) {
            mySwal.fire({icon: 'error', title: '실패', text: '회원정보를 수정할 수 있는 등급이 아닙니다'});
            history.push('/');
          } else if ( response['data']['result'] === '000020' ) {
            mySwal.fire({icon: 'error', title: '실패', text: '마스터 계정은 정보를 수정할 수 없습니다'});
            setPassword('');
            setPasswordConfirm('');
          } else if ( response['data']['result'] === '000080' ) {
            mySwal.fire({icon: 'error', title: '실패', text: '탈퇴 된 계정입니다. 관리자에게 문의해주세요'});
            setUserId(0);
            setUserName('');
            setUserGrade('');
            history.push('/');
          } else if ( response['data']['result'] === '000090' ) {
            mySwal.fire({icon: 'error', title: '실패', text: '정지 된 계정입니다. 관리자에게 문의해주세요'});
            setUserId(0);
            setUserName('');
            setUserGrade('');
            history.push('/');
          }
        }).catch(function(error){
          mySwal.fire({icon: 'error', title: '실패', text: '알수 없는 문제로 회원정보 변경이 실패했습니다'});
          setPassword('');
          setPasswordConfirm('');
        });
      }
    })
  }
  const alarm = () => {
    mySwal.fire({icon: 'question', title: '질문', text: '해당 유저에게 보낼 메세지를 입력해주세요', input: 'text', showCancelButton: true}).then((result) => {
      if (result.isConfirmed) {
        socket.emit('sendMessage', {'message': result.value, 'memberId': MemberId})
        socket.on('confirmResult', (data) => {
          if ( data.result === '000000') {
            mySwal.fire({icon: 'success', title: '성공', text: '메세지가 성공적으로 전송되었습니다'});
          }
        });
      }
    })
  }

  return(
    <form method='post' autocomplete='off' className='tr'>
      <div className='td'><input type='tel' value={Member['phone']} readOnly /></div>
      <div className='td'><input type='text' value={Name} onChange={onNameHandler} /></div>
      <div className='td'><input type='password' autocomplete='off' value={Password} onChange={onPasswordHandler} /></div>
      <div className='td'><input type='password' autocomplete='off' value={PasswordConfirm} onChange={onPasswordConfirmHandler} /></div>
      <div className='td'>
        <select onChange={onGradeHandler}>
          {
            Member['grade'] === 'master' ? 
              <option>{Grade}</option>
            :
              grades.map((grade) => {return <option selected={grade === Grade ? true : false}>{grade}</option> })
          }
        </select>
      </div>
      <div className='td'>
        <select onChange={onStateHandler}>
          {
          states.map((state) => { 
            return <option selected={state === State ? true : false}>{state}</option> 
            })
          }
        </select>
      </div>
      <div className='td'><div className='button' onClick={onChangeClick}>변경</div></div>
      <div className='td'><div className='button' onClick={alarm}>알림</div></div>
    </form>
  )
    
}

export default MemberTable;