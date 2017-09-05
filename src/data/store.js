import { applyMiddleware, combineReducers, createStore } from 'redux';
import thunkMiddleware from 'redux-thunk';

const ADD_ASSETS_FILTER = 'ADD_ASSETS_FILTER';
const UPDATE_ASSETS = 'UPDATE_ASSETS';

const PING_RESPONSE = 'PING_RESPONSE';

function pingResponse(response) {
  return {
    type: PING_RESPONSE,
    status: response.status,
  };
}

export function pingStudio() {
  return dispatch =>
    fetch('/api/assets/course-v1:edX+DemoX+Demo_Course/?page=0&page_size=50&sort=sort&asset_type=', {
      credentials: 'same-origin',
      headers: {
        Accept: 'application/json',
      },
    })
      .then((response) => {
        // if (response.status !== this.state.apiConnectionStatus) {
        //   this.setState({
        //     apiConnectionStatus: response.status,
        //   });
        // }
        dispatch(pingResponse(response));
      });
}

function apiConnectionStatus(state = null, action) {
  switch (action.type) {
    case PING_RESPONSE:
      return action.status;
    default:
      return state;
  }
}

function assetsList(state = {}, action) {
  switch (action.type) {
    case UPDATE_ASSETS:
      return Object.assign({}, state, action.filter);
    default:
      return state;
  }
}

function assetsFilters(state = {}, action) {
  switch (action.type) {
    case ADD_ASSETS_FILTER:
      return Object.assign({}, state, action.filter);
    default:
      return state;
  }
}

const rootReducer = combineReducers({
  assetsList,
  assetsFilters,
  apiConnectionStatus,
});

const store = createStore(
  rootReducer,
  applyMiddleware(thunkMiddleware),
);

export default store;
