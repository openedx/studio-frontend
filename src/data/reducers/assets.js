import { combineReducers } from 'redux';

import { assetActions } from '../constants/actionTypes';
import { assetLoading } from '../constants/loadingTypes';

import { addLoadingField, removeLoadingField, toggleLockAsset } from './utils';

const initialState = {
  page: 0,
  pageSize: 50,
  assetTypes: {},
  sort: 'date_added',
  direction: 'desc',
};

const list = (state = [], action) => {
  let assets;
  switch (action.type) {
    case assetActions.REQUEST_ASSETS_SUCCESS:
      return action.data;
    case assetActions.DELETE_ASSET_SUCCESS:
      return state.filter(asset => asset.id !== action.assetId);
    case assetActions.TOGGLE_LOCK_ASSET_SUCCESS:
      assets = removeLoadingField(state, action.asset.id, assetLoading.LOCK);
      return toggleLockAsset(assets, action.asset.id);
    case assetActions.TOGGLING_LOCK_ASSET_FAILURE:
      return removeLoadingField(state, action.assetId, assetLoading.LOCK);
    case assetActions.TOGGLING_LOCK_ASSET_SUCCESS:
      return addLoadingField(state, action.asset.id, assetLoading.LOCK);
    case assetActions.DELETE_ASSET_FAILURE:
      return [];
    default:
      return state;
  }
};

const status = (state = {}, action) => {
  switch (action.type) {
    case assetActions.CLEAR_ASSETS_STATUS:
      return {};
    case assetActions.DELETE_ASSET_SUCCESS:
      return {
        response: action.response,
        type: action.type,
      };
    case assetActions.DELETE_ASSET_FAILURE:
      return {
        response: action.response,
        type: action.type,
      };
    case assetActions.TOGGLING_LOCK_ASSET_FAILURE:
      return {
        asset: action.asset,
        response: action.response,
        type: action.type,
      };
    default:
      return state;
  }
};

const parameters = (state = initialState, action) => {
  switch (action.type) {
    case assetActions.FILTER_UPDATED:
      return { ...state, assetTypes: { ...state.assetTypes, ...action.data } };
    case assetActions.SORT_UPDATE:
      return { ...state, ...action.data };
    default:
      return state;
  }
};

const assets = combineReducers({
  list,
  status,
  parameters,
});

export default assets;
