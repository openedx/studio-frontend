import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import AccessibilityBody from '../AccessibilityBody';

import edxBootstrap from '../../SFE.scss';
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
      <div className={edxBootstrap.container}>
        <div className={edxBootstrap.row}>
          <div className={edxBootstrap.col}>
            <AccessibilityBody
              communityAccessibilityLink="https://www.edx.org/accessibility"
              phoneNumber="TODO: FILL THIS IN"
              email="accessibility@edx.org"
            />
            <h1>Accessibility Feedback</h1>
            <div>
              Hold for submission form
            </div>
          </div>
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
