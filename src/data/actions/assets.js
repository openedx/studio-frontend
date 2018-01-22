import * as clientApi from '../api/client';
import { assetActions } from '../constants/actionTypes';

const compare = (attributes, obj1, obj2) => (
  attributes.every(attribute => (obj1[attribute] === obj2[attribute]))
);

const isSameResponse = (request, lastRequest) => (
  compare(['page', 'sort', 'direction'], request, lastRequest) &&
  compare(['Audio', 'Code', 'Documents', 'Images', 'OTHER'], request.assetTypes, lastRequest.assetTypes)
);

export const requestAssetsSuccess = response => ({
  type: assetActions.request.REQUEST_ASSETS_SUCCESS,
  data: response,
});

export const requestAssetsFailure = response => ({
  type: assetActions.request.REQUEST_ASSETS_FAILURE,
  data: response,
});

export const getAssets = (request, courseDetails) =>
  (dispatch, getState) =>
    clientApi.requestAssets(courseDetails.id, {
      page: request.page,
      assetTypes: request.assetTypes,
      sort: request.sort,
      direction: request.direction,
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error(response);
      })
      .then((json) => {
        const lastRequest = getState().request;
        if (isSameResponse(request, lastRequest)) {
          dispatch(requestAssetsSuccess(json));
        }
      })
      .catch((error) => {
        dispatch(requestAssetsFailure(error));
      });

export const filterUpdate = (filterKey, filterValue) => ({
  type: assetActions.filter.FILTER_UPDATED,
  data: { [filterKey]: filterValue },
});

export const sortUpdate = (sort, direction) => ({
  type: assetActions.sort.SORT_UPDATE,
  data: { sort, direction },
});

export const pageUpdate = page => ({
  type: assetActions.paginate.PAGE_UPDATE,
  data: { page },
});

export const deleteAssetSuccess = assetId => ({
  type: assetActions.delete.DELETE_ASSET_SUCCESS,
  assetId,
});

export const deleteAssetFailure = assetId => ({
  type: assetActions.delete.DELETE_ASSET_FAILURE,
  assetId,
});

export const deleteAsset = (assetId, courseDetails) =>
  dispatch =>
    clientApi.requestDeleteAsset(courseDetails.id, assetId)
      // since the API returns 204 on success and 404 on failure, neither of which have
      // content, we don't json-ify the response
      .then((response) => {
        if (response.ok) {
          dispatch(deleteAssetSuccess(assetId));
        } else {
          dispatch(deleteAssetFailure(assetId));
        }
      });

export const togglingLockAsset = asset => ({
  type: assetActions.lock.TOGGLING_LOCK_ASSET_SUCCESS,
  asset,
});

export const clearAssetsStatus = () => ({
  type: assetActions.clear.CLEAR_ASSETS_STATUS,
});

export const toggleLockAssetSuccess = asset => ({
  type: assetActions.lock.TOGGLE_LOCK_ASSET_SUCCESS,
  asset,
});

export const toggleLockAssetFailure = (asset, response) => ({
  type: assetActions.lock.TOGGLING_LOCK_ASSET_FAILURE,
  asset,
  response,
});

export const toggleLockAsset = (asset, courseDetails) =>
  (dispatch) => {
    dispatch(togglingLockAsset(asset));
    return clientApi.requestToggleLockAsset(courseDetails.id, asset)
      .then((response) => {
        if (!response.ok) {
          throw new Error(response);
        }
      })
      .then(() => {
        dispatch(toggleLockAssetSuccess(asset));
      })
      .catch((error) => {
        dispatch(toggleLockAssetFailure(asset, error));
      });
  };

export const uploadingAssets = count => ({
  type: assetActions.upload.UPLOADING_ASSETS,
  count,
});

export const uploadAssetSuccess = response => ({
  type: assetActions.upload.UPLOAD_ASSET_SUCCESS,
  response,
});

export const uploadAssetFailure = (asset, response) => ({
  type: assetActions.upload.UPLOAD_ASSET_FAILURE,
  asset,
  response,
});

export const uploadAssets = (assets, courseDetails) =>
  (dispatch, getState) => {
    dispatch(uploadingAssets(assets.length));
    // gather all the promises into a single promise that can be returned
    return Promise.all(assets.map(asset => (
      clientApi.postUploadAsset(courseDetails.id, asset)
        .then((response) => {
          if (response.ok) {
            return response.json().then((json) => {
              dispatch(uploadAssetSuccess(json));
              // dispatch(getAssets(..)) returns a promise, so we return it
              // up to chain it
              return dispatch(getAssets(getState().request, courseDetails));
            });
          }
          dispatch(uploadAssetFailure(asset, response.status));
          return undefined;
        })
    )));
  };

export const uploadExceedMaxCount = maxFileCount => ({
  type: assetActions.upload.UPLOAD_EXCEED_MAX_COUNT_ERROR,
  maxFileCount,
});

export const uploadExceedMaxSize = maxFileSizeMB => ({
  type: assetActions.upload.UPLOAD_EXCEED_MAX_SIZE_ERROR,
  maxFileSizeMB,
});
