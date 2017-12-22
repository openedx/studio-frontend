import configureStore from 'redux-mock-store';
import fetchMock from 'fetch-mock';
import thunk from 'redux-thunk';

import endpoints from '../api/endpoints';
import * as actionCreators from './accessibility';
import { accessibilityActions } from '../../data/constants/actionTypes';

const initialState = {
  accessibility: {
    status: {},
  },
};
const zendeskEndpoint = endpoints.zendesk;
const middlewares = [thunk];
const mockStore = configureStore(middlewares);
let store;

describe('Accessibility Action Creators', () => {
  beforeEach(() => {
    store = mockStore(initialState);
  });

  afterEach(() => {
    fetchMock.reset();
    fetchMock.restore();
  });
  it('returns expected state from submitAccessibilityFormSuccess', () => {
    const response = {
      status: 200,
    };

    const expectedAction = {
      statusCode: response.status,
      type: accessibilityActions.ACCESSIBILITY_FORM_SUBMIT_SUCCESS,
    };

    expect(store.dispatch(
      actionCreators.submitAccessibilityFormSuccess(response))).toEqual(expectedAction);
  });
  it('returns expected state from submitAccessibilityFormRateLimitFailure', () => {
    const response = {
      status: 429,
      detail: 'You have hit the rate limit!',
    };

    const expectedAction = {
      statusCode: 429,
      failureDetails: response.detail,
      type: accessibilityActions.ACCESSIBILITY_FORM_SUBMIT_RATE_LIMIT_FAILURE,
    };

    expect(store.dispatch(
      actionCreators.submitAccessibilityFormRateLimitFailure(response))).toEqual(expectedAction);
  });
  it('returns expected state from success', () => {
    fetchMock.once(zendeskEndpoint, 201);
    const expectedActions = [
      { type: accessibilityActions.ACCESSIBILITY_FORM_SUBMIT_SUCCESS, statusCode: 201 },
    ];

    return store.dispatch(actionCreators.submitAccessibilityForm()).then(() => {
      // return of async actions
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('returns expected state from rate limit error', () => {
    fetchMock.once(zendeskEndpoint, {
      status: 429,
      body: { detail: 'Request was throttled. Expected available in 175.0 seconds.' },
    });
    const expectedActions = [{
      type: accessibilityActions.ACCESSIBILITY_FORM_SUBMIT_RATE_LIMIT_FAILURE,
      statusCode: 429,
      failureDetails: 'Request was throttled. Expected available in 175.0 seconds.',
    }];

    return store.dispatch(actionCreators.submitAccessibilityForm()).then(() => {
      // return of async actions
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('returns expected state from clearing status', () => {
    const expectedAction = { type: accessibilityActions.CLEAR_ACCESSIBILITY_STATUS };
    expect(store.dispatch(actionCreators.clearAccessibilityStatus())).toEqual(expectedAction);
  });
});
