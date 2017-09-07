import { ASSETS_RESPONSE } from '../actions/assets';

const assetsList = (state = [], action) => {
  switch (action.type) {
    case ASSETS_RESPONSE:
      return action.data;
    default:
      return state;
  }
};

export default assetsList;
