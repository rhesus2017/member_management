// react
import React, { Component } from 'react';

// component
import Content from './Content';

// css
import '../css/Main.css';

class Main extends Component {

  render() {

    return(
      <div class="main">
        <main>
          <h1 class="blind">React Example Main</h1>
          <Content></Content>
        </main>
      </div>
    )

  }

}

export default Main;