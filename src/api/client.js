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

function assetTypeValueFromState(assetFilters) {
  // TODO: change this to multi-value once API supports it
  if (assetFilters.other) {
    return 'OTHER';
  } else if (assetFilters.images) {
    return 'Images';
  } else if (assetFilters.documents) {
    return 'Documents';
  }
  return '';
}

export function getAssets(courseId, { page = 0, pageSize = 50, sort = 'sort', assetsFilters = {} }) {
  const assetType = assetTypeValueFromState(assetsFilters);
  return fetch(
    `${endpoints.assets}/${courseId}/?page=${page}&page_size=${pageSize}&sort=${sort}&asset_type=${assetType}`, {
      credentials: 'same-origin',
      headers: {
        Accept: 'application/json',
      },
    },
  );
}
