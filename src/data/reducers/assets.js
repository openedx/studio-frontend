import { combineReducers } from 'redux';

import { assetActions } from '../constants/actionTypes';
import { assetLoading } from '../constants/loadingTypes';
import { getDefaultFilterState } from '../../utils/getAssetsFilters';

import { addLoadingField, removeLoadingField, toggleLockAsset } from './utils';
import { getAssetAPIAttributeFromDatabaseAttribute } from '../../utils/getAssetsAttributes';

const defaultAssetTypeFilters = getDefaultFilterState();

export const filtersInitial = {
  assetTypes: { ...defaultAssetTypeFilters },
};

export const paginationInitial = {
  start: 0,
  end: 0,
  page: 0,
  pageSize: 50,
  totalCount: 0,
};

export const sortInitial = {
  sort: 'date_added',
  direction: 'desc',
};

export const searchInitial = {
  search: '',
};

export const requestInitial = {
  ...filtersInitial,
  ...sortInitial,
  ...searchInitial,
  page: paginationInitial.page,
};

export const filters = (state = filtersInitial, action) => {
  let filterTypes = {};

  switch (action.type) {
    case assetActions.request.REQUEST_ASSETS_SUCCESS:
      filterTypes = { ...defaultAssetTypeFilters };
      action.response.assetTypes.forEach((assetType) => { filterTypes[assetType] = true; });
      return { ...state, assetTypes: filterTypes };
    case assetActions.filter.FILTER_UPDATE_FAILURE:
      return { ...state, assetTypes: action.previousState.assetTypes };
    case assetActions.clear.CLEAR_FILTERS_FAILURE:
      return { ...state, assetTypes: action.previousState.assetTypes };
    default:
      return state;
  }
};

export const assets = (state = [], action) => {
  let assetsList;
  switch (action.type) {
    case assetActions.request.REQUEST_ASSETS_SUCCESS:
      return action.response.assets;
    case assetActions.request.REQUEST_ASSETS_FAILURE:
      return action.previousState;
    case assetActions.lock.TOGGLE_LOCK_ASSET_SUCCESS:
      assetsList = removeLoadingField(state, action.asset.id, assetLoading.LOCK);
      return toggleLockAsset(assetsList, action.asset.id);
    case assetActions.lock.TOGGLING_LOCK_ASSET_FAILURE:
      return removeLoadingField(state, action.assetId, assetLoading.LOCK);
    case assetActions.lock.TOGGLING_LOCK_ASSET_SUCCESS:
      return addLoadingField(state, action.asset.id, assetLoading.LOCK);
    case assetActions.delete.DELETE_ASSET_FAILURE:
      return [];
    default:
      return state;
  }
};

export const pagination = (state = paginationInitial, action) => {
  switch (action.type) {
    case assetActions.request.REQUEST_ASSETS_SUCCESS:
      return {
        start: action.response.start,
        end: action.response.end,
        page: action.response.page,
        pageSize: action.response.pageSize,
        totalCount: action.response.totalCount,
      };
    case assetActions.paginate.PAGE_UPDATE_FAILURE:
      return { ...state, ...action.previousState };
    case assetActions.paginate.RESET_PAGE:
      return { ...state, page: -1 };
    default:
      return state;
  }
};

export const sort = (state = sortInitial, action) => {
  switch (action.type) {
    case assetActions.request.REQUEST_ASSETS_SUCCESS:
      return {
        sort: getAssetAPIAttributeFromDatabaseAttribute(action.response.sort),
        direction: action.response.direction,
      };
    case assetActions.sort.SORT_UPDATE_FAILURE:
      return { ...state, ...action.previousState };
    default:
      return state;
  }
};

export const search = (state = searchInitial, action) => {
  switch (action.type) {
    case assetActions.request.REQUEST_ASSETS_SUCCESS:
      return {
        search: action.response.textSearch,
      };
    case assetActions.search.SEARCH_UPDATE_FAILURE:
      return { ...state, ...action.previousState };
    default:
      return state;
  }
};

export const status = (state = {}, action) => {
  switch (action.type) {
    case assetActions.request.REQUEST_ASSETS_SUCCESS:
      return {
        response: action.response,
        type: action.type,
      };
    case assetActions.request.REQUEST_ASSETS_FAILURE:
      return {
        response: action.response,
        type: action.type,
      };
    case assetActions.request.REQUESTING_ASSETS:
      return {
        type: action.type,
      };
    case assetActions.clear.CLEAR_ASSETS_STATUS:
      return {};
    case assetActions.delete.DELETE_ASSET_SUCCESS:
      return {
        response: action.response,
        type: action.type,
      };
    case assetActions.delete.DELETE_ASSET_FAILURE:
      return {
        response: action.response,
        type: action.type,
      };
    case assetActions.lock.TOGGLING_LOCK_ASSET_FAILURE:
      return {
        asset: action.asset,
        response: action.response,
        type: action.type,
      };
    case assetActions.upload.UPLOAD_ASSET_SUCCESS:
      return {
        response: action.response,
        type: action.type,
      };
    case assetActions.upload.UPLOAD_ASSET_FAILURE:
      return {
        asset: action.asset,
        response: action.response,
        type: action.type,
      };
    case assetActions.upload.UPLOAD_EXCEED_MAX_COUNT_ERROR:
      return {
        maxFileCount: action.maxFileCount,
        type: action.type,
      };
    case assetActions.upload.UPLOAD_EXCEED_MAX_SIZE_ERROR:
      return {
        maxFileSizeMB: action.maxFileSizeMB,
        type: action.type,
      };
    case assetActions.upload.UPLOADING_ASSETS:
      return {
        count: action.count,
        type: action.type,
      };
    case assetActions.filter.FILTER_UPDATE_FAILURE:
      return {
        type: action.type,
      };
    case assetActions.sort.SORT_UPDATE_FAILURE:
      return {
        type: action.type,
      };
    case assetActions.paginate.PAGE_UPDATE_FAILURE:
      return {
        type: action.type,
      };
    default:
      return state;
  }
};

export const request = (state = requestInitial, action) => {
  switch (action.type) {
    case assetActions.request.UPDATE_REQUEST:
      return {
        ...state,
        ...action.newRequest,
      };
    default:
      return state;
  }
};

export const metadata = combineReducers({
  filters,
  pagination,
  request,
  sort,
  status,
  search,
});
