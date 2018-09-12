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
  paginationPage: {
    id: 'paginationPage',
    defaultMessage: 'page',
    description: 'Label for a page in a page navigation element',
  },
  paginationCurrentPage: {
    id: 'paginationCurrentPage',
    defaultMessage: 'current page',
    description: 'Label for the current page in a page navigation element',
  },
  paginationOf: {
    id: 'paginationOf',
    defaultMessage: 'of',
    description: 'word used to show the number of pages out of which a page is selected; for example, "page 5 of 10" current page in a page navigation element',
  },

});

export default messages;
