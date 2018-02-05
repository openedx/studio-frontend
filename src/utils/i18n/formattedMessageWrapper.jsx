import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';

const WrappedMessage = (props) => {
  const { message, intl, ...other } = props;

  // manually check if a translation exists for this message in the current (non-default) locale
  // this allows us to match the containing "lang" span when we fallback to the default locale
  let locale = intl.defaultLocale;
  if (message.id in intl.messages) {
    locale = intl.locale;
  }
  return (
    <span lang={locale}>
      <FormattedMessage
        {...message}
        {...other}
      />
    </span>
  );
};

WrappedMessage.propTypes = {
  intl: intlShape.isRequired,
  message: PropTypes.shape({
    id: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    defaultMessage: PropTypes.string.isRequired,
  }).isRequired,
};

export default injectIntl(WrappedMessage);
