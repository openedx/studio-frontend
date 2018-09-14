import React from 'react';

import { assetActions } from '../../data/constants/actionTypes';
import AssetsPage, { TABLE_CONTENTS_ID } from './index';
import { courseDetails, testAssetsList } from '../../utils/testConstants';
import messages from './displayMessages';
import { pageTypes } from '../../utils/getAssetsPageType';
import { shallowWithIntl } from '../../utils/i18n/enzymeHelper';
import WrappedMessage from '../../utils/i18n/formattedMessageWrapper';

let wrapper;

const defaultProps = {
  assetsList: [],
  assetsStatus: {},
  courseDetails,
  deletedAsset: {},
  filtersMetadata: {
    assetTypes: {
      edX: false,
    },
  },
  searchMetadata: {
    search: '',
  },
  status: {},
  uploadSettings: {
    max_file_size_in_mbs: 1,
  },
  clearAssetDeletion: () => {},
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
  expect(wrapper.find('Connect(InjectIntl(Pagination))')).toHaveLength(1);
};

const rendersAssetsResultsCountTest = () => {
  expect(wrapper.find('Connect(AssetsResultsCount)')).toHaveLength(2);
};

const rendersAssetsClearFiltersButtonTest = () => {
  expect(wrapper.find('Connect(AssetsClearFiltersButton)')).toHaveLength(1);
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
    expect(body).toHaveLength(3);
    renderAssetsTableTest();
    renderPaginationTest();
  });
  it('renders skip link', () => {
    const skipLink = wrapper.find(`a[href="#${TABLE_CONTENTS_ID}"]`);
    const target = wrapper.find(`#${TABLE_CONTENTS_ID}`);
    expect(skipLink).toHaveLength(1);
    expect(skipLink.hasClass('sr-only-focusable')).toEqual(true);
    expect(target).toHaveLength(1);
    expect(target.find('Connect(AssetsTable)')).toHaveLength(1);
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
    it('is hidden with no assets', () => {
      expect(wrapper.find('Connect(AssetsSearch)')).toHaveLength(0);
    });
    it('is visible with assets', () => {
      wrapper.setProps({
        assetsList: [{
          display_name: 'a.txt',
        }],
      });
      expect(wrapper.find('Connect(AssetsSearch)')).toHaveLength(1);
    });
  });
  describe('AssetsResultsCount', () => {
    it('is hidden with no assets', () => {
      expect(wrapper.find('Connect(AssetsResultsCount)')).toHaveLength(1);
    });
    it('is visible with assets', () => {
      wrapper.setProps({
        assetsList: [{
          display_name: 'a.txt',
        }],
      });
      rendersAssetsResultsCountTest();
    });
  });
  describe('AssetsClearFiltersButton', () => {
    it('is hidden with no assets', () => {
      expect(wrapper.find('Connect(AssetsClearFiltersButton)')).toHaveLength(0);
    });
    it('is hidden with assets', () => {
      wrapper.setProps({
        assetsList: [{
          display_name: 'a.txt',
        }],
      });
      expect(wrapper.find('Connect(AssetsClearFiltersButton)')).toHaveLength(0);
    });
    it('is visible with assets and has search applied', () => {
      wrapper.setProps({
        assetsList: [{
          display_name: 'a.txt',
        }],
        searchMetadata: {
          search: 'edX',
        },
      });
      rendersAssetsClearFiltersButtonTest();
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
        expect(wrapper.state('pageType')).toEqual(pageTypes.NORMAL);
      });
    });
    describe('has correct behavior', () => {
      it('when assetsList prop changes to empty', () => {
        wrapper.setProps({
          assetsList: [],
        });

        expect(wrapper.state('pageType')).toEqual(pageTypes.NO_ASSETS);
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

        expect(body.find(WrappedMessage).at(0).prop('message')).toEqual(messages.assetsPageNoAssetsMessage);
      });
      it('with correct markup structure', () => {
        const page = wrapper.find('.container .row .col');
        expect(page).toHaveLength(1);

        const body = wrapper.find('.col-10');

        wrapper = page;
        rendersAssetsDropZoneTest(page);

        expect(body).toHaveLength(1);
        expect(body.find(WrappedMessage).at(0).prop('tagName')).toEqual('h3');
      });
    });
    describe('has correct state', () => {
      it('pageType', () => {
        expect(wrapper.state('pageType')).toEqual(pageTypes.NO_ASSETS);
      });
    });
    describe('has correct behavior', () => {
      it('when assetsList prop changes to non-empty', () => {
        wrapper.setProps({
          assetsList: [{
            display_name: 'a.txt',
          }],
        });

        expect(wrapper.state('pageType')).toEqual(pageTypes.NORMAL);
      });
    });
  });
  describe('without results', () => {
    beforeEach(() => {
      wrapper.setProps({
        filtersMetadata: {
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

        expect(body.find(WrappedMessage).at(0).prop('message')).toEqual(messages.assetsPageNoResultsMessage);
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
      });
      it('noResultsBody for 2+ filters', () => {
        wrapper.setProps({
          filtersMetadata: {
            assetTypes: {
              edX: true,
              dahlia: true,
            },
          },
        });

        const body = wrapper.find('.container .row .col-10');
        expect(body.find(WrappedMessage).at(0).prop('message')).toEqual(messages.assetsPageNoResultsMessage);
      });
      describe('AssetsClearFiltersButton', () => {
        beforeEach(() => {
          wrapper.setProps({
            filtersMetadata: {
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
            filtersMetadata: {
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
        expect(wrapper.state('pageType')).toEqual(pageTypes.NO_RESULTS);
      });
    });
    describe('has correct behavior', () => {
      it('when assetsList prop changes to non-empty', () => {
        wrapper.setProps({
          assetsList: [{
            display_name: 'a.txt',
          }],
        });

        expect(wrapper.state('pageType')).toEqual(pageTypes.NORMAL);
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
        expect(wrapper.state('pageType')).toEqual(pageTypes.SKELETON);
      });
    });
    describe('has correct behavior', () => {
      it('when assetsList prop changes to non-empty', () => {
        wrapper.setProps({
          assetsList: [{
            display_name: 'a.txt',
          }],
        });

        expect(wrapper.state('pageType')).toEqual(pageTypes.NORMAL);
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
  describe('onDeleteStatusAlertClose', () => {
    it('calls clearAssetDeletion prop', () => {
      const clearAssetDeletionSpy = jest.fn();

      // run test with no assets to avoid triggering a focus change
      wrapper.setProps({
        clearAssetDeletion: clearAssetDeletionSpy,
        deletedAsset: testAssetsList[0],
        deletedAssetIndex: 0,
      });

      wrapper.instance().onDeleteStatusAlertClose();
      expect(clearAssetDeletionSpy).toHaveBeenCalledTimes(1);
    });
  });
  describe('getNextFocusElementOnDelete', () => {
    const deleteButtonRefs = testAssetsList
      .map(asset => asset.id)
      .reduce(
        // eslint-disable-next-line no-param-reassign
        ((memo, id) => { memo[id] = id; return memo; }),
        {},
      );

    const testData = [
      { deletedAssetIndex: 0 },
      { deletedAssetIndex: testAssetsList.length - 1 },
      { deletedAssetIndex: 2 },
    ];

    testData.forEach((test) => {
      it(`returns the correct element to focus on when element at index ${test.deletedAssetIndex} deleted`, () => {
        const deletedAssetIndex = test.deletedAssetIndex;

        wrapper.setProps({
          assetsList: testAssetsList,
          assetsStatus: {
            type: assetActions.delete.DELETE_ASSET_SUCCESS,
          },
          deletedAssetIndex,
          deleteAsset: testAssetsList[deletedAssetIndex],
        });

        wrapper.instance().deleteButtonRefs = deleteButtonRefs;

        const nextFocusElementOnDelete = wrapper.instance().getNextFocusElementOnDelete();

        expect(nextFocusElementOnDelete).toEqual(testAssetsList[deletedAssetIndex].id);
      });
    });
  });
});
