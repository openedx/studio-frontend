import configureStore from 'redux-mock-store';
import fetchMock from 'fetch-mock';
import thunk from 'redux-thunk';

import endpoints from '../api/endpoints';
import * as actionCreators from './assets';
import { requestInitial } from '../reducers/assets';
import { assetActions } from '../../data/constants/actionTypes';

const initialState = {
  request: { ...requestInitial },
};

const courseDetails = {
  id: 'edX',
};

const assetId = 'asset';

const assetsEndpoint = endpoints.assets;
const middlewares = [thunk];
const mockStore = configureStore(middlewares);
let store;

// currying a function that can be passed to fetch-mock to determine what
// response should be based on whether or not upload succeeds or fails
const getUploadResponse = isSuccess => (
  (url, opts) => ({
    status: isSuccess ? 200 : 400,
    body: {
      asset: opts.body.get('file'),
    },
  })
);

describe('Assets Action Creators', () => {
  beforeEach(() => {
    store = mockStore(initialState);
  });

  afterEach(() => {
    fetchMock.reset();
    fetchMock.restore();
  });

  it('returns expected state from requestAssetsSuccess', () => {
    const expectedAction = { data: 'response', type: assetActions.REQUEST_ASSETS_SUCCESS };
    expect(store.dispatch(actionCreators.requestAssetsSuccess('response'))).toEqual(expectedAction);
  });
  it('returns expected state from assetDeleteFailure', () => {
    const expectedAction = { assetId, type: assetActions.DELETE_ASSET_FAILURE };
    expect(store.dispatch(actionCreators.deleteAssetFailure(assetId))).toEqual(expectedAction);
  });
  it('returns expected state from getAssets success', () => {
    const request = requestInitial;
    const response = request;

    fetchMock.once(`begin:${assetsEndpoint}`, response);
    const expectedActions = [
      { type: assetActions.REQUEST_ASSETS_SUCCESS, data: response },
    ];

    return store.dispatch(actionCreators.getAssets(request, courseDetails)).then(() => {
      // return of async actions
      expect(store.getActions()).toEqual(expectedActions);
    });
  });
  it('returns expected state from getAssets failure', () => {
    const request = requestInitial;

    const response = {
      status: 400,
      body: request,
    };

    const errorResponse = new Error(response);

    fetchMock.once(`begin:${assetsEndpoint}`, response);
    const expectedActions = [
      { type: assetActions.REQUEST_ASSETS_FAILURE, data: errorResponse },
    ];

    store = mockStore(initialState);
    return store.dispatch(actionCreators.getAssets(request, courseDetails)).then(() => {
      // return of async actions
      expect(store.getActions()).toEqual(expectedActions);
    });
  });
  it('returns expected state from getAssets if response metadata does not match request', () => {
    const request = {
      ...requestInitial,
      direction: 'asc',
    };

    const response = request;

    fetchMock.once(`begin:${assetsEndpoint}`, response);

    // if the response is not the same as the request, we expect nothing
    const expectedActions = [];

    return store.dispatch(actionCreators.getAssets(request, courseDetails)).then(() => {
      // return of async actions
      expect(store.getActions()).toEqual(expectedActions);
    });
  });
  it('returns expected state from filterUpdate', () => {
    const expectedAction = { data: { filter: true }, type: assetActions.FILTER_UPDATED };
    expect(store.dispatch(actionCreators.filterUpdate('filter', true))).toEqual(expectedAction);
  });
  it('returns expected state from sortUpdate', () => {
    const expectedAction = { data: { sort: 'edX', direction: 'desc' }, type: assetActions.SORT_UPDATE };
    expect(store.dispatch(actionCreators.sortUpdate('edX', 'desc'))).toEqual(expectedAction);
  });
  it('returns expected state from pageUpdate', () => {
    const expectedAction = { data: { page: 0 }, type: assetActions.PAGE_UPDATE };
    expect(store.dispatch(actionCreators.pageUpdate(0))).toEqual(expectedAction);
  });
  it('returns expected state from deleteAsset success', () => {
    const response = {
      status: 204,
      body: {},
    };

    fetchMock.once(`begin:${assetsEndpoint}`, response);

    const expectedActions = [
      { type: assetActions.DELETE_ASSET_SUCCESS, assetId },
    ];

    return store.dispatch(actionCreators.deleteAsset(assetId, courseDetails)).then(() => {
      // return of async actions
      expect(store.getActions()).toEqual(expectedActions);
    });
  });
  it('returns expected state from deleteAsset failure', () => {
    const response = {
      status: 400,
    };

    fetchMock.once(`begin:${assetsEndpoint}`, response);

    const expectedActions = [
      { type: assetActions.DELETE_ASSET_FAILURE, assetId },
    ];

    return store.dispatch(actionCreators.deleteAsset(assetId, courseDetails)).then(() => {
      // return of async actions
      expect(store.getActions()).toEqual(expectedActions);
    });
  });
  it('returns expected state from clearAssetsStatus', () => {
    const expectedAction = { type: assetActions.CLEAR_ASSETS_STATUS };
    expect(store.dispatch(actionCreators.clearAssetsStatus())).toEqual(expectedAction);
  it('returns expected state from toggleLockAsset success', () => {
    const response = {
      status: 200,
    };

    fetchMock.once(`begin:${assetsEndpoint}`, response);

    const expectedActions = [
      { type: assetActions.TOGGLING_LOCK_ASSET_SUCCESS, asset: assetId },
      { type: assetActions.TOGGLE_LOCK_ASSET_SUCCESS, asset: assetId },
    ];

    return store.dispatch(actionCreators.toggleLockAsset(assetId, courseDetails)).then(() => {
      // return of async actions
      expect(store.getActions()).toEqual(expectedActions);
    });
  });
  it('returns expected state from toggleLockAsset success', () => {
    const response = {
      status: 400,
    };

    const error = new Error(response);

    fetchMock.once(`begin:${assetsEndpoint}`, response);

    const expectedActions = [
      { type: assetActions.TOGGLING_LOCK_ASSET_SUCCESS, asset: assetId },
      { type: assetActions.TOGGLING_LOCK_ASSET_FAILURE, asset: assetId, response: error },
    ];

    return store.dispatch(actionCreators.toggleLockAsset(assetId, courseDetails)).then(() => {
      // return of async actions
      expect(store.getActions()).toEqual(expectedActions);
    });
  });
  it('returns expected state from togglingLockAsset', () => {
    const expectedAction = { asset: 'asset', type: assetActions.TOGGLING_LOCK_ASSET_SUCCESS };
    expect(store.dispatch(actionCreators.togglingLockAsset('asset'))).toEqual(expectedAction);
  });
  it('returns expected state from toggleLockAssetSuccess', () => {
    const expectedAction = { asset: 'asset', type: assetActions.TOGGLE_LOCK_ASSET_SUCCESS };
    expect(store.dispatch(actionCreators.toggleLockAssetSuccess('asset'))).toEqual(expectedAction);
  });
  it('returns expected state from toggleLockAssetFailure', () => {
    const expectedAction = { asset: 'asset', response: 'response', type: assetActions.TOGGLING_LOCK_ASSET_FAILURE };
    expect(store.dispatch(actionCreators.toggleLockAssetFailure('asset', 'response'))).toEqual(expectedAction);
  });
  it('returns expected state from uploadExceedMaxSize', () => {
    const expectedAction = { maxFileSizeMB: 23, type: assetActions.UPLOAD_EXCEED_MAX_SIZE_ERROR };
    expect(store.dispatch(actionCreators.uploadExceedMaxSize(23))).toEqual(expectedAction);
  });
  it('returns expected state from uploadExceedMaxCount', () => {
    const expectedAction = { maxFileCount: 1, type: assetActions.UPLOAD_EXCEED_MAX_COUNT_ERROR };
    expect(store.dispatch(actionCreators.uploadExceedMaxCount(1))).toEqual(expectedAction);
  });
  it('returns expected state from uploadAssetFailure', () => {
    const expectedAction = { asset: 'file', response: 'response', type: assetActions.UPLOAD_ASSET_FAILURE };
    expect(store.dispatch(actionCreators.uploadAssetFailure('file', 'response'))).toEqual(expectedAction);
  });
  it('returns expected state from uploadAssetSuccess', () => {
    const expectedAction = { response: 'response', type: assetActions.UPLOAD_ASSET_SUCCESS };
    expect(store.dispatch(actionCreators.uploadAssetSuccess('response'))).toEqual(expectedAction);
  });
  it('returns expected state from uploadingAssets', () => {
    const expectedAction = { count: 99, type: assetActions.UPLOADING_ASSETS };
    expect(store.dispatch(actionCreators.uploadingAssets(99, 'response'))).toEqual(expectedAction);
  });

  it('returns expected state from uploadAssets success', () => {
    const assetsResponse = {
      status: 200,
      body: {
        assets: ['a.txt'],
      },
    };

    fetchMock.mock(`begin:${assetsEndpoint}`, getUploadResponse(true), { method: 'post' });
    fetchMock.mock(`begin:${assetsEndpoint}`, assetsResponse, { method: 'get' });

    const files = ['a.txt', 'b.txt', 'c.txt'];

    const expectedActions = [
      { count: files.length, type: assetActions.UPLOADING_ASSETS },
    ];

    files.forEach((file) => {
      expectedActions.push({ type: assetActions.UPLOAD_ASSET_SUCCESS, response: { asset: file } });
    });

    files.forEach(() => {
      expectedActions.push(
        { type: assetActions.REQUEST_ASSETS_SUCCESS, data: assetsResponse.body },
      );
    });

    // console.log(store.dispatch(actionCreators.uploadAssets(files, courseDetails)).then(() => {
    //   console.log(store.getActions());
    // }));
    // console.log(store.getActions());
    return store.dispatch(actionCreators.uploadAssets(files, courseDetails)).then(() => {
      // return of async actions

      expect(store.getActions()).toEqual(expectedActions);
    });
  });
  it('returns expected state from uploadAssets failure', () => {
    // fetchMock.mock(`begin:${assetsEndpoint}`, response, { query: { body: 'gdfgdf' } });
    // fetchMock..mock(`begin:${assetsEndpoint}`, getResponse, { method: 'post' })
    const assetsResponse = {
      status: 400,
      body: 400,
    };

    fetchMock.mock(`begin:${assetsEndpoint}`, getUploadResponse(false), { method: 'post' });
    // fetchMock.mock(`begin:${assetsEndpoint}`, assetsResponse, { method: 'get' });

    const files = ['a.txt', 'b.txt', 'c.txt'];

    const expectedActions = [
      { count: files.length, type: assetActions.UPLOADING_ASSETS },
    ];

    files.forEach((file) => {
      expectedActions.push(
        { type: assetActions.UPLOAD_ASSET_FAILURE, asset: file, response: assetsResponse.body },
      );
    });

    // console.log(store.dispatch(actionCreators.uploadAssets(files, courseDetails)).then(() => {
    //   console.log(store.getActions());
    // }));
    // console.log(store.getActions());
    return store.dispatch(actionCreators.uploadAssets(files, courseDetails)).then(() => {
      // return of async actions

      expect(store.getActions()).toEqual(expectedActions);
    });
  });
});
