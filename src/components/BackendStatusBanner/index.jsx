import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Button } from '@edx/paragon';

import styles from './BackendStatusBanner.scss';
import statusMap from './statusMap.json';
import { pingStudio } from '../../data/actions/pingStudio';

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

  renderStatusMessage() {
    const status = statusMap[this.props.connectionStatus];
    if (status.link) {
      return (
        <span>
          {status.message}
          {' '}
          <a href={status.link.url} className={styles['alert-link']}>{status.link.text}</a>
        </span>
      );
    }
    return status.message;
  }

  render() {
    const status = statusMap[this.props.connectionStatus];
    return (!status || this.props.connectionStatus === 200) ?
      null :
      (
        <div
          className={classNames(
            styles['api-error'],
            styles.alert,
            styles[`alert-${status.alertLevel}`],
          )}
        >
          <Button
            label="↻"
            buttonType="sm"
            className={[styles['btn-outline-primary']]}
            onClick={this.props.pingStudio}
          />
          {' '}
          {this.renderStatusMessage()}
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
