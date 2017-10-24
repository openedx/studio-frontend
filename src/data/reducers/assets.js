import { combineReducers } from 'redux';

import { assetActions } from '../actions/assets';

const initialState = {
  courseId: 'course-v1:edX+DemoX+Demo_Course',
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
    default:
      return state;
  }
};

const status = (state = {}, action) => {
  switch (action.type) {
    case assetActions.ASSET_XHR_FAILURE:
      return {
        response: action.response,
        text: action.text,
      };
    default:
      return state;
  }
};

// const types = (state = {}, action) => {
//   switch (action.type) {
//     case assetActions.FILTER_UPDATED:
//       return { ...state, ...action.data };
//     default:
//       return state;
//   }
// };

// const sort = (state = {}, action) => {
//   switch (action.type) {
//     case assetActions.SORT_UPDATE:
//       return { ...state, ...action.data };
//     default:
//       return state;
//   }
// };

// {
//   sort: 'date_added',
//   direction: 'asc',
// }

// const parameters = (state = initialState, action) => ({
//   ...state,
//   assetTypes: types(state.assetTypes, action),
// });

const parameters = (state = initialState, action) => {
  switch (action.type) {
    case assetActions.FILTER_UPDATED:
      return { ...state, assetTypes: { ...state.assetTypes, ...action.data } };
    case assetActions.SORT_UPDATE:
      // console.log({ ...state, ...action.data });
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
