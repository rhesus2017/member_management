// react
import React from 'react';

// component
import Header from '../../component/Header/Header';
import Main from '../../component/Main/Main';
import Footer from '../../component/Footer/Footer';

// css
import './Home.css';

const Home = (props) => {

  return(
    <div className="home">
      <Header></Header>
      <Main title={props.title} name={props.name}></Main>
      <Footer></Footer>
    </div>
  )

}

export default Home;