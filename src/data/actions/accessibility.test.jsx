import configureStore from 'redux-mock-store';
import fetchMock from 'fetch-mock';
import thunk from 'redux-thunk';

import endpoints from '../api/endpoints';
import { submitAccessibilityForm, clearAccessibilityStatus } from './accessibility';
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

describe('Accessibility Action Creator', () => {
  afterEach(() => {
    fetchMock.reset();
    fetchMock.restore();
  });

  it('returns expected state from success', () => {
    fetchMock.once(zendeskEndpoint, 201);
    const expectedActions = [
      { type: accessibilityActions.ACCESSIBILITY_FORM_SUBMIT_SUCCESS, statusCode: 201 },
    ];
    store = mockStore(initialState);
    return store.dispatch(submitAccessibilityForm()).then(() => {
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
    store = mockStore(initialState);
    return store.dispatch(submitAccessibilityForm()).then(() => {
      // return of async actions
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('returns expected state from clearing status', () => {
    const expectedAction = { type: accessibilityActions.CLEAR_ACCESSIBILITY_STATUS };
    store = mockStore(initialState);
    expect(store.dispatch(clearAccessibilityStatus())).toEqual(expectedAction);
  });
});
