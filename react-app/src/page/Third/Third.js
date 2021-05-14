// react
import React from 'react';

// component
import Header from '../../component/Header/Header';
import Main from '../../component/Main/Main';
import Footer from '../../component/Footer/Footer';

// css
import './Third.css';

const Third = ({title, name}) => {

  return(
    <div className="third">
      <Header></Header>
      <Main title={title} name={name}></Main>
      <Footer></Footer>
    </div>
  )

}

export default Third;