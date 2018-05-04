import { assetActions } from '../data/constants/actionTypes';
import { getPageType, pageTypes } from './getAssetsPageType';

const defaultProps = {
  assetsList: [],
  filtersMetadata: {
    assetTypes: {
      edx: false,
    },
  },
  searchMetadata: {
    search: '',
  },
  status: {},
};
const currentPageType = pageTypes.SKELETON;

describe('getPageType utility function', () => {
  it('Returns NO_ASSETS with empty assetsList', () => {
    const type = getPageType(defaultProps, currentPageType);
    expect(type).toEqual(pageTypes.NO_ASSETS);
  });
  it('Returns NO_RESULTS with empty assetsList and filter applied', () => {
    const type = getPageType({
      ...defaultProps,
      filtersMetadata: {
        assetTypes: {
          edx: true,
        },
      },
    }, currentPageType);
    expect(type).toEqual(pageTypes.NO_RESULTS);
  });
  it('Returns NORMAL with data in assetsList', () => {
    const type = getPageType({
      ...defaultProps,
      assetsList: [{
        some: 'asset',
      }],
    }, currentPageType);
    expect(type).toEqual(pageTypes.NORMAL);
  });
  it('Returns current page type when status is REQUESTING_ASSETS', () => {
    const type = getPageType({
      ...defaultProps,
      status: {
        type: assetActions.request.REQUESTING_ASSETS,
      },
    }, currentPageType);
    expect(type).toEqual(currentPageType);
  });
});
