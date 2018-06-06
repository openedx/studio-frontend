import { combineReducers } from 'redux';

import { courseChecklistActions } from '../constants/actionTypes';

export const courseBestPractices = (state = {}, action) => {
  switch (action.type) {
    case courseChecklistActions.request.REQUEST_COURSE_QUALITY_SUCCESS:
      return action.response;
    default:
      return state;
  }
};

export const courseLaunch = (state = {}, action) => {
  switch (action.type) {
    case courseChecklistActions.request.REQUEST_COURSE_VALIDATION_SUCCESS:
      return action.response;
    default:
      return state;
  }
};

const courseChecklistData = combineReducers({
  courseBestPractices,
  courseLaunch,
});

export default courseChecklistData;
