import { combineReducers } from 'redux';

import assets from './assets';
import connectionStatus from './connectionStatus';

/* eslint-disable no-undef */
const courseDetails = () => courseContext;

const rootReducer = combineReducers({
  assets,
  connectionStatus,
  courseDetails,
});

export default rootReducer;
