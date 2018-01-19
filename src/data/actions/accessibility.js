import * as clientApi from '../api/client';
import { accessibilityActions } from '../constants/actionTypes';

export const submitAccessibilityFormSuccess = response => ({
  type: accessibilityActions.submit.ACCESSIBILITY_FORM_SUBMIT_SUCCESS,
  statusCode: response.status,
});

export const submitAccessibilityFormRateLimitFailure = response => ({
  type: accessibilityActions.submit.ACCESSIBILITY_FORM_SUBMIT_RATE_LIMIT_FAILURE,
  statusCode: 429,
  failureDetails: response.detail,
});

export const submitAccessibilityForm = (formEmail, formFullName, formMessage) =>
  dispatch =>
    clientApi.postAccessibilityForm(formEmail, formFullName, formMessage)
      .then((response) => {
        // if 429 - Rate limit hit
        // fetch response json to get more details
        // else show user success message as server handles all other requests properly
        if (response.status === 429) {
          return response.json();
        }

        dispatch(submitAccessibilityFormSuccess(response));
        return undefined;
      })
      .then((json) => {
        if (json) {
          dispatch(submitAccessibilityFormRateLimitFailure(json));
        }
      })
      .catch(() => {
        // TODO: properly catch any error and possibly send back for appropriate logging
      });

export const clearAccessibilityStatus = () => ({
  type: accessibilityActions.clear.CLEAR_ACCESSIBILITY_STATUS,
});
