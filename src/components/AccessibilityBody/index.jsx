import React from 'react';
import PropTypes from 'prop-types';

import messages from './displayMessages';
import WrappedMessage from '../../utils/i18n/formattedMessageWrapper';
import styles from './AccessibilityBody.scss';

const AccessibilityBody = (props) => {
  const mailto = `mailto:${props.email}`;
  const emailElement = (<a href={mailto}>{props.email}</a>);
  const communityAccessibilityElement = (
    <WrappedMessage message={messages.a11yBodyPolicyLink}>
      { displayText => <a href={props.communityAccessibilityLink}>{displayText}</a> }
    </WrappedMessage>
  );

  /* eslint-disable max-len */
  return (
    <div>
      <WrappedMessage message={messages.a11yBodyPageHeader}>
        { displayText => <h2 className="page-header">{displayText}</h2> }
      </WrappedMessage>
      <WrappedMessage
        message={messages.a11yBodyIntroGraph}
        values={{
          communityAccessibilityElement,
        }}
        tagName="p"
      />
      <WrappedMessage
        message={messages.a11yBodyStepsHeader}
        tagName="p"
      />
      <ol className={styles['numerical-list']}>
        <WrappedMessage
          message={messages.a11yBodyEmailHeading}
          values={{
            emailElement,
          }}
        >
          {
            displayText => (
              <li>{displayText}
                <ol className={styles['alphabetical-list']}>
                  <WrappedMessage
                    message={messages.a11yBodyNameEmail}
                    tagName="li"
                  />
                  <WrappedMessage
                    message={messages.a11yBodyInstitution}
                    tagName="li"
                  />
                  <WrappedMessage
                    message={messages.a11yBodyBarrier}
                    tagName="li"
                  />
                  <WrappedMessage
                    message={messages.a11yBodyTimeConstraints}
                    tagName="li"
                  />
                </ol>
              </li>
            )
          }
        </WrappedMessage>
        <WrappedMessage
          message={messages.a11yBodyReceipt}
          tagName="li"
        />
        <WrappedMessage
          message={messages.a11yBodyExtraInfo}
          tagName="li"
        />
        <WrappedMessage
          message={messages.a11yBodyFixesListHeader}
          tagName="li"
        >
          {
            displayText => (
              <li>{displayText}
                <ol className={styles['alphabetical-list']}>
                  <WrappedMessage
                    message={messages.a11yBodyThirdParty}
                    tagName="li"
                  />
                  <WrappedMessage
                    message={messages.a11yBodyContractor}
                    tagName="li"
                  />
                  <WrappedMessage
                    message={messages.a11yBodyCodeFix}
                    tagName="li"
                  />
                </ol>
              </li>
            )
          }
        </WrappedMessage>
      </ol>
      <WrappedMessage
        message={messages.a11yBodyEdxResponse}
        tagName="p"
      />
      <WrappedMessage
        message={messages.a11yBodyEdxFollowUp}
        tagName="p"
      />
      <WrappedMessage
        message={messages.a11yBodyOngoingSupport}
        tagName="p"
      />
      <WrappedMessage
        message={messages.a11yBodyProcessContact}
        tagName="p"
        values={{
          emailElement,
          phoneNumber: props.phoneNumber,
        }}
      />
      <WrappedMessage
        message={messages.a11yBodyA11yFeedback}
        tagName="p"
        values={{
          emailElement,
        }}
      />
    </div>
  );
  /* eslint-enable max-len */
};

AccessibilityBody.propTypes = {
  communityAccessibilityLink: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  phoneNumber: PropTypes.string.isRequired,
};

export default AccessibilityBody;
