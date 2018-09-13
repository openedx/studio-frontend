import * as clientApi from '../api/client';
import { assetActions } from '../constants/actionTypes';
import { getDefaultFilterState } from '../../utils/getAssetsFilters';
import { searchInitial } from '../reducers/assets';
import deepCopy from './utils';

const compare = (attributes, obj1, obj2) => (
  attributes.every(attribute => (obj1[attribute] === obj2[attribute]))
);

const compareRequestToResponse = (request1, request2) => (
  compare(['page', 'sort', 'direction'], request1, request2) &&
  compare(['Audio', 'Code', 'Documents', 'Images', 'OTHER'], request1.assetTypes, request2.assetTypes)
);

const isLastRequestMade = (requestMade, lastRequest) => (
  compareRequestToResponse(requestMade, lastRequest)
);

const requestFailed = responseAction => (
  responseAction && 'type' in responseAction && responseAction.type === assetActions.request.REQUEST_ASSETS_FAILURE
);

export const updateRequest = newRequest => ({
  type: assetActions.request.UPDATE_REQUEST,
  newRequest,
});

export const requestAssetsSuccess = response => ({
  type: assetActions.request.REQUEST_ASSETS_SUCCESS,
  response,
});

export const requestAssetsFailure = (response, previousAssetsState) => ({
  type: assetActions.request.REQUEST_ASSETS_FAILURE,
  response,
  previousState: previousAssetsState,
});

export const requestingAssets = () => ({
  type: assetActions.request.REQUESTING_ASSETS,
});

export const getAssets = (parameters, courseDetails) =>
  (dispatch, getState) => {
    dispatch(requestingAssets());

    const state = getState();

    const requestParameters = {
      page: state.metadata.pagination.page,
      pageSize: state.metadata.pagination.pageSize,
      assetTypes: state.metadata.filters.assetTypes,
      sort: state.metadata.sort.sort,
      direction: state.metadata.sort.direction,
      search: state.metadata.search.search,
      ...parameters,
    };

    dispatch(updateRequest(requestParameters));
    return clientApi.requestAssets(courseDetails.id, { ...requestParameters })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error(response);
      })
      .then((json) => {
        if (isLastRequestMade(getState().metadata.request, requestParameters)) {
          return dispatch(requestAssetsSuccess(json));
        }
        return Promise.resolve();
      })
      .catch((error) => {
        if (isLastRequestMade(getState().metadata.request, requestParameters)) {
          return dispatch(requestAssetsFailure(error, state.assets));
        }
        return Promise.resolve();
      });
  };

export const filterUpdateFailure = previousFilterState => ({
  type: assetActions.filter.FILTER_UPDATE_FAILURE,
  previousState: {
    assetTypes: previousFilterState,
  },
});

export const filterUpdate = (filterKey, filterValue, courseDetails) =>
  (dispatch, getState) => {
    const currentFilterState = getState().metadata.filters.assetTypes;

    // because filter state is not binary, we have to add on to the request and
    // not rely on the page metadata for constructing the request
    const currentFilterParameters = deepCopy(getState().metadata.request.assetTypes);
    currentFilterParameters[filterKey] = filterValue;

    const parameters = {
      assetTypes: currentFilterParameters,
      page: 0,
    };

    return dispatch(getAssets(parameters, courseDetails)).then((responseAction) => {
      if (requestFailed(responseAction)) {
        dispatch(filterUpdateFailure(currentFilterState));
      }
    });
  };

export const clearFiltersFailure = previousFilterState => ({
  type: assetActions.clear.CLEAR_FILTERS_FAILURE,
  previousState: {
    assetTypes: previousFilterState,
  },
});

export const clearFilters = courseDetails =>
  (dispatch, getState) => {
    const currentFilterState = getState().metadata.filters.assetTypes;

    const defaultFilterParameters = getDefaultFilterState();
    const parameters = {
      assetTypes: defaultFilterParameters,
      page: 0,
      search: searchInitial.search,
    };

    return dispatch(getAssets(parameters, courseDetails)).then((responseAction) => {
      if (requestFailed(responseAction)) {
        dispatch(clearFiltersFailure(currentFilterState));
      }
    });
  };

export const sortUpdateFailure = previousSortState => ({
  type: assetActions.sort.SORT_UPDATE_FAILURE,
  previousState: { ...previousSortState },
});

export const sortUpdate = (sort, direction, courseDetails) =>
  (dispatch, getState) => {
    const currentSortState = getState().metadata.sort;

    const parameters = {
      sort,
      direction,
    };

    return dispatch(getAssets(parameters, courseDetails)).then((responseAction) => {
      if (requestFailed(responseAction)) {
        dispatch(sortUpdateFailure(currentSortState));
      }
    });
  };

export const searchUpdateFailure = previousSearchState => ({
  type: assetActions.search.SEARCH_UPDATE_FAILURE,
  previousState: { ...previousSearchState },
});

export const searchUpdate = (search, courseDetails) =>
  (dispatch, getState) => {
    const currentSearchState = getState().metadata.search;

    return dispatch(getAssets({ search }, courseDetails)).then((responseAction) => {
      if (requestFailed(responseAction)) {
        dispatch(searchUpdateFailure(currentSearchState));
      }
    });
  };

export const pageUpdateFailure = previousPageState => ({
  type: assetActions.paginate.PAGE_UPDATE_FAILURE,
  previousState: { ...previousPageState },
});

export const pageUpdate = (page, courseDetails) =>
  (dispatch, getState) => {
    const currentPageState = getState().metadata.pagination;

    const parameters = {
      page,
    };

    return dispatch(getAssets(parameters, courseDetails)).then((responseAction) => {
      if (requestFailed(responseAction)) {
        dispatch(pageUpdateFailure(currentPageState));
      }
    });
  };

export const clearAssetDeletion = () => ({
  type: assetActions.delete.CLEAR_DELETE,
});

export const deleteAssetSuccess = asset => ({
  type: assetActions.delete.DELETE_ASSET_SUCCESS,
  asset,
});

export const deleteAssetFailure = asset => ({
  type: assetActions.delete.DELETE_ASSET_FAILURE,
  asset,
});

export const stageAssetDeletion = (asset, index) => ({
  type: assetActions.delete.STAGE_ASSET_DELETION,
  asset,
  index,
});

export const unstageAssetDeletion = () => ({
  type: assetActions.delete.UNSTAGE_ASSET_DELETION,
});

export const deleteAsset = (asset, courseDetails) =>
  dispatch =>
    clientApi.requestDeleteAsset(courseDetails.id, asset.id)
      // since the API returns 204 on success and 404 on failure, neither of which have
      // content, we don't json-ify the response
      .then((response) => {
        if (response.ok) {
          return dispatch(getAssets({}, courseDetails)).then(() => (
            dispatch(deleteAssetSuccess(asset))
          ));
        }
        return dispatch(deleteAssetFailure(asset));
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
  (dispatch) => {
    dispatch(uploadingAssets(assets.length));
    // gather all the promises into a single promise that can be returned
    return Promise.all(assets.map(asset => (
      clientApi.postUploadAsset(courseDetails.id, asset)
        .then((response) => {
          if (response.ok) {
            return response.json().then((json) => {
              dispatch(uploadAssetSuccess(json));
              // dispatch(getAssets(..)) returns a promise, so we return it
              return dispatch(getAssets({}, courseDetails));
            });
          }
          dispatch(uploadAssetFailure(asset, response.status));
          return Promise.resolve();
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

export const uploadInvalidFileType = () => ({
  type: assetActions.upload.UPLOAD_INVALID_FILE_TYPE_ERROR,
});

export const updateImagePreview = enabled => ({
  type: assetActions.imagePreview.IMAGE_PREVIEW_UPDATE,
  enabled,
});

export const selectAsset = asset => ({
  type: assetActions.select.SELECT_ASSET,
  asset,
});

export const clearSelectedAsset = () => ({
  type: assetActions.select.CLEAR_SELECTED_ASSET,
});
