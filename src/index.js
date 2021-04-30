// react
import React from 'react';
import ReactDOM from 'react-dom';

// component
import Header from './component/Header';
import Main from './component/Main';
import Footer from './component/Footer';

ReactDOM.render(
  <React.StrictMode>
    <div className="react_app">
      <Header></Header>
      <Main></Main>
      <Footer></Footer>
    </div>
  </React.StrictMode>,
  document.getElementById('root')
);
