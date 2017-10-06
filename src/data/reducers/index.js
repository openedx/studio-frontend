import { combineReducers } from 'redux';

import assets from './assets';
import connectionStatus from './connectionStatus';

const rootReducer = combineReducers({
  assets,
  connectionStatus,
});

export default rootReducer;
