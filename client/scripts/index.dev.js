import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import AmIRichApp from '../components/AmIRichApp';
import DevTools from '../components/DevTools';
import configureStore from './store';

const store = configureStore();

ReactDOM.render(
    <Provider store={store}>
      <div>
        <AmIRichApp />
        <DevTools />
      </div>
    </Provider>,
    document.getElementById('content')
);
