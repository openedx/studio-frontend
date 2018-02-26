import { connect } from 'react-redux';

import { clearAssetsStatus } from '../../data/actions/assets';
import AssetsStatusAlert from '.';

const mapStateToProps = state => ({
  assetsStatus: state.metadata.status,
  deletedAsset: state.metadata.deletion.deletedAsset,
});

const mapDispatchToProps = dispatch => ({
  clearAssetsStatus: () => dispatch(clearAssetsStatus()),
});

const WrappedAssetsStatusAlert = connect(
  mapStateToProps,
  mapDispatchToProps,
)(AssetsStatusAlert);

export default WrappedAssetsStatusAlert;
