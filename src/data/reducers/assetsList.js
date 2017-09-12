import { REQUEST_ASSETS_SUCCESS } from '../actions/assets';

const assetsList = (state = [], action) => {
  switch (action.type) {
    case REQUEST_ASSETS_SUCCESS:
      return action.data;
    default:
      return state;
  }
};

export default assetsList;
