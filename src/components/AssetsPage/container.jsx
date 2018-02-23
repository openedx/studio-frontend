import { connect } from 'react-redux';

import AssetsPage from '.';
import { getAssets } from '../../data/actions/assets';


const mapStateToProps = state => ({
  assetsList: state.assets,
  courseDetails: state.studioDetails.course,
  uploadSettings: state.studioDetails.upload_settings,
  status: state.metadata.status,
  filtersMetaData: state.metadata.filters,
  searchMetaData: state.metadata.search,
  searchSettings: state.studioDetails.search_settings,
});

const mapDispatchToProps = dispatch => ({
  getAssets: (request, courseDetails) => dispatch(getAssets(request, courseDetails)),
});

const WrappedAssetsPage = connect(
  mapStateToProps,
  mapDispatchToProps,
)(AssetsPage);

export default WrappedAssetsPage;
