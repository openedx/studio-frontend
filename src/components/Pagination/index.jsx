import React from 'react';
import PropTypes from 'prop-types';
// import ReactPaginate from 'react-paginate';
import { Pagination as ParagonPagination } from '@edx/paragon';

import classNames from 'classnames';
import paginationStyles from './Pagination.scss';
import edxBootstrap from '../../SFE.scss';
import messages from './displayMessages';
import WrappedMessage from '../../utils/i18n/formattedMessageWrapper';

export default class Pagination extends React.Component {
  constructor(props) {
    super(props);
    this.onPageClick = this.onPageClick.bind(this);
  }

  onPageClick(page) {
    console.log(page);
    this.props.updatePage(page-1, this.props.courseDetails);
  }

  getDisabledScreenReaderText() {
    return (
      <WrappedMessage message={messages.paginationButtonDisabled}>
        {displayText => <span className={paginationStyles['sr-only']}>{displayText}</span>}
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

  getNextLabel(totalPages) {
    return (
      <React.Fragment>
        <WrappedMessage message={messages.paginationNext} />
        {(this.props.assetsListMetadata.page === totalPages - 1 &&
          totalPages > 0) && this.getDisabledScreenReaderText()}
      </React.Fragment>
    );
  }

  getBreakLabel() {
    return (
      <span>
        ...
        {this.getDisabledScreenReaderText()}
      </span>
    );
  }

  render() {
    const { page, pageSize, totalCount } = this.props.assetsListMetadata;
    const totalPages = Math.ceil(totalCount / pageSize);

    return (
      <ParagonPagination
        currentPage={page + 1}
        onPageSelect={this.onPageClick}
        pageCount={totalPages}
        paginationLabel={<WrappedMessage message={messages.paginationAriaLabel} />}
        buttonLabels={{
          previous: <WrappedMessage message={messages.paginationPrevious} />,
          next: <WrappedMessage message={messages.paginationNext} />,
          page: <WrappedMessage message={messages.paginationPage} />,
          currentPage: <WrappedMessage message={messages.paginationCurrentPage} />,
          pageOfCount: <WrappedMessage message={messages.paginationOf} />,
        }}
      />
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
