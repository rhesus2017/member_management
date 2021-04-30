// react
import React, { Component } from 'react';

// component
import Content from './Content';
import Memo from './Memo';

class Main extends Component {

  render() {

    return(
      <div class="main">
        <main>
          <h1 class="blind">React Example Main</h1>
          <Content></Content>
          <Memo></Memo>
        </main>
      </div>
    )

  }

}

export default Main;