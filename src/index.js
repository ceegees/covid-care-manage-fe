import "core-js/stable";
import "regenerator-runtime/runtime";
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux'
import configureStore from './redux/configureStore';
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import './scss/index.css'; 
import './scss/style.scss'; 
import * as serviceWorker from './serviceWorker';
import App from './components/App';

const store = configureStore({
  localBodies:[]
});
window.gAppStore = store;

ReactDOM.render( 
    <Provider store={store} >
    <BrowserRouter  >
      <App/>
    </BrowserRouter> 
  </Provider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.unregister(); 