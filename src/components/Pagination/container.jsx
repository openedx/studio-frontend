import { connect } from 'react-redux';

import Pagination from '.';
import { pageUpdate } from '../../data/actions/assets';

const mapStateToProps = state => ({
  assetsListMetadata: state.metadata.pagination,
  courseDetails: state.studioDetails.course,
});

const mapDispatchToProps = dispatch => ({
  updatePage: (page, courseDetails) => dispatch(pageUpdate(page, courseDetails)),
});

const WrappedPagination = connect(
  mapStateToProps,
  mapDispatchToProps,
)(Pagination);

export default WrappedPagination;
