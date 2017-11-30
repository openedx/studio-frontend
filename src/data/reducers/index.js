import { combineReducers } from 'redux';

import assets from './assets';
import connectionStatus from './connectionStatus';

/* eslint-disable no-undef */
const studioDetails = () => studioContext;

const rootReducer = combineReducers({
  assets,
  connectionStatus,
  studioDetails,
});

export default rootReducer;
