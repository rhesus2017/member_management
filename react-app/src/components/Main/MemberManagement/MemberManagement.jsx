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

  useEffect(() => {
    getMemberInformation();
  }, [currentPage.pager]); // eslint-disable-line react-hooks/exhaustive-deps

  const storageClear = (route) => {
    setStorage('userId', 0);
    setStorage('userName', '');
    setStorage('userGrade', '');
    history.push(route);
  }
  const getMemberInformation = () => {
    axios({
      url: '/auth/api/get_member_information',
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
        mySwal.fire({icon: 'error', title: '실패', html: '회원정보를 볼 수 있는 등급이 아닙니다'});
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
      mySwal.fire({icon: 'error', title: '실패', html: '알수 없는 문제로 회원정보 가져오기를 실패했습니다'});
      storageClear('/');
    });
  }

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
            <div className='td th'><span>변경</span></div>
            <div className='td th'><span>알림</span></div>
            <div className='td th'><span>로그아웃</span></div>
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