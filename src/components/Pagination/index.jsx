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
 * @extends React.Component
 */
class Pagination extends React.Component {
  onPageClick = (oneIndexedPageNumber) => {
    this.props.updatePage(oneIndexedPageNumber - 1, this.props.courseDetails);
  }

  render() {
    const { page: zeroIndexedPageNumber, pageSize, totalCount } = this.props.assetsListMetadata;
    const totalPages = Math.ceil(totalCount / pageSize);

    return (
      <WrappedMessage message={messages.paginationAriaLabel}>
        { paginationLabel =>
          (
            <ParagonPagination
              paginationLabel={paginationLabel}
              pageCount={totalPages}
              buttonLabels={{
                previous: this.props.intl.formatMessage(messages.paginationPrevious),
                next: this.props.intl.formatMessage(messages.paginationNext),
                page: this.props.intl.formatMessage(messages.paginationPage),
                currentPage: this.props.intl.formatMessage(messages.paginationCurrentPage),
                pageOfCount: this.props.intl.formatMessage(messages.paginationOf),
              }}
              currentPage={zeroIndexedPageNumber + 1}
              onPageSelect={this.onPageClick}
            />
          )
        }
      </WrappedMessage>
    );
  }
}

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
