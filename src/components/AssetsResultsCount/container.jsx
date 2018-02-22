import { connect } from 'react-redux';

import AssetsResultsCount from '.';

const mapStateToProps = state => ({
  paginationMetaData: state.metadata.pagination,
  filtersMetaData: state.metadata.filters,
  searchMetaData: state.metadata.filters,
});

const WrappedAssetsResultsCount = connect(
  mapStateToProps,
)(AssetsResultsCount);

export default WrappedAssetsResultsCount;
