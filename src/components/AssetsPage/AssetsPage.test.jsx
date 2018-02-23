import React from 'react';

import AssetsPage, { types } from './index';
import { assetActions } from '../../data/constants/actionTypes';
import courseDetails from '../../utils/testConstants';
import { shallowWithIntl } from '../../utils/i18n/enzymeHelper';
import WrappedMessage from '../../utils/i18n/formattedMessageWrapper';
import messages from './displayMessages';

let wrapper;

const defaultProps = {
  assetsList: [],
  courseDetails,
  filtersMetaData: {
    assetTypes: {
      edX: false,
    },
  },
  searchMetaData: {
    search: '',
  },
  status: {},
  uploadSettings: {
    max_file_size_in_mbs: 1,
  },
  searchSettings: {
    enabled: true,
  },

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
  wrapper = shallowWithIntl(
    <AssetsPage
      {...defaultProps}
    />,
  );
});

describe('<AssetsPage />', () => {
  describe('AssetsSearch', () => {
    it('is hidden when disabled', () => {
      wrapper = shallowWithIntl(
        <AssetsPage
          {...defaultProps}
          searchSettings={{ enabled: false }}
        />,
      );
      expect(wrapper.find('Connect(AssetsSearch)')).toHaveLength(0);
    });
    it('is visible when enabled', () => {
      expect(wrapper.find('Connect(AssetsSearch)')).toHaveLength(1);
    });
  });
  describe('AssetsResultsCount', () => {
    it('is hidden when disabled', () => {
      wrapper = shallowWithIntl(
        <AssetsPage
          {...defaultProps}
          searchSettings={{ enabled: false }}
        />,
      );
      expect(wrapper.find('Connect(AssetsResultsCount)')).toHaveLength(0);
    });
    it('is hidden when enabled and no assets', () => {
      expect(wrapper.find('Connect(AssetsResultsCount)')).toHaveLength(0);
    });
    it('is visible when enabled and has assets', () => {
      wrapper.setProps({
        assetsList: [{
          display_name: 'a.txt',
        }],
      });
      expect(wrapper.find('Connect(AssetsResultsCount)')).toHaveLength(1);
    });
  });
  describe('AssetsClearFiltersButton', () => {
    it('is hidden when disabled', () => {
      wrapper = shallowWithIntl(
        <AssetsPage
          {...defaultProps}
          searchSettings={{ enabled: false }}
        />,
      );
      expect(wrapper.find('Connect(AssetsClearFiltersButton)')).toHaveLength(0);
    });
    it('is hidden when enabled and no assets', () => {
      expect(wrapper.find('Connect(AssetsClearFiltersButton)')).toHaveLength(0);
    });
    it('is visible when enabled and has assets', () => {
      wrapper.setProps({
        assetsList: [{
          display_name: 'a.txt',
        }],
      });
      expect(wrapper.find('Connect(AssetsClearFiltersButton)')).toHaveLength(1);
    });
  });
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

        expect(body.find(WrappedMessage).at(0).prop('message')).toEqual(messages.assetsPageNoAssetsNumFiles);
        expect(body.find(WrappedMessage).at(1).prop('message')).toEqual(messages.assetsPageNoAssetsMessage);
      });
      it('with correct markup structure', () => {
        const page = wrapper.find('.container .row .col');
        expect(page).toHaveLength(1);

        const body = wrapper.find('.col-10');

        wrapper = page;
        rendersAssetsDropZoneTest(page);

        expect(body).toHaveLength(1);
        expect(body.find(WrappedMessage).at(0).prop('tagName')).toEqual('h3');
        expect(body.find(WrappedMessage).at(1).prop('tagName')).toEqual('h4');
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

        expect(body.find(WrappedMessage).at(0).prop('message')).toEqual(messages.assetsPageNoResultsNumFiles);
        expect(body.find(WrappedMessage).at(1).prop('message')).toEqual(messages.assetsPageNoResultsMessage);
      });

      it('with correct markup structure', () => {
        const page = wrapper.find('.container .row .col');
        expect(page).toHaveLength(1);

        const body = wrapper.find('.col-10');

        wrapper = page;

        rendersAssetsDropZoneTest();
        renderAssetsFiltersTest();

        expect(body).toHaveLength(1);
        expect(body.find(WrappedMessage).at(0).prop('tagName')).toEqual('h3');
        expect(body.find(WrappedMessage).at(1).prop('tagName')).toEqual('h4');
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
        expect(body.find(WrappedMessage).at(0).prop('message')).toEqual(messages.assetsPageNoResultsNumFiles);
        expect(body.find(WrappedMessage).at(1).prop('message')).toEqual(messages.assetsPageNoResultsMessage);
      });
      describe('AssetsClearFiltersButton', () => {
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
          expect(body.find('Connect(AssetsClearFiltersButton)')).toHaveLength(1);
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
          expect(body.find('Connect(AssetsClearFiltersButton)')).toHaveLength(1);
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
