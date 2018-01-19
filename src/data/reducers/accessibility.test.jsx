import accessibility from './accessibility';
import { accessibilityActions } from '../../data/constants/actionTypes';

const defaultState = {};

describe('Accessibility Reducer', () => {
  it('returns empty state on clear', () => {
    const state = accessibility(defaultState, {
      type: accessibilityActions.clear.CLEAR_ACCESSIBILITY_STATUS,
    });
    expect(state.status).toEqual({});
  });
  it('returns correct state on success', () => {
    const state = accessibility(defaultState, {
      type: accessibilityActions.submit.ACCESSIBILITY_FORM_SUBMIT_SUCCESS,
      statusCode: 201,
    });
    expect(state.status).toEqual({
      type: accessibilityActions.submit.ACCESSIBILITY_FORM_SUBMIT_SUCCESS,
      statusCode: 201,
    });
  });
  it('returns correct state on failure', () => {
    const state = accessibility(defaultState, {
      type: accessibilityActions.submit.ACCESSIBILITY_FORM_SUBMIT_RATE_LIMIT_FAILURE,
      statusCode: 429,
      failureDetails: 'Request was throttled. Expected available in 175.0 seconds.',
    });
    expect(state.status).toEqual({
      type: accessibilityActions.submit.ACCESSIBILITY_FORM_SUBMIT_RATE_LIMIT_FAILURE,
      statusCode: 429,
      failureDetails: 'Request was throttled. Expected available in 175.0 seconds.',
    });
  });
});
