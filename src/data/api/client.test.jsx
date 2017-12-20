import fetchMock from 'fetch-mock';

import endpoints from './endpoints';
import {
  requestAssets,
  requestDeleteAsset,
  requestToggleLockAsset,
  postUploadAsset,
  postAccessibilityForm,
} from './client';

const COURSE_ID = 'my-course-id';
const ASSET_ID = 'asset-id';

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
      sort: 'content_type',
      direction: 'asc',
      assetTypes: { Documents: true, Images: false },
    });

    const actualUrl = fetchMock.lastUrl();
    ['page=2', 'page_size=10', 'sort=contentType', 'direction=asc', 'asset_type=Documents'].forEach((expectedQueryArg) => {
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

describe('API client requestToggleLockAsset', () => {
  beforeEach(() => {
    const assetEndpointRegex = new RegExp(`/assets/${COURSE_ID}/${ASSET_ID}/`);
    fetchMock.mock(assetEndpointRegex, 200);
  });

  afterEach(() => {
    fetchMock.reset();
  });

  it('is called', () => {
    requestToggleLockAsset(COURSE_ID, { id: ASSET_ID, locked: false });
    expect(fetchMock.lastOptions().body).toEqual(JSON.stringify({ locked: true }));
    expect(fetchMock.called()).toBe(true);
  });
});

describe('API client postUploadAsset', () => {
  beforeEach(() => {
    const assetEndpointRegex = new RegExp(`/assets/${COURSE_ID}/`);
    fetchMock.mock(assetEndpointRegex, 200);
  });

  afterEach(() => {
    fetchMock.reset();
  });

  it('is called', () => {
    postUploadAsset(COURSE_ID, 'quail.png');
    expect(fetchMock.lastOptions().body.get('file')).toBe('quail.png');
    expect(fetchMock.called()).toBe(true);
  });
});

describe('Accessibility Zendesk Client API', () => {
  const email = 'staff@example.com';
  const fullName = 'Staff Submitter';
  const feedbackMessage = 'Feedback';

  beforeEach(() => {
    const zendeskEndpoint = endpoints.zendesk;
    fetchMock.mock(zendeskEndpoint, 200);
  });

  afterEach(() => {
    fetchMock.reset();
  });

  it('is called', () => {
    postAccessibilityForm(email, fullName, feedbackMessage);
    expect(fetchMock.lastOptions().body).toEqual(JSON.stringify({
      name: fullName,
      tags: ['studio_a11y'],
      email: {
        from: email,
        subject: 'Studio Accessibility Request',
        message: feedbackMessage,
      },
    }));
    expect(fetchMock.called()).toBe(true);
  });
});
