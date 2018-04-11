import React from 'react';
import PropTypes from 'prop-types';
import ReactPaginate from 'react-paginate';

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

  onPageClick(pageData) {
    this.props.updatePage(pageData.selected, this.props.courseDetails);
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
      <WrappedMessage message={messages.paginationAriaLabel}>
        { paginationLabel =>
          (
            <nav aria-label={paginationLabel}>
              <ReactPaginate
                previousLabel={this.getPreviousLabel(totalPages)}
                nextLabel={this.getNextLabel(totalPages)}
                breakLabel={this.getBreakLabel()}
                pageCount={totalPages}
                forcePage={page}
                marginPagesDisplayed={2}
                pageRangeDisplayed={5}
                onPageChange={this.onPageClick}
                activeClassName={classNames(edxBootstrap.active)}
                breakClassName={classNames(edxBootstrap['page-link'], edxBootstrap.disabled)}
                containerClassName={classNames(edxBootstrap.pagination)}
                disabledClassName={classNames(edxBootstrap.disabled)}
                nextClassName={classNames(edxBootstrap.next)}
                nextLinkClassName={classNames(edxBootstrap['page-link'])}
                pageClassName={classNames(edxBootstrap['page-item'])}
                pageLinkClassName={classNames(edxBootstrap['page-link'])}
                previousClassName={classNames(edxBootstrap.previous)}
                previousLinkClassName={classNames(edxBootstrap['page-link'])}
              />
            </nav>
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
