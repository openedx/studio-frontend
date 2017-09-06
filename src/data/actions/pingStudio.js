import { getAssets } from '../../api/client';

export const PING_RESPONSE = 'PING_RESPONSE';

function pingResponse(response) {
  return {
    type: PING_RESPONSE,
    status: response.status,
  };
}

export function pingStudio() {
  return dispatch =>
    getAssets('course-v1:edX+DemoX+Demo_Course', {
      page: 0,
    })
      .then(response => dispatch(pingResponse(response)));
}
