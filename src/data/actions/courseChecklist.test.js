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

  it('returns expected state from requestCourseQualitySuccess', () => {
    response = 'response';
    const expectedAction =
    { type: courseChecklistActions.request.REQUEST_COURSE_QUALITY_SUCCESS, response };
    expect(store.dispatch(actionCreators.requestCourseQualitySuccess(response)))
      .toEqual(expectedAction);
  });

  it('returns expected state from requestCourseQualityFailure', () => {
    response = 'response';
    const expectedAction =
      { type: courseChecklistActions.request.REQUEST_COURSE_QUALITY_FAILURE, response };
    expect(store.dispatch(actionCreators.requestCourseQualityFailure(response)))
      .toEqual(expectedAction);
  });

  it('returns expected state from getCourseQuality success', () => {
    const requestParameters = {};
    response = {
      success: 'Success',
    };

    fetchMock.once(`begin:${courseBestPracticesEndpoint}`, response);
    const expectedActions = [
      { type: courseChecklistActions.request.REQUEST_COURSE_QUALITY_SUCCESS, response },
    ];
    return store.dispatch(actionCreators.getCourseQuality(requestParameters, courseDetails))
      .then(() => {
        // return of async actions
        expect(store.getActions()).toEqual(expectedActions);
      });
  });

  it('returns expected state from getCourseQuality failure', () => {
    const requestParameters = {};
    response = {
      status: 400,
      failure: 'Failure',
    };

    const errorResponse = new Error(response);

    fetchMock.once(`begin:${courseBestPracticesEndpoint}`, response);
    const expectedActions = [
      {
        type: courseChecklistActions.request.REQUEST_COURSE_QUALITY_FAILURE,
        response: errorResponse,
      },
    ];

    store = mockStore(initialState);
    return store.dispatch(actionCreators.getCourseQuality(requestParameters, courseDetails))
      .then(() => {
      // return of async actions
        expect(store.getActions()).toEqual(expectedActions);
      });
  });

  it('returns expected state from requestCourseValidationSuccess', () => {
    response = 'response';

    const expectedAction =
      { type: courseChecklistActions.request.REQUEST_COURSE_VALIDATION_SUCCESS, response };
    expect(store.dispatch(actionCreators.requestCourseValidationSuccess(response)))
      .toEqual(expectedAction);
  });

  it('returns expected state from requestCourseValidationFailure', () => {
    response = 'response';

    const expectedAction =
      { type: courseChecklistActions.request.REQUEST_COURSE_VALIDATION_FAILURE, response };
    expect(store.dispatch(actionCreators.requestCourseValidationFailure(response)))
      .toEqual(expectedAction);
  });

  it('returns expected state from getCourseValidation success', () => {
    const requestParameters = {};
    response = {
      success: 'Success',
    };

    fetchMock.once(`begin:${courseLaunchEndpoint}`, response);
    const expectedActions = [
      { type: courseChecklistActions.request.REQUEST_COURSE_VALIDATION_SUCCESS, response },
    ];
    return store.dispatch(actionCreators.getCourseValidation(requestParameters, courseDetails))
      .then(() => {
        // return of async actions
        expect(store.getActions()).toEqual(expectedActions);
      });
  });

  it('returns expected state from getCourseValidation failure', () => {
    const requestParameters = {};
    response = {
      status: 400,
      failure: 'Failure',
    };

    const errorResponse = new Error(response);

    fetchMock.once(`begin:${courseLaunchEndpoint}`, response);
    const expectedActions = [
      {
        type: courseChecklistActions.request.REQUEST_COURSE_VALIDATION_FAILURE,
        response: errorResponse,
      },
    ];

    store = mockStore(initialState);
    return store.dispatch(actionCreators.getCourseValidation(requestParameters, courseDetails))
      .then(() => {
      // return of async actions
        expect(store.getActions()).toEqual(expectedActions);
      });
  });
});
