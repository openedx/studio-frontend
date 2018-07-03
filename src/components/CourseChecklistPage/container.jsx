import { connect } from 'react-redux';

import CourseChecklistPage from '.';
import { getCourseBestPractices, getCourseLaunch } from '../../data/actions/courseChecklist';

const mapStateToProps = state => ({
  studioDetails: state.studioDetails,
  courseBestPracticesData: state.courseChecklistData.courseBestPractices,
  courseLaunchData: state.courseChecklistData.courseLaunch,
  loadingChecklists: state.courseChecklistData.loadingChecklists,
});

const mapDispatchToProps = dispatch => ({
  getCourseBestPractices: (parameters, courseDetails) =>
    dispatch(getCourseBestPractices(parameters, courseDetails)),
  getCourseLaunch: (parameters, courseDetails) =>
    dispatch(getCourseLaunch(parameters, courseDetails)),
});

const WrappedCourseChecklistPage = connect(
  mapStateToProps,
  mapDispatchToProps,
)(CourseChecklistPage);

export default WrappedCourseChecklistPage;
