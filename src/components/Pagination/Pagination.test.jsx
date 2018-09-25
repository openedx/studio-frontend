import React from 'react';
import { Pagination as ParagonPagination } from '@edx/paragon';

import { courseDetails } from '../../utils/testConstants';
import { mountWithIntl } from '../../utils/i18n/enzymeHelper';
import Pagination from './index';

const defaultProps = {
  assetsListMetadata: {
    page: 0,
    pageSize: 50,
    totalCount: 5000,
  },
  courseDetails,
  updatePage: () => {},
};

const totalPages = Math.ceil(
  defaultProps.assetsListMetadata.totalCount / defaultProps.assetsListMetadata.pageSize,
);

describe('<Pagination />', () => {
  let wrapper;
  let paragonPagination;

  beforeEach(() => {
    wrapper = mountWithIntl(
      <Pagination
        {...defaultProps}
      />,
    );
    paragonPagination = wrapper.find(ParagonPagination);
  });

  it('renders exactly one paragon Pagination component', () => {
    expect(paragonPagination.length).toEqual(1);
  });
  it('provides the correct number of pages to the paragon pagination component', () => {
    expect(paragonPagination.last().prop('pageCount')).toEqual(totalPages);
  });
  it('translates zero-indexed page numbers to one-indexed page numbers for paragon\'s ingestion', () => {
    const currentPage = wrapper.props().assetsListMetadata.page;

    expect(currentPage).toEqual(0);
    expect(paragonPagination.prop('currentPage')).toEqual(currentPage + 1);
  });
  it('changes the current page when assets list state updates', () => {
    wrapper.setProps({
      assetsListMetadata: {
        page: 1,
        pageSize: 50,
        totalCount: 5000,
      },
    });
    const currentPage = wrapper.props().assetsListMetadata.page;
    paragonPagination = wrapper.find(ParagonPagination);

    expect(currentPage).toEqual(1);
    expect(paragonPagination.prop('currentPage')).toEqual(currentPage + 1);
  });
  it('calls provided updatePage function when paragon\'s pagination changes page number', () => {
    const updatePageSpy = jest.fn();
    wrapper.setProps({
      updatePage: updatePageSpy,
    });
    paragonPagination.prop('onPageSelect')(7);
    expect(updatePageSpy).toHaveBeenCalledTimes(1);
    expect(updatePageSpy).toHaveBeenCalledWith(6, defaultProps.courseDetails);
  });
});
