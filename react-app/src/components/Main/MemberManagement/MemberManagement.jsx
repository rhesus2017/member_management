// react
import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom';
import axios from 'axios';

// redux
import { useSelector } from 'react-redux';

// component
import MemberTable from './MemberTable/MemberTable';
import Pagination from './Pagination/Pagination';

// css
import './MemberManagement.css';


const MemberManagement = () => { 

  const mySwal = require('sweetalert2');
  const history = useHistory();
  const currentPage = useSelector(state => state.GetPagination);
  const getStorage = (item) => { return JSON.parse(window.localStorage.getItem(item)) }
  const setStorage = (item, value) => { window.localStorage.setItem(item, JSON.stringify(value)) }
  const [Members, setMembers] = useState([]);
  const [Count, setCount] = useState();
  let getMemberComplete = false;

  useEffect(() => {
    sessionCheck()
    getMemberComplete = true; // eslint-disable-line react-hooks/exhaustive-deps
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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
        getAllMemberInformation()
      }
    }).catch(function(error){
      mySwal.fire({icon: 'error', title: '실패', text: '알수 없는 문제로 새션 확인을 실패했습니다'});
    });
  }
  const getAllMemberInformation = () => {
    axios({
      url: '/auth/api/get_all_information',
      method:'POST',
      data:{
        userId: getStorage('userId'),
        pager: currentPage.pager
      }
    }).then(function (response) {
      if ( response['data']['result'] === '000000' ) {
        setMembers(response['data']['rows']);
        setCount(response['data']['count']['count(*)']);
      }else if ( response['data']['result'] === '000010' ) {
        mySwal.fire({icon: 'error', title: '실패', text: '회원정보를 볼 수 있는 등급이 아닙니다'});
        history.push('/');
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
      }
    }).catch(function(error){
      mySwal.fire({icon: 'error', title: '실패', text: '알수 없는 문제로 회원정보 가져오기를 실패했습니다'});
      history.push('/');
    });
  }

  useEffect(() => {
    if ( getMemberComplete === false ) {
      getAllMemberInformation();
    } else {
      getMemberComplete = false;  // eslint-disable-line react-hooks/exhaustive-deps
    }
  }, [currentPage.pager])

  return(
    <div className='management_wrap'>
      <div className='table_wrap'>
        <div className='table'>
          <div className='tr'>
            <div className='td th'><span>휴대폰번호</span></div>
            <div className='td th'><span>이름</span></div>
            <div className='td th'><span>비밀번호</span></div>
            <div className='td th'><span>비밀번호확인</span></div>
            <div className='td th'><span>등급</span></div>
            <div className='td th'><span>상태</span></div>
            <div className='td th'></div>
          </div>
          { 
            Members.map((Member) => {
              return (
                <MemberTable Member={Member} />
              )
            })
          }     
        </div>
        <Pagination Count={Count}/>
      </div>
    </div>
  )
    
}


export default MemberManagement;