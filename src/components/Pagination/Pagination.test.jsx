import React from 'react';

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
  let pageItems;
  let pageLinks;

  beforeEach(() => {
    wrapper = mountWithIntl(
      <Pagination
        {...defaultProps}
      />,
    );

    pageItems = wrapper.find('.page-item');
    pageLinks = wrapper.find('.page-item .page-link');
  });

  it('renders correct number of pages', () => {
    expect(parseInt(pageItems.last().text(), 10)).toEqual(totalPages);
    expect(parseInt(pageLinks.last().text(), 10)).toEqual(totalPages);
  });
  it('page click calls updatePage', () => {
    const updatePageSpy = jest.fn();

    wrapper.setProps({ updatePage: updatePageSpy });

    pageLinks.last().simulate('click');

    expect(updatePageSpy).toHaveBeenCalledTimes(1);
    // API treats pages as 0-indexed, but we treat them as 1-indexed
    expect(updatePageSpy).toHaveBeenCalledWith(totalPages - 1, defaultProps.courseDetails);
  });
  it('changes the current page when assets list state updates', () => {
    let currentPage = wrapper.props().assetsListMetadata.page;
    let currentPageLink = pageItems.at(0).find('a');

    expect(currentPage).toEqual(0);
    expect(currentPageLink.prop('aria-label')).toContain('current page');

    wrapper.setProps({
      assetsListMetadata: {
        page: 1,
        pageSize: 50,
        totalCount: 5000,
      },
    });

    pageItems = wrapper.find('.page-item');
    currentPage = wrapper.props().assetsListMetadata.page;
    currentPageLink = pageItems.at(1).find('a');

    expect(currentPage).toEqual(1);
    expect(currentPageLink.prop('aria-label')).toContain('current page');
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
