// react
import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux';
import { Provider  } from 'react-redux';
import MenuOpenCloseApp from './reducer';

// component
import App from './App';

// js
import '@fortawesome/fontawesome-free/js/all.js';


const store = createStore(MenuOpenCloseApp);

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);
