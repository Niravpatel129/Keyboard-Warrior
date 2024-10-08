import React from 'react';
import ReactDOM from 'react-dom';
import App from './AppComponent';
import './index.css';

ReactDOM.render(<App />, document.getElementById('root'));

if (module.hot) {
  module.hot.accept('./AppComponent', () => {
    const NextApp = require('./AppComponent').default;
    ReactDOM.render(<NextApp />, document.getElementById('root'));
  });
}
