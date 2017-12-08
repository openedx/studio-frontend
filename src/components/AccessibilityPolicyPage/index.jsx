import React from 'react';
import PropTypes from 'prop-types';

import AccessibilityBody from '../AccessibilityBody';
import WrappedAccessibilityPolicyForm from '../AccessibilityPolicyForm';

import edxBootstrap from '../../SFE.scss';
// import styles from './AccessibilityPolicyPage.scss';

const AccessibilityPolicyPage = props => (
  <div className={edxBootstrap.container}>
    <div className={edxBootstrap.row}>
      <div className={edxBootstrap.col}>
        <AccessibilityBody
          communityAccessibilityLink={props.communityAccessibilityLink}
          phoneNumber={props.phoneNumber}
          email={props.email}
        />
        <WrappedAccessibilityPolicyForm
          accessibilityEmail={props.email}
        />
      </div>
    </div>
  </div>
);

AccessibilityPolicyPage.propTypes = {
  communityAccessibilityLink: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  phoneNumber: PropTypes.string.isRequired,
};

export default AccessibilityPolicyPage;
