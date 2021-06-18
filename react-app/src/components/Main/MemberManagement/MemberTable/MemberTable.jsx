// react
import React, { useState } from 'react'
import axios from 'axios';
// import { useDispatch } from 'react-redux';

// hoc
import useLocalStorage from "../../../../hoc/useLocalStorage";

const MemberTable = ({ Member }) => { 

  const grades = ['master', 'admin', 'guest']
  const mySwal = require('sweetalert2');
  // const dispatch = useDispatch();
  const MemberId = Member['id'];
  const [Name, setName] = useState(Member['name']);
  const [Password, setPassword] = useState("");
  const [PasswordConfirm, setPasswordConfirm] = useState("");
  const [Grade, setGrade] = useState(Member['grade']);
  const [UserId, setUserId] = useLocalStorage("userId", 0); // eslint-disable-line no-unused-vars
  const [UserName, setUserName] = useLocalStorage("userName", ""); // eslint-disable-line no-unused-vars
  const [UserGrade, setUserGrade] = useLocalStorage("userGrade", "");

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

  // const UserNameSetting = () => {
  //   dispatch(UserNameSetting());
  // }

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
            memberId: {MemberId},
            name: {Name},
            password: {Password},
            grade: {Grade},
          }
        }).then(function (response) {
          if ( response['data']['result'] === '000000' ) {
            mySwal.fire({icon: 'success', title: '성공', text: '회원정보 변경이 완료됐습니다'});
            setPassword('');
            setPasswordConfirm('');

            if ( MemberId === UserId ) {
              setUserName(Name);
              setUserGrade(Grade);
              // UserNameSetting();
            }

          }
        }).catch(function(error){
          mySwal.fire({icon: 'error', title: '실패', text: '알수 없는 문제로 회원정보 변경이 실패했습니다'});
          setPassword('');
          setPasswordConfirm('');
        });
      }
    })
  }

  return(
    <form className="tr">
      <div className="td"><input type="tel" value={Member['phone']} readOnly /></div>
      <div className="td"><input type="text" value={Name} onChange={onNameHandler} /></div>
      <div className="td"><input type="password" autocomplete="off" value={Password} onChange={onPasswordHandler} /></div>
      <div className="td"><input type="password" autocomplete="off" value={PasswordConfirm} onChange={onPasswordConfirmHandler} /></div>
      <div className="td">
        <select disabled={UserGrade === 'admin' ? true : false || Member.grade === 'master' ? true : false} onChange={onGradeHandler}>
          {
          grades.map((grade) => { 
            return <option selected={grade === Grade ? true : false}>{grade}</option> 
            })
          }
        </select>
      </div>
      <div className="td"><button onClick={onChangeClick}>변경</button></div>
      <div className="td"><button>알림</button></div>
    </form>
  )
    
}

export default MemberTable;