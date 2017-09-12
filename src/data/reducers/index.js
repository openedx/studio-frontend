import { combineReducers } from 'redux';

import assetsList from './assetsList';
import connectionStatus from './connectionStatus';

const rootReducer = combineReducers({
  assetsList,
  connectionStatus,
});

export default rootReducer;
