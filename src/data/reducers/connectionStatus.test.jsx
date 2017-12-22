import connectionStatus from './connectionStatus';
import { PING_RESPONSE } from '../actions/pingStudio';

const defaultState = {};

describe('Connection Status Reducer', () => {
  it('returns status for PING_RESPONSE action', () => {
    const state = connectionStatus(defaultState, {
      type: PING_RESPONSE,
      status: 200,
    });
    expect(state).toEqual(200);
  });
});
