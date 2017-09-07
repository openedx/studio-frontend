import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import CheckBox from 'paragon/src/CheckBox';

import { getAssets } from '../data/actions/assets';
import styles from './styles.scss';

class AssetsPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      checked: false,
    };
  }

  componentDidMount() {
    this.props.getAssets('course-v1:edX+DemoX+Demo_Course');
  }

  handleCheckBoxChange = (checked) => {
    this.setState({
      checked,
    });
  }

  render() {
    return (
      <div className={styles.assets}>
        <h2>Files & Uploads</h2>
        <CheckBox
          name="checkbox"
          label="I am a checkbox!"
          onChange={this.handleCheckBoxChange}
          checked={this.state.checked}
        />
      </div>
    );
  }
}

AssetsPage.propTypes = {
  // assetsList: PropTypes.number,
  getAssets: PropTypes.func.isRequired,
};

AssetsPage.defaultProps = {
  assetsList: [],
};

const WrappedAssetsPage = connect(
  state => ({
    assetsList: state.assetsList,
  }), dispatch => ({
    getAssets: courseId => dispatch(getAssets(courseId)),
  }),
)(AssetsPage);

export default WrappedAssetsPage;
