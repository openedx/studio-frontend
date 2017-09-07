import { getAssets } from '../../api/client';

export const PING_RESPONSE = 'PING_RESPONSE';

export const pingResponse = response => ({
  type: PING_RESPONSE,
  status: response.status,
});

export const pingStudio = () =>
  dispatch =>
    getAssets('course-v1:edX+DemoX+Demo_Course', {
      page: 0,
    })
      .then(response => dispatch(pingResponse(response)));
