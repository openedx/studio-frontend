import { combineReducers } from 'redux';

import { accessibilityActions } from '../constants/actionTypes';

const status = (state = {}, action) => {
  switch (action.type) {
    case accessibilityActions.CLEAR_ACCESSIBILITY_STATUS:
      return {};
    case accessibilityActions.ACCESSIBILITY_FORM_SUBMIT_SUCCESS:
      return {
        statusCode: action.statusCode,
        type: action.type,
      };
    case accessibilityActions.ACCESSIBILITY_FORM_SUBMIT_RATE_LIMIT_FAILURE:
      return {
        statusCode: action.statusCode,
        failureDetails: action.failureDetails,
        type: action.type,
      };
    default:
      return state;
  }
};

const accessibility = combineReducers({
  status,
});

export default accessibility;
