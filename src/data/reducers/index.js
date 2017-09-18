import { combineReducers } from 'redux';

import assetsList from './assetsList';
import assetsFilters from './assetsFilters';
import connectionStatus from './connectionStatus';

const rootReducer = combineReducers({
  assetsList,
  assetsFilters,
  connectionStatus,
});

export default rootReducer;
