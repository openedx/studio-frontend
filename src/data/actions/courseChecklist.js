import * as clientApi from '../api/client';
import { courseChecklistActions } from '../constants/actionTypes';

export const requestCourseBestPracticesSuccess = response => ({
  type: courseChecklistActions.request.REQUEST_COURSE_BEST_PRACTICES_SUCCESS,
  response,
});

export const requestCourseBestPracticesFailure = response => ({
  type: courseChecklistActions.request.REQUEST_COURSE_BEST_PRACTICES_FAILURE,
  response,
});

export const getCourseBestPractices = (parameters, courseDetails) =>
  dispatch => (
    clientApi.requestCourseBestPractices(courseDetails.id, { ...parameters })
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
      ))
  );

export const requestCourseLaunchSuccess = response => ({
  type: courseChecklistActions.request.REQUEST_COURSE_LAUNCH_SUCCESS,
  response,
});

export const requestCourseLaunchFailure = response => ({
  type: courseChecklistActions.request.REQUEST_COURSE_LAUNCH_FAILURE,
  response,
});

export const getCourseLaunch = (parameters, courseDetails) =>
  dispatch => (
    clientApi.requestCourseLaunch(courseDetails.id, { ...parameters })
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
      ))
  );
