import React from 'react';
import PropTypes from 'prop-types';
import ReactDomServer from 'react-dom/server';

import messages from './displayMessages';
import WrappedMessage from '../../utils/i18n/formattedMessageWrapper';
import styles from './AccessibilityBody.scss';

const AccessibilityBody = (props) => {
  const emailAddress = props.email;
  const mailto = `mailto:${emailAddress}`;
  const emailElement = (<a href={mailto}>{emailAddress}</a>);
  const communityAccessibilityElement = (
    <WrappedMessage message={messages.a11yBodyPolicyLink}>
      { displayText => <a href={props.communityAccessibilityLink}>{displayText}</a> }
    </WrappedMessage>
  );
  /* eslint-disable max-len,react/no-danger */
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
            emailElement: ReactDomServer.renderToString(emailElement),
          }}
        >
          {
            displayText => (
              // I am using dangerouslySetInnerHTML to as workaround to fix an issue that does not render
              // html element in the parent when it has its own children.
              // I am certain about the string being inserted here is not malicious so it's a pretty safe bet to use dangerouslySetInnerHTML.
              <li><span dangerouslySetInnerHTML={{ __html: displayText }} />
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
      </ol>
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
};

export default AccessibilityBody;
