import * as reducers from './assets';
import { assetActions } from '../../data/constants/actionTypes';
import { assetLoading } from '../../data/constants/loadingTypes';
import { getAssetAPIAttributeFromDatabaseAttribute } from '../../utils/getAssetsAttributes';

let action;
let defaultState;
let state;

describe('Assets Reducers', () => {
  describe('assets reducer', () => {
    it('returns correct assets state for REQUEST_ASSETS_SUCCESS action', () => {
      defaultState = [];

      action = {
        type: assetActions.REQUEST_ASSETS_SUCCESS,
        data: {
          assets: [
            { id: 'asset1' },
            { id: 'asset2' },
            { id: 'asset3' },
          ],
        },
      };

      state = reducers.assets(defaultState, action);

      expect(state).toEqual(action.data.assets);
    });
    it('returns correct assets state for DELETE_ASSET_SUCCESS action', () => {
      defaultState = {
        assets: [
          { id: 'asset1' },
          { id: 'asset2' },
          { id: 'asset3' },
        ],
      };

      action = {
        type: assetActions.DELETE_ASSET_SUCCESS,
        assetId: 'asset2',
      };

      state = reducers.assets(defaultState.assets, action);

      // filter out the deleted asset
      expect(state).toEqual(defaultState.assets.filter(
        asset => asset.id !== action.assetId));
    });
    it('returns correct assets state for TOGGLE_LOCK_ASSET_SUCCESS action', () => {
      defaultState = {
        assets: [
          { id: 'asset1', loadingFields: [] },
          { id: 'asset2', loadingFields: [assetLoading.LOCK] },
          { id: 'asset3', loadingFields: [] },
        ],
      };

      // deep copy over the old state and change data appropriately to reflect new state
      const newState = defaultState.assets.map(asset => ({ ...asset }));
      newState[1].loadingFields = [];
      newState[1].locked = true;

      action = {
        asset: { id: 'asset2' },
        type: assetActions.TOGGLE_LOCK_ASSET_SUCCESS,
      };

      state = reducers.assets(defaultState.assets, action);

      expect(state).toEqual(newState);
    });
    it('returns correct assets state for TOGGLING_LOCK_ASSET_FAILURE action', () => {
      defaultState = {
        assets: [
          { id: 'asset1', loadingFields: [] },
          { id: 'asset2', loadingFields: [assetLoading.LOCK] },
          { id: 'asset3', loadingFields: [] },
        ],
      };

      action = {
        assetId: 'asset2',
        type: assetActions.TOGGLING_LOCK_ASSET_FAILURE,
      };

      // deep copy over the old state and change data appropriately to reflect new state
      const newState = defaultState.assets.map(asset => ({ ...asset }));
      newState[1].loadingFields = [];

      state = reducers.assets(defaultState.assets, action);

      expect(state).toEqual(newState);
    });
    it('returns correct assets state for TOGGLING_LOCK_ASSET_SUCCESS action', () => {
      defaultState = {
        assets: [
          { id: 'asset1' },
          { id: 'asset2' },
          { id: 'asset3' },
        ],
      };

      action = {
        asset: {
          id: 'asset2',
        },
        type: assetActions.TOGGLING_LOCK_ASSET_SUCCESS,
      };

      const newState = defaultState.assets.map(asset => ({ ...asset }));
      newState[1].loadingFields = [assetLoading.LOCK];

      state = reducers.assets(defaultState.assets, action);

      expect(state).toEqual(newState);
    });
    it('returns correct assets state for DELETE_ASSET_FAILURE action', () => {
      defaultState = [];

      action = {
        type: assetActions.DELETE_ASSET_FAILURE,
      };

      state = reducers.assets(defaultState, action);

      expect(state).toEqual([]);
    });
  });
  describe('metadata reducer', () => {
    describe('filter reducer', () => {
      defaultState = reducers.filtersInitial;

      it('returns correct assetTypes state on REQUEST_ASSETS_SUCCESS action', () => {
        action = {
          data: {
            assetTypes: {
              edX: true,
            },
          },
          type: assetActions.REQUEST_ASSETS_SUCCESS,
        };

        state = reducers.filters(defaultState, action);

        expect(state).toEqual({
          ...defaultState,
          assetTypes: { ...defaultState.assetTypes, ...action.data },
        });
      });
    });
    describe('pagination reducer', () => {
      defaultState = reducers.paginationInitial;

      it('returns correct pagination state on REQUEST_ASSETS_SUCCESS action', () => {
        action = {
          data: {
            start: 99,
            end: 101,
            page: 100,
            pageSize: 1,
            totalCount: 100,
          },
          type: assetActions.REQUEST_ASSETS_SUCCESS,
        };

        state = reducers.pagination(defaultState, action);

        expect(state).toEqual({
          ...action.data,
        });
      });
    });
    describe('sort reducer', () => {
      it('returns correct sort and direction state on REQUEST_ASSETS_SUCCESS action', () => {
        action = {
          data: {
            sort: 'content_type',
            direction: 'asc',
          },
          type: assetActions.REQUEST_ASSETS_SUCCESS,
        };

        state = reducers.sort(defaultState, action);

        expect(state).toEqual({
          ...action.data,
          sort: getAssetAPIAttributeFromDatabaseAttribute(action.data.sort),
        });
      });
    });
    describe('status reducer', () => {
      defaultState = {};

      // the status reducer treats all the following actions identically, so loop over them
      const sameBehaviorReducers = [
        assetActions.REQUEST_ASSETS_SUCCESS,
        assetActions.REQUEST_ASSETS_FAILURE,
        assetActions.DELETE_ASSET_SUCCESS,
        assetActions.DELETE_ASSET_FAILURE,
      ];

      sameBehaviorReducers.forEach((reducer) => {
        it(`returns correct status state on ${reducer.split('.')[1]} action`, () => {
          action = {
            type: reducer,
            response: 'Status!',
          };

          state = reducers.status(defaultState, action);

          expect(state).toEqual(action);
        });
      });

      it('returns correct status state on CLEAR_ASSETS_STATUS action', () => {
        state = reducers.status(defaultState, {
          type: assetActions.CLEAR_ASSETS_STATUS,
        });

        expect(state).toEqual({});
      });
      it('returns correct status state on TOGGLING_LOCK_ASSET_FALURE action', () => {
        action = {
          asset: 'asset',
          response: 'Failure!',
          type: assetActions.TOGGLING_LOCK_ASSET_FAILURE,
        };

        state = reducers.status(defaultState, action);

        expect(state).toEqual(action);
      });
    });
  });
  describe('request reducer', () => {
    defaultState = reducers.requestInitial;

    it('returns correct sort and direction state on SORT_UPDATE action', () => {
      action = {
        data: {
          sort: 'edX',
          direction: 'desc',
        },
        type: assetActions.SORT_UPDATE,
      };

      state = reducers.request(defaultState, action);

      expect(state).toEqual({
        ...defaultState,
        ...action.data,
      });
    });
    it('returns correct sort and direction state on PAGE_UPDATE action', () => {
      action = {
        data: {
          page: 100,
        },
        type: assetActions.PAGE_UPDATE,
      };

      state = reducers.request(defaultState, action);

      expect(state).toEqual({
        ...defaultState,
        ...action.data,
      });
    });
    it('returns correct sort and direction state on FILTER_UPDATE action', () => {
      action = {
        data: {
          assetTypes: {
            edX: true,
          },
        },
        type: assetActions.FILTER_UPDATED,
      };

      state = reducers.request(defaultState, action);

      expect(state).toEqual({
        ...defaultState,
        assetTypes: { ...defaultState.assetTypes, ...action.data },
      });
    });
  });
});
