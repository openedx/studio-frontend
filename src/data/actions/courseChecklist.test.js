// eslint-disable-next-line import/no-extraneous-dependencies
import configureStore from 'redux-mock-store';
// eslint-disable-next-line import/no-extraneous-dependencies
import fetchMock from 'fetch-mock';
import thunk from 'redux-thunk';

import * as actionCreators from './courseChecklist';
import { courseDetails } from '../../utils/testConstants';
import { courseChecklistActions } from '../constants/actionTypes';
import endpoints from '../api/endpoints';

const courseBestPracticesEndpoint = endpoints.courseBestPractices;
const courseLaunchEndpoint = endpoints.courseLaunch;
const initialState = {};
const middlewares = [thunk];
const mockStore = configureStore(middlewares);

let store;

describe('Course Checklist Action Creators', () => {
  let response;

  beforeEach(() => {
    store = mockStore(initialState);
  });

  afterEach(() => {
    fetchMock.reset();
    fetchMock.restore();
  });

  it('returns expected state from requestCourseBestPracticesSuccess', () => {
    response = 'response';
    const expectedAction =
    { type: courseChecklistActions.request.REQUEST_COURSE_BEST_PRACTICES_SUCCESS, response };
    expect(store.dispatch(actionCreators.requestCourseBestPracticesSuccess(response)))
      .toEqual(expectedAction);
  });

  it('returns expected state from requestCourseBestPracticesFailure', () => {
    response = 'response';
    const expectedAction =
      { type: courseChecklistActions.request.REQUEST_COURSE_BEST_PRACTICES_FAILURE, response };
    expect(store.dispatch(actionCreators.requestCourseBestPracticesFailure(response)))
      .toEqual(expectedAction);
  });

  it('returns expected state from getCourseBestPractices success', () => {
    const requestParameters = {};
    response = {
      success: 'Success',
    };

    fetchMock.once(`begin:${courseBestPracticesEndpoint}`, response);
    const expectedActions = [
      { type: courseChecklistActions.request.REQUESTING_COURSE_BEST_PRACTICES },
      { type: courseChecklistActions.request.REQUEST_COURSE_BEST_PRACTICES_SUCCESS, response },
    ];
    return store.dispatch(actionCreators.getCourseBestPractices(requestParameters, courseDetails))
      .then(() => {
        // return of async actions
        expect(store.getActions()).toEqual(expectedActions);
      });
  });

  it('returns expected state from getCourseBestPractices failure', () => {
    const requestParameters = {};
    response = {
      status: 400,
      failure: 'Failure',
    };

    const errorResponse = new Error(response);

    fetchMock.once(`begin:${courseBestPracticesEndpoint}`, response);
    const expectedActions = [
      { type: courseChecklistActions.request.REQUESTING_COURSE_BEST_PRACTICES },
      {
        type: courseChecklistActions.request.REQUEST_COURSE_BEST_PRACTICES_FAILURE,
        response: errorResponse,
      },
    ];

    store = mockStore(initialState);
    return store.dispatch(actionCreators.getCourseBestPractices(requestParameters, courseDetails))
      .then(() => {
      // return of async actions
        expect(store.getActions()).toEqual(expectedActions);
      });
  });

  it('returns expected state from requestCourseLaunchSuccess', () => {
    response = 'response';

    const expectedAction =
      { type: courseChecklistActions.request.REQUEST_COURSE_LAUNCH_SUCCESS, response };
    expect(store.dispatch(actionCreators.requestCourseLaunchSuccess(response)))
      .toEqual(expectedAction);
  });

  it('returns expected state from requestCourseLaunchFailure', () => {
    response = 'response';

    const expectedAction =
      { type: courseChecklistActions.request.REQUEST_COURSE_LAUNCH_FAILURE, response };
    expect(store.dispatch(actionCreators.requestCourseLaunchFailure(response)))
      .toEqual(expectedAction);
  });

  it('returns expected state from getCourseLaunch success', () => {
    const requestParameters = {};
    response = {
      success: 'Success',
    };

    fetchMock.once(`begin:${courseLaunchEndpoint}`, response);
    const expectedActions = [
      { type: courseChecklistActions.request.REQUESTING_COURSE_LAUNCH },
      { type: courseChecklistActions.request.REQUEST_COURSE_LAUNCH_SUCCESS, response },
    ];
    return store.dispatch(actionCreators.getCourseLaunch(requestParameters, courseDetails))
      .then(() => {
        // return of async actions
        expect(store.getActions()).toEqual(expectedActions);
      });
  });

  it('returns expected state from getCourseLaunch failure', () => {
    const requestParameters = {};
    response = {
      status: 400,
      failure: 'Failure',
    };

    const errorResponse = new Error(response);

    fetchMock.once(`begin:${courseLaunchEndpoint}`, response);
    const expectedActions = [
      { type: courseChecklistActions.request.REQUESTING_COURSE_LAUNCH },
      {
        type: courseChecklistActions.request.REQUEST_COURSE_LAUNCH_FAILURE,
        response: errorResponse,
      },
    ];

    store = mockStore(initialState);
    return store.dispatch(actionCreators.getCourseLaunch(requestParameters, courseDetails))
      .then(() => {
      // return of async actions
        expect(store.getActions()).toEqual(expectedActions);
      });
  });
});
