import { FILTER_UPDATED } from '../actions/assets';

const initialState = {
  courseId: 'course-v1:edX+DemoX+Demo_Course',
  page: 0,
  pageSize: 50,
  assetTypes: {},
  sort: 'sort',
};

const assetTypes = (state = {}, action) => {
  switch (action.type) {
    case FILTER_UPDATED:
      return { ...state, ...action.data };
    default:
      return state;
  }
};

const assetsParameters = (state = initialState, action) => ({
  ...state,
  assetTypes: assetTypes(state.assetTypes, action),
});

export default assetsParameters;
