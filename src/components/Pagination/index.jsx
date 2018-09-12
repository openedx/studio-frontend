import React from 'react';
import PropTypes from 'prop-types';
import { Pagination as ParagonPagination } from '@edx/paragon';

import paginationStyles from './Pagination.scss';
import messages from './displayMessages';
import WrappedMessage from '../../utils/i18n/formattedMessageWrapper';

/**
 * Pagination component specific to the Studio Asset page
 *
 * Translates between zero-indexed Asset page metadata and Paragon's
 * Pagination component's one-indexed page numbers
 */
export default class Pagination extends React.Component {
  onPageClick = (oneIndexedPageNumber) => {
    this.props.updatePage(oneIndexedPageNumber - 1, this.props.courseDetails);
  }

  getDisabledScreenReaderText() {
    return (
      <WrappedMessage message={messages.paginationButtonDisabled}>
        { displayText => <span className={paginationStyles['sr-only']}>{displayText}</span> }
      </WrappedMessage>
    );
  }

  getPreviousLabel(totalPages) {
    return (
      <React.Fragment>
        <WrappedMessage message={messages.paginationPrevious} />
        {(this.props.assetsListMetadata.page === 0 && totalPages >= 0) &&
          this.getDisabledScreenReaderText()}
      </React.Fragment>
    );
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
                // TODO; blocked on an interesting issue documented at matthugs/trouble-in-intl-land
                /* previous: this.getPreviousLabel(totalPages),
                    next: (
                    <React.Fragment>
                    <WrappedMessage message={messages.paginationNext} />
                    {(this.props.assetsListMetadata.page === totalPages - 1 &&
                    totalPages > 0) && this.getDisabledScreenReaderText()}
                    </React.Fragment>),
                    page: <WrappedMessage message={messages.paginationPage} />,
                    curerntPage: <WrappedMessage message={messages.paginationCurrentPage} />,
                    pageOfCount: <WrappedMessage message={messages.paginationOf} />, */
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
};
