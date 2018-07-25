import { connect } from 'react-redux';

import CourseOutlineStatus from '.';
import { getCourseBestPractices, getCourseLaunch } from '../../data/actions/courseChecklist';

const mapStateToProps = state => ({
  courseBestPracticesData: state.courseChecklistData.courseBestPractices,
  courseLaunchData: state.courseChecklistData.courseLaunch,
  loadingChecklists: state.courseChecklistData.loadingChecklists,
  studioDetails: state.studioDetails,
});

const mapDispatchToProps = dispatch => ({
  getCourseBestPractices: (parameters, courseDetails) =>
    dispatch(getCourseBestPractices(parameters, courseDetails)),
  getCourseLaunch: (parameters, courseDetails) =>
    dispatch(getCourseLaunch(parameters, courseDetails)),
});

const WrappedCourseOutlineStatus = connect(
  mapStateToProps,
  mapDispatchToProps,
)(CourseOutlineStatus);

export default WrappedCourseOutlineStatus;
