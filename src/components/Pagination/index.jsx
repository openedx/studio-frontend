import React from 'react';
import PropTypes from 'prop-types';
import { Pagination as ParagonPagination } from '@edx/paragon';
import { intlShape, injectIntl } from 'react-intl';

import './Pagination.scss';
import messages from './displayMessages';
import WrappedMessage from '../../utils/i18n/formattedMessageWrapper';

/**
 * Pagination component specific to the Studio Asset page
 *
 * Translates between zero-indexed Asset page metadata and Paragon's
 * Pagination component's one-indexed page numbers
 *
 */
const Pagination = (props) => {
  const onPageClick = (oneIndexedPageNumber) => {
    props.updatePage(oneIndexedPageNumber - 1, props.courseDetails);
  };
  const { page: zeroIndexedPageNumber, pageSize, totalCount } = props.assetsListMetadata;
  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <WrappedMessage message={messages.paginationAriaLabel}>
      { paginationLabel => (
        <ParagonPagination
          paginationLabel={paginationLabel}
          pageCount={totalPages}
          buttonLabels={{
            previous: props.intl.formatMessage(messages.paginationPrevious),
            next: props.intl.formatMessage(messages.paginationNext),
            page: props.intl.formatMessage(messages.paginationPage),
            currentPage: props.intl.formatMessage(messages.paginationCurrentPage),
            pageOfCount: props.intl.formatMessage(messages.paginationOf),
          }}
          currentPage={zeroIndexedPageNumber + 1}
          onPageSelect={onPageClick}
        />
      )}
    </WrappedMessage>
  );
};

Pagination.propTypes = {
  assetsListMetadata: PropTypes.shape({
    start: PropTypes.number,
    end: PropTypes.number,
    page: PropTypes.number,
    pageSize: PropTypes.number,
    totalCount: PropTypes.number,
  }).isRequired,
  courseDetails: PropTypes.shape({
    lang: PropTypes.string,
    url_name: PropTypes.string,
    name: PropTypes.string,
    display_course_number: PropTypes.string,
    num: PropTypes.string,
    org: PropTypes.string,
    id: PropTypes.string,
    revision: PropTypes.string,
    base_url: PropTypes.string,
  }).isRequired,
  updatePage: PropTypes.func.isRequired,
  intl: intlShape.isRequired,
};

export default injectIntl(Pagination);
