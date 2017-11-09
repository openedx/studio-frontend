import { pingStudioHome } from '../api/client';

export const PING_RESPONSE = 'PING_RESPONSE';

export const pingResponse = response => ({
  type: PING_RESPONSE,
  status: response.status,
});

export const pingStudio = () =>
  dispatch =>
    pingStudioHome()
      .then(response => dispatch(pingResponse(response)));
