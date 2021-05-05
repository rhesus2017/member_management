// react
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from "react-router-dom";

// component
import App from './App';

ReactDOM.render(
  <BrowserRouter>
    <React.StrictMode>
      <App></App>
    </React.StrictMode>
  </BrowserRouter>,
  document.getElementById('root')
);
