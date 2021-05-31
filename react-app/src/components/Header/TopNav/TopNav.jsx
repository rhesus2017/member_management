// react
import React from 'react';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { Link, useHistory } from "react-router-dom";
import { MenuOpenClose } from '../../../action';

// hoc
import useLocalStorage from "../../../hoc/useLocalStorage";

// img
import logo from './img/logo.png';

// css
import './TopNav.css';

const TopNav = () => {

  const mySwal = require('sweetalert2');
  const history = useHistory();
  const dispatch = useDispatch();
  const [userId, setUserId] = useLocalStorage("userId", "0");

  const menuOpenClose = () => {
    dispatch(MenuOpenClose());
  }

  const logOut = (event) => {
    mySwal.fire({icon: 'question', title: '질문', text: '정말 로그아웃 하시겠습니까?', showCancelButton: true}).then((result) => {
      if (result.isConfirmed) {
        axios({
          url: 'http://127.0.0.1:5000/auth/api/logout',
          method:'POST'
        }).then(function (response) {
          if ( response['data']['result'] === '000000' ) {
            mySwal.fire({icon: 'success', title: '성공', text: '로그아웃이 완료되었습니다'}).then((result) => {
              setUserId("0");
              history.push('/');
            });
          }
        }).catch(function(error){
          mySwal.fire({icon: 'error', title: '실패', text: '알수 없는 문제로 로그아웃이 실패했습니다'});
        });
      }
    })
  }

  return(
    <div className="top_nav">

      <div className="left">

        <button onClick={menuOpenClose}>
          <span></span>
          <span></span>
          <span></span>
        </button>

        <Link to="/">
          <img src={logo} alt="react" />
        </Link>

      </div>
      
        {
          userId !== "0" ? <div className="right"><Link to="/Information">내 정보</Link><span></span><span onClick={logOut}>로그아웃</span></div>
          : <div className="right"><Link to="/Login">로그인</Link><span></span><Link to="/Join">회원가입</Link></div>
        }
        
    </div>
  )

}

export default TopNav;