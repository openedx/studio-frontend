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
  let wrapper,
      paragonPagination,
      // TODO: these should probably be eliminated since they cross component boundaries
      pageLinks;

  beforeEach(() => {
    wrapper = mountWithIntl(
      <Pagination
        {...defaultProps}
      />,
    );

    pageLinks = wrapper.find('.page-item .page-link');
    paragonPagination = wrapper.find(ParagonPagination);
  });

  it('renders exactly one paragon Pagination component', () => {
    expect(paragonPagination.length).toEqual(1);
  });
  it('provides the correct number of pages to the paragon pagination component', () => {
    expect(paragonPagination.last().prop('pageCount')).toEqual(totalPages);
  });
  it('translates zero-indexed page numbers to one-indexed page numbers for paragon\'s ingestion', () => {
    let currentPage = wrapper.props().assetsListMetadata.page;

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
    })
    let currentPage = wrapper.props().assetsListMetadata.page;
    paragonPagination = wrapper.find(ParagonPagination);

    expect(currentPage).toEqual(1);
    expect(paragonPagination.prop('currentPage')).toEqual(currentPage + 1);

  });
  describe('break link', () => {
    let breakLink;

    beforeEach(() => {
      breakLink = wrapper.find('.disabled.page-link');
    });

    it('has disabled break link', () => {
      expect(breakLink).toHaveLength(1);
      expect(breakLink.text()).toEqual('...button is disabled');
    });
    it('has sr-only text on disabled break link', () => {
      const breakScreenReader = breakLink.find('.sr-only');
      expect(breakScreenReader).toHaveLength(1);
      expect(breakScreenReader.text()).toEqual('button is disabled');
    });
  });
  describe('previous link', () => {
    let previousLink;

    beforeEach(() => {
      wrapper.setProps({
        ...defaultProps,
        assetsListMetadata: {
          ...defaultProps.assetsListMetadata,
          page: 0,
        },
      });

      previousLink = wrapper.find('.disabled > .page-link');
    });
    it('is disabled when page is first page', () => {
      expect(previousLink).toHaveLength(1);
      expect(previousLink.text()).toEqual('previousbutton is disabled');
    });
    it('has sr-only text', () => {
      const breakScreenReader = previousLink.find('.sr-only');
      expect(breakScreenReader).toHaveLength(1);
      expect(breakScreenReader.text()).toEqual('button is disabled');
    });
  });
  describe('next link has sr-only text when disabled', () => {
    let nextLink;

    beforeEach(() => {
      wrapper.setProps({
        ...defaultProps,
        assetsListMetadata: {
          ...defaultProps.assetsListMetadata,
          page: totalPages - 1,
        },
      });

      pageLinks.last().simulate('click');

      nextLink = wrapper.find('.disabled > .page-link');
    });
    it('is disabled when page is last page', () => {
      expect(nextLink).toHaveLength(1);
      expect(nextLink.text()).toEqual('nextbutton is disabled');
    });
    it('has sr-only text when disabled', () => {
      const breakScreenReader = nextLink.find('.sr-only');
      expect(breakScreenReader).toHaveLength(1);
      expect(breakScreenReader.text()).toEqual('button is disabled');
    });
  });
});
