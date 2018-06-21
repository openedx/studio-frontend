import { combineReducers } from 'redux';

import { assets, metadata } from './assets';
import accessibility from './accessibility';
import connectionStatus from './connectionStatus';
import courseChecklistData from './courseChecklist';

/* eslint-disable no-undef */
const studioDetails = () => studioContext;

const rootReducer = combineReducers({
  accessibility,
  assets,
  metadata,
  connectionStatus,
  courseChecklistData,
  studioDetails,
});

export default rootReducer;

