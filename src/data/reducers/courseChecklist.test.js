import { courseBestPractices, courseLaunch } from './courseChecklist';
import { courseChecklistActions } from '../../data/constants/actionTypes';

let action;
let defaultState;
let state;

describe('Course Checklist Reducers', () => {
  describe('courseBestPractices reducer', () => {
    it('returns correct state for REQUEST_COURSE_QUALITY_SUCCESS action', () => {
      defaultState = {};

      action = {
        type: courseChecklistActions.request.REQUEST_COURSE_QUALITY_SUCCESS,
        response: 'response',
      };

      state = courseBestPractices(defaultState, action);

      expect(state).toEqual(action.response);
    });
  });

  describe('courseLaunch reducer', () => {
    it('returns correct state for REQUEST_COURSE_VALIDATION_SUCCESS action', () => {
      defaultState = {};

      action = {
        type: courseChecklistActions.request.REQUEST_COURSE_VALIDATION_SUCCESS,
        response: 'response',
      };

      state = courseLaunch(defaultState, action);

      expect(state).toEqual(action.response);
    });
  });
});
