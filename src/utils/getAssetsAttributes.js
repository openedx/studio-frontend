/*
The assets API returns snake-cased attribute names on a per-asset basis and inconsistently cased
attributes for sort state. The assets API expects, however, attribute names that match the
underlying database documents. These utility functions transform between the two. The assets
API does some of this transformation server-side, but it neglects to transform contentType to
content_type, so we do all the transformation here.

Database Attributes:
  displayname
  contentType
  uploadDate

Assets API Attributes:
  display_name
  content_type
  date_added

Call to Assets API:
  ${endpoints.assets}/${courseId}/?$sort=uploadDate

Assets API Returns:
  ...
  "sort": "date_added",
  "assets": [
  {
    ...
    "display_name": "image.jpg",
    "content_type": "content_type": "image/jpg",
    "date_added": "Dec 19, 2017 at 16:34 UTC",
    ...
  }
}

Note the snake-cased attribute values for "sort" and the keys of "assets"[0].

*/

const invertMap = (map) => {
  const invertedMap = new Map();

  map.forEach(
    (key, value) => { invertedMap.set(key, value); },
  );

  return invertedMap;
};

const assetAPIAttributesToDatabaseAttributes = new Map([
  ['display_name', 'displayname'],
  ['content_type', 'contentType'],
  ['date_added', 'uploadDate'],
]);

const assetDatabaseAttributesToAPIAttributes = invertMap(assetAPIAttributesToDatabaseAttributes);

export const getDatabaseAttributesFromAssetAttributes = attribute => (
  attribute ? assetAPIAttributesToDatabaseAttributes.get(attribute) : ''
);

export const getAssetAPIAttributeFromDatabaseAttribute = attribute => (
  attribute ? assetDatabaseAttributesToAPIAttributes.get(attribute) : ''
);
