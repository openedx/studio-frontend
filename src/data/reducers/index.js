import { combineReducers } from 'redux';

import { assets, metadata } from './assets';
import accessibility from './accessibility';
import connectionStatus from './connectionStatus';

/* eslint-disable no-undef */
const studioDetails = () => studioContext;

const rootReducer = combineReducers({
  accessibility,
  assets,
  metadata,
  connectionStatus,
  studioDetails,
});

export default rootReducer;

