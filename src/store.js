import { applyMiddleware, createStore, combineReducers } from 'redux';
import logger from 'redux-logger';
import * as reducers from './reducers';

const store = process.env.NODE_ENV === 'production'
  ? createStore(combineReducers(reducers))
  : createStore(combineReducers(reducers), {}, applyMiddleware(logger));

export default store;
