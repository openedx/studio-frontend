import React from 'react';
import Enzyme from 'enzyme';
import { Button } from '@edx/paragon';

import { AssetsPage, mapDispatchToProps, types } from './index';
import { assetActions } from '../../data/constants/actionTypes';
// import { types } from './pageTypes';

const { shallow } = Enzyme;

let wrapper;

const defaultProps = {
  assetsList: [],
  courseDetails: {},
  filtersMetaData: {
    assetTypes: {
      edX: false,
    },
  },
  request: {
    assetTypes: {},
  },
  status: {},
  uploadSettings: {
    max_file_size_in_mbs: 1,
  },

  clearFilters: () => {},
  getAssets: () => {},
};

const rendersAssetsDropZoneTest = () => {
  expect(wrapper.find('Connect(AssetsDropZone)')).toHaveLength(1);
};

const renderAssetsFiltersTest = () => {
  expect(wrapper.find('Connect(AssetsFilters)')).toHaveLength(1);
};

const renderAssetsTableTest = () => {
  expect(wrapper.find('Connect(AssetsTable)')).toHaveLength(1);
};

const renderPaginationTest = () => {
  expect(wrapper.find('Connect(Pagination)')).toHaveLength(1);
};

const normalAssetsPageRenderTest = () => {
  it('AssetsDropZone', () => {
    rendersAssetsDropZoneTest();
  });
  it('AssetsFilters', () => {
    renderAssetsFiltersTest();
  });
  it('AssetsTable', () => {
    renderAssetsTableTest();
  });
  it('Pagination', () => {
    renderPaginationTest();
  });
  it('with correct markup structure', () => {
    const page = wrapper.find('.container .row .col');
    expect(page).toHaveLength(1);
    const body = wrapper.find('.col-10');

    wrapper = page;
    rendersAssetsDropZoneTest();
    renderAssetsFiltersTest();

    wrapper = body;
    expect(body).toHaveLength(1);
    renderAssetsTableTest();
    renderPaginationTest();
  });
};

beforeEach(() => {
  wrapper = shallow(
    <AssetsPage
      {...defaultProps}
    />,
  );
});

describe('<AssetsPage />', () => {
  describe('with assets', () => {
    beforeEach(() => {
      wrapper.setProps({
        assetsList: [{
          display_name: 'a.txt',
        }],
      });
    });
    describe('renders', () => {
      normalAssetsPageRenderTest();
    });
    describe('has correct state', () => {
      it('pageType', () => {
        expect(wrapper.state('pageType')).toEqual(types.NORMAL);
      });
    });
    describe('has correct behavior', () => {
      it('when assetsList prop changes to empty', () => {
        wrapper.setProps({
          assetsList: [],
        });

        expect(wrapper.state('pageType')).toEqual(types.NO_ASSETS);
      });
    });
  });
  describe('without assets', () => {
    beforeEach(() => {
      wrapper.setProps({
        assetsList: [],
      });
    });
    describe('renders', () => {
      it('AssetsDropZone', () => {
        rendersAssetsDropZoneTest();
      });
      it('noAssetsBody', () => {
        const body = wrapper.find('.container .row .col-10');

        expect(body.find('h3').text()).toEqual('0 files in your course');
        expect(body.find('h4').text()).toEqual('Enhance your course content by uploading files such as images and documents.');
      });
      it('with correct markup structure', () => {
        const page = wrapper.find('.container .row .col');
        expect(page).toHaveLength(1);

        const body = wrapper.find('.col-10');

        wrapper = page;
        rendersAssetsDropZoneTest(page);

        expect(body).toHaveLength(1);
        expect(body.find('h3')).toHaveLength(1);
        expect(body.find('h4')).toHaveLength(1);
      });
    });
    describe('has correct state', () => {
      it('pageType', () => {
        expect(wrapper.state('pageType')).toEqual(types.NO_ASSETS);
      });
    });
    describe('has correct behavior', () => {
      it('when assetsList prop changes to non-empty', () => {
        wrapper.setProps({
          assetsList: [{
            display_name: 'a.txt',
          }],
        });

        expect(wrapper.state('pageType')).toEqual(types.NORMAL);
      });
    });
  });
  describe('without results', () => {
    beforeEach(() => {
      wrapper.setProps({
        filtersMetaData: {
          assetTypes: {
            edX: true,
          },
        },
      });
    });
    describe('renders', () => {
      beforeEach(() => {
        wrapper.setProps({
          assetsList: [],
        });
      });
      it('AssetsDropZone', () => {
        rendersAssetsDropZoneTest();
      });
      it('AssetsFilters', () => {
        renderAssetsFiltersTest();
      });
      it('noResultsBody for 1 filter', () => {
        const body = wrapper.find('.container .row .col-10');

        expect(body.find('h3').text()).toEqual('0 files');
        expect(body.find('h4').text()).toEqual('No files were found for this filter.');
      });

      it('with correct markup structure', () => {
        const page = wrapper.find('.container .row .col');
        expect(page).toHaveLength(1);

        const body = wrapper.find('.col-10');

        wrapper = page;

        rendersAssetsDropZoneTest();
        renderAssetsFiltersTest();

        expect(body).toHaveLength(1);
        expect(body.find('h3')).toHaveLength(1);
        expect(body.find('h4')).toHaveLength(1);
      });
      it('noResultsBody for 2+ filters', () => {
        wrapper.setProps({
          filtersMetaData: {
            assetTypes: {
              edX: true,
              dahlia: true,
            },
          },
        });

        const body = wrapper.find('.container .row .col-10');
        expect(body.find('h3').text()).toEqual('0 files');
        expect(body.find('h4').text()).toEqual('No files were found for these filters.');
      });
      describe('clear filters button', () => {
        beforeEach(() => {
          wrapper.setProps({
            filtersMetaData: {
              assetTypes: {
                edX: true,
              },
            },
          });
        });
        it('renders for 1 filter', () => {
          const body = wrapper.find('.container .row .col-10');
          const clearFiltersButton = body.find(Button);

          expect(clearFiltersButton).toHaveLength(1);
          expect(clearFiltersButton.prop('buttonType')).toEqual('link');
          expect(clearFiltersButton.prop('label')).toEqual('Clear filter');
        });
        it('renders for 2+ filters', () => {
          wrapper.setProps({
            filtersMetaData: {
              assetTypes: {
                edX: true,
                dahlia: true,
              },
            },
          });

          const body = wrapper.find('.container .row .col-10');
          const clearFiltersButton = body.find(Button);

          expect(clearFiltersButton).toHaveLength(1);
          expect(clearFiltersButton.prop('buttonType')).toEqual('link');
          expect(clearFiltersButton.prop('label')).toEqual('Clear all filters');
        });
        it('calls clearFilters onClick', () => {
          const clearFiltersMock = jest.fn();

          wrapper = shallow(
            <AssetsPage
              {...defaultProps}
              clearFilters={clearFiltersMock}
            />,
          );

          wrapper.setProps({
            filtersMetaData: {
              assetTypes: {
                edX: true,
              },
            },
          });

          const body = wrapper.find('.container .row .col-10');
          const clearFiltersButton = body.find(Button);

          clearFiltersButton.simulate('click');

          expect(clearFiltersMock).toHaveBeenCalledTimes(1);
        });
      });
    });
    describe('has correct state', () => {
      it('pageType', () => {
        expect(wrapper.state('pageType')).toEqual(types.NO_RESULTS);
      });
    });
    describe('has correct behavior', () => {
      it('when assetsList prop changes to non-empty', () => {
        wrapper.setProps({
          assetsList: [{
            display_name: 'a.txt',
          }],
        });

        expect(wrapper.state('pageType')).toEqual(types.NORMAL);
      });
    });
  });
  describe('skeleton page', () => {
    describe('renders', () => {
      it('AssetsDropZone', () => {
        rendersAssetsDropZoneTest();
      });
      it('AssetsFilters', () => {
        renderAssetsFiltersTest();
      });
    });
    describe('has correct state', () => {
      it('pageType', () => {
        expect(wrapper.state('pageType')).toEqual(types.SKELETON);
      });
    });
    describe('has correct behavior', () => {
      it('when assetsList prop changes to non-empty', () => {
        wrapper.setProps({
          assetsList: [{
            display_name: 'a.txt',
          }],
        });

        expect(wrapper.state('pageType')).toEqual(types.NORMAL);
      });
    });
  });
  describe('getAssets', () => {
    const getAssetsMock = jest.fn();
    beforeEach(() => {
      wrapper = shallow(
        <AssetsPage
          {...defaultProps}
          getAssets={getAssetsMock}
        />,
      );

      getAssetsMock.mockReset();
    });
    it('is called on changes to request', () => {
      const request = {
        request: 'request',
      };

      wrapper.setProps({
        request,
      });

      expect(getAssetsMock).toHaveBeenCalledTimes(1);
      expect(getAssetsMock).toHaveBeenCalledWith(request, defaultProps.courseDetails);
    });
    it('is not called on no changes to request', () => {
      wrapper.setProps({
        request: defaultProps.request,
      });

      expect(getAssetsMock).toHaveBeenCalledTimes(0);
    });
  });
  describe('has correct mapDispatchToProps', () => {
    it('for clearFilters', () => {
      const dispatchSpy = jest.fn();

      const { clearFilters } = mapDispatchToProps(dispatchSpy);

      const clearFiltersAction = {
        type: assetActions.clear.CLEAR_FILTERS,
      };

      clearFilters();

      expect(dispatchSpy).toHaveBeenCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(clearFiltersAction);
    });
    it('for getAssets', () => {
      const dispatchSpy = jest.fn();
      const getAssetsMock = jest.fn();

      wrapper = shallow(
        <AssetsPage
          {...defaultProps}
          getAssets={getAssetsMock}
        />,
      );

      const { getAssets } = mapDispatchToProps(dispatchSpy);

      getAssets(defaultProps.request, defaultProps.courseDetails);

      expect(dispatchSpy).toHaveBeenCalledTimes(1);
      expect(getAssetsMock).toHaveBeenCalledTimes(1);
    });
  });
  describe('other page type', () => {
    it('throws error', () => {
      const pageType = 'edX';
      const error = new Error(`Unknown pageType ${pageType}.`);

      try {
        wrapper.instance().getPage(pageType);
      } catch (e) {
        expect(e).toEqual(error);
      }
    });
  });
  describe('if getting assets, render current page', () => {
    beforeEach(() => {
      wrapper.setProps({
        assetsList: [{
          display_name: 'a.txt',
        }],
      });
    });

    normalAssetsPageRenderTest();

    beforeAll(() => {
      wrapper.setProps({
        status: {
          type: assetActions.request.REQUESTING_ASSETS,
        },
      });
    });

    normalAssetsPageRenderTest();
  });
});
