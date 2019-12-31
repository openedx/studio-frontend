import React from 'react';
import PropTypes from 'prop-types';

import AccessibilityBody from '../AccessibilityBody';
import WrappedAccessibilityPolicyForm from '../AccessibilityPolicyForm';

const AccessibilityPolicyPage = props => (
  <div className="container">
    <div className="row">
      <div className="col">
        <AccessibilityBody
          communityAccessibilityLink={props.communityAccessibilityLink}
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
};

export default AccessibilityPolicyPage;
