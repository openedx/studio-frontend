import { fetchAssets } from '../../api/client';

export const ASSETS_RESPONSE = 'ASSETS_RESPONSE';

export const assetsResponse = response => ({
  type: ASSETS_RESPONSE,
  data: response.assets,
});

export const getAssets = (courseId) =>
  dispatch =>
    fetchAssets(courseId, {
      page: 0,
    })
      .then(response => response.json())
      .then(json => dispatch(assetsResponse(json)));
