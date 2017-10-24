/* eslint import/prefer-default-export: "off" */
import Cookies from 'js-cookie';

import endpoints from './endpoints';

// terrible name, but it'll do for the moment
const assetAttributesToDatabaseAttributes = {
  display_name: 'displayname',
  content_type: 'contentType',
  date_added: 'uploadDate',
};

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
  return Object.keys(assetTypes).filter(key => assetTypes[key]);
}

function getDatabaseAttributesFromAssetAttributes(sort) {
  return assetAttributesToDatabaseAttributes[sort];
}

export function requestAssets(courseId, { page = 0, pageSize = 50, sort = 'sort', direction = '', assetTypes = {} }) {
  const assetTypesToFilter = assetTypesFromState(assetTypes);
  const sortType = getDatabaseAttributesFromAssetAttributes(sort);
  console.log('sortType: ' + sortType);

  console.log(`${endpoints.assets}/${courseId}/?page=${page}&page_size=${pageSize}&sort=${sort}&direction=${direction}&asset_type=${assetTypesToFilter.join(',')}`);
  return fetch(
    `${endpoints.assets}/${courseId}/?page=${page}&page_size=${pageSize}&sort=${sortType}&direction=${direction}&asset_type=${assetTypesToFilter.join(',')}`, {
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
