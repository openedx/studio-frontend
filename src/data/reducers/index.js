import { combineReducers } from 'redux';

import accessibility from './accessibility';
import assets from './assets';
import connectionStatus from './connectionStatus';

/* eslint-disable no-undef */
const studioDetails = () => studioContext;

const rootReducer = combineReducers({
  accessibility,
  assets,
  connectionStatus,
  studioDetails,
});

export default rootReducer;
