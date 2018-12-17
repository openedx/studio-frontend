import { connect } from 'react-redux';

import ProctoringSettings from '.';

const mapStateToProps = state => ({
  availableProctoringProviders: state.studioDetails.available_proctoring_providers,
  courseID: state.studioDetails.course.id,
  createZendeskTickets: state.studioDetails.create_zendesk_tickets,
  defaultProctoringProvider: state.studioDetails.default_proctoring_provider,
  selectedProctoringProvider: state.studioDetails.selected_proctoring_provider,
  userIsStaff: state.studioDetails.user_is_staff,
});

const mapDispatchToProps = dispatch => ({
});

const WrappedProctoringSettings = connect(
  mapStateToProps,
  mapDispatchToProps,
)(ProctoringSettings);

export default WrappedProctoringSettings;
