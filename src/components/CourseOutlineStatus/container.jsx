import { connect } from 'react-redux';

import CourseOutlineStatus from '.';
import { getCourseQuality, getCourseValidation } from '../../data/actions/courseChecklist';

const mapStateToProps = state => ({
  studioDetails: state.studioDetails,
  courseBestPracticesData: state.courseChecklistData.courseBestPractices,
  courseLaunchData: state.courseChecklistData.courseLaunch,
});

const mapDispatchToProps = dispatch => ({
  getCourseQuality: (parameters, courseDetails) =>
    dispatch(getCourseQuality(parameters, courseDetails)),
  getCourseValidation: (parameters, courseDetails) =>
    dispatch(getCourseValidation(parameters, courseDetails)),
});

const WrappedCourseOutlineStatus = connect(
  mapStateToProps,
  mapDispatchToProps,
)(CourseOutlineStatus);

export default WrappedCourseOutlineStatus;
