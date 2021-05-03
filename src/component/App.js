// react
import React, { Component } from 'react';

// component
import Header from './Header';
import Main from './Main';
import Footer from './Footer';

class App extends Component {

  render() {

    return(
      <div className="react_app">
        <Header action={this.menuOpenClose}></Header>
        <Main></Main>
        <Footer></Footer>
      </div>
    )

  }

}

export default App;