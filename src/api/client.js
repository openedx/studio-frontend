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

function assetTypeValueFromState(assetTypes) {
  // TODO: change this to multi-value once API supports it
  return Object.keys(assetTypes).find(key => assetTypes[key]) || '';
}

export function getAssets(courseId, { page = 0, pageSize = 50, sort = 'sort', assetTypes = {} }) {
  const assetType = assetTypeValueFromState(assetTypes);
  return fetch(
    `${endpoints.assets}/${courseId}/?page=${page}&page_size=${pageSize}&sort=${sort}&asset_type=${assetType}`, {
      credentials: 'same-origin',
      headers: {
        Accept: 'application/json',
      },
    },
  );
}
