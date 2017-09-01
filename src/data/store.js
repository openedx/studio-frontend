import { combineReducers, createStore } from 'redux';

const ADD_ASSETS_FILTER = 'ADD_ASSETS_FILTER';
const UPDATE_ASSETS = 'UPDATE_ASSETS';

function list(state = {}, action) {
  switch (action.type) {
    case UPDATE_ASSETS:
      return Object.assign({}, state, action.filter);
    default:
      return state;
  }
}

function filters(state = {}, action) {
  switch (action.type) {
    case ADD_ASSETS_FILTER:
      return Object.assign({}, state, action.filter);
    default:
      return state;
  }
}

const rootReducer = combineReducers({
  list,
  filters,
});

const store = createStore(rootReducer);

export default store;
