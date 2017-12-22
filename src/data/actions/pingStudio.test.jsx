import configureStore from 'redux-mock-store';
import fetchMock from 'fetch-mock';
import thunk from 'redux-thunk';

import endpoints from '../api/endpoints';
import { PING_RESPONSE, pingResponse, pingStudio } from './pingStudio';

const initialState = {};

const studioEndpoint = endpoints.home;
const middlewares = [thunk];
const mockStore = configureStore(middlewares);
let store;

describe('Ping Studio Action Creators', () => {
  const response = {
    status: 200,
  };

  beforeEach(() => {
    store = mockStore(initialState);
    fetchMock.once(`begin:${studioEndpoint}`, response);
  });

  afterEach(() => {
    fetchMock.reset();
    fetchMock.restore();
  });

  it('returns expected state from pingResponse', () => {
    const expectedAction = { type: PING_RESPONSE, status: response.status };
    expect(store.dispatch(pingResponse(response))).toEqual(expectedAction);
  });
  it('returns expected state from pingStudio success', () => {
    const expectedActions = [
      { type: PING_RESPONSE, status: response.status },
    ];

    return store.dispatch(pingStudio()).then(() => {
      // return of async actions
      expect(store.getActions()).toEqual(expectedActions);
    });
  });
});
