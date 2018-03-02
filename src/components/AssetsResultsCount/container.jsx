import { connect } from 'react-redux';

import AssetsResultsCount from '.';

const mapStateToProps = state => ({
  paginationMetadata: state.metadata.pagination,
  filtersMetadata: state.metadata.filters,
  searchMetadata: state.metadata.search,
});

const WrappedAssetsResultsCount = connect(
  mapStateToProps,
)(AssetsResultsCount);

export default WrappedAssetsResultsCount;
