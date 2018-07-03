import { combineReducers } from 'redux';

import { courseChecklistActions } from '../constants/actionTypes';
import { checklistLoading } from '../constants/loadingTypes';

export const courseBestPractices = (state = {}, action) => {
  switch (action.type) {
    case courseChecklistActions.request.REQUEST_COURSE_BEST_PRACTICES_SUCCESS:
      return action.response;
    default:
      return state;
  }
};

export const courseLaunch = (state = {}, action) => {
  switch (action.type) {
    case courseChecklistActions.request.REQUEST_COURSE_LAUNCH_SUCCESS:
      return action.response;
    default:
      return state;
  }
};

export const loadingChecklists = (state = [], action) => {
  switch (action.type) {
    case courseChecklistActions.request.REQUESTING_COURSE_BEST_PRACTICES:
      if (state.includes(checklistLoading.COURSE_BEST_PRACTICES)) {
        return state;
      }

      return [...state, checklistLoading.COURSE_BEST_PRACTICES];
    case courseChecklistActions.request.REQUEST_COURSE_BEST_PRACTICES_SUCCESS: {
      const newState = [...state];

      const index = newState.indexOf(checklistLoading.COURSE_BEST_PRACTICES);

      if (index !== -1) {
        newState.splice(index);
        return newState;
      }

      return state;
    }
    case courseChecklistActions.request.REQUESTING_COURSE_LAUNCH:
      if (state.includes(checklistLoading.COURSE_LAUNCH)) {
        return state;
      }

      return [...state, checklistLoading.COURSE_LAUNCH];
    case courseChecklistActions.request.REQUEST_COURSE_LAUNCH_SUCCESS: {
      const newState = [...state];

      const index = newState.indexOf(checklistLoading.COURSE_LAUNCH);

      if (index !== -1) {
        newState.splice(index);
        return newState;
      }

      return state;
    }
    default: return state;
  }
};

const courseChecklistData = combineReducers({
  courseBestPractices,
  courseLaunch,
  loadingChecklists,
});

export default courseChecklistData;
