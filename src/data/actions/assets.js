import { getAssetsClient } from '../../api/client';
import { pingResponse } from './pingStudio';

export const ASSETS_RESPONSE = 'ASSETS_RESPONSE';

export const assetsResponse = response => ({
  type: ASSETS_RESPONSE,
  data: response.data,
});

export const getAssets = () =>
  dispatch =>
    getAssetsClient('course-v1:edX+DemoX+Demo_Course', {
      page: 0,
    })
      .then(response => dispatch(pingResponse(response)));
