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
  type: assetActions.REQUEST_ASSETS_SUCCESS,
  data: response,
});

export const assetDeleteFailure = response => ({
  type: assetActions.DELETE_ASSET_FAILURE,
  response,
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
        dispatch(assetDeleteFailure(error));
      });

export const filterUpdate = (filterKey, filterValue) => ({
  type: assetActions.FILTER_UPDATED,
  data: { [filterKey]: filterValue },
});

export const sortUpdate = (sort, direction) => ({
  type: assetActions.SORT_UPDATE,
  data: { sort, direction },
});

export const pageUpdate = page => ({
  type: assetActions.PAGE_UPDATE,
  data: { page },
});

export const deleteAssetSuccess = (assetId, response) => ({
  type: assetActions.DELETE_ASSET_SUCCESS,
  assetId,
  response,
});

export const deleteAsset = (assetId, courseDetails) =>
  dispatch =>
    clientApi.requestDeleteAsset(courseDetails.id, assetId)
      .then((response) => {
        if (response.ok) {
          dispatch(deleteAssetSuccess(assetId, response));
        } else {
          dispatch(assetDeleteFailure(response));
        }
      });

export const togglingLockAsset = asset => ({
  type: assetActions.TOGGLING_LOCK_ASSET_SUCCESS,
  asset,
});

export const toggleLockAssetSuccess = asset => ({
  type: assetActions.TOGGLE_LOCK_ASSET_SUCCESS,
  asset,
});

export const toggleLockAssetFailure = (asset, response) => ({
  type: assetActions.TOGGLING_LOCK_ASSET_FAILURE,
  asset,
  response,
});

export const toggleLockAsset = (asset, courseDetails) =>
  (dispatch) => {
    dispatch(togglingLockAsset(asset));
    clientApi.requestToggleLockAsset(courseDetails.id, asset)
      .then((response) => {
        if (response.ok) {
          dispatch(toggleLockAssetSuccess(asset));
        } else {
          dispatch(toggleLockAssetFailure(asset, response));
        }
      });
  };

export const clearAssetsStatus = () =>
  dispatch =>
    dispatch({ type: assetActions.CLEAR_ASSETS_STATUS });

export const uploadingAssets = count => ({
  type: assetActions.UPLOADING_ASSETS,
  count,
});

export const uploadAssetSuccess = (asset, response) => ({
  type: assetActions.UPLOAD_ASSET_SUCCESS,
  asset,
  response,
});

export const uploadAssetFailure = (file, response) => ({
  type: assetActions.UPLOAD_ASSET_FAILURE,
  file,
  response,
});

export const uploadAssets = (files, courseDetails) =>
  (dispatch, getState) => {
    dispatch(uploadingAssets(files.length));
    files.forEach((file) => {
      clientApi.postUploadAsset(courseDetails.id, file)
        .then((response) => {
          if (response.ok) {
            response.json().then((data) => {
              dispatch(uploadAssetSuccess(data.asset, response));
              dispatch(getAssets(getState().request, courseDetails));
            });
          } else {
            dispatch(uploadAssetFailure(file, response));
          }
        });
    });
  };

export const uploadExceedMaxCount = maxFileCount =>
  dispatch =>
    dispatch({
      type: assetActions.UPLOAD_EXCEED_MAX_COUNT_ERROR,
      maxFileCount,
    });

export const uploadExceedMaxSize = maxFileSizeMB =>
  dispatch =>
    dispatch({
      type: assetActions.UPLOAD_EXCEED_MAX_SIZE_ERROR,
      maxFileSizeMB,
    });
