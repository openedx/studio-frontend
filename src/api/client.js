/* eslint import/prefer-default-export: "off" */
import endpoints from './endpoints';

export function pingStudioHome() {
  return fetch(
    endpoints.home, {
      credentials: 'same-origin',
      headers: {
        Accept: 'application/json',
      },
    },
  );
}

export function getAssets(courseId, { page = 0, pageSize = 50, sort = 'sort', assetType = '' }) {
  return fetch(
    `${endpoints.assets}/${courseId}/?page=${page}&page_size=${pageSize}&sort=${sort}&asset_type=${assetType}`, {
      credentials: 'same-origin',
      headers: {
        Accept: 'application/json',
      },
    },
  );
}
