export const PING_RESPONSE = 'PING_RESPONSE';

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
      .then(response => dispatch(pingResponse(response)));
}
