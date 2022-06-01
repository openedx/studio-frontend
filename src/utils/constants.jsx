import PropTypes from 'prop-types';

export const ASSET_SHAPE = {
  content_type: PropTypes.string,
  date_added: PropTypes.string,
  display_name: PropTypes.string,
  external_url: PropTypes.string,
  id: PropTypes.string,
  locked: PropTypes.bool,
  portable_url: PropTypes.string,
  thumbnail: PropTypes.string,
  url: PropTypes.string,
};

export const ASSET_TYPES_SHAPE = {
  Audio: PropTypes.bool,
  Code: PropTypes.bool,
  Documents: PropTypes.bool,
  Images: PropTypes.bool,
  OTHER: PropTypes.bool,
};

export const RESPONSE_SHAPE = {
  assetTypes: PropTypes.arrayOf(PropTypes.shape(ASSET_TYPES_SHAPE)),
  assets: PropTypes.arrayOf(PropTypes.shape(ASSET_SHAPE)),
  direction: PropTypes.string,
  end: PropTypes.number,
  page: PropTypes.number,
  pageSize: PropTypes.number,
  sort: PropTypes.string,
  start: PropTypes.number,
  textSearch: PropTypes.string,
  totalCount: PropTypes.number,
};

export const ASSET_STATUS_SHAPE = {
  response: PropTypes.shape(RESPONSE_SHAPE),
  type: PropTypes.string,
};
