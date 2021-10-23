// react
import React, { Fragment } from 'react';

// css
import './Title.css';


const Title = ({ title }) => {

  return(
    <Fragment>
      <p className='main_title'>{title}</p>
      {title === 'Home' && <span className='main_text'>마스터 및 관리자 계정은 <a href="https://github.com/rhesus2017/member_management" target="_blnak">Github README.md</a> 에서 확인해주세요.</span>}
      {title === '로그인' && <span className='main_text'>마스터 및 관리자 계정은 <a href="https://github.com/rhesus2017/member_management" target="_blnak">Github README.md</a> 에서 확인해주세요.</span>}
      {title === '메세지' && <span className='main_text'>미접속 상태일 때 받은 메세지를 보관합니다.</span>}
    </Fragment>
  )
  
}


export default Title;