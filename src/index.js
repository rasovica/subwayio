import React from 'react';
import ReactDOM from 'react-dom';
import fontawesome from '@fortawesome/fontawesome';
import {faPause, faPlay} from '@fortawesome/free-solid-svg-icons';

import App from './App';

import './index.css';

fontawesome.library.add(faPause, faPlay);

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
