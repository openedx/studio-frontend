import { combineReducers } from 'redux';

import connectionStatus from './connectionStatus';

const rootReducer = combineReducers({
  connectionStatus,
});

export default rootReducer;
