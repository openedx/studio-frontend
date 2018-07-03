import { checklistLoading } from '../constants/loadingTypes';
import { courseBestPractices, courseLaunch, loadingChecklists } from './courseChecklist';
import { courseChecklistActions } from '../../data/constants/actionTypes';

let action;
let defaultState;
let state;

describe('Course Checklist Reducers', () => {
  describe('courseBestPractices reducer', () => {
    it('returns correct state for REQUEST_COURSE_BEST_PRACTICES_SUCCESS action', () => {
      defaultState = {};

      action = {
        type: courseChecklistActions.request.REQUEST_COURSE_BEST_PRACTICES_SUCCESS,
        response: 'response',
      };

      state = courseBestPractices(defaultState, action);

      expect(state).toEqual(action.response);
    });
  });

  describe('courseLaunch reducer', () => {
    it('returns correct state for REQUEST_COURSE_LAUNCH_SUCCESS action', () => {
      defaultState = {};

      action = {
        type: courseChecklistActions.request.REQUEST_COURSE_LAUNCH_SUCCESS,
        response: 'response',
      };

      state = courseLaunch(defaultState, action);

      expect(state).toEqual(action.response);
    });
  });

  describe('loadingChecklists reducer', () => {
    it('returns correct state for REQUESTING_COURSE_BEST_PRACTICES action', () => {
      defaultState = [];

      action = {
        type: courseChecklistActions.request.REQUESTING_COURSE_BEST_PRACTICES,
      };

      state = loadingChecklists(defaultState, action);

      expect(state).toEqual([checklistLoading.COURSE_BEST_PRACTICES]);
    });

    it('returns correct state for REQUESTING_COURSE_BEST_PRACTICES action if already loading', () => {
      defaultState = [checklistLoading.COURSE_BEST_PRACTICES];

      action = {
        type: courseChecklistActions.request.REQUESTING_COURSE_BEST_PRACTICES,
      };

      state = loadingChecklists(defaultState, action);

      expect(state).toEqual([checklistLoading.COURSE_BEST_PRACTICES]);
    });

    it('returns correct state for REQUESTING_COURSE_LAUNCH action', () => {
      defaultState = [];

      action = {
        type: courseChecklistActions.request.REQUESTING_COURSE_LAUNCH,
      };

      state = loadingChecklists(defaultState, action);

      expect(state).toEqual([checklistLoading.COURSE_LAUNCH]);
    });

    it('returns correct state for REQUESTING_COURSE_LAUNCH action if already loading', () => {
      defaultState = [checklistLoading.COURSE_LAUNCH];

      action = {
        type: courseChecklistActions.request.REQUESTING_COURSE_LAUNCH,
      };

      state = loadingChecklists(defaultState, action);

      expect(state).toEqual([checklistLoading.COURSE_LAUNCH]);
    });

    it('returns correct state for REQUEST_COURSE_BEST_PRACTICES_SUCCESS action', () => {
      defaultState = [checklistLoading.COURSE_BEST_PRACTICES];

      action = {
        type: courseChecklistActions.request.REQUEST_COURSE_BEST_PRACTICES_SUCCESS,
      };

      state = loadingChecklists(defaultState, action);

      expect(state).toEqual([]);
    });

    it('returns correct state for REQUEST_COURSE_BEST_PRACTICES_SUCCESS action if not loading', () => {
      defaultState = [];

      action = {
        type: courseChecklistActions.request.REQUEST_COURSE_BEST_PRACTICES_SUCCESS,
      };

      state = loadingChecklists(defaultState, action);

      expect(state).toEqual([]);
    });

    it('returns correct state for REQUEST_COURSE_LAUNCH_SUCCESS action', () => {
      defaultState = [checklistLoading.COURSE_LAUNCH];

      action = {
        type: courseChecklistActions.request.REQUEST_COURSE_LAUNCH_SUCCESS,
      };

      state = loadingChecklists(defaultState, action);

      expect(state).toEqual([]);
    });

    it('returns correct state for REQUEST_COURSE_LAUNCH_SUCCESS action if not loading', () => {
      defaultState = [];

      action = {
        type: courseChecklistActions.request.REQUEST_COURSE_LAUNCH_SUCCESS,
      };

      state = loadingChecklists(defaultState, action);

      expect(state).toEqual([]);
    });
  });
});
