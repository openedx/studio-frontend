/* eslint import/prefer-default-export: "off" */
import Cookies from 'js-cookie';
import 'whatwg-fetch'; // fetch polyfill

import endpoints from './endpoints';
import { getDatabaseAttributesFromAssetAttributes } from '../../utils/getAssetsAttributes';

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

export function requestAssets(courseId, params) {
  const assetTypesToFilter = assetTypesFromState(params.assetTypes);
  const sortType = getDatabaseAttributesFromAssetAttributes(params.sort);

  const parameters = {
    ...params,
    sort: sortType,
    asset_type: assetTypesToFilter.length > 0 ? assetTypesToFilter : undefined,
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

export function requestToggleLockAsset(courseId, asset) {
  return fetch(
    `${endpoints.assets}/${courseId}/${asset.id}`, {
      credentials: 'same-origin',
      method: 'put',
      body: JSON.stringify({ locked: !asset.locked }),
      headers: {
        Accept: 'application/json',
        'X-CSRFToken': Cookies.get('csrftoken'),
      },
    },
  );
}

export function postUploadAsset(courseId, file) {
  const data = new FormData();
  data.append('file', file);
  return fetch(
    `${endpoints.assets}/${courseId}/`, {
      credentials: 'same-origin',
      method: 'post',
      body: data,
      headers: {
        Accept: 'application/json',
        'X-CSRFToken': Cookies.get('csrftoken'),
      },
    },
  );
}

export function postAccessibilityForm(formEmail, formFullName, formMessage) {
  return fetch(
    `${endpoints.zendesk}`, {
      credentials: 'same-origin',
      method: 'post',
      body: JSON.stringify({
        name: formFullName,
        tags: ['studio_a11y'],
        email: {
          from: formEmail,
          subject: 'Studio Accessibility Request',
          message: formMessage,
        },
      }),
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'X-CSRFToken': Cookies.get('csrftoken'),
      },
    },
  );
}
