import { connect } from 'react-redux';

import CourseChecklist from '.';

const mapStateToProps = state => ({
  courseDetails: state.studioDetails.course,
});

const mapDispatchToProps = () => ({});

const WrappedCourseChecklist = connect(
  mapStateToProps,
  mapDispatchToProps,
)(CourseChecklist);

export default WrappedCourseChecklist;
