import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import settingsReducer from './settings';

export default combineReducers({
  routing: routerReducer,
  settings: settingsReducer,
});
