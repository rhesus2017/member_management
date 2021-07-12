// react
import React, { Fragment } from 'react';

// css
import './Title.css';


const Title = ({ title }) => {

  return(
    <Fragment>
      <p className='main_title'>{title}</p>
      {title === 'MESSAGE' && <span className='main_text'>미접속 상태일 때 받은 메세지를 보관합니다.</span>}
    </Fragment>
  )
  
}


export default Title;