// react
import React from 'react';

// component
import Header from '../../component/Header/Header';
import Main from '../../component/Main/Main';
import Footer from '../../component/Footer/Footer';

// css
import './Login.css';

const Login = ({title, name}) => {

  return(
    <div className="login">
      <Header></Header>
      <Main title={title} name={name}></Main>
      <Footer></Footer>
    </div>
  )

}

export default Login;