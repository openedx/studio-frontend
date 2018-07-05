import { connect } from 'react-redux';

import CourseChecklist from '.';

const mapStateToProps = state => ({
  studioDetails: state.studioDetails,
});

const mapDispatchToProps = () => ({});

const WrappedCourseChecklist = connect(
  mapStateToProps,
  mapDispatchToProps,
)(CourseChecklist);

export default WrappedCourseChecklist;
