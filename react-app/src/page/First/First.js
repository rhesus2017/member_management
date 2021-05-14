// react
import React from 'react';

// component
import Header from '../../component/Header/Header';
import Main from '../../component/Main/Main';
import Footer from '../../component/Footer/Footer';

// css
import './First.css';

const First = ({title, name}) => {

  return(
    <div className="first">
      <Header></Header>
      <Main title={title} name={name}></Main>
      <Footer></Footer>
    </div>
  )

}

export default First;