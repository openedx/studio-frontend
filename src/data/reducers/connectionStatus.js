import { PING_RESPONSE } from '../actions/pingStudio';

export default function connectionStatus(state = null, action) {
  switch (action.type) {
    case PING_RESPONSE:
      return action.status;
    default:
      return state;
  }
}
