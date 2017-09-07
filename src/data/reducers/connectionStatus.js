import { PING_RESPONSE } from '../actions/pingStudio';

const connectionStatus = (state = null, action) => {
  switch (action.type) {
    case PING_RESPONSE:
      return action.status;
    default:
      return state;
  }
};

export default connectionStatus;
