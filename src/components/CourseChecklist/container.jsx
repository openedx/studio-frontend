import { connect } from 'react-redux';

import CourseChecklist from '.';

const mapStateToProps = state => ({
  links: state.studioDetails.links,
});

const mapDispatchToProps = () => ({});

const WrappedCourseChecklist = connect(
  mapStateToProps,
  mapDispatchToProps,
)(CourseChecklist);

export default WrappedCourseChecklist;
