import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import connectionReducer from './connections';
import settingsReducer from './settings';

export default combineReducers({
  connections: connectionReducer,
  routing: routerReducer,
  settings: settingsReducer,
});
