import React from 'react';
import Enzyme from 'enzyme';
import { Pagination, mapDispatchToProps } from './index';

const { mount } = Enzyme;

const defaultProps = {
  assetsListMetaData: {
    page: 0,
    pageSize: 50,
    totalCount: 5000,
  },
  updatePage: () => {},
};

const totalPages = Math.ceil(
  defaultProps.assetsListMetaData.totalCount / defaultProps.assetsListMetaData.pageSize,
);

describe('<Pagination />', () => {
  let wrapper;
  let pageItems;
  let pageLinks;

  beforeEach(() => {
    wrapper = mount(
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
    expect(updatePageSpy).toHaveBeenCalledWith(totalPages - 1);
  });
  it('changes the current page when assets list state updates', () => {
    let currentPage = wrapper.props().assetsListMetaData.page;
    let currentPageLink = pageItems.at(0).find('a');

    expect(currentPage).toEqual(0);
    expect(currentPageLink.prop('aria-label')).toContain('current page');

    wrapper.setProps({
      assetsListMetaData: {
        page: 1,
        pageSize: 50,
        totalCount: 5000,
      },
    });

    pageItems = wrapper.find('.page-item');
    currentPage = wrapper.props().assetsListMetaData.page;
    currentPageLink = pageItems.at(1).find('a');

    expect(currentPage).toEqual(1);
    expect(currentPageLink.prop('aria-label')).toContain('current page');
  });
  it('has correct mapDispatchToProps', () => {
    const dispatchSpy = jest.fn();

    const { updatePage } = mapDispatchToProps(dispatchSpy);

    const updatePageAction = {
      data: {
        page: totalPages,
      },
      type: 'PAGE_UPDATE',
    };

    updatePage(totalPages);

    expect(dispatchSpy).toHaveBeenCalledTimes(1);
    expect(dispatchSpy).toHaveBeenCalledWith(updatePageAction);
  });
  describe('break link', () => {
    let breakLink;

    beforeEach(() => {
      breakLink = wrapper.find('.disabled.page-link');
    });

    it('has disabled break link', () => {
      expect(breakLink).toHaveLength(1);
      expect(breakLink.text()).toEqual('... button disabled');
    });
    it('has sr-only text on disabled break link', () => {
      const breakScreenReader = breakLink.find('.sr-only');
      expect(breakScreenReader).toHaveLength(1);
      expect(breakScreenReader.text()).toEqual(' button disabled');
    });
  });
  describe('previous link', () => {
    let previousLink;

    beforeEach(() => {
      wrapper.setProps({
        ...defaultProps,
        assetsListMetaData: {
          ...defaultProps.assetsListMetaData,
          page: 0,
        },
      });

      previousLink = wrapper.find('.disabled > .page-link');
    });
    it('is disabled when page is first page', () => {
      expect(previousLink).toHaveLength(1);
      expect(previousLink.text()).toEqual('previous button disabled');
    });
    it('has sr-only text', () => {
      const breakScreenReader = previousLink.find('.sr-only');
      expect(breakScreenReader).toHaveLength(1);
      expect(breakScreenReader.text()).toEqual(' button disabled');
    });
  });
  describe('next link has sr-only text when disabled', () => {
    let nextLink;

    beforeEach(() => {
      wrapper.setProps({
        ...defaultProps,
        assetsListMetaData: {
          ...defaultProps.assetsListMetaData,
          page: totalPages - 1,
        },
      });

      pageLinks.last().simulate('click');

      nextLink = wrapper.find('.disabled > .page-link');
    });
    it('is disabled when page is last page', () => {
      expect(nextLink).toHaveLength(1);
      expect(nextLink.text()).toEqual('next button disabled');
    });
    it('has sr-only text when disabled', () => {
      const breakScreenReader = nextLink.find('.sr-only');
      expect(breakScreenReader).toHaveLength(1);
      expect(breakScreenReader.text()).toEqual(' button disabled');
    });
  });
});
