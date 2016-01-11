import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import AmIRichApp from '../components/AmIRichApp';
import Navbar from '../components/Navbar';
import store from './store';

ReactDOM.render(
    <Provider store={store}>
      <div>
        <Navbar />
        <AmIRichApp />
      </div>
    </Provider>,
    document.getElementById('content')
);
