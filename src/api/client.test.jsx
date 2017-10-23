import fetchMock from 'fetch-mock';

import { requestAssets, requestDeleteAsset } from './client';

const COURSE_ID = 'my-course-id';

describe('API client requestAssets', () => {
  beforeEach(() => {
    const assetEndpointRegex = new RegExp(`/assets/${COURSE_ID}/`);
    fetchMock.mock(assetEndpointRegex, 200);
  });

  afterEach(() => {
    fetchMock.reset();
  });

  it('is called with query params', () => {
    requestAssets(COURSE_ID, {
      page: 2,
      pageSize: 10,
      sort: 'asc',
      assetTypes: { Documents: true, Images: false },
    });

    const actualUrl = fetchMock.lastUrl();
    ['page=2', 'page_size=10', 'sort=asc', 'asset_type=Documents'].forEach((expectedQueryArg) => {
      expect(actualUrl).toEqual(expect.stringContaining(expectedQueryArg));
    });
  });

  it('is called with multiple asset types', () => {
    requestAssets(COURSE_ID, {
      assetTypes: { Documents: true, Images: false, Other: true },
    });
    const actualUrl = fetchMock.lastUrl();
    expect(actualUrl).toEqual(expect.stringContaining('asset_type=Documents,Other'));
  });
});

describe('API client requestDeleteAsset', () => {
  const ASSET_ID = 'asset-id';

  beforeEach(() => {
    const assetEndpointRegex = new RegExp(`/assets/${COURSE_ID}/${ASSET_ID}/`);
    fetchMock.mock(assetEndpointRegex, 200);
  });

  afterEach(() => {
    fetchMock.reset();
  });

  it('is called', () => {
    requestDeleteAsset(COURSE_ID, ASSET_ID);
    expect(fetchMock.called()).toBe(true);
  });
});
