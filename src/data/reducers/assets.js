import { combineReducers } from 'redux';

import { assetActions } from '../constants/actionTypes';

const initialState = {
  page: 0,
  pageSize: 50,
  assetTypes: {},
  sort: 'date_added',
  direction: 'desc',
};

const list = (state = [], action) => {
  switch (action.type) {
    case assetActions.REQUEST_ASSETS_SUCCESS:
      return action.data;
    case assetActions.DELETE_ASSET_SUCCESS:
      return state.filter(asset => asset.id !== action.assetId);
    case assetActions.ASSET_XHR_FAILURE:
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
    case assetActions.ASSET_XHR_FAILURE:
      return {
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
