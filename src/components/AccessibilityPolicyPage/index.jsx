import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

// import styles from './AccessibilityPolicyPage.scss';

export class AccessibilityPolicyPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      formSubmitted: false,
    };
  }

  render() {
    return (
      <div>
        ACCESSIBILITY POLICY PAGE
        <div>
          Hold for policy text
        </div>
        <div>
          Hold for submission form
        </div>
      </div>
    );
  }
}

AccessibilityPolicyPage.propTypes = {
  // remove this linting disable once page is hooked up with correct API
  /* eslint-disable react/no-unused-prop-types */
  zendeskDetails: PropTypes.shape({
    id: PropTypes.string,
    secret: PropTypes.string,
  }).isRequired,
};

const mapStateToProps = state => ({
  zendeskDetails: state.studioDetails.zendesk,
});

// const mapDispatchToProps = dispatch => ({
// });

const WrappedAccessibilityPolicyPage = connect(
  mapStateToProps,
  // mapDispatchToProps,
)(AccessibilityPolicyPage);

export default WrappedAccessibilityPolicyPage;
