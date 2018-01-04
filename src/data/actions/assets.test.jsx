import configureStore from 'redux-mock-store';
import fetchMock from 'fetch-mock';
import thunk from 'redux-thunk';

import endpoints from '../api/endpoints';
import * as actionCreators from './assets';
import { assetActions } from '../../data/constants/actionTypes';

const initialState = {
  request: {
    assetTypes: {},
    start: 0,
    end: 0,
    page: 0,
    pageSize: 50,
    totalCount: 0,
    sort: 'date_added',
    direction: 'desc',
  },
};

const assetsEndpoint = endpoints.assets;
const middlewares = [thunk];
const mockStore = configureStore(middlewares);
let store;

describe('Assets Action Creator', () => {
  beforeEach(() => {
    store = mockStore(initialState);
  });

  it('returns expected state from requestAssetsSuccess', () => {
    const expectedAction = { data: 'response', type: assetActions.REQUEST_ASSETS_SUCCESS };
    expect(store.dispatch(actionCreators.requestAssetsSuccess('response'))).toEqual(expectedAction);
  });
  it('returns expected state from assetDeleteFailure', () => {
    const expectedAction = { response: 'response', type: assetActions.DELETE_ASSET_FAILURE };
    expect(store.dispatch(actionCreators.assetDeleteFailure('response'))).toEqual(expectedAction);
  });
  it('returns expected state from getAssets success', () => {
    const request = {
      page: 0,
      assetTypes: {},
      sort: 'date_added',
      direction: 'desc',
    };

    const response = request;

    const courseDetails = {
      id: 'edX',
    };

    fetchMock.once(`begin:${assetsEndpoint}`, response);
    const expectedActions = [
      { type: assetActions.REQUEST_ASSETS_SUCCESS, data: response },
    ];

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
  it('returns expected state from deleteAssetSuccess', () => {
    const expectedAction = { assetId: 'assetId', response: 'response', type: assetActions.DELETE_ASSET_SUCCESS };
    expect(store.dispatch(actionCreators.deleteAssetSuccess('assetId', 'response'))).toEqual(expectedAction);
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
    const expectedAction = { file: 'file', response: 'response', type: assetActions.UPLOAD_ASSET_FAILURE };
    expect(store.dispatch(actionCreators.uploadAssetFailure('file', 'response'))).toEqual(expectedAction);
  });
  it('returns expected state from uploadAssetSuccess', () => {
    const expectedAction = { asset: 'asset', response: 'response', type: assetActions.UPLOAD_ASSET_SUCCESS };
    expect(store.dispatch(actionCreators.uploadAssetSuccess('asset', 'response'))).toEqual(expectedAction);
  });
  it('returns expected state from uploadingAssets', () => {
    const expectedAction = { count: 99, type: assetActions.UPLOADING_ASSETS };
    expect(store.dispatch(actionCreators.uploadingAssets(99, 'response'))).toEqual(expectedAction);
  });
});
