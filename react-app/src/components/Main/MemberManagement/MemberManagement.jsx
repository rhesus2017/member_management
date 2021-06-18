// react
import React, { useEffect, useState } from 'react'
import { useHistory } from "react-router-dom";
import axios from 'axios';

// component
import MemberTable from './MemberTable/MemberTable';

// hoc
import useLocalStorage from "../../../hoc/useLocalStorage";

// css
import './MemberManagement.css';

const MemberManagement = () => { 

  useEffect(() => {
    sessionCheck()
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const mySwal = require('sweetalert2');
  const history = useHistory();
  const [Members, setMembers] = useState([]);
  const [UserId, setUserId] = useLocalStorage("userId", 0);
  const [UserName, setUserName] = useLocalStorage("userName", ""); // eslint-disable-line no-unused-vars
  const [UserGrade, setUserGrade] = useLocalStorage("userGrade", ""); // eslint-disable-line no-unused-vars

  const sessionCheck = (event) => {
    axios({
      url: '/auth/api/session_check',
      method:'GET',
    }).then(function (response) {
      if ( UserId !== 0 && !response['data']['session'] ) {
        mySwal.fire({icon: 'error', title: '실패', text: '세션이 만료되었습니다. 로그인 페이지로 이동합니다'}).then((result) => {
          setUserId(0);
          setUserName("");
          setUserGrade("");
          history.push('/Login');
        });
      } else if ( UserId === "0" && !response['data']['session'] ) {
        mySwal.fire({icon: 'error', title: '실패', text: '로그인이 필요한 페이지입니다. 로그인 페이지로 이동합니다'}).then((result) => {
          setUserId(0);
          setUserName("");
          setUserGrade("");
          history.push('/Login');
        });
      } else {
        getAllMemberInformation()
      }
    }).catch(function(error){
      mySwal.fire({icon: 'error', title: '실패', text: '알수 없는 문제로 새션 확인을 실패했습니다'});
    });
  }
  const getAllMemberInformation = (event) => {
    axios({
      url: '/auth/api/get_all_information',
      method:'GET',
    }).then(function (response) {
      if ( response['data']['result'] === '000000' ) {
        setMembers(response['data']['rows']);
      }else if ( response['data']['result'] === '000010' ) {
        mySwal.fire({icon: 'error', title: '실패', text: '회원정보를 볼 수 있는 등급이 아닙니다'});
        history.push('/');
      }
    }).catch(function(error){
      mySwal.fire({icon: 'error', title: '실패', text: '알수 없는 문제로 회원정보 가져오기를 실패했습니다'});
      history.push('/');
    });
  }

  return(
    <div className="management_wrap">
      <div className="table">
        <div className="tr">
          <div className="td th"><span>휴대폰번호</span></div>
          <div className="td th"><span>이름</span></div>
          <div className="td th"><span>비밀번호</span></div>
          <div className="td th"><span>비밀번호확인</span></div>
          <div className="td th"><span>등급</span></div>
          <div className="td th"></div>
        </div>
        { 
          Members.map((Member) => {
            return (
              <MemberTable Member={Member}></MemberTable>
            )
          })
        }     
      </div>
    </div>
  )
    
}

export default MemberManagement;