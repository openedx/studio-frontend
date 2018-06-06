import { connect } from 'react-redux';

import CourseChecklistPage from '.';
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

const WrappedCourseChecklistPage = connect(
  mapStateToProps,
  mapDispatchToProps,
)(CourseChecklistPage);

export default WrappedCourseChecklistPage;
