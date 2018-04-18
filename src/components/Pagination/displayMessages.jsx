import { defineMessages } from 'react-intl';

const messages = defineMessages({
  paginationAriaLabel: {
    id: 'paginationAriaLabel',
    defaultMessage: 'Content pagination',
    description: 'Screen-reader text to label the nav region as pagination',
  },
  paginationButtonDisabled: {
    id: 'paginationButtonDisabled',
    defaultMessage: 'button is disabled',
    description: 'Screen-reader text that indicates that the button is disabled',
  },
  paginationNext: {
    id: 'paginationNext',
    defaultMessage: 'next',
    description: 'Label for next button',
  },
  paginationPrevious: {
    id: 'paginationPrevious',
    defaultMessage: 'previous',
    description: 'Label for previous button',
  },
});

export default messages;
