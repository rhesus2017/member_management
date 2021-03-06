// react
import React from 'react';

// component
import Header from '../../components/Header/Header';
import Main from '../../components/Main/Main';
import Footer from '../../components/Footer/Footer';


const Information = ({ title, name, link }) => {

  return(
    <div className={name}>
      <Header link={link} />
      <Main title={title} name={name} />
      <Footer />
    </div>
  )

}


export default Information;