import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import ReactPaginate from 'react-paginate';

import classNames from 'classnames';
import paginationStyles from './Pagination.scss';
import messages from './displayMessages';
import WrappedMessage from '../../utils/i18n/formattedMessageWrapper';
import { pageUpdate } from '../../data/actions/assets';

export class Pagination extends React.Component {
  constructor(props) {
    super(props);
    this.onPageClick = this.onPageClick.bind(this);
  }

  onPageClick(pageData) {
    this.props.updatePage(pageData.selected);
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
        {(this.props.assetsListMetaData.page === 0 && totalPages >= 0) &&
          this.getDisabledScreenReaderText()}
      </React.Fragment>
    );
  }

  getNextLabel(totalPages) {
    return (
      <React.Fragment>
        <WrappedMessage message={messages.paginationNext} />
        {(this.props.assetsListMetaData.page === totalPages - 1 &&
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
    const { page, pageSize, totalCount } = this.props.assetsListMetaData;
    const totalPages = Math.ceil(totalCount / pageSize);

    return (
      <nav aria-label="Assets Pagination Navigation">
        <ReactPaginate
          previousLabel={this.getPreviousLabel(totalPages)}
          nextLabel={this.getNextLabel(totalPages)}
          breakLabel={this.getBreakLabel()}
          pageCount={totalPages}
          forcePage={page}
          marginPagesDisplayed={2}
          pageRangeDisplayed={5}
          onPageChange={this.onPageClick}
          activeClassName={classNames(paginationStyles.active)}
          breakClassName={classNames(paginationStyles['page-link'], paginationStyles.disabled)}
          containerClassName={classNames(paginationStyles.pagination)}
          disabledClassName={classNames(paginationStyles.disabled)}
          nextClassName={classNames(paginationStyles.next)}
          nextLinkClassName={classNames(paginationStyles['page-link'])}
          pageClassName={classNames(paginationStyles['page-item'])}
          pageLinkClassName={classNames(paginationStyles['page-link'])}
          previousClassName={classNames(paginationStyles.previous)}
          previousLinkClassName={classNames(paginationStyles['page-link'])}
        />
      </nav>
    );
  }
}

Pagination.propTypes = {
  assetsListMetaData: PropTypes.shape({
    start: PropTypes.number,
    end: PropTypes.number,
    page: PropTypes.number,
    pageSize: PropTypes.number,
    totalCount: PropTypes.number,
  }).isRequired,
  updatePage: PropTypes.func.isRequired,
};


const mapStateToProps = state => ({
  assetsListMetaData: state.metadata.pagination,
  courseDetails: state.courseDetails,
});

export const mapDispatchToProps = dispatch => ({
  updatePage: page => dispatch(pageUpdate(page)),
});

const WrappedPagination = connect(
  mapStateToProps,
  mapDispatchToProps,
)(Pagination);

export default WrappedPagination;
