import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import mainReducer from '../reducers/reducer';
import {initialState} from '../data/initial-state.js';

const finalCreateStore = compose(
    // Middleware you want to use in development:
    applyMiddleware(thunk)
)(createStore);

const store = finalCreateStore(mainReducer, initialState);

export default store;