import * as clientApi from '../api/client';
import { courseChecklistActions } from '../constants/actionTypes';

export const requestCourseQualitySuccess = response => ({
  type: courseChecklistActions.request.REQUEST_COURSE_QUALITY_SUCCESS,
  response,
});

export const requestCourseQualityFailure = response => ({
  type: courseChecklistActions.request.REQUEST_COURSE_QUALITY_FAILURE,
  response,
});

export const getCourseQuality = (parameters, courseDetails) =>
  dispatch => (
    clientApi.requestCourseBestPractices(courseDetails.id, { ...parameters })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error(response);
      })
      .then(json => (
        dispatch(requestCourseQualitySuccess(json))
      ))
      .catch(error => (
        dispatch(requestCourseQualityFailure(error))
      ))
  );

export const requestCourseValidationSuccess = response => ({
  type: courseChecklistActions.request.REQUEST_COURSE_VALIDATION_SUCCESS,
  response,
});

export const requestCourseValidationFailure = response => ({
  type: courseChecklistActions.request.REQUEST_COURSE_VALIDATION_FAILURE,
  response,
});

export const getCourseValidation = (parameters, courseDetails) =>
  dispatch => (
    clientApi.requestCourseLaunch(courseDetails.id, { ...parameters })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error(response);
      })
      .then(json => (
        dispatch(requestCourseValidationSuccess(json))
      ))
      .catch(error => (
        dispatch(requestCourseValidationFailure(error))
      ))
  );
