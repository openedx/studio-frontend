import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import statusMap from './statusMap.json';
import { pingStudio } from '../data/store';

class BackendStatusBanner extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      apiConnectionStatus: 200,
    };
  }

  componentDidMount() {
    this.props.pingStudio();
  }

  render() {
    return (this.apiConnectionStatus === 200) ?
      null :
      (
        <div className="api-error">
          {statusMap[this.props.apiConnectionStatus]}
        </div>
      );
  }
}

BackendStatusBanner.propTypes = {
  apiConnectionStatus: PropTypes.string.isRequired,
  pingStudio: PropTypes.func.isRequired,
};

const WrappedBackendStatusBanner = connect(
  state => ({
    apiConnectionStatus: state.apiConnectionStatus,
  }), dispatch => ({
    pingStudio: () => dispatch(pingStudio()),
  }),
)(BackendStatusBanner);

export default WrappedBackendStatusBanner;
