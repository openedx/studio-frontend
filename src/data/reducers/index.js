import { combineReducers } from 'redux';

import assetsList from './assetsList';
import assetsParameters from './assetsParameters';
import connectionStatus from './connectionStatus';

const rootReducer = combineReducers({
  assetsList,
  assetsParameters,
  connectionStatus,
});

export default rootReducer;
