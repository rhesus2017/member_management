// react
import React from 'react';
import { Link } from 'react-router-dom';

// css
import './LeftNav.css';


const LeftNav = ({ link }) => {

  const mySwal = require('sweetalert2');
  const getStorage = (item) => { return JSON.parse(window.localStorage.getItem(item)) }

  const clickMenu = () => {
    if ( getStorage('userId') === 0 ) {
      mySwal.fire({icon: 'error', title: '실패', html: '관리자 계정은 <a href="https://github.com/rhesus2017/member_management" target="_blank">README.md</a> 에서 확인해주세요.'});
    } else if ( getStorage('userGrade') === 'guest' ) {
      mySwal.fire({icon: 'error', title: '실패', html: '회원정보를 볼 수 있는 등급이 아닙니다'});
    }
   
  }

  return(
    <nav className='left_nav'>
      <ul>
        {
          getStorage('userId') === 0 || getStorage('userGrade') === 'guest'
          ? <li><span className={link === '/MemberManagement' && 'on'} onClick={clickMenu}><i className='fas fa-bezier-curve awesome-icon'></i><span>회원관리</span></span></li>
          : <li><Link to='/MemberManagement' className={link === '/MemberManagement' && 'on'}><i className='fas fa-bezier-curve awesome-icon'></i><span>회원관리</span></Link></li>
        }
        
      </ul>
    </nav>
  )

}


export default LeftNav;