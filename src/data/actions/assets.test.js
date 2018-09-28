// eslint-disable-next-line import/no-extraneous-dependencies
import configureStore from 'redux-mock-store';
// eslint-disable-next-line import/no-extraneous-dependencies
import fetchMock from 'fetch-mock';
import thunk from 'redux-thunk';

import deepCopy from './utils';
import endpoints from '../api/endpoints';
import { assetActions } from '../../data/constants/actionTypes';
import { deletionInitial, filtersInitial, paginationInitial, sortInitial, searchInitial, requestInitial } from '../reducers/assets';
import { testAssetsList, courseDetails } from '../../utils/testConstants';
import * as actionCreators from './assets';


const initialState = {
  assets: [],
  metadata: {
    filters: { ...filtersInitial },
    pagination: { ...paginationInitial },
    request: { ...requestInitial },
    sort: { ...sortInitial },
    search: { ...searchInitial },
    deletion: { ...deletionInitial },
  },
};

const assetsEndpoint = endpoints.assets;
const middlewares = [thunk];
const mockStore = configureStore(middlewares);
let store;

const getMockStoreWithNewRequestState = (request) => {
  const newRequestState = {
    ...deepCopy(requestInitial),
    ...request,
  };

  const newStateWithRequest = {
    ...deepCopy(initialState),
  };
  newStateWithRequest.metadata.request = newRequestState;

  return mockStore(newStateWithRequest);
};

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
    const expectedAction = { response: 'response', type: assetActions.request.REQUEST_ASSETS_SUCCESS };
    expect(store.dispatch(actionCreators.requestAssetsSuccess('response'))).toEqual(expectedAction);
  });

  it('returns expected state from assetDeleteFailure', () => {
    const asset = testAssetsList[0];
    const expectedAction = { asset, type: assetActions.delete.DELETE_ASSET_FAILURE };
    expect(store.dispatch(actionCreators.deleteAssetFailure(asset))).toEqual(expectedAction);
  });

  it('returns expected state from getAssets success', () => {
    const requestParameters = {};
    const response = {
      body: {
        success: 'Success',
        ...initialState,
      },
    };

    fetchMock.once(`begin:${assetsEndpoint}`, response);
    const expectedActions = [
      { type: assetActions.request.REQUESTING_ASSETS },
      { type: assetActions.request.UPDATE_REQUEST, newRequest: requestInitial },
      { type: assetActions.request.REQUEST_ASSETS_SUCCESS, response: response.body },
    ];
    return store.dispatch(actionCreators.getAssets(requestParameters, courseDetails)).then(() => {
      // return of async actions
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('returns expected state from getAssets failure', () => {
    const requestParameters = {};
    const response = {
      status: 400,
      body: {
        failure: 'Failure',
        ...initialState,
      },
    };

    const errorResponse = new Error(response);

    fetchMock.once(`begin:${assetsEndpoint}`, response);
    const expectedActions = [
      { type: assetActions.request.REQUESTING_ASSETS },
      { type: assetActions.request.UPDATE_REQUEST, newRequest: requestInitial },
      { type: assetActions.request.REQUEST_ASSETS_FAILURE,
        previousState: initialState.assets,
        response: errorResponse },
    ];

    store = mockStore(initialState);
    return store.dispatch(actionCreators.getAssets(requestParameters, courseDetails)).then(() => {
      // return of async actions
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('returns expected state from getAssets success when not last made request', () => {
    const requestParameters = {
      page: 10,
    };

    const newRequest = {
      ...requestInitial,
      ...requestParameters,
    };

    const response = {
      body: {
        success: 'Success',
        ...initialState,
      },
    };

    fetchMock.once(`begin:${assetsEndpoint}`, response);
    const expectedActions = [
      { type: assetActions.request.REQUESTING_ASSETS },
      { type: assetActions.request.UPDATE_REQUEST, newRequest },
    ];
    return store.dispatch(actionCreators.getAssets(requestParameters, courseDetails)).then(() => {
      // return of async actions
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('returns expected state from getAssets failure when not last made request', () => {
    const requestParameters = {
      page: 10,
    };

    const newRequest = {
      ...requestInitial,
      ...requestParameters,
    };

    const response = {
      status: 400,
      body: {
        failure: 'Failure',
        ...initialState,
      },
    };

    fetchMock.once(`begin:${assetsEndpoint}`, response);
    const expectedActions = [
      { type: assetActions.request.REQUESTING_ASSETS },
      { type: assetActions.request.UPDATE_REQUEST, newRequest },
    ];
    return store.dispatch(actionCreators.getAssets(requestParameters, courseDetails)).then(() => {
      // return of async actions
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('returns expected state from filterUpdate success', () => {
    const filterParameter = 'Images';

    const newRequest = {
      ...deepCopy(filtersInitial),
      page: 0,
    };
    newRequest.assetTypes[filterParameter] = true;

    store = getMockStoreWithNewRequestState(newRequest);

    const response = {
      body: {
        assetTypes: filterParameter,
      },
    };

    fetchMock.once(`begin:${assetsEndpoint}`, response);
    const expectedActions = [
      { type: assetActions.request.REQUESTING_ASSETS },
      { type: assetActions.request.UPDATE_REQUEST,
        newRequest: { ...requestInitial, ...newRequest } },
      { type: assetActions.request.REQUEST_ASSETS_SUCCESS, response: response.body },
    ];

    return store.dispatch(actionCreators.filterUpdate(filterParameter, true, courseDetails))
      .then(() => {
        // return of async actions
        expect(store.getActions()).toEqual(expectedActions);
      });
  });

  it('returns expected state from filterUpdate failure', () => {
    const filterParameter = 'Images';

    const newRequest = {
      ...deepCopy(filtersInitial),
      page: 0,
    };
    newRequest.assetTypes[filterParameter] = true;

    store = getMockStoreWithNewRequestState(newRequest);

    const response = {
      status: 400,
      body: {
        failure: 'Failure',
      },
    };
    const errorResponse = new Error(response);

    fetchMock.once(`begin:${assetsEndpoint}`, response);
    const expectedActions = [
      { type: assetActions.request.REQUESTING_ASSETS },
      { type: assetActions.request.UPDATE_REQUEST,
        newRequest: { ...requestInitial, ...newRequest } },
      { type: assetActions.request.REQUEST_ASSETS_FAILURE,
        previousState: initialState.assets,
        response: errorResponse },
      { type: assetActions.filter.FILTER_UPDATE_FAILURE,
        previousState: { assetTypes: initialState.metadata.filters.assetTypes } },
    ];

    return store.dispatch(actionCreators.filterUpdate(filterParameter, true, courseDetails))
      .then(() => {
        // return of async actions
        expect(store.getActions()).toEqual(expectedActions);
      });
  });

  it('returns expected state from clearFilters success', () => {
    const newRequest = {
      ...filtersInitial,
      ...searchInitial,
      page: 0,
    };

    const response = {
      body: {
        ...initialState.metadata.filters,
        ...initialState.metadata.search,
      },
    };

    fetchMock.once(`begin:${assetsEndpoint}`, response);
    const expectedActions = [
      { type: assetActions.request.REQUESTING_ASSETS },
      { type: assetActions.request.UPDATE_REQUEST,
        newRequest: { ...requestInitial, ...newRequest } },
      { type: assetActions.request.REQUEST_ASSETS_SUCCESS, response: response.body },
    ];

    return store.dispatch(actionCreators.clearFilters(courseDetails)).then(() => {
      // return of async actions
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('returns expected state from clearFilters failure', () => {
    const response = {
      status: 400,
      body: {
        failure: 'Failure',
      },
    };

    const errorResponse = new Error(response);

    const newRequest = {
      ...initialState.metadata.filters,
      ...initialState.metadata.search,
      page: 0,
    };

    fetchMock.once(`begin:${assetsEndpoint}`, response);
    const expectedActions = [
      { type: assetActions.request.REQUESTING_ASSETS },
      { type: assetActions.request.UPDATE_REQUEST,
        newRequest: { ...requestInitial, ...newRequest } },
      { type: assetActions.request.REQUEST_ASSETS_FAILURE,
        previousState: initialState.assets,
        response: errorResponse },
      { type: assetActions.clear.CLEAR_FILTERS_FAILURE,
        previousState: { assetTypes: initialState.metadata.filters.assetTypes } },
    ];

    return store.dispatch(actionCreators.clearFilters(courseDetails)).then(() => {
      // return of async actions
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('returns expected state from sortUpdate success', () => {
    const sortParameters = { sort: 'edX', direction: 'desc' };

    const newRequest = {
      ...sortInitial,
      ...sortParameters,
    };

    store = getMockStoreWithNewRequestState(newRequest);

    const response = {
      body: {
        ...sortParameters,
      },
    };

    fetchMock.once(`begin:${assetsEndpoint}`, response);
    const expectedActions = [
      { type: assetActions.request.REQUESTING_ASSETS },
      { type: assetActions.request.UPDATE_REQUEST,
        newRequest: { ...requestInitial, ...newRequest } },
      { type: assetActions.request.REQUEST_ASSETS_SUCCESS, response: response.body },
    ];

    return store.dispatch(actionCreators
      .sortUpdate(sortParameters.sort, sortParameters.direction, courseDetails)).then(() => {
      // return of async actions
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('returns expected state from sortUpdate failure', () => {
    const sortParameters = { sort: 'edX', direction: 'desc' };

    const newRequest = {
      ...sortInitial,
      ...sortParameters,
    };

    store = getMockStoreWithNewRequestState(newRequest);

    const response = {
      status: 400,
      body: {
        failure: 'Failure',
      },
    };

    const errorResponse = new Error(response);

    fetchMock.once(`begin:${assetsEndpoint}`, response);
    const expectedActions = [
      { type: assetActions.request.REQUESTING_ASSETS },
      { type: assetActions.request.UPDATE_REQUEST,
        newRequest: { ...requestInitial, ...newRequest } },
      { type: assetActions.request.REQUEST_ASSETS_FAILURE,
        previousState: initialState.assets,
        response: errorResponse },
      { type: assetActions.sort.SORT_UPDATE_FAILURE,
        previousState: { ...initialState.metadata.sort } },
    ];

    return store.dispatch(actionCreators.sortUpdate('edX', 'desc', courseDetails)).then(() => {
      // return of async actions
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('returns expected state from searchUpdate success', () => {
    const searchParameters = { search: 'edX' };

    const newRequest = {
      ...searchInitial,
      ...searchParameters,
    };

    store = getMockStoreWithNewRequestState(newRequest);

    const response = {
      body: {
        ...searchParameters,
      },
    };

    fetchMock.once(`begin:${assetsEndpoint}`, response);
    const expectedActions = [
      { type: assetActions.request.REQUESTING_ASSETS },
      { type: assetActions.request.UPDATE_REQUEST,
        newRequest: { ...requestInitial, ...newRequest } },
      { type: assetActions.request.REQUEST_ASSETS_SUCCESS, response: response.body },
    ];

    return store.dispatch(actionCreators
      .searchUpdate(searchParameters.search, courseDetails)).then(() => {
      // return of async actions
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('returns expected state from searchUpdate failure', () => {
    const searchParameters = { search: 'edX' };

    const newRequest = {
      ...searchInitial,
      ...searchParameters,
    };

    store = getMockStoreWithNewRequestState(newRequest);

    const response = {
      status: 400,
      body: {
        failure: 'Failure',
      },
    };

    const errorResponse = new Error(response);

    fetchMock.once(`begin:${assetsEndpoint}`, response);
    const expectedActions = [
      { type: assetActions.request.REQUESTING_ASSETS },
      { type: assetActions.request.UPDATE_REQUEST,
        newRequest: { ...requestInitial, ...newRequest } },
      { type: assetActions.request.REQUEST_ASSETS_FAILURE,
        previousState: initialState.assets,
        response: errorResponse },
      { type: assetActions.search.SEARCH_UPDATE_FAILURE,
        previousState: { ...initialState.metadata.search } },
    ];

    return store.dispatch(actionCreators.searchUpdate('edX', courseDetails)).then(() => {
      // return of async actions
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('returns expected state from pageUpdate success', () => {
    const paginationParameters = { page: 10 };

    const newRequest = {
      ...paginationParameters,
    };

    store = getMockStoreWithNewRequestState(newRequest);

    const response = {
      body: {
        ...paginationParameters,
      },
    };

    fetchMock.once(`begin:${assetsEndpoint}`, response);
    const expectedActions = [
      { type: assetActions.request.REQUESTING_ASSETS },
      { type: assetActions.request.UPDATE_REQUEST,
        newRequest: { ...requestInitial, ...newRequest } },
      { type: assetActions.request.REQUEST_ASSETS_SUCCESS, response: response.body },
    ];

    return store.dispatch(actionCreators.pageUpdate(paginationParameters.page, courseDetails))
      .then(() => {
        // return of async actions
        expect(store.getActions()).toEqual(expectedActions);
      });
  });

  it('returns expected state from pageUpdate failure', () => {
    const paginationParameters = { page: 10 };

    const newRequest = {
      ...paginationParameters,
    };

    store = getMockStoreWithNewRequestState(newRequest);

    const response = {
      status: 400,
      body: {
        failure: 'Failure',
      },
    };

    const errorResponse = new Error(response);

    fetchMock.once(`begin:${assetsEndpoint}`, response);
    const expectedActions = [
      { type: assetActions.request.REQUESTING_ASSETS },
      { type: assetActions.request.UPDATE_REQUEST,
        newRequest: { ...requestInitial, ...newRequest } },
      { type: assetActions.request.REQUEST_ASSETS_FAILURE,
        previousState: initialState.assets,
        response: errorResponse },
      { type: assetActions.paginate.PAGE_UPDATE_FAILURE,
        previousState: { ...initialState.metadata.pagination } },
    ];

    return store.dispatch(actionCreators.pageUpdate(10, courseDetails)).then(() => {
      // return of async actions
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('returns expected state from deleteAsset success', () => {
    const response = {
      status: 204,
      body: {},
    };

    const asset = testAssetsList[0];

    fetchMock.deleteOnce(`begin:${assetsEndpoint}`, {});
    fetchMock.getOnce(`begin:${assetsEndpoint}`, response);

    const expectedActions = [
      { type: assetActions.request.REQUESTING_ASSETS },
      { type: assetActions.request.UPDATE_REQUEST, newRequest: requestInitial },
      { type: assetActions.request.REQUEST_ASSETS_SUCCESS, response: response.body },
      { type: assetActions.delete.DELETE_ASSET_SUCCESS, asset },
    ];

    return store.dispatch(actionCreators.deleteAsset(asset, courseDetails)).then(() => {
      // return of async actions
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('returns expected state from deleteAsset failure', () => {
    const response = {
      status: 400,
    };

    const asset = testAssetsList[0];

    fetchMock.once(`begin:${assetsEndpoint}`, response);

    const expectedActions = [
      { type: assetActions.delete.DELETE_ASSET_FAILURE, asset },
    ];

    return store.dispatch(actionCreators.deleteAsset(asset, courseDetails)).then(() => {
      // return of async actions
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('returns expected state from stageAssetDeletion', () => {
    const index = 0;
    const asset = testAssetsList[index];
    const expectedAction = { type: assetActions.delete.STAGE_ASSET_DELETION, asset, index };
    expect(store.dispatch(actionCreators.stageAssetDeletion(asset, index))).toEqual(expectedAction);
  });

  it('returns expected state from unstageAssetDeletion', () => {
    const expectedAction = { type: assetActions.delete.UNSTAGE_ASSET_DELETION };
    expect(store.dispatch(actionCreators.unstageAssetDeletion())).toEqual(expectedAction);
  });

  it('returns expected state from clearAssetsStatus', () => {
    const expectedAction = { type: assetActions.clear.CLEAR_ASSETS_STATUS };
    expect(store.dispatch(actionCreators.clearAssetsStatus())).toEqual(expectedAction);
  });

  it('returns expected state from toggleLockAsset success', () => {
    const response = {
      status: 200,
    };

    const asset = testAssetsList[0];

    fetchMock.once(`begin:${assetsEndpoint}`, response);

    const expectedActions = [
      { type: assetActions.lock.TOGGLING_LOCK_ASSET_SUCCESS, asset: asset.id },
      { type: assetActions.lock.TOGGLE_LOCK_ASSET_SUCCESS, asset: asset.id },
    ];

    return store.dispatch(actionCreators.toggleLockAsset(asset.id, courseDetails)).then(() => {
      // return of async actions
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('returns expected state from toggleLockAsset failure', () => {
    const response = {
      status: 400,
    };

    const error = new Error(response);
    const asset = testAssetsList[0];

    fetchMock.once(`begin:${assetsEndpoint}`, response);

    const expectedActions = [
      { type: assetActions.lock.TOGGLING_LOCK_ASSET_SUCCESS, asset: asset.id },
      { type: assetActions.lock.TOGGLING_LOCK_ASSET_FAILURE, asset: asset.id, response: error },
    ];

    return store.dispatch(actionCreators.toggleLockAsset(asset.id, courseDetails)).then(() => {
      // return of async actions
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('returns expected state from togglingLockAsset', () => {
    const expectedAction = { asset: 'asset', type: assetActions.lock.TOGGLING_LOCK_ASSET_SUCCESS };
    expect(store.dispatch(actionCreators.togglingLockAsset('asset'))).toEqual(expectedAction);
  });

  it('returns expected state from toggleLockAssetSuccess', () => {
    const expectedAction = { asset: 'asset', type: assetActions.lock.TOGGLE_LOCK_ASSET_SUCCESS };
    expect(store.dispatch(actionCreators.toggleLockAssetSuccess('asset'))).toEqual(expectedAction);
  });

  it('returns expected state from toggleLockAssetFailure', () => {
    const expectedAction = { asset: 'asset', response: 'response', type: assetActions.lock.TOGGLING_LOCK_ASSET_FAILURE };
    expect(store.dispatch(actionCreators.toggleLockAssetFailure('asset', 'response'))).toEqual(expectedAction);
  });

  it('returns expected state from uploadExceedMaxSize', () => {
    const expectedAction = {
      maxFileSizeMB: 23,
      type: assetActions.upload.UPLOAD_EXCEED_MAX_SIZE_ERROR,
    };
    expect(store.dispatch(actionCreators.uploadExceedMaxSize(23))).toEqual(expectedAction);
  });

  it('returns expected state from uploadExceedMaxCount', () => {
    const expectedAction = {
      maxFileCount: 1,
      type: assetActions.upload.UPLOAD_EXCEED_MAX_COUNT_ERROR,
    };
    expect(store.dispatch(actionCreators.uploadExceedMaxCount(1))).toEqual(expectedAction);
  });

  it('returns expected state from uploadInvalidFileType', () => {
    const expectedAction = {
      type: assetActions.upload.UPLOAD_INVALID_FILE_TYPE_ERROR,
    };
    expect(store.dispatch(actionCreators.uploadInvalidFileType())).toEqual(expectedAction);
  });

  it('returns expected state from uploadAssetFailure', () => {
    const expectedAction = { asset: 'asset', response: 'response', type: assetActions.upload.UPLOAD_ASSET_FAILURE };
    expect(store.dispatch(actionCreators.uploadAssetFailure('asset', 'response'))).toEqual(expectedAction);
  });

  it('returns expected state from uploadAssetSuccess', () => {
    const expectedAction = { response: 'response', type: assetActions.upload.UPLOAD_ASSET_SUCCESS };
    expect(store.dispatch(actionCreators.uploadAssetSuccess('response'))).toEqual(expectedAction);
  });

  it('returns expected state from uploadingAssets', () => {
    const expectedAction = { count: 99, type: assetActions.upload.UPLOADING_ASSETS };
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

    const assets = ['a.txt', 'b.txt', 'c.txt'];

    const expectedActions = [
      { count: assets.length, type: assetActions.upload.UPLOADING_ASSETS },
    ];

    assets.forEach((asset) => {
      expectedActions.push({ type: assetActions.upload.UPLOAD_ASSET_SUCCESS, response: { asset } });
      expectedActions.push({ type: assetActions.request.REQUESTING_ASSETS });
      expectedActions.push({ type: assetActions.request.UPDATE_REQUEST,
        newRequest: requestInitial });
    });

    assets.forEach(() => {
      expectedActions.push(
        { type: assetActions.request.REQUEST_ASSETS_SUCCESS, response: assetsResponse.body },
      );
    });

    return store.dispatch(actionCreators.uploadAssets(assets, courseDetails)).then(() => {
      // return of async actions
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('returns expected state from uploadAssets failure', () => {
    const assetsResponse = {
      status: 400,
      body: 400,
    };

    fetchMock.mock(`begin:${assetsEndpoint}`, getUploadResponse(false), { method: 'post' });

    const assets = ['a.txt', 'b.txt', 'c.txt'];

    const expectedActions = [
      { count: assets.length, type: assetActions.upload.UPLOADING_ASSETS },
    ];

    assets.forEach((asset) => {
      expectedActions.push(
        { type: assetActions.upload.UPLOAD_ASSET_FAILURE, asset, response: assetsResponse.body },
      );
    });

    return store.dispatch(actionCreators.uploadAssets(assets, courseDetails)).then(() => {
      // return of async actions
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('returns expected state from selectAsset', () => {
    const expectedAction = { asset: 'asset', type: assetActions.select.SELECT_ASSET };
    expect(store.dispatch(actionCreators.selectAsset('asset'))).toEqual(expectedAction);
  });

  it('returns expected state from clearSelectedAsset', () => {
    const expectedAction = { type: assetActions.select.CLEAR_SELECTED_ASSET };
    expect(store.dispatch(actionCreators.clearSelectedAsset('asset'))).toEqual(expectedAction);
  });
});
