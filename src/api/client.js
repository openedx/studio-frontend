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

function objectIsNonEmpty(object) {
  return Object.keys(object).length > 0;
}

export function requestAssets(courseId, params) {
  const assetTypesToFilter = assetTypesFromState(params.assetTypes);
  const sortType = getDatabaseAttributesFromAssetAttributes(params.sort);

  const parameters = {
    ...params,
    sort: sortType,
    asset_type: (objectIsNonEmpty(assetTypesToFilter) ? assetTypesToFilter : undefined),
    assetTypes: undefined,
    page_size: params.pageSize,
    pageSize: undefined,
  };

  const requestString = Object.keys(parameters).reduce((memo, key) => { if (parameters[key]) { memo.push(`${key}=${parameters[key]}`); } return memo; }, []).join('&');

  return fetch(
    `${endpoints.assets}/${courseId}/?${requestString}`, {
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
