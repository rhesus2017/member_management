// react
import React from 'react';

// component
import Header from '../../component/Header/Header';
import Main from '../../component/Main/Main';
import Footer from '../../component/Footer/Footer';

// css
import './Join.css';

const Join = ({title, name}) => {

  return(
    <div className="join">
      <Header></Header>
      <Main title={title} name={name}></Main>
      <Footer></Footer>
    </div>
  )

}

export default Join;