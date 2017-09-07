import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import statusMap from './statusMap.json';
import { pingStudio } from '../data/actions/pingStudio';

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
    return (this.props.connectionStatus === 200) ?
      null :
      (
        <div className="api-error">
          {statusMap[this.props.connectionStatus]}
        </div>
      );
  }
}

BackendStatusBanner.propTypes = {
  connectionStatus: PropTypes.number,
  pingStudio: PropTypes.func.isRequired,
};

BackendStatusBanner.defaultProps = {
  connectionStatus: null,
};

const WrappedBackendStatusBanner = connect(
  state => ({
    connectionStatus: state.connectionStatus,
  }), dispatch => ({
    pingStudio: () => dispatch(pingStudio()),
  }),
)(BackendStatusBanner);

export default WrappedBackendStatusBanner;
