/* eslint import/prefer-default-export: "off" */
import Cookies from 'js-cookie';

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

function assetTypesFromState(assetTypes) {
  return Object.keys(assetTypes).filter(key => assetTypes);
}

export function requestAssets(courseId, { page = 0, pageSize = 50, sort = 'sort', assetTypes = {} }) {
  const assetTypesToFilter = assetTypesFromState(assetTypes)
  return fetch(
    `${endpoints.assets}/${courseId}/?page=${page}&page_size=${pageSize}&sort=${sort}&asset_type=${assetTypesToFilter.join(',')}`, {
      credentials: 'same-origin',
      headers: {
        Accept: 'application/json',
      },
    },
  );
}

export function requestDeleteAsset(courseId, assetId) {
  return fetch(
    `${endpoints.assets}/${courseId}/${assetId}`, {
      credentials: 'same-origin',
      method: 'delete',
      headers: {
        Accept: 'application/json',
        'X-CSRFToken': Cookies.get('csrftoken'),
      },
    },
  );
}
