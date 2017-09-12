import { getAssets } from '../../api/client';

export const REQUEST_ASSETS_SUCCESS = 'REQUEST_ASSETS_SUCCESS';

export const requestAssetsSuccess = response => ({
  type: REQUEST_ASSETS_SUCCESS,
  data: response.assets,
});

export const requestAssets = courseId =>
  dispatch =>
    getAssets(courseId, {
      page: 0,
    })
      .then(response => response.json())
      .then(json => dispatch(requestAssetsSuccess(json)));
