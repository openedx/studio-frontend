import { getAssets } from '../../api/client';

export const ASSETS_RESPONSE = 'ASSETS_RESPONSE';

export const assetsResponse = response => ({
  type: ASSETS_RESPONSE,
  data: response.data,
});

export const getAssets = () =>
  dispatch =>
    getAssets('course-v1:edX+DemoX+Demo_Course', {
      page: 0,
    })
      .then(response => dispatch(pingResponse(response)));
