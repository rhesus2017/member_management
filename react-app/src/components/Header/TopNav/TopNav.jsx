// react
import React, { useEffect } from 'react';
import axios from 'axios';
import { Link, useHistory } from 'react-router-dom';

// redux
import { useDispatch, useSelector } from 'react-redux';
import { MenuOpenClose } from '../../../action';
import { RecentMessage } from '../../../action';

// img
import logo from './img/logo.png';

// css
import './TopNav.css';


const TopNav = () => {

  useEffect(() => {
    checkMessage();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const mySwal = require('sweetalert2');
  const history = useHistory();
  const dispatch = useDispatch();
  const menuOpenClose = () => { dispatch(MenuOpenClose());}
  const recentMessage = (check) => { dispatch(RecentMessage(check)); }
  const UserNameSetting = useSelector(state => state.UserNameSetting);
  const RecentMessageCheck = useSelector(state => state.RecentMessage);
  const getStorage = (item) => { return JSON.parse(window.localStorage.getItem(item)) }
  const setStorage = (item, value) => { window.localStorage.setItem(item, JSON.stringify(value)) }
  
  const storageClear = (route) => {
    setStorage('userId', 0);
    setStorage('userName', '');
    setStorage('userGrade', '');
    history.push(route);
  }
  const checkMessage = () => {
    axios({
      url: '/api/check_message',
      method: 'POST',
      data: {
        userId: getStorage('userId')
      }
    }).then(function (response) {
      if ( response['data']['result'] === '000000' ) {
        recentMessage(true);
      } else if ( response['data']['result'] === '000010' ) {
        recentMessage(false);
      }
    }).catch(function(error){
      mySwal.fire({icon: 'error', title: '실패', html: '알수 없는 문제로 메세지 체크를 실패했습니다'});
      storageClear('/');
    });
  }
  const logOut = () => {
    mySwal.fire({icon: 'question', title: '질문', html: '정말 로그아웃 하시겠습니까?', showCancelButton: true}).then((result) => {
      if (result.isConfirmed) {
        axios({
          url: '/api/logout',
          method: 'POST',
          data: {
            userId: getStorage('userId')
          }
        }).then(function (response) {
          if ( response['data']['result'] === '000000' ) {
            mySwal.fire({icon: 'success', title: '성공', html: '로그아웃이 완료되었습니다'});
            storageClear('/');
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
    <div className='top_nav'>
      <div className='left'>

        <button onClick={menuOpenClose}>
          <span></span>
          <span></span>
          <span></span>
        </button>

        <Link to='/'>
          <img src={logo} alt='react' />
        </Link>

      </div>
      
        {
          getStorage('userId') !== 0
          ? <div className='right'>
              <Link to='/Message' className='message'><i class="far fa-comment-dots"></i><span className={RecentMessageCheck.check ? 'new' : ''}></span></Link>
              <Link to='/Information' className='auth'>{UserNameSetting.name}</Link>
              <span></span>
              <span onClick={logOut}>로그아웃</span>
            </div>
          : 
          <div className='right'>
            <Link to='/Login' className='auth'>로그인</Link>
            <span></span>
            <Link to='/Join' className='auth'>회원가입</Link></div>
        }
        
    </div>
  )

}


export default TopNav;