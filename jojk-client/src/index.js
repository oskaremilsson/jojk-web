import React from 'react';
import ReactDOM from 'react-dom';
import AppRouter from './component/AppRouter';
import { BrowserRouter, Route} from 'react-router-dom';
import './index.css';

ReactDOM.render((
  <BrowserRouter>
    <Route path="/" component={AppRouter} />
  </BrowserRouter>),
  document.getElementById('root')
);
