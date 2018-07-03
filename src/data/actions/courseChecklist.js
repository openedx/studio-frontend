import * as clientApi from '../api/client';
import { courseChecklistActions } from '../constants/actionTypes';

export const requestingCourseBestPractices = () => ({
  type: courseChecklistActions.request.REQUESTING_COURSE_BEST_PRACTICES,
});

export const requestCourseBestPracticesSuccess = response => ({
  type: courseChecklistActions.request.REQUEST_COURSE_BEST_PRACTICES_SUCCESS,
  response,
});

export const requestCourseBestPracticesFailure = response => ({
  type: courseChecklistActions.request.REQUEST_COURSE_BEST_PRACTICES_FAILURE,
  response,
});

export const getCourseBestPractices = (parameters, courseDetails) =>
  (dispatch) => {
    dispatch(requestingCourseBestPractices());

    return clientApi.requestCourseBestPractices(courseDetails.id, { ...parameters })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error(response);
      })
      .then(json => (
        dispatch(requestCourseBestPracticesSuccess(json))
      ))
      .catch(error => (
        dispatch(requestCourseBestPracticesFailure(error))
      ));
  };

export const requestingCourseLaunch = () => ({
  type: courseChecklistActions.request.REQUESTING_COURSE_LAUNCH,
});

export const requestCourseLaunchSuccess = response => ({
  type: courseChecklistActions.request.REQUEST_COURSE_LAUNCH_SUCCESS,
  response,
});

export const requestCourseLaunchFailure = response => ({
  type: courseChecklistActions.request.REQUEST_COURSE_LAUNCH_FAILURE,
  response,
});

export const getCourseLaunch = (parameters, courseDetails) =>
  (dispatch) => {
    dispatch(requestingCourseLaunch());

    return clientApi.requestCourseLaunch(courseDetails.id, { ...parameters })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error(response);
      })
      .then(json => (
        dispatch(requestCourseLaunchSuccess(json))
      ))
      .catch(error => (
        dispatch(requestCourseLaunchFailure(error))
      ));
  };
